const express = require("express");
const router = express.Router();

let classes = [];

// GET all
router.get("/", (req, res) => {
  res.json(classes);
});

// POST create
router.post("/", (req, res) => {
  const newClass = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date(),
  };

  classes.push(newClass);

  res.json(newClass);
});

module.exports = router;