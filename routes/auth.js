// Routes to authenticate users
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// api/auth

// Sign in an user
router.post("/", authController.authenticateUser);

// Gets authenticated user
router.get("/", auth, authController.authenticatedUser);

module.exports = router;
