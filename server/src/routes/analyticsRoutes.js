const express = require('express');
const { query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_MAX_EXPENSIVE,
} = require('../utils/constants');

// These routes are mounted under /api/v1/analytics in index.js.

// ─── Rate limiters (Backend Issue #11) ──────────────────────────────────────

/** Standard rate limit for lightweight overview/detailed endpoints */
const standardLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test',
});

/** Stricter rate limit for date-range endpoints (heavy DB queries) */
const expensiveLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_EXPENSIVE,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many range queries, please try again later.' },
  skip: () => process.env.NODE_ENV === 'test',
});

// ─── Shared validators ───────────────────────────────────────────────────────

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

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/v1/analytics/overview
router.get('/overview', standardLimiter, analyticsController.getOverview);

// GET /api/v1/analytics/revenue-trend?months=5
router.get(
  '/revenue-trend',
  standardLimiter,
  [query('months').optional({ values: 'falsy' }).isInt({ min: 1, max: 24 }).withMessage('months must be an integer between 1 and 24')],
  analyticsController.getRevenueTrend,
);

// GET /api/v1/analytics/funnel?startDate=&endDate=  (expensive – lower limit)
router.get('/funnel', expensiveLimiter, dateRangeValidators, analyticsController.getFunnel);

// GET /api/v1/analytics/users?startDate=&endDate=  (expensive – lower limit)
router.get('/users', expensiveLimiter, dateRangeValidators, analyticsController.getUserAnalytics);

// GET /api/v1/analytics/detailed
router.get('/detailed', standardLimiter, analyticsController.getDetailedAnalytics);

module.exports = router;
