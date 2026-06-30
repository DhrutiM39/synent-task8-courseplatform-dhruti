const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
   resetPassword,
   getAllUsers,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/users", protect, getAllUsers);

module.exports = router;