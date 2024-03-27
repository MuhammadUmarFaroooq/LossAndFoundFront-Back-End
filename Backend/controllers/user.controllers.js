const mongoose = require("mongoose");
const Users = require("../modals/users");
const jwt = require("jsonwebtoken");
const VerificationToken = require("../modals/VerificationTokenSchema");
const { createRandomBytes } = require("../helper/helper");
const {
  generateOTP,
  mailTransport,
  generateHTMLWithOTP,
} = require("../helper/mail");
const sharp = require("sharp");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      country,
      province,
      city,
      password,
      confirmPassword,
    } = req.body;

    const isNewUser = await Users.isThisEmailInUse(email.toLowerCase());

    if (isNewUser) {
      return res.json({
        success: false,
        message: "This email is already in use. Please sign in.",
      });
    }

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    const avatarFileName = req.file ? req.file.filename : null; // Get the filename

    const userToSave = new Users({
      fullName,
      email: email.toLowerCase(),
      phone,
      country,
      province,
      city,
      password,
      confirmPassword,
      avatar: avatarFileName, // Save the filename instead of buffer
    });

    const OTP = generateOTP();
    const VeriToken = new VerificationToken({
      owner: userToSave._id,
      token: OTP,
    });
    await VeriToken.save();

    await userToSave.save();

    mailTransport().sendMail({
      from: "emailverfication@gmal.com",
      to: userToSave.email,
      subject: "Verify OTP",
      html: generateHTMLWithOTP(OTP),
    });

    res.status(201).json({
      status: "ok",
      message: "User created.",
      userToSave,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email.toLowerCase() }); // Convert to lowercase before comparing

    if (!user) {
      return res.status(401).json({
        message: "Username or password is incorrect.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Username or password is incorrect.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "ok",
      message: "Successfully logged in.",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access. User data not available.",
      });
    }

    const useremail = user.email;
    const userData = await Users.findOne({ email: useremail });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User data not found.",
      });
    }

    // Fetch the favorites separately and populate them
    const populatedFavorites = await Users.populate(userData, {
      path: "favorites",
    });

    res.json({
      status: "ok",
      data: {
        id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        province: userData.province,
        city: userData.city,
        avatar: userData.avatar,
        favorites: populatedFavorites.favorites, // Assuming favorites is an array of post objects
      },
    });
  } catch (error) {
    console.log("Error getting user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const userData = await Users.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Fetch the favorites separately and populate them
    const populatedFavorites = await Users.populate(userData, {
      path: "favorites",
    });

    res.json({
      status: "ok",
      data: {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        province: userData.province,
        city: userData.city,
        avatar: userData.avatar,
        favorites: populatedFavorites.favorites, // Assuming favorites is an array of post objects
      },
    });
  } catch (error) {
    console.log("Error getting user data by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email: email.toLowerCase() }); // Convert to lowercase before comparing

    if (!user) {
      return res.status(401).json({
        message: "Email is incorrect.",
      });
    }

    const token = await VerificationToken.findOne({ owner: user._id });
    if (token) {
      return res.json({
        success: false,
        message: "Only after one hour you cann request",
      });
    }

    const OTP = generateOTP();
    const VeriToken = new VerificationToken({ owner: user._id, token: OTP });
    await VeriToken.save();

    mailTransport().sendMail({
      from: "emailverfication@gmal.com",
      to: user.email,
      subject: "Verify OTP",
      html: generateHTMLWithOTP(OTP),
    });

    res.json({
      status: "ok",
      message: "OTP sent",
      user
    });
  } catch (error) {
    console.log("Error getting user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, country, province, city } = req.body;

    // Check if the user exists
    const user = await Users.findById(req.user._id);
    console.log("update in", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Update user profile fields
    user.fullName = fullName;
    user.phone = phone;
    user.country = country;
    user.province = province;
    user.city = city;

    // Update avatar if a new file is provided
    if (req.file) {
      const avatarFileName = req.file.filename;
      user.avatar = avatarFileName;
    }

    await Users.updateOne({ _id: req.user._id }, user);
    console.log("Updated User Profile:", user);

    res.status(200).json({
      status: "ok",
      message: "Profile updated successfully.",
      user: {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        province: user.province,
        city: user.city,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    // Find the user by userId
    const user = await Users.findById(userId);

    // Check if the provided current password matches the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update the user's password in the database
    await Users.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({
      status: "ok",
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // Find the verification token associated with the user
    const tokenRecord = await VerificationToken.findOne({ owner: userId });

    if (!tokenRecord) {
      return res.status(404).json({
        success: false,
        message: "Verification token not found. Please try again.",
      });
    }

    // Compare the provided OTP with the stored hashed OTP
    const isMatch = await tokenRecord.compareToken(otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }

    // Mark the user as verified
    await Users.findByIdAndUpdate(userId, { verified: true });

    // Delete the verification token
    await VerificationToken.findOneAndDelete({ owner: userId });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. User has been verified.",
    });
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  signin,
  getUserData,
  getUserById,
  forgetpassword,
  updateProfile,
  changePassword,
  verifyOTP,
};
