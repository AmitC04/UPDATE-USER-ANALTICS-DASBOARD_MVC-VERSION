/**
 * API Client Configuration
 * Converted from api.js to TypeScript (Frontend Issue #4 – mixed JS/TS codebase).
 *
 * Fixes:
 *  - Frontend #4  : Full TypeScript with import type safety
 *  - Frontend #14 : Structured error handling (no raw console.error in production)
 *  - Frontend #17 : Automatic retry with exponential back-off for transient failures
 *  - Backend  #15 : 10-second request timeout
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  OverviewData,
  FunnelData,
  UserAnalyticsData,
  RevenueMonthData,
  DetailedAnalyticsData,
  UserProfile,
} from '@/types/api';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Maximum number of automatic retries for idempotent requests */
const MAX_RETRIES = 2;
/** Base back-off delay in ms; doubles each attempt */
const RETRY_BASE_DELAY_MS = 500;
/** HTTP status codes that should trigger a retry */
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

// ─── Client ──────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000, // 10-second request timeout
  // withCredentials omitted — this app uses Authorization: Bearer, not cookies.
  // Setting withCredentials makes CORS preflight stricter without benefit here.
  headers: { 'Content-Type': 'application/json' },
});

// ─── Retry helper ────────────────────────────────────────────────────────────

/**
 * Execute an API call with automatic retries on transient failures.
 * Fixes Frontend Issue #17.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = MAX_RETRIES
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = (err as AxiosError)?.response?.status;
      // Do not retry on 4xx client errors (except 429 rate-limit)
      if (status && status < 500 && status !== 429) throw err;
      if (!RETRYABLE_STATUSES.has(status as number) && status !== undefined && status >= 400) {
        throw err;
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, RETRY_BASE_DELAY_MS * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

/**
 * Simple response validator – throws if the response shape is unexpected.
 * Fixes Frontend Issue #8 – no more blind data access.
 */
function assertSuccess<T>(response: ApiResponse<T>, endpoint: string): T {
  if (!response || response.success === false) {
    throw new Error(response?.error ?? `Request to ${endpoint} failed`);
  }
  if (response.data === undefined || response.data === null) {
    throw new Error(`No data returned from ${endpoint}`);
  }
  return response.data;
}

// ─── Exported functions ──────────────────────────────────────────────────────

/**
 * Fetch Overview Analytics
 * GET /api/v1/analytics/overview
 */
export const fetchOverview = async (): Promise<OverviewData> => {
  return withRetry(async () => {
    const res = await api.get<ApiResponse<OverviewData>>('/api/v1/analytics/overview');
    return assertSuccess(res.data, '/api/v1/analytics/overview');
  });
};

/**
 * Fetch Revenue Trend
 * GET /api/v1/analytics/revenue-trend
 */
export const fetchRevenueTrend = async (months = 5): Promise<RevenueMonthData[]> => {
  return withRetry(async () => {
    const res = await api.get<ApiResponse<RevenueMonthData[]>>(
      '/api/v1/analytics/revenue-trend',
      { params: { months } }
    );
    return assertSuccess(res.data, '/api/v1/analytics/revenue-trend');
  });
};

/**
 * Fetch Conversion Funnel Data
 * GET /api/v1/analytics/funnel
 */
export const fetchFunnel = async (
  startDate?: string,
  endDate?: string
): Promise<FunnelData> => {
  return withRetry(async () => {
    const res = await api.get<ApiResponse<FunnelData>>('/api/v1/analytics/funnel', {
      params: { startDate, endDate },
    });
    return assertSuccess(res.data, '/api/v1/analytics/funnel');
  });
};

/**
 * Fetch User Analytics
 * GET /api/v1/analytics/users
 */
export const fetchUserAnalytics = async (
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<UserAnalyticsData>> => {
  return withRetry(async () => {
    const res = await api.get<ApiResponse<UserAnalyticsData>>('/api/v1/analytics/users', {
      params: { startDate, endDate },
    });
    return res.data;
  });
};

/**
 * Fetch User Profile
 * GET /api/v1/user/getUser
 * Falls back to demo user when not authenticated (no login system in this app).
 */
export const fetchUser = async (): Promise<UserProfile> => {
  // Try authenticated endpoint first (if a Bearer token is set elsewhere)
  try {
    const res = await api.get<ApiResponse<UserProfile>>('/api/v1/user/getUser');
    return assertSuccess(res.data, '/api/v1/user/getUser');
  } catch (err) {
    const status = (err as AxiosError)?.response?.status;
    // 401/403 = no valid token — fall through to demo endpoint
    if (status !== 401 && status !== 403) {
      // For any other error (500, network, etc.) also try demo as fallback
      // so the profile page always shows something useful
    }
    // Fall back to the demo user endpoint (always available in development)
    try {
      const demoRes = await api.get<ApiResponse<UserProfile>>('/api/v1/user/getDemoUser');
      const data = assertSuccess(demoRes.data, '/api/v1/user/getDemoUser');
      return { ...data, isDemo: true };
    } catch (demoErr) {
      // Demo endpoint also failed — return a static offline profile so the
      // UI never shows a hard error just because the user isn't logged in.
      return {
        user_id: 0,
        first_name: 'Guest',
        last_name: 'User',
        email: 'guest@example.com',
        auth_provider: 'none',
        password_changed_at: new Date().toISOString(),
        isDemo: true,
      };
    }
  }
};

/**
 * Fetch Detailed Analytics
 * GET /api/v1/analytics/detailed
 */
export const fetchDetailedAnalytics = async (): Promise<DetailedAnalyticsData> => {
  return withRetry(async () => {
    const res = await api.get<ApiResponse<DetailedAnalyticsData>>(
      '/api/v1/analytics/detailed'
    );
    return assertSuccess(res.data, '/api/v1/analytics/detailed');
  });
};

export default api;
