const express = require("express");
const { body, validationResult } = require("express-validator");
const { protect } = require("../middleware/auth");
   const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");
const multer = require("multer");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const FormData = require("form-data");
const router = express.Router();
// ...existing code...

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("mobile")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Please enter a valid 10-digit mobile number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("idProofFrontPhoto").notEmpty().withMessage("Front photo required"),
    body("idProofBackPhoto").notEmpty().withMessage("Back photo required"),
  ],
  async (req, res) => {
    try {
      console.log("Register Requested");

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        name,
        email,
        mobile,
        password,
        dateOfBirth,
        gender,
        idProofFrontPhoto,
        idProofBackPhoto,
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      // =========================
      // Call DIGINIT API
      // =========================
      const form = new FormData();
      const frontImageBuffer = Buffer.from(
        idProofFrontPhoto.base64.split(",")[1],
        "base64"
      );
      const backImageBuffer = Buffer.from(
        idProofBackPhoto.base64.split(",")[1],
        "base64"
      );

      form.append("front_image", frontImageBuffer, {
        filename: "front.jpg",
        contentType: "image/jpeg",
      });
      form.append("back_image", backImageBuffer, {
        filename: "back.jpg",
        contentType: "image/jpeg",
      });

      const diginitResponse = await axios.post(
        "https://verification.didit.me/v2/id-verification/",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "x-api-key": "_p5EIr602PmBfTLGmN9YByBMon_6YNwg6Jt2lte4qj0",
          },
        }
      );
      if (
        diginitResponse.status !== 200 ||
        !diginitResponse.data.id_verification
      ) {
        return res.status(400).json({
          success: false,
          message: "ID verification failed",
          details: diginitResponse.data,
        });
      }

      const extracted = diginitResponse.data.id_verification;

      // Map gender from API ('M', 'F', 'U') to your schema ('Male', 'Female', 'Other')
      const mapGender = (apiGender) => {
        if (apiGender === "M") return "Male";
        if (apiGender === "F") return "Female";
        return "Other"; // Default for 'U' or other values
      };
      console.log(extracted.document_number);

      // Create user
      // =========================
      const user = await User.create({
        // Use extracted data if available, otherwise fall back to form data
        name: extracted.full_name || name,
        email,
        mobile,
        dateOfBirth: extracted.date_of_birth || dateOfBirth,
        gender: mapGender(extracted.gender),
        password,
        idNumber: extracted.document_number,
        aadhaarNumber: extracted.document_number,
        address: extracted.address, // This might be null, ensure your schema allows it
        isVerified: true, // Mark verified if DIGINIT succeeds
      });

      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            isVerified: user.isVerified,
          },
          token,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Generate token
      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            isVerified: user.isVerified,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req, res) => {
  // The 'protect' middleware has already run and attached the user to req.user
  try {
    // req.user is available here
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
