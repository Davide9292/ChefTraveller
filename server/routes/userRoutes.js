// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Use the general auth middleware

router.get('/me', authMiddleware, userController.getCurrentUser);

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'API test route working!' });
});

module.exports = router; 