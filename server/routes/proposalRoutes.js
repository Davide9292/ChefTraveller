// server/routes/proposalRoutes.js
const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');
const staffAuthMiddleware = require('../middleware/staffAuthMiddleware'); // Protect the route

router.post('/', staffAuthMiddleware, proposalController.createProposal);

module.exports = router;