const express = require("express");
const router = express.Router();

const {
  addLesson,
  getLessonsByModule,
} = require("../controllers/lessonController");

const { protect } = require("../middleware/authMiddleware");

// Add Lesson
router.post("/", protect, addLesson);

// Get Lessons of a Module
router.get("/:moduleId", getLessonsByModule);

module.exports = router;

