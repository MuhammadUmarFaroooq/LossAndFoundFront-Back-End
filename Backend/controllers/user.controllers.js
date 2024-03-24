const mongoose = require("mongoose");
const Users = require("../modals/users");
const jwt = require("jsonwebtoken");
const VerificationToken = require("../modals/VerificationTokenSchema");
const { createRandomBytes } = require("../helper/helper");
const { generateOTP, mailTransport } = require("../helper/mail");
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

    await userToSave.save();

    res.status(201).json({
      status: "ok",
      message: "User created.",
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
      html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Item Sync</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Item Sync. Use the following OTP to complete your Reset procedures. OTP is valid for 1 hour</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />Item Sync</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Item Sync</p>
      <p>Gujranwala,Punjab</p>
      <p>Pakistan</p>
    </div>
  </div>
</div>`,
    });

    res.json({
      status: "ok",
      message: "OTP sent",
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

module.exports = { changePassword };

module.exports = {
  signup,
  signin,
  getUserData,
  getUserById,
  forgetpassword,
  updateProfile,
  changePassword,
};
