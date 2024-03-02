const mongoose = require("mongoose");
const Posts = require("../modals/post");
const users = require("../modals/users");

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
      status: "ok",
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

const getAllPosts = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    // Fetch all posts
    const allPosts = await Posts.find();

    res.status(200).json({
      success: true,
      posts: allPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const postId = req.params.id;

    // Fetch the post by id
    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    res.status(200).json({
      success: true,
      post: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getPostsByUserId = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const userId = req.params.userId;

    // Fetch posts by user ID
    const posts = await Posts.find({ user: userId });

    res.status(200).json({
      success: true,
      posts: posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const toggleFavorite = async (req, res) => {
  const { postId } = req.params;

  try {
    // 1. Find the post by ID
    const post = await Posts.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // 2. Toggle the isFavorite property
    post.isFavorite = !post.isFavorite;

    // 3. Save the updated post
    const updatedPost = await post.save();

    // 4. Update user's favorites list correctly using MongoDB update operators

    const updatedUser = await users.findByIdAndUpdate(
      req.user._id, // Update the current user
      {
        $set: {
          favorites: updatedPost.isFavorite
            ? [...req.user.favorites, updatedPost._id] // Add post ID if true
            : req.user.favorites.filter(
                (favPostId) =>
                  favPostId.toString() !== updatedPost._id.toString()
              ), // Remove post ID if false
        },
      },
      { new: true } // Ensure you get the updated info
    );

    // 5. Fetch the updated user document (optional)

    // 6. Send the response with correct information
    res.status(200).json({
      success: true,
      message: `Post ${
        updatedPost.isFavorite ? "added to" : "removed from"
      } favorites`,
      post: updatedPost,
      user: updatedUser, // Include the updated user object if needed
    });
  } catch (error) {
    console.error("Error toggling favorite status:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  postUpload,
  getAllPosts,
  toggleFavorite,
  getPostById,
  getPostsByUserId,
};
