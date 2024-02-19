const express = require("express");
const multer = require("multer");
const { postUpload, getAllPosts } = require("../controllers/post.controllers");

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

postRouter.get("/", (req, res) => {
  res.json({ success: true, message: "wElcome to posts" });
});

postRouter.post(
  "/uploadPost",
  postauthenticate,
  upload.array("images", 5), // Allow up to 5 images
  postUpload
);

postRouter.get("/getAllPosts", postauthenticate, getAllPosts);

module.exports = postRouter;
