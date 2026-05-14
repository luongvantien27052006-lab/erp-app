const prisma = require("../lib/prisma");

/* ===== PARSE DATE VN ===== */
const parseVNDate = (str) => {
    if (!str) return null;

    const parts = str.split("/");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);

    return isNaN(date.getTime()) ? null : date;
};

/* ================= CREATE ================= */
exports.createStudent = async (req, res) => {
    try {
        const data = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const student = await prisma.student.create({
            data: {
                fullName: data.fullName || "",
                cccd: data.cccd || null,

                dob: parseVNDate(data.dob),
                cccdIssueDate: parseVNDate(data.issueDate),
                cccdIssuePlace: data.cccdIssuePlace || "",

                gender: data.gender || "",
                address: data.address || "",
                hometown: data.hometown || data.address || "",

                phone: data.phone || "",
                email: data.email || "",

                program: data.program || "",
                academicLevel: data.academicLevel || "",
                gapYear: Number(data.gapYear || 0),
                targetSchool: data.targetSchool || "",

                parentName: data.parentName || "",
                parentPhone: data.parentPhone || "",
                familyCondition: data.familyCondition || "",
                note: data.note || "",

                saleId: req.user.id,
                saleEmail: req.user.email,

                status: "PENDING",
                score: 0,
                riskLevel: "LOW",
            },
        });

        res.json(student);

    } catch (err) {
        console.error("CREATE ERROR:", err);

        if (err.code === "P2002") {
            return res.status(400).json({
                message: "CCCD đã tồn tại",
            });
        }

        res.status(500).json({
            message: err.message,
        });
    }
};

/* ================= GET ================= */
exports.getStudents = async (req, res) => {
    try {
        console.log("👉 HIT API");

        if (!req.user) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        const where =
            req.user.role === "admin"
                ? {}
                : { saleId: req.user.id };

        const students = await prisma.student.findMany({
            where,
            // 🔥 FIX: bỏ include gây treo
            orderBy: {
                createdAt: "desc",
            },
        });

        console.log("👉 DONE QUERY");

        return res.json(students);

    } catch (err) {
        console.error("GET STUDENTS ERROR:", err);
        return res.status(500).json({ message: err.message });
    }
};

/* ================= APPROVE ================= */
exports.approveStudent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const student = await prisma.student.update({
            where: { id },
            data: {
                status: "APPROVED",
            },
        });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= REJECT ================= */
exports.rejectStudent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const student = await prisma.student.update({
            where: { id },
            data: {
                status: "REJECTED",
            },
        });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= DELETE ================= */
exports.deleteStudent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.student.delete({
            where: { id },
        });

        res.json({ message: "Đã xóa học sinh" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};