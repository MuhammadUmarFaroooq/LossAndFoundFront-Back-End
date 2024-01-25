const express = require("express");
const { check } = require("express-validator");
const multer = require("multer");
const {
  signup,
  signin,
  getUserData,
  forgetpassword,
} = require("../controllers/user.controllers");
const {
  validateUserSignUp,
  uservalidation,
  validateUserSignIn,
} = require("../middlewares/user.validmiddle");
const authenticate = require("../middlewares/auth.middleware");
const sharp = require("sharp");
const User = require("../modals/users");
const Router = express.Router;

const usersRouter = Router();

const storage = multer.memoryStorage();
const filterFile = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid Image", false);
  }
};

const uploads = multer({ storage: storage, filterFile });

usersRouter.get("/", (req, res) => {
  res.json({ success: true, message: "Elcome to Backend" });
});

usersRouter.post("/signup", validateUserSignUp, uservalidation, signup);

usersRouter.post("/login", validateUserSignIn, uservalidation, signin);

usersRouter.post("/getUserData", authenticate, getUserData);

usersRouter.post("/forgetpassword", forgetpassword);

usersRouter.post(
  "/upload-Profile",
  authenticate,
  uploads.single("profile"),
  async (req, res) => {
    const { user } = req;

    if (!user) {
      console.log("Unauthorized access");
      res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
      return;
    }

    try {
      const profileBuffer = req.file.buffer;
      const { width, height } = await sharp(profileBuffer).metadata();

      const avatar = await sharp(profileBuffer)
        .resize(Math.round(width * 0.5), Math.round(height * 0.5))
        .toBuffer();

      await User.findByIdAndUpdate(user._id, { avatar: avatar });

      res.status(200).json({
        success: true,
        message: "Picture has been uploaded",
        userId: req.userId,
      });
    } catch (error) {
      console.error("Error in image uploading", error);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

module.exports = usersRouter;
