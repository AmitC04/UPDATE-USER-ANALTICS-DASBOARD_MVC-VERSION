const express = require('express');
const { query } = require('express-validator'); // Issue #4, #11 - input validation
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Issue #10 - These routes are mounted under /api/v1/analytics in index.js

// Shared date-range validators
// Use { values: 'falsy' } so that empty string '' is treated as "not provided"
const dateRangeValidators = [
  query('startDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('startDate must be a valid ISO-8601 date (e.g. 2025-01-01)'),
  query('endDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('endDate must be a valid ISO-8601 date (e.g. 2025-12-31)'),
];

// GET /api/v1/analytics/overview
router.get('/overview', analyticsController.getOverview);

// GET /api/v1/analytics/revenue-trend?months=5
router.get(
  '/revenue-trend',
  [query('months').optional({ values: 'falsy' }).isInt({ min: 1, max: 24 }).withMessage('months must be an integer between 1 and 24')],
  analyticsController.getRevenueTrend,
);

// GET /api/v1/analytics/funnel?startDate=&endDate=
router.get('/funnel', dateRangeValidators, analyticsController.getFunnel);

// GET /api/v1/analytics/users?startDate=&endDate=
router.get('/users', dateRangeValidators, analyticsController.getUserAnalytics);

// GET /api/v1/analytics/detailed
router.get('/detailed', analyticsController.getDetailedAnalytics);

module.exports = router;
