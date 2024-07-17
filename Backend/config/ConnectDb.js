

const mongoose = require("mongoose");
require("dotenv").config();

const connStr = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(connStr);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

// Event listener for successful connection
mongoose.connection.on("connected", () => {
  console.log("MongoDB connecteds...");
});

// Event listener for connection error
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

module.exports = { connectDB };

