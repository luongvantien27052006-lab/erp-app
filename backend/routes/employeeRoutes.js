const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");

const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

/* =========================
   LẤY DANH SÁCH
========================= */
router.get("/", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { id: "desc" },
    });

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =========================
   TẠO NHÂN VIÊN
========================= */
router.post("/create", async (req, res) => {
  try {
    const {
      employeeId,
      email,
      fullName,
      address,
      role,
      password,
    } = req.body;

    const existing = await prisma.employee.findFirst({
      where: {
        OR: [{ employeeId }, { email }],
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "ID hoặc email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        email,
        fullName,
        address,
        role,
        password: hashedPassword,
      },
    });

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   XÓA
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employee.delete({
      where: { id },
    });

    res.json({ message: "Đã xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa" });
  }
});

module.exports = router;