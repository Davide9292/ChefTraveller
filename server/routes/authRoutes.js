const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/test-db', async (req, res) => {
    try {
      const testUser = await User.findOne(); // Fetch any user from the database
      res.json({ success: true, testUser }); // Send a success response with the user data
    } catch (error) {
      console.error('DB Test Error:', error); // Log any errors
      res.status(500).json({ success: false, error: error.message }); // Send an error response
    }
  });

router.post('/register', authController.register);
router.post('/login', authController.login);
console.log

module.exports = router;