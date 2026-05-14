const express = require("express");
const router = express.Router();

// dữ liệu tạm
let visaProfiles = [];

// GET all
router.get("/", (req, res) => {
  res.json(visaProfiles);
});

// POST create
router.post("/", (req, res) => {
  const newVisa = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date(),
  };

  visaProfiles.push(newVisa);

  res.json(newVisa);
});

// PUT update
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = visaProfiles.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Không tìm thấy hồ sơ visa",
    });
  }

  visaProfiles[index] = {
    ...visaProfiles[index],
    ...req.body,
  };

  res.json(visaProfiles[index]);
});

module.exports = router;