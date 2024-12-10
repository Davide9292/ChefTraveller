// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Use the general auth middleware

router.get('/me', authMiddleware, userController.getCurrentUser);

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'API test route working!' });
});

router.post('/me/password/verify', authMiddleware, userController.verifyPassword); // Add this route
router.put('/me/password', authMiddleware, userController.changePassword); // Add this route


module.exports = router; 