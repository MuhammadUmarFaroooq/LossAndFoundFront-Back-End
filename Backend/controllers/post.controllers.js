const mongoose = require("mongoose");
const Posts = require("../modals/post");

const postUpload = async (req, res) => {
  try {
    const {
      type,
      name,
      category,
      brand,
      color,
      location,
      description,
      dateOfItem,
    } = req.body;

    const user = req.user;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    if (!req.files || !Array.isArray(req.files)) {
      console.log("No files uploaded or invalid file data.", req.files);
      return res.status(400).json({
        success: false,
        message: "No files uploaded or invalid file data.",
      });
    }

    // Create post instance
    const post = new Posts({
      user: user._id,
      type,
      name,
      category,
      brand,
      color,
      datePosted: new Date(),
      dateOfItem,
      location,
      description,
      images: req.files.map((file) => file.filename),
      expirationDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { postUpload };
