const express = require("express");
const router = express.Router();

const {
  addModule,
  getModulesByCourse,
} = require("../controllers/moduleController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addModule);

router.get("/:courseId", getModulesByCourse);

module.exports = router;

