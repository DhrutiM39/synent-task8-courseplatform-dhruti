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

router.post("/", addCourse);
router.get("/", getCourses);
router.get("/:id/content", getCourseContent);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;