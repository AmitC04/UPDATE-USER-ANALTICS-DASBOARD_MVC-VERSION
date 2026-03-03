/**
 * Shared TypeScript interfaces for API request/response shapes.
 * Fixes Frontend Issue #4 – type safety across the full API boundary.
 * Fixes Frontend Issue #37 – adapter layer decouples components from raw API shape.
 */

// ─── Overview ───────────────────────────────────────────────────────────────

export interface RecentActivity {
  action: string;
  user: string;
  time: string;
}

export interface OverviewData {
  visitors_today: number;
  logged_in_users_today: number;
  active_users_now: number;
  revenue_today: number;
  orders_today: number;
  refunds_today: number;
  recent_activity: RecentActivity[];
  recent_profile_updates: Array<{ user: string; field: string; time: string }>;
  password_changes_today: number;
  profile_updates_today: number;
  last_sensitive_change: string | null;
}

// ─── Funnel ─────────────────────────────────────────────────────────────────

export interface FunnelStep {
  step: string;
  count: number;
  dropOff: number;
}

export interface FunnelData {
  funnel: FunnelStep[];
  overall_conversion: number;
  period: { start: string; end: string };
}

// ─── User Analytics ──────────────────────────────────────────────────────────

export interface DailyStat {
  date: string;
  logins: number;
  registrations: number;
  password_changes: number;
}

export interface UserAnalyticsData {
  daily_stats: DailyStat[];
  guest_vs_registered: {
    guest: number;
    registered: number;
    total: number;
  };
  period: { start: string; end: string };
}

// ─── Revenue Trend ───────────────────────────────────────────────────────────

export interface RevenueMonthData {
  month: string;
  revenue: number;
}

// ─── Detailed Analytics ──────────────────────────────────────────────────────

export interface SignupMethodEntry {
  name: string;
  value: number;
  color: string;
}

export interface DetailedAnalyticsData {
  signup_methods: SignupMethodEntry[];
  top_certifications: Array<{ name: string; count: number }>;
  reviews_submitted: number;
}

// ─── Generic API response wrapper ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// ─── User / Profile ──────────────────────────────────────────────────────────

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  auth_provider: string;
  password_changed_at: string;
  /** Present only on demo/fallback responses */
  isDemo?: boolean;
}

// ─── Filter state ────────────────────────────────────────────────────────────

export interface UserAnalyticsFilters {
  dateRange: 'last7days' | 'last30days' | 'last90days';
  country: string;
  city: string;
  userType: 'all' | 'guest' | 'registered';
  authProvider: 'all' | 'email' | 'google';
}
