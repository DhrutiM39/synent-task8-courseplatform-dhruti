const express = require("express");
const router = express.Router();

const {
  addCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseContent,
} = require("../controllers/courseController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, isAdmin, addCourse);


router.get("/", getCourses);
router.get("/:id/content", protect, getCourseContent);
router.get("/:id", getCourseById);
router.put("/:id", protect, isAdmin, updateCourse);
router.delete("/:id", protect, isAdmin, deleteCourse);


module.exports = router;