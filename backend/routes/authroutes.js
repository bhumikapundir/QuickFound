const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {

  const { studentId, password } = req.body;

  const user = await User.findOne({ studentId, password });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user
  });

});

module.exports = router;