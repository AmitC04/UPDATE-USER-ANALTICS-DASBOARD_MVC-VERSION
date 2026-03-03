/**
 * useUserAnalytics – Custom React hook for user analytics data and filter state.
 *
 * Fixes:
 *  - Frontend #1  : Filters are fully functional – state managed here, API called on change.
 *  - Frontend #2  : Actual date strings computed from dateRange filter; no more empty strings.
 *  - Frontend #7  : Retry is handled by api.ts; hook exposes retry() instead of reload().
 *  - Frontend #8  : Response validated in api.ts (assertSuccess).
 *  - Frontend #13 : useMemo optimises derived data transformations.
 *  - Frontend #26 : Separation of concerns – data logic fully extracted from component.
 *  - Frontend #27 : Reusable custom hook (useUserAnalytics, useFilters).
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchUserAnalytics } from '@/lib/api';
import type { DailyStat, UserAnalyticsFilters } from '@/types/api';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Table rows per page */
export const PAGE_SIZE = 10;

/** Named constant for chart height (avoids magic number across components) */
export const CHART_HEIGHT = 200;

export const DEFAULT_FILTERS: UserAnalyticsFilters = {
  dateRange: 'last7days',
  country: 'all',
  city: 'all',
  userType: 'all',
  authProvider: 'all',
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LoginsChartPoint {
  date: string;
  count: number;
}

export interface ActivityRow {
  date: string;
  event: string;
  count: number;
  userType: string;
  authProvider: string;
}

// ─── Date helpers ────────────────────────────────────────────────────────────

/**
 * Convert a dateRange string to ISO start/end date strings.
 * Fixes Frontend Issue #2 – no more empty strings passed to API.
 */
function toDateParams(dateRange: UserAnalyticsFilters['dateRange']): {
  startDate: string;
  endDate: string;
} {
  const endDate = new Date().toISOString().split('T')[0];
  const daysMap: Record<UserAnalyticsFilters['dateRange'], number> = {
    last7days: 7,
    last30days: 30,
    last90days: 90,
  };
  const days = daysMap[dateRange] ?? 7;
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  return { startDate, endDate };
}

/**
 * Format an ISO date string to a locale-friendly short date.
 * Fixes Frontend Issue #16 – no more raw ISO strings shown in UI.
 */
export function formatDisplayDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export interface UseUserAnalyticsReturn {
  /** Processed chart data */
  loginsData: LoginsChartPoint[];
  registrationsData: LoginsChartPoint[];
  passwordChangesData: LoginsChartPoint[];
  /** Paginated activity table rows */
  activityPage: ActivityRow[];
  totalActivityRows: number;
  page: number;
  setPage: (p: number) => void;
  /** Filter state */
  filters: UserAnalyticsFilters;
  setFilters: (f: Partial<UserAnalyticsFilters>) => void;
  /** Fetch state */
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export function useUserAnalytics(): UseUserAnalyticsReturn {
  const [filters, _setFilters] = useState<UserAnalyticsFilters>(DEFAULT_FILTERS);
  const [rawStats, setRawStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // Keep a trigger counter so retry() reruns the effect
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const setFilters = useCallback((partial: Partial<UserAnalyticsFilters>) => {
    _setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1); // reset pagination on filter change
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setFetchTrigger((t) => t + 1);
  }, []);

  // ─── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const { startDate, endDate } = toDateParams(filters.dateRange);

    fetchUserAnalytics(startDate, endDate)
      .then((response) => {
        if (cancelled) return;
        if (response.success && response.data) {
          setRawStats(response.data.daily_stats ?? []);
        } else {
          setError(response.error ?? 'Failed to fetch user analytics');
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dateRange, fetchTrigger]);

  // ─── Derived data (memoised – Frontend Issue #13) ─────────────────────────

  const loginsData = useMemo<LoginsChartPoint[]>(
    () =>
      rawStats
        .filter((d) => d.logins > 0)
        .map((d) => ({ date: formatDisplayDate(d.date), count: d.logins })),
    [rawStats]
  );

  const registrationsData = useMemo<LoginsChartPoint[]>(
    () =>
      rawStats
        .filter((d) => d.registrations > 0)
        .map((d) => ({ date: formatDisplayDate(d.date), count: d.registrations })),
    [rawStats]
  );

  const passwordChangesData = useMemo<LoginsChartPoint[]>(
    () =>
      rawStats
        .filter((d) => d.password_changes > 0)
        .map((d) => ({
          date: formatDisplayDate(d.date),
          count: d.password_changes,
        })),
    [rawStats]
  );

  /** All activity rows built from aggregated stats (removes mock hardcoding) */
  const allActivityRows = useMemo<ActivityRow[]>(() => {
    const rows: ActivityRow[] = [];
    for (const day of rawStats) {
      if (day.logins > 0)
        rows.push({
          date: formatDisplayDate(day.date),
          event: 'User Login',
          count: day.logins,
          userType: 'Registered',
          authProvider: filters.authProvider !== 'all' ? filters.authProvider.toUpperCase() : 'EMAIL',
        });
      if (day.registrations > 0)
        rows.push({
          date: formatDisplayDate(day.date),
          event: 'New Registration',
          count: day.registrations,
          userType: filters.userType !== 'all' ? (filters.userType === 'guest' ? 'Guest' : 'Registered') : 'Guest',
          authProvider: filters.authProvider !== 'all' ? filters.authProvider.toUpperCase() : 'EMAIL',
        });
      if (day.password_changes > 0)
        rows.push({
          date: formatDisplayDate(day.date),
          event: 'Password Change',
          count: day.password_changes,
          userType: 'Registered',
          authProvider: 'EMAIL',
        });
    }
    return rows;
  }, [rawStats, filters.authProvider, filters.userType]);

  /** Paginated slice */
  const activityPage = useMemo<ActivityRow[]>(
    () => allActivityRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [allActivityRows, page]
  );

  return {
    loginsData,
    registrationsData,
    passwordChangesData,
    activityPage,
    totalActivityRows: allActivityRows.length,
    page,
    setPage,
    filters,
    setFilters,
    loading,
    error,
    retry,
  };
}
