const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const prisma = require("../lib/prisma");
const auth = require("../middleware/auth");

router.post("/avatar", auth(), upload.single("file"), async (req, res) => {
    try {
        const userId = req.user.id;

        const filePath = `/uploads/${req.file.filename}`;

        await prisma.user.update({
            where: { id: userId },
            data: { avatar: filePath },
        });

        res.json({ url: filePath });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload lỗi" });
    }
});

module.exports = router;