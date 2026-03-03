/**
 * Application-wide named constants.
 * Fixes Backend Issue #12 (hard-coded config) and Issue #19 (magic numbers).
 * Prefer environment variables for values that differ per deployment.
 */

/** Cache TTL values in seconds */
const CACHE_TTL_SECONDS = {
  OVERVIEW: 300,        // 5 minutes
  USER_ANALYTICS: 120,  // 2 minutes
  FUNNEL: 120,          // 2 minutes
  REVENUE: 300,         // 5 minutes
  DETAILED: 300,        // 5 minutes
};

/** Active-user detection window */
const ACTIVE_USER_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/** Maximum analytics date range the API will accept */
const MAX_DATE_RANGE_DAYS = 365;

/** Default lookback windows */
const DEFAULT_FUNNEL_RANGE_DAYS = 30;
const DEFAULT_USER_ANALYTICS_RANGE_DAYS = 7;

/** Revenue trend bounds */
const MAX_REVENUE_MONTHS = 24;
const DEFAULT_REVENUE_MONTHS = 5;

/** In-memory cache hard cap (LRU evicts oldest when exceeded) */
const MAX_CACHE_SIZE = 500;

/** Maximum allowed metadata JSON payload */
const METADATA_MAX_SIZE_BYTES = 10 * 1024; // 10 KB

/** Default currency code – override via DEFAULT_CURRENCY env var */
const CURRENCY_DEFAULT = process.env.DEFAULT_CURRENCY || 'INR';

/** Frontend chart height in px (shared reference for documentation purposes) */
const CHART_HEIGHT_PX = 200;

/** Axios / Express request timeout */
const API_TIMEOUT_MS = 10_000; // 10 seconds

/** Rate-limit windows */
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;   // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 200;            // per window per IP (analytics endpoints)
const RATE_LIMIT_MAX_EXPENSIVE = 30;            // for heavy date-range endpoints

module.exports = {
  CACHE_TTL_SECONDS,
  ACTIVE_USER_THRESHOLD_MS,
  MAX_DATE_RANGE_DAYS,
  DEFAULT_FUNNEL_RANGE_DAYS,
  DEFAULT_USER_ANALYTICS_RANGE_DAYS,
  MAX_REVENUE_MONTHS,
  DEFAULT_REVENUE_MONTHS,
  MAX_CACHE_SIZE,
  METADATA_MAX_SIZE_BYTES,
  CURRENCY_DEFAULT,
  CHART_HEIGHT_PX,
  API_TIMEOUT_MS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_MAX_EXPENSIVE,
};
