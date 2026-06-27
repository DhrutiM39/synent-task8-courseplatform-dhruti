const express = require("express");
const router = express.Router();

const {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, enrollCourse);

router.get(
  "/my-courses",
  protect,
  getMyEnrollments
);

router.put(
  "/:id/progress",
  protect,
  updateProgress
);

module.exports = router;