const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth');

// User profile endpoints
router.get('/getUser', requireAuth, userController.getUser);

module.exports = router;