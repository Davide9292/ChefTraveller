// server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController'); // You'll need to create this controller
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, messageController.sendMessage);

module.exports = router;