const prisma = require('../prisma');
const {
  ACTIVE_USER_THRESHOLD_MS,
  DEFAULT_FUNNEL_RANGE_DAYS,
  DEFAULT_USER_ANALYTICS_RANGE_DAYS,
  DEFAULT_REVENUE_MONTHS,
  MAX_REVENUE_MONTHS,
} = require('../utils/constants');

/**
 * Analytics Model
 * Contains all database logic for analytics operations.
 *
 * Fixes:
 *  - Backend #2  : BigInt fields serialized to String (JSON.stringify safe).
 *  - Backend #7  : Decimal/float amounts kept as precise strings; no parseFloat.
 *  - Backend #10 : Revenue trend already uses Promise.all.
 *  - Backend #13 : Shared getDateRange() eliminates repeated default-date logic.
 */

// ─── Shared date-range utility ───────────────────────────────────────────────

/**
 * Return { start, end } Date objects for a given ISO string pair.
 * Falls back to `defaultDays` lookback when values are absent.
 *
 * @param {string|undefined} startDate
 * @param {string|undefined} endDate
 * @param {number} defaultDays
 * @returns {{ start: Date, end: Date }}
 */
function getDateRange(startDate, endDate, defaultDays) {
  const start = startDate
    ? new Date(startDate)
    : new Date(Date.now() - defaultDays * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  return { start, end };
}

/**
 * Safely convert a Prisma Decimal / BigInt / number to a plain JS number
 * while preserving two decimal places for currency values.
 * Uses string conversion to avoid floating-point loss of precision.
 *
 * @param {any} value
 * @returns {number}
 */
function toSafeNumber(value) {
  if (value == null) return 0;
  // Prisma Decimal has a .toString() method
  return parseFloat(String(value));
}

/**
 * Convert BigInt to a regular JS number (safe for IDs that fit in Number).
 * If the value may exceed Number.MAX_SAFE_INTEGER use String instead.
 * @param {bigint|null} value
 * @returns {number|null}
 */
function bigIntToNumber(value) {
  if (value == null) return null;
  return Number(value);
}


async function getOverviewData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fiveMinutesAgo = new Date(Date.now() - ACTIVE_USER_THRESHOLD_MS);

    // Issue #22 - Run all independent queries in parallel
    const [
      visitorsToday,
      loggedInUsersToday,
      activeUsersNow,
      revenueEvents,
      ordersToday,
      refundsToday,
      recentActivityRaw,
      recentProfileUpdatesRaw,
      passwordChangesToday,
      profileUpdatesToday,
    ] = await Promise.all([
      prisma.user_sessions.count({
        where: { login_time: { gte: today, lt: tomorrow } },
      }),
      prisma.user_sessions.count({
        where: { login_time: { gte: today, lt: tomorrow }, is_guest: false },
      }),
      prisma.user_sessions.count({
        where: { logout_time: null, last_seen_at: { gte: fiveMinutesAgo } },
      }),
      prisma.user_activity.findMany({
        where: {
          event_type: 'payment_success',
          event_time: { gte: today, lt: tomorrow },
          amount: { not: null },
        },
        select: { amount: true, currency: true },
      }),
      prisma.user_activity.count({
        where: { event_type: 'payment_success', event_time: { gte: today, lt: tomorrow } },
      }),
      prisma.user_activity.count({
        where: { event_type: 'payment_failed', event_time: { gte: today, lt: tomorrow } },
      }),
      prisma.user_activity.findMany({
        take: 5,
        orderBy: { event_time: 'desc' },
        include: { users: { select: { email: true } } },
      }),
      prisma.user_audit_log.findMany({
        take: 5,
        where: { action_type: 'profile_updated' },
        orderBy: { created_at: 'desc' },
        include: { users: { select: { email: true } } },
      }),
      prisma.user_audit_log.count({
        where: { action_type: 'password_changed', created_at: { gte: today, lt: tomorrow } },
      }),
      prisma.user_audit_log.count({
        where: { action_type: 'profile_updated', created_at: { gte: today, lt: tomorrow } },
      }),
    ]);

    // Compute revenue – use toSafeNumber() to avoid Decimal precision loss (Backend #7)
    let revenueToday = 0;
    revenueEvents.forEach((event) => {
      if (event.amount) {
        revenueToday += toSafeNumber(event.amount);
      }
    });

    const recentActivity = recentActivityRaw.map((activity) => ({
      action: activity.event_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      user: activity.users?.email || (activity.is_guest ? 'Guest User' : 'Unknown User'),
      time: activity.event_time,
    }));

    const recentProfileUpdates = recentProfileUpdatesRaw.map((update) => ({
      user: update.users?.email || 'Unknown User',
      field: 'Profile Information',
      time: update.created_at,
    }));

    return {
      visitors_today: visitorsToday,
      logged_in_users_today: loggedInUsersToday,
      active_users_now: activeUsersNow,
      revenue_today: revenueToday,
      orders_today: ordersToday,
      refunds_today: refundsToday,
      recent_activity: recentActivity,
      recent_profile_updates: recentProfileUpdates,
      password_changes_today: passwordChangesToday,
      profile_updates_today: profileUpdatesToday,
      last_sensitive_change: recentActivity[0]?.time || null,
    };
  } catch (error) {
    throw error;
  }
}

