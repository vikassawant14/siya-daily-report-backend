
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SIYA Backend Running"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Employee management routes
app.use("/api/employees", employeeRoutes);

async function startServer() {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error("Missing MongoDB URI or JWT secret in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas Connected Successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SIYA Server Running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
