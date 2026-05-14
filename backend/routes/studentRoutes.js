const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const role = require("../middleware/roleMiddleware");

const {
    createStudent,
    getStudents,
    approveStudent,
    rejectStudent,
    deleteStudent,
} = require("../controllers/studentController");

router.get("/", auth(), getStudents);

router.post("/", auth(), createStudent);

router.put("/approve/:id", auth(), role("ADMIN"), approveStudent);

router.put("/reject/:id", auth(), role("ADMIN"), rejectStudent);

router.delete("/:id", auth(), role("ADMIN"), deleteStudent);

module.exports = router;