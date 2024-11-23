// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Use the general auth middleware

router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;