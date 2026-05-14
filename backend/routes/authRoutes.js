const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

/* ===== GENERATE CODE ===== */
function getRolePrefix(role) {
    if (role === "admin") return "AD";
    if (role === "sale") return "SL";
    if (role === "accountant") return "AC";
    if (role === "profile") return "PF";   // hồ sơ
    if (role === "teacher") return "TC";   // giáo viên
    if (role === "student") return "ST";   // học sinh
    return "US";
}

function generateChecksum(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum % 10;
}

async function generateEmployeeCode(prisma, role) {
    const prefix = getRolePrefix(role);
    const year = new Date().getFullYear().toString().slice(-2);

    const count = await prisma.user.count();
    const seq = (count + 1).toString().padStart(5, "0");

    const base = `${prefix}-${year}-${seq}`;
    const checksum = generateChecksum(base);

    return `${base}-${checksum}`;
}
/* ===== LOGIN ===== */
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }

        const jwt = require("jsonwebtoken");

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: false, // dev
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({
                user,
            });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});
/* ===== CREATE USER ===== */
router.post("/register", async (req, res) => {
    try {

        // 🔥 CHẶN FIELD RÁC (FIX 1000)
        const {
            fullName,
            phone,
            email,
            hometown,
            password,
            role,
        } = req.body;

        // ❗ KHÔNG lấy field khác
        // ❗ 1000 sẽ bị loại bỏ ở đây

        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu dữ liệu" });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu tối thiểu 6 ký tự",
            });
        }

        let finalPassword = password;

        if (!password.startsWith("$2b$")) {
            finalPassword = await bcrypt.hash(password, 10);
        }

        const code = await generateEmployeeCode(prisma, role);

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.create({
                data: {
                    fullName,
                    phone,
                    email,
                    hometown,
                    password: finalPassword,
                    role,
                    code,
                },
            });

            await tx.employee.create({
                data: {
                    name: fullName,
                    email,
                    phone,
                    role,
                    userId: user.id,
                },
            });

            return user;
        });

        res.json(result);

    } catch (err) {
        console.error("CREATE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
});

/* ===== GET USERS ===== */
router.get("/users", async (req, res) => {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(users);
});

/* ===== DELETE USER ===== */
router.delete("/users/:id", async (req, res) => {
    const id = Number(req.params.id);

    await prisma.user.delete({
        where: { id },
    });

    res.json({ message: "Deleted" });
});
router.get("/me", auth(), async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id }
    });

    res.json(user);
});
module.exports = router;