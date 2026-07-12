const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24h

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      verificationExpire,
    });

    const verifyUrl = `http://localhost:5173/verify-email/${verificationToken}`;
    console.log(`\n[DEV NOTE] Verification Link (copy/click this if email fails to send):\n${verifyUrl}\n`);

    // Send verification email (non-blocking response)
    try {
      await sendEmail({
        email,
        subject: "Verify your email address",
        message: `<p>Thank you for registering!</p>
                  <p>Please verify your email address by clicking the link below:</p>
                  <p><a href="${verifyUrl}">Verify Email</a></p>
                  <p>This link expires in 24 hours. If you did not create an account, please ignore this email.</p>`,
      });
    } catch (mailErr) {
      console.log("VERIFICATION EMAIL ERROR:", mailErr.message || mailErr);
    }

    res.status(201).json({ message: "Registration successful. Please check your email to verify your account." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email address before logging in." });
    }


    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    message: "Protected Route Accessed",
    user: req.user,
  });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send reset email (non-blocking response)
    try {
      await sendEmail({
        email,
        subject: "Password Reset Request",
        message: `<p>You requested a password reset for your account.</p>
                  <p>Click the link below to reset your password:</p>
                  <p><a href="${resetUrl}">Reset Password</a></p>
                  <p>If you did not request this, please ignore this email.</p>`,
      });
    } catch (mailErr) {
      console.log("FORGOT PASSWORD EMAIL ERROR:", mailErr.message || mailErr);
    }

    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Verification Token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
  verifyEmail,
};

