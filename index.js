// Import express
const express = require("express");

// Import connectDB
const connectDB = require("./config/db");

// Import cors
const cors = require("cors");

// Assign express function to app const
const app = express();

// Connect to database
connectDB();

// Enable cors
app.use(cors());

// Enable express.json
app.use(express.json({ extended: true }));

// Define port
const PORT = process.env.PORT || 4000;

// Import routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

// Run and listen server at PORT
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
