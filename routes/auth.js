
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Admin and Employee login
router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        message: "User ID and password are required"
      });
    }

    const user = await User.findOne({
      userId: userId.trim().toLowerCase(),
      active: true
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid login details"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        userId: user.userId,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Server error"
    });
  }
});

module.exports = router;
