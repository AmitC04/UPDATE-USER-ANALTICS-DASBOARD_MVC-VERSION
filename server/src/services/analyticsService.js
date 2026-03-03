/**
 * Analytics Service
 * Business logic layer between HTTP controllers and data-access models.
 *
 * Fixes:
 *  - Backend #3  : cache.delByPrefix() enables targeted invalidation.
 *  - Backend #6  : validateDateRange() blocks invalid / oversized date windows.
 *  - Backend #12 : TTL values imported from constants (no more magic numbers).
 *  - Backend #24 : buildCacheKey() normalises null/undefined to 'all' in keys.
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
const AppError = require('../utils/AppError');
const {
  CACHE_TTL_SECONDS,
  MAX_DATE_RANGE_DAYS,
  MAX_REVENUE_MONTHS,
  DEFAULT_REVENUE_MONTHS,
} = require('../utils/constants');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a deterministic cache key, converting absent values to 'all'
 * so keys are never ambiguous (e.g. never "funnel:null:null").
 * Fixes Backend Issue #24.
 * @param {...(string|number|null|undefined)} parts
 * @returns {string}
 */
function buildCacheKey(...parts) {
  return parts.map((p) => (p == null || p === '' ? 'all' : String(p))).join(':');
}

/**
 * Validate a date range pair.
 * - startDate must be ≤ endDate.
 * - Range must not exceed MAX_DATE_RANGE_DAYS.
 * Fixes Backend Issue #6.
 *
 * @param {string|undefined} startDate - ISO-8601 string
 * @param {string|undefined} endDate   - ISO-8601 string
 * @throws {AppError} 400 if validation fails
 */
function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return; // no range provided – use model defaults
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) {
    throw new AppError('startDate must be before or equal to endDate', 400);
  }
  const diffDays = (end - start) / (1000 * 60 * 60 * 24);
  if (diffDays > MAX_DATE_RANGE_DAYS) {
    throw new AppError(
      `Date range cannot exceed ${MAX_DATE_RANGE_DAYS} days`,
      400
    );
  }
}

// ─── Service methods ─────────────────────────────────────────────────────────

/** Get cached overview analytics. */
async function getOverview() {
  const cacheKey = buildCacheKey('analytics', 'overview');
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getOverviewData();
  cache.set(cacheKey, data, CACHE_TTL_SECONDS.OVERVIEW);
  return data;
}

/** Get conversion funnel with date validation. */
async function getFunnel(startDate, endDate) {
  validateDateRange(startDate, endDate);
  const cacheKey = buildCacheKey('analytics', 'funnel', startDate, endDate);
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getFunnelData(startDate, endDate);
  cache.set(cacheKey, data, CACHE_TTL_SECONDS.FUNNEL);
  return data;
}

/** Get user analytics with date validation. */
async function getUserAnalytics(startDate, endDate) {
  validateDateRange(startDate, endDate);
  const cacheKey = buildCacheKey('analytics', 'users', startDate, endDate);
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getUserAnalyticsData(startDate, endDate);
  cache.set(cacheKey, data, CACHE_TTL_SECONDS.USER_ANALYTICS);
  return data;
}

/**
 * Get revenue trend.
 * @param {number} months - Number of months (1 – MAX_REVENUE_MONTHS)
 */
async function getRevenueTrend(months) {
  const safeMonths = Math.min(
    Math.max(parseInt(months) || DEFAULT_REVENUE_MONTHS, 1),
    MAX_REVENUE_MONTHS
  );
  const cacheKey = buildCacheKey('analytics', 'revenue', safeMonths);
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getRevenueTrendData(safeMonths);
  cache.set(cacheKey, data, CACHE_TTL_SECONDS.REVENUE);
  return data;
}

/** Get detailed analytics (signup methods, certifications, etc.) */
async function getDetailedAnalytics() {
  const cacheKey = buildCacheKey('analytics', 'detailed');
  const cached = cache.get(cacheKey);
  if (cached) {
    logger.debug(`Cache HIT: ${cacheKey}`);
    return cached;
  }
  const data = await getDetailedAnalyticsData();
  cache.set(cacheKey, data, CACHE_TTL_SECONDS.DETAILED);
  return data;
}

/**
 * Invalidate all analytics cache entries.
 * Call this when new events are written so stale data is cleared.
 * Fixes Backend Issue #3.
 */
function invalidateAnalyticsCache() {
  cache.delByPrefix('analytics:');
  logger.info('Analytics cache invalidated');
}

module.exports = {
  getOverview,
  getFunnel,
  getUserAnalytics,
  getRevenueTrend,
  getDetailedAnalytics,
  invalidateAnalyticsCache,
};
