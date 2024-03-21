const express = require("express");
const multer = require("multer");
const {
  signup,
  signin,
  getUserData,
  forgetpassword,
  updateProfile,
  getUserById,
  changePassword,
  verifyOTP,
} = require("../controllers/user.controllers");
const {
  validateUserSignUp,
  uservalidation,
  validateUserSignIn,
} = require("../middlewares/user.validmiddle");
const authenticate = require("../middlewares/auth.middleware");
const postauthenticate = require("../middlewares/post.auth");
const User = require("../modals/users");
const Router = express.Router;

const usersRouter = Router();
const path = require("path");

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

usersRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Elcome to Backend" });
});

usersRouter.post(
  "/signup",
  upload.single("avatar"),
  validateUserSignUp,
  uservalidation,
  signup
);

usersRouter.post("/login", validateUserSignIn, uservalidation, signin);

usersRouter.get("/getUserData", postauthenticate, getUserData);

usersRouter.get("/getUserById/:userId", postauthenticate, getUserById);

usersRouter.post("/forgetpassword", forgetpassword);

usersRouter.patch(
  "/updateprofile",
  postauthenticate,
  upload.single("avatar"),
  updateProfile
);
usersRouter.patch("/changepassword", postauthenticate, changePassword);

usersRouter.post("/verify-otp", verifyOTP);

module.exports = usersRouter;
