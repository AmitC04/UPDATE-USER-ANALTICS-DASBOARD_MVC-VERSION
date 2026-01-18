const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

// User profile endpoints
router.get('/getUser', requireAuth, userController.getUser);
router.get('/getDemoUser', userController.getDemoUser);

module.exports = router;