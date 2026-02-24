const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

// Issue #10 - Mounted under /api/v1/user in index.js

// GET /api/v1/user/getUser  (authenticated)
router.get('/getUser', requireAuth, userController.getUser);

// Issue #2 - Demo endpoint ONLY available in development environment
if (process.env.NODE_ENV === 'development') {
  router.get('/getDemoUser', userController.getDemoUser);
}

module.exports = router;
