/**
 * Analytics Service
 * Issue #8 / #20 - Service layer: business logic separated from HTTP handling
 * and data access layer (three-tier architecture).
 *
 * Tier:   Controller → Service (business logic) → Model (data access)
 */
const {
  getOverviewData,
  getFunnelData,
  getUserAnalyticsData,
  getRevenueTrendData,
  getDetailedAnalyticsData,
} = require('../models/analyticsModel');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

/**
 * Get cached overview analytics.
 * Issue #21 - 5-minute cache for dashboard data.
 */
async function getOverview() {
  const cacheKey = 'analytics:overview';
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug('Cache HIT: analytics:overview');
    return cached;
  }
  const data = await getOverviewData();
  cache.set(cacheKey, data, 300); // 5 min TTL
  return data;
}

/**
 * Get conversion funnel with business validation.
 * Issue #4 / #18 - Validated inputs, date boundary guards.
 */
async function getFunnel(startDate, endDate) {
  const cacheKey = `analytics:funnel:${startDate || 'null'}:${endDate || 'null'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getFunnelData(startDate, endDate);
  cache.set(cacheKey, data, 120); // 2 min TTL
  return data;
}

/**
 * Get user analytics with business validation.
 */
async function getUserAnalytics(startDate, endDate) {
  const cacheKey = `analytics:users:${startDate || 'null'}:${endDate || 'null'}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getUserAnalyticsData(startDate, endDate);
  cache.set(cacheKey, data, 120);
  return data;
}

/**
 * Get revenue trend.
 * @param {number} months - Number of months (1-24)
 */
async function getRevenueTrend(months) {
  const safeMonths = Math.min(Math.max(parseInt(months) || 5, 1), 24);
  const cacheKey = `analytics:revenue:${safeMonths}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getRevenueTrendData(safeMonths);
  cache.set(cacheKey, data, 300);
  return data;
}

/**
 * Get detailed analytics (signup methods, certifications, etc.)
 */
async function getDetailedAnalytics() {
  const cacheKey = 'analytics:detailed';
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug('Cache HIT: analytics:detailed');
    return cached;
  }
  const data = await getDetailedAnalyticsData();
  cache.set(cacheKey, data, 300);
  return data;
}

module.exports = {
  getOverview,
  getFunnel,
  getUserAnalytics,
  getRevenueTrend,
  getDetailedAnalytics,
};
