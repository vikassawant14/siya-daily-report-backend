
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const {
  authenticateToken,
  requireRole
} = require("../middleware/auth");

const router = express.Router();

// Admin creates an employee
router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { userId, name, password } = req.body;

      if (
        typeof userId !== "string" ||
        typeof name !== "string" ||
        typeof password !== "string" ||
        !userId.trim() ||
        !name.trim() ||
        password.length < 12
      ) {
        return res.status(400).json({
          message: "Valid User ID, name and password (minimum 12 characters) are required"
        });
      }

      const normalizedId = userId.trim().toLowerCase();

      const existingUser = await User.findOne({
        userId: normalizedId
      });

      if (existingUser) {
        return res.status(409).json({
          message: "User ID already exists"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const employee = await User.create({
        userId: normalizedId,
        name: name.trim(),
        password: hashedPassword,
        role: "employee"
      });

      res.status(201).json({
        message: "Employee created successfully",
        employee: {
          userId: employee.userId,
          name: employee.name,
          role: employee.role
        }
      });

    } catch (error) {
      console.error("Employee creation error:", error.message);
      res.status(500).json({
        message: "Could not create employee"
      });
    }
  }
);

// Admin views all employees
router.get(
  "/",
  authenticateToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const employees = await User.find(
        { role: "employee" },
        "userId name active createdAt"
      ).sort({ createdAt: -1 });

      res.json({ employees });

    } catch (error) {
      res.status(500).json({
        message: "Could not retrieve employees"
      });
    }
  }
);

module.exports = router;
