const express = require("express");
const router = express.Router();

const {
  addLesson,
  getLessonsByModule,
} = require("../controllers/lessonController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

// Add Lesson
router.post("/", protect, isAdmin, addLesson);






// Get Lessons of a Module
router.get("/:moduleId", protect, getLessonsByModule);

module.exports = router;

