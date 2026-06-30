const express = require("express");
const router = express.Router();

const {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
  getAllEnrollments,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, enrollCourse);

router.get( "/my-courses",protect,getMyEnrollments);

router.put( "/:id/progress",protect,updateProgress);

router.get("/all",protect,getAllEnrollments);


module.exports = router;