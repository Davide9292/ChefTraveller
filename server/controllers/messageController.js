// server/controllers/messageController.js
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { bookingId, content } = req.body;
    const senderId = req.user.userId;

    const message = new Message({ sender: senderId, booking: bookingId, content }); // Remove recipient from message creation
    await message.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};