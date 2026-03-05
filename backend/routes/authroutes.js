const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
router.post("/login", async (req, res) => {

  const { studentId, password } = req.body;

  const user = await User.findOne({ studentId, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user._id, studentId: user.studentId },
    "quickfound_secret",
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user
  });

});

module.exports = router;