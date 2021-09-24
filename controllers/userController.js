const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  //Express validator result evaluation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Validate if user already exists
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "This user already exists" });
    }

    // Create new user
    user = new User(req.body);

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    // Save user
    await user.save();

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
    console.log(eror);
    res.status(400).send("There was an error");
  }
};
