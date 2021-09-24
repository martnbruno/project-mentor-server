const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

const connectDB = async () => {
  await mongoose.connect(process.env.DB_MONGO, (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB");
  });
};

module.exports = connectDB;
