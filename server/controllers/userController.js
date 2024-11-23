// server/controllers/userController.js
const User = require('../models/User'); // Import the User model

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