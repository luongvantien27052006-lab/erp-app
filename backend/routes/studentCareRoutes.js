const express = require("express");
const router = express.Router();

let careLogs = [];

// GET all
router.get("/", (req, res) => {
  res.json(careLogs);
});

// POST create
router.post("/", (req, res) => {
  const newLog = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date(),
  };

  careLogs.push(newLog);

  res.json(newLog);
});

module.exports = router;