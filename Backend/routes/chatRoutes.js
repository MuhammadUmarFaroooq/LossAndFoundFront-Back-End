// chatRoutes.js

const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatContollers");
const authenticate = require("../middlewares/auth.middleware");

// Route to send a message
router.post("/send_message", authenticate, async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.userId; // Extracted from the authentication middleware

  try {
    // Call controller function to send message
    const savedMessage = await chatController.sendMessage(senderId, receiverId, message, res);

    // Respond to the client with the saved message details
    res.status(200).json({ message: message, data: savedMessage });

    if(res.status === 200){
      console.log('Message sent successfully');
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get("/receive_message/:messageId", authenticate, chatController.receiveMessage);
router.get("/chat_history/:user2Id", authenticate, chatController.getChatHistory);
router.delete("/delete_message/:messageId", authenticate, chatController.deleteMessage);

module.exports = router;
