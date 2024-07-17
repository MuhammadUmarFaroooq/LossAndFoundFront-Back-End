const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const { connectDB } = require("./config/ConnectDb"); // Adjust path as needed
const usersRouter = require("./routes/user.routes"); // Adjust path as needed
const postRouter = require("./routes/post.routes"); // Adjust path as needed
const chatRoutes = require("./routes/chatRoutes"); // Adjust path as needed // Adjust path as needed
const friendRouter = require("./routes/friend.routes");

const { Server } = require("socket.io");
const http = require("http"); 
connectDB(); // Connect to MongoDB

const app = express();
const server = http.createServer(app); // Assuming 'app' is your Express app
const io = new Server(server); 

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve images from the "public/Images/uploads" directory
app.use("/images/uploads", express.static(path.join(__dirname, "public", "Images", "uploads")));

// Routes
app.use("/users", usersRouter); // User routes
app.use("/posts", postRouter); // Post routes
app.use("/chat", chatRoutes); // Chat routes
app.use("/friends", friendRouter);
// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle events here
  socket.on("send_message", async (data) => {
    // Process message logic
    try {
      const { senderId, receiverId, message } = data;
      // Your message processing logic here...
      // Emit events back to clients as needed
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("message_error", { error: "Failed to process message" });
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});


// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


