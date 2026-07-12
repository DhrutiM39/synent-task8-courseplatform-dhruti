const express = require("express");
const router = express.Router();

const {
  getMyEnrollments,
  updateProgress,
  markLessonComplete,
  getAllEnrollments,
} = require("../controllers/enrollmentController");




const { protect, isAdmin } = require("../middleware/authMiddleware");



// Enrollment is created only after successful Razorpay payment verification.
// Payment-free enrollment endpoint is intentionally disabled.
router.post("/", protect, (req, res) => {
  return res.status(410).json({
    message: "Payment required. Enroll via /api/payments/verify after Razorpay success.",
  });
});


router.get("/my-courses", protect, getMyEnrollments);


router.put( "/:id/progress",protect,updateProgress);
router.post("/mark-lesson-complete", protect, markLessonComplete);



router.get("/all", protect, isAdmin, getAllEnrollments);



module.exports = router;