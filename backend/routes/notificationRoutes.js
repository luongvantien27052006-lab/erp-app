const express = require("express");
const router = express.Router();

const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/auth");

const ALL = "ALL_EMPLOYEE";

/* ================= GET ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const data = await prisma.notification.findMany({
      where: {
        OR: [
          { receiver: user.email },
          { receiver: user.role },
          { receiver: ALL },
          { receiver: `USER_${user.id}` },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/* ================= CREATE ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, message, type, value } = req.body;

    let receivers = [];

    if (type === "ALL") {
      receivers = [ALL];
    } else if (type === "ROLE") {
      receivers = [value];
    } else if (type === "EMAIL_MULTI") {
      receivers = value.split(",").map((e) => e.trim());
    } else if (type === "USER_MULTI") {
      receivers = value
        .split(",")
        .map((id) => `USER_${id.trim()}`);
    }

    const data = receivers.map((r) => ({
      title,
      message,
      receiver: r,
    }));

    await prisma.notification.createMany({ data });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;