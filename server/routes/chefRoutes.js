
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chefController = require('../controllers/chefController');

router.get('/', chefController.getChefs);
router.get('/:id', chefController.getChefById);
router.get('/me', authMiddleware, chefController.getChefProfile);
router.put('/:id/availability', authMiddleware, chefController.updateAvailability); // Add this route


// Add other routes for creating, updating, and deleting chefs as needed

module.exports = router;