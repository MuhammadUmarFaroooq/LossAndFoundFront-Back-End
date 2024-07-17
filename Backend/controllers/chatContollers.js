const { Server } = require("socket.io");
const Message = require("../modals/message");

const io = new Server();

async function sendMessage(senderId, receiverId, message) {
  try {
    // Save message to database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      timestamp: new Date(),
    });

    // Emit event to sender's room
    io.to(senderId).emit("message_sent", newMessage);

    // Emit event to receiver's room (if applicable)
    io.to(receiverId).emit("message_received", newMessage);

    return {
      success: true,
      message: newMessage,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("send_message", async (data) => {
    console.log("Received chat message:", data);

    try {
      const { senderId, receiverId, message } = data;

      const newMessage = await Message.create({
        senderId,
        receiverId,
        message,
        timestamp: new Date(),
      });

      io.to(receiverId).emit("message_received", newMessage);
      socket.emit("message_sent", newMessage);

      console.log("Message sent and received successfully");
    } catch (error) {
      console.error("Error processing chat message:", error);
      socket.emit("message_error", { error: "Failed to process message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

async function receiveMessage(req, res) {
  const { messageId } = req.params;
  const receiverId = req.userId; // Extracted from the authentication middleware

  try {
    // Fetch message from database
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Check if the receiver is the intended recipient
    if (message.receiverId.toString() !== receiverId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access to message" });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error receiving message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to receive message",
    });
  }
}

async function getChatHistory(req, res) {
  const { userId: user1Id } = req;
  const { user2Id } = req.params;

  try {
    // Fetch all messages between two users from database
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
    });
  }
}

async function deleteMessage(req, res) {
  const { messageId } = req.params;

  try {
    // Delete message from database
    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({
      success: true,
      message: deletedMessage,
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
}

module.exports = {
  sendMessage,
  receiveMessage,
  getChatHistory,
  deleteMessage,
};
