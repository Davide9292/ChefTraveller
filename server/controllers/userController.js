// server/controllers/userController.js
const User = require('../models/User'); // Import the User model
const Message = require('../models/Message'); // Import the Message model
const bcrypt = require('bcrypt');

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: 'bookings',
      populate: { path: 'proposal.chefs.chef' } // Populate the 'chef' field within the 'chefs' array of the 'proposal' field
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    res.json({ message: 'Password verified' });
  } catch (error) {
    console.error('Error verifying password:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Add your password validation logic here (e.g., minimum length, special characters, etc.)
    if (newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) || !/\d/.test(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet requirements' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching messages for user:', req.user.userId);

    // Add this line to get the bookingId from the query parameters
    const bookingId = req.query.bookingId; 

    // Fetch messages where the user is the sender and the booking matches the bookingId
    const messages = await Message.find({ sender: userId, booking: bookingId })
      .populate('sender')
      .populate('booking');

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};