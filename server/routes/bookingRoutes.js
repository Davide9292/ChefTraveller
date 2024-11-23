// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const staffAuthMiddleware = require('../middleware/staffAuthMiddleware'); // Use the staff auth middleware

router.post('/',authMiddleware, bookingController.createBooking);
router.get('/', staffAuthMiddleware, bookingController.getAllBookings); // Protect with staff middleware
router.put('/:id/status', staffAuthMiddleware, bookingController.updateBookingStatus); // Add this route

module.exports = router;