const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", async (req, res) => {
  const { studentId, password } = req.body;
  const user = await User.findOne({ studentId, password });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user._id, studentId: user.studentId, role: user.role },
    "quickfound_secret",
    { expiresIn: "7d" }
  );
  res.json({ token, user });
});

// Admin only - reset any user's password
router.patch("/reset-password", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const { studentId, newPassword } = req.body;
    if (!studentId || !newPassword) {
      return res.status(400).json({ message: "studentId and newPassword required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOneAndUpdate(
      { studentId },
      { password: newPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, message: `Password reset for ${user.name}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin only - get all users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    const users = await User.find({}, "name studentId role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;