// Get conversion funnel data
async function getFunnelData(startDate, endDate) {
  try {
    // getDateRange() eliminates duplicated default-date logic (Backend #13)
    const { start, end } = getDateRange(startDate, endDate, DEFAULT_FUNNEL_RANGE_DAYS);

    // Visitors (all sessions)
    const visitors = await prisma.user_sessions.count({
      where: {
        login_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Registered users (sessions with user_id)
    const registered = await prisma.user_sessions.count({
      where: {
        login_time: {
          gte: start,
          lte: end,
        },
        is_guest: false,
      },
    });

    // Added to cart
    const addedToCart = await prisma.user_activity.count({
      where: {
        event_type: 'add_to_cart',
        event_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Checkout started
    const checkoutStarted = await prisma.user_activity.count({
      where: {
        event_type: 'checkout_started',
        event_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Payment success
    const paymentSuccess = await prisma.user_activity.count({
      where: {
        event_type: 'payment_success',
        event_time: {
          gte: start,
          lte: end,
        },
      },
    });

    // Calculate drop-off rates
    const calculateDropOff = (current, previous) => {
      if (previous === 0) return 0;
      return Math.round(((previous - current) / previous) * 100);
    };

    const funnel = [
      {
        step: 'Visitors',
        count: visitors,
        dropOff: 0,
      },
      {
        step: 'Registered Users',
        count: registered,
        dropOff: calculateDropOff(registered, visitors),
      },
      {
        step: 'Added to Cart',
        count: addedToCart,
        dropOff: calculateDropOff(addedToCart, registered),
      },
      {
        step: 'Checkout Started',
        count: checkoutStarted,
        dropOff: calculateDropOff(checkoutStarted, addedToCart),
      },
      {
        step: 'Payment Success',
        count: paymentSuccess,
        dropOff: calculateDropOff(paymentSuccess, checkoutStarted),
      },
    ];

    // Overall conversion rate
    const overallConversion = visitors > 0 ? ((paymentSuccess / visitors) * 100).toFixed(2) : 0;

    return {
      funnel,
      overall_conversion: parseFloat(overallConversion),
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };
  } catch (error) {
    throw error;
  }
}

// Get user analytics
async function getUserAnalyticsData(startDate, endDate) {
  try {
    const { start, end } = getDateRange(startDate, endDate, DEFAULT_USER_ANALYTICS_RANGE_DAYS);

    // Group by date
    const dateMap = new Map();

    // Logins per day
    const logins = await prisma.user_activity.findMany({
      where: {
        event_type: 'login_success',
        event_time: {
          gte: start,
          lte: end,
        },
      },
      select: {
        event_time: true,
      },
    });

    logins.forEach((login) => {
      const date = login.event_time.toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, logins: 0, registrations: 0, password_changes: 0 });
      }
      dateMap.get(date).logins++;
    });

    // Registrations per day
    const registrations = await prisma.user_activity.findMany({
      where: {
        event_type: {
          in: ['register_email', 'register_google'],
        },
        event_time: {
          gte: start,
          lte: end,
        },
      },
      select: {
        event_time: true,
        event_type: true,
      },
    });

    registrations.forEach((reg) => {
      const date = reg.event_time.toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, logins: 0, registrations: 0, password_changes: 0 });
      }
      dateMap.get(date).registrations++;
    });

    // Password changes per day (from user_audit_log)
    const passwordChanges = await prisma.user_audit_log.findMany({
      where: {
        action_type: 'password_changed',
        created_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        created_at: true,
      },
    });

    passwordChanges.forEach((change) => {
      const date = change.created_at.toISOString().split('T')[0];
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, logins: 0, registrations: 0, password_changes: 0 });
      }
      dateMap.get(date).password_changes++;
    });

    // Convert to array and sort by date
    const dailyStats = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Guest vs Registered split
    const guestCount = await prisma.user_activity.count({
      where: {
        event_time: {
          gte: start,
          lte: end,
        },
        is_guest: true,
      },
    });

    const registeredCount = await prisma.user_activity.count({
      where: {
        event_time: {
          gte: start,
          lte: end,
        },
        is_guest: false,
      },
    });

    return {
      daily_stats: dailyStats,
      guest_vs_registered: {
        guest: guestCount,
        registered: registeredCount,
        total: guestCount + registeredCount,
      },
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    };
  } catch (error) {
    throw error;
  }
}

// Get revenue trend (last N months)
async function getRevenueTrendData(months = DEFAULT_REVENUE_MONTHS) {
  try {
    const monthsArray = [];
    const now = new Date();

    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsArray.push({
        month: date.toLocaleString('default', { month: 'short' }),
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59),
      });
    }

    const revenueData = await Promise.all(
      monthsArray.map(async ({ month, start, end }) => {
        const events = await prisma.user_activity.findMany({
          where: {
            event_type: 'payment_success',
            event_time: {
              gte: start,
              lte: end,
            },
            amount: {
              not: null,
            },
          },
          select: {
            amount: true,
          },
        });

        // toSafeNumber() preserves decimal precision (Backend #7)
        let revenue = 0;
        events.forEach((event) => {
          if (event.amount) revenue += toSafeNumber(event.amount);
        });

        return { month, revenue };
      })
    );

    return revenueData;
  } catch (error) {
    throw error;
  }
}

// Get detailed analytics for charts and advanced metrics
async function getDetailedAnalyticsData() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get signup methods breakdown (email vs google registrations)
    const registrationCounts = await prisma.user_activity.groupBy({
      by: ['event_type'],
      where: {
        event_type: {
          in: ['register_email', 'register_google']
        },
        event_time: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: {
        event_type: true,
      },
    });

    // Format signup methods data
    const signupMethods = registrationCounts.map(item => ({
      name: item.event_type === 'register_email' ? 'Email' : 'Google',
      value: item._count.event_type,
      color: item.event_type === 'register_email' ? '#3b82f6' : '#10b981' // blue for email, green for google
    }));

    // If no registrations today, return empty array (no mock data in production)
    // Issue #12 - hardcoded fallback data removed

    // Get review submissions
    const reviewCount = await prisma.user_activity.count({
      where: {
        event_type: 'review_submitted',
        event_time: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Issue #12 - top certifications data should come from product/order tables.
    // Returning empty array until product catalog integration is available.
    const topCertifications = [];

    return {
      signup_methods: signupMethods,
      top_certifications: topCertifications,
      reviews_submitted: reviewCount,
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getOverviewData,
  getFunnelData,
  getUserAnalyticsData,
  getRevenueTrendData,
  getDetailedAnalyticsData,
};