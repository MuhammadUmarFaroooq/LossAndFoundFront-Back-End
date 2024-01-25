const express = require("express");

const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("./config/ConnectDb");
const usersRouter = require("./routes/user.routes");

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

app.listen(8000, () => {
  console.log("port is listening");
});