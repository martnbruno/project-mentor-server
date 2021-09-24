// Middleware that reads and validates the user's token before giving access to createProject function at projects.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Read token from header
  const token = req.header("x-auth-token");

  // Check if there is a token
  if (!token) {
    return res
      .status(401)
      .json({ msg: "There is no token, permission not valid" });
  }

  // Validate token
  try {
    const validated = jwt.verify(token, process.env.SECRET);
    req.user = validated.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
