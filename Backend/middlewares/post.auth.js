const jwt = require("jsonwebtoken");
const Users = require("../modals/users");

const postauthenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization"); // Extract token from the header

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access! Token missing.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Users.findById(decoded.userId);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized Access" });
      }

      req.userId = decoded._id;
      req.user = user; // Set the user in the request object
      next();
    } catch (error) {
      console.log(error.message);

      if (error.message === "jwt expired") {
        console.log("Token expired");
        return res.status(401).json({
          success: false,
          message: "Unauthorized. Token expired.",
        });
      } else {
        console.log("Invalid token");
        return res.status(401).json({
          success: false,
          message: "Unauthorized Access! Invalid token.",
        });
      }
    }
  } catch (error) {
    console.log("Internal Server Error");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = postauthenticate;
