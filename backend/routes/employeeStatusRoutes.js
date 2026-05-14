const express = require("express");
const router = express.Router();

let onlineUsers = [];

router.post(
  "/login-track",
  (req, res) => {
    const {
      userId,
      fullName,
      role,
    } = req.body;

    const existing =
      onlineUsers.find(
        (u) =>
          u.userId === userId
      );

    if (!existing) {
      onlineUsers.push({
        userId,
        fullName,
        role,
        loginTime:
          new Date().toLocaleString(),
        online: true,
      });
    }

    res.json({
      message: "Đã ghi nhận",
    });
  }
);

router.post(
  "/logout-track",
  (req, res) => {
    const { userId } =
      req.body;

    const user =
      onlineUsers.find(
        (u) =>
          u.userId === userId
      );

    if (user) {
      user.online = false;
      user.logoutTime =
        new Date().toLocaleString();
    }

    res.json({
      message:
        "Đã logout",
    });
  }
);

router.get("/", (req, res) => {
  res.json(onlineUsers);
});

module.exports = router;