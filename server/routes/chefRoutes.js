const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');

router.get('/', chefController.getChefs);
router.get('/:id', chefController.getChefById);

// Add other routes for creating, updating, and deleting chefs as needed

module.exports = router;