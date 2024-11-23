const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authenticate = require('../middleware/authMiddleware');   

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authenticate, eventController.createEvent); // Protect the route with middleware

// Add other routes for creating, updating, and deleting events as needed

module.exports = router;