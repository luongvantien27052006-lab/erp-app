const express = require("express");
const router = express.Router();
const path = require("path");
const { generateContract } = require("../services/contractService");

router.post("/generate", async (req, res) => {
  try {
    const data = req.body;

    let template = "";

    // 🔥 CHỌN TEMPLATE
    if (data.program === "D2-1") {
      template = "templates/D2-1.docx";
    } else if (data.program === "D4-1") {
      template = "templates/D4-1.docx";
    } else if (data.program === "D2-6" && data.region === "MB") {
      template = "templates/D2-6-MB.docx";
    } else {
      template = "templates/D2-6-MN.docx";
    }

    const output = path.join(
      __dirname,
      "../contracts/contract-" + Date.now()
    );

    const pdfPath = await generateContract(
      data,
      template,
      output
    );

    res.download(pdfPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi tạo hợp đồng",
    });
  }
});

module.exports = router;