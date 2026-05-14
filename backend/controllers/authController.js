const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({
                message: "Email không tồn tại",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Sai mật khẩu",
            });
        }

        // 🔥 TẠO TOKEN
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // 🔥 FIX COOKIE (QUAN TRỌNG NHẤT)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // dev local
            sameSite: "lax",
            path: "/",
        });

        // 🔥 DEBUG (xem terminal có log không)
        console.log("SET COOKIE TOKEN:", token);

        return res.json({
            message: "Đăng nhập thành công",
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};

/* ================= ME ================= */
exports.getMe = async (req, res) => {
    try {
        return res.json(req.user);
    } catch (err) {
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.json({ message: "Đã đăng xuất" });
    } catch (err) {
        return res.status(500).json({
            message: "Lỗi server",
        });
    }
};