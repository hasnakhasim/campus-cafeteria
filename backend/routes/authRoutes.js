const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create student
    const user = new User({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student"
    });

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });

  }
});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    // Successful login
    res.json({
      message: "Login successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });

  }
});


module.exports = router;