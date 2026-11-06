
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const userId = (await ask("Admin User ID: "))
      .trim().toLowerCase();

    const name = (await ask("Admin Name: ")).trim();

    const password = await ask("Admin Password (minimum 12 characters): ");

    if (!userId || !name || password.length < 12) {
      throw new Error("Enter valid details and a password of at least 12 characters.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      userId,
      name,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin account created successfully.");

  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
  }
}

createAdmin();
