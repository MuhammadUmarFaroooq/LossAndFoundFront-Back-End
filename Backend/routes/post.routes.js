const express = require("express");
const multer = require("multer");
const { postUpload } = require("../controllers/post.controllers");

const Router = express.Router;
const postRouter = Router();
const path = require("path");
const postauthenticate = require("../middlewares/post.auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("public", "Images", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

const validateRequiredFields = (req, res, next) => {
  const { type, name, category, location, description, dateOfItem } = req.body;
  console.log(type);
  const missingFields = [];

  if (!type) missingFields.push("type");
  if (!name) missingFields.push("name");
  if (!category) missingFields.push("category");
  if (!location) missingFields.push("location");
  if (!description) missingFields.push("description");
  if (!dateOfItem) missingFields.push("dateOfItem");

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}.`,
    });
  }

  next();
};

postRouter.get("/", (req, res) => {
  res.json({ success: true, message: "wElcome to posts" });
});

postRouter.post(
  "/uploadPost",
  postauthenticate,
  validateRequiredFields,
  upload.array("images", 5), // Allow up to 5 images
  postUpload
);

module.exports = postRouter;
