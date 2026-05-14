const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "tmp/" });

const API_KEY = process.env.FPT_API_KEY;

/* ===== FORMAT GIỚI TÍNH ===== */
const normalizeGender = (g) => {
    if (!g) return "";
    g = g.toLowerCase();

    if (g.includes("nam")) return "Nam";
    if (g.includes("nu") || g.includes("nữ")) return "Nữ";

    return "";
};

/* ===== GỌI FPT OCR ===== */
async function callFPT(path) {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(path));

    const res = await axios.post(
        "https://api.fpt.ai/vision/idr/vnm",
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                "api-key": API_KEY,
            },
        }
    );

    return res.data?.data?.[0] || {};
}

/* ===== API ===== */
router.post(
    "/scan-cccd",
    upload.fields([
        { name: "front", maxCount: 1 },
        { name: "back", maxCount: 1 },
    ]),
    async (req, res) => {
        let frontPath, backPath;

        try {
            const front = req.files?.front?.[0];
            const back = req.files?.back?.[0];

            if (!front) {
                return res.status(400).json({ message: "Thiếu mặt trước" });
            }

            frontPath = front.path;
            backPath = back?.path;

            // 🔥 OCR cả 2 mặt bằng FPT
            const frontData = await callFPT(frontPath);
            const backData = backPath ? await callFPT(backPath) : {};

            console.log("FPT FRONT:", frontData);
            console.log("FPT BACK:", backData);

            const result = {
                fullName: frontData.name || "",
                cccd: frontData.id || "",
                dob: frontData.dob || "",
                gender: normalizeGender(frontData.sex),
                address: frontData.address || "",

                // 🔥 NGÀY CẤP CHUẨN
                issueDate:
                    backData.issue_date ||
                    frontData.issue_date ||
                    "",

                issuePlace:
                    "Cục Cảnh sát QLHC về TTXH",
            };

            console.log("FINAL OCR:", result);

            return res.json(result);

        } catch (err) {
            console.error("OCR ERROR:", err.response?.data || err.message);

            return res.status(500).json({
                error: "OCR_FAIL",
            });

        } finally {
            if (frontPath) fs.unlink(frontPath, () => { });
            if (backPath) fs.unlink(backPath, () => { });
        }
    }
);

module.exports = router;