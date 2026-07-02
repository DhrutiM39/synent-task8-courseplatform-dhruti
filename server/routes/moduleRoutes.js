const express = require("express");
const router = express.Router();

const {
  addModule,
  getModulesByCourse,
} = require("../controllers/moduleController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, isAdmin, addModule);



router.get("/:courseId", protect, getModulesByCourse);

module.exports = router;

