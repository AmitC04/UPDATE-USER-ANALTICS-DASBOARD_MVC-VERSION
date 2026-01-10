const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// Overview endpoints
router.get('/overview', analyticsController.getOverview);
router.get('/revenue-trend', analyticsController.getRevenueTrend);

// Funnel endpoints
router.get('/funnel', analyticsController.getFunnel);

// User analytics endpoints
router.get('/users', analyticsController.getUserAnalytics);

// Detailed analytics endpoints
router.get('/detailed', analyticsController.getDetailedAnalytics);

module.exports = router;

