// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const staffAuthMiddleware = require('../middleware/staffAuthMiddleware'); // Use the staff auth middleware

router.put('/:id/status', authMiddleware, bookingController.updateBookingStatus); // Add this route
router.post('/',authMiddleware, bookingController.createBooking);
router.get('/', staffAuthMiddleware, bookingController.getAllBookings); // Protect with staff middleware
router.put('/:id/status', staffAuthMiddleware, bookingController.updateBookingStatus); // Add this route
router.put('/:id', authMiddleware, bookingController.editBooking); // Add the editBooking route
router.post('/:id/new-proposal', authMiddleware, bookingController.requestNewProposal); // Add this route
router.delete('/:id', staffAuthMiddleware, bookingController.deleteBooking); // Add this route

module.exports = router;