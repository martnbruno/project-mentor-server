const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req, res) => {
  //Express validator result evaluation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Destructuring email and password from request.
  const { email, password } = req.body;

  try {
    // Check that the user is already registered with findOne method that takes email of provided user. If not return status 400.
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "The provided user doesn't exist" });
    }
    // Check password is correct with compare method from bcrypt. If not return status 400.
    const passwordCheck = await bcryptjs.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    // If checks are passed
    // Create JWT Payload
    const payload = {
      user: {
        id: user.id,
      },
    };
    // Sign JWT
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        // 1hour
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        // Confirmation message
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Get which user is authenticated
exports.authenticatedUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "There was an error" });
  }
};
