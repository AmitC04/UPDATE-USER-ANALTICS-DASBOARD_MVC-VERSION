const { validationResult } = require('express-validator');
const analyticsService = require('../services/analyticsService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * Analytics Controller
 * HTTP handling ONLY. Business logic lives in analyticsService.js.
 * Secure error messages; all inputs validated via express-validator.
 *
 * Fixes:
 *  - Backend #16 : checkValidation throws AppError – no accidental double-response.
 */

/**
 * Extract validated params or throw an AppError (400).
 * Callers no longer need a if(!check) return guard.
 * Fixes Backend Issue #16.
 * @param {import('express').Request} req
 */
function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(
      errors.array().map((e) => e.msg).join('; '),
      400
    );
  }
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
    next(error);
  }
}

/**
 * GET /api/v1/analytics/funnel?startDate=&endDate=
 */
async function getFunnel(req, res, next) {
  try {
    checkValidation(req);
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
  try {
    checkValidation(req);
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
  try {
    checkValidation(req);
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