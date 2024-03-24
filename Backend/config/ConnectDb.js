const mongoose = require("mongoose");

const connStr = `${process.env.MONGO_URL}`;

const connectDB = async () => {
  try {
    await mongoose.connect(connStr);
  } catch (error) {
    console.error(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected...");
});

module.exports = { connectDB };
