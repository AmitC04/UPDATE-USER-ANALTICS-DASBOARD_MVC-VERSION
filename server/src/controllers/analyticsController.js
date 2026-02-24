const { validationResult } = require('express-validator');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');

/**
 * Analytics Controller
 * Issue #8 - HTTP handling ONLY. Business logic lives in analyticsService.js.
 * Issue #3 - Error messages never expose internal details.
 * Issue #4 - All inputs validated via express-validator (see analyticsRoutes.js).
 */

/** Helper: extract validated params or reject early */
function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
}

/**
 * GET /api/v1/analytics/overview
 */
async function getOverview(req, res, next) {
  try {
    const data = await analyticsService.getOverview();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Overview analytics error:', { error: error.message, stack: error.stack, userId: req.user?.id });
    next(error); // Issue #9 - centralized handler
  }
}

/**
 * GET /api/v1/analytics/funnel?startDate=&endDate=
 * Issue #4 - dates validated as ISO-8601 in routes
 */
async function getFunnel(req, res, next) {
  if (!checkValidation(req, res)) return;
  try {
    const { startDate, endDate } = req.query;
    const data = await analyticsService.getFunnel(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Funnel analytics error:', { error: error.message, stack: error.stack });
    next(error);
  }
}

/**
 * GET /api/v1/analytics/users?startDate=&endDate=
 */
async function getUserAnalytics(req, res, next) {
  if (!checkValidation(req, res)) return;
  try {
    const { startDate, endDate } = req.query;
    const data = await analyticsService.getUserAnalytics(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('User analytics error:', { error: error.message, stack: error.stack });
    next(error);
  }
}

/**
 * GET /api/v1/analytics/revenue-trend?months=5
 */
async function getRevenueTrend(req, res, next) {
  if (!checkValidation(req, res)) return;
  try {
    const months = req.query.months || 5;
    const data = await analyticsService.getRevenueTrend(months);
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Revenue trend error:', { error: error.message, stack: error.stack });
    next(error);
  }
}

/**
 * GET /api/v1/analytics/detailed
 */
async function getDetailedAnalytics(req, res, next) {
  try {
    const data = await analyticsService.getDetailedAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    logger.error('Detailed analytics error:', { error: error.message, stack: error.stack });
    next(error);
  }
}

module.exports = {
  getOverview,
  getFunnel,
  getUserAnalytics,
  getRevenueTrend,
  getDetailedAnalytics,
};