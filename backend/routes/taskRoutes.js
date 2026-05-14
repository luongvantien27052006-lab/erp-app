const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

/* GET theo role */
router.get("/:role", async (req, res) => {
  const data = await prisma.task.findMany({
    where: { role: req.params.role, status: "PENDING" },
    orderBy: { order: "asc" },
  });
  res.json(data);
});

/* DONE TASK */
router.put("/:id/done", async (req, res) => {
  const id = Number(req.params.id);

  const task = await prisma.task.update({
    where: { id },
    data: { status: "DONE" },
  });

  const next = await prisma.task.findFirst({
    where: {
      studentId: task.studentId,
      order: task.order + 1,
    },
  });

  if (next) {
    global.io.to("user_" + next.role).emit("new-task", next);
  }

  res.json({ ok: true });
});

module.exports = router;