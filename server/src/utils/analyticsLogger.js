/**
 * Centralized Analytics Event Logger
 *
 * Fixes:
 *  - Backend #1  : retry logic on transient DB failures; errors bubble to
 *                  logger rather than silently returning null.
 *  - Backend #4  : createOrUpdateSession uses Prisma upsert (no TOCTOU race).
 *  - Backend #8  : logEventWithSession wraps event + session in $transaction.
 *  - Backend #9  : All console.warn/error replaced with structured logger.
 *  - Backend #14 : metadata size validation (10 KB cap) + sanitization.
 */

const prisma = require('../prisma');
const logger = require('./logger');
const { METADATA_MAX_SIZE_BYTES, CURRENCY_DEFAULT } = require('./constants');

// ─── Helpers ────────────────────────────────────────────────────────────────

const VALID_EVENT_TYPES = new Set([
  'login_success', 'login_failed', 'logout',
  'register_email', 'register_google',
  'password_changed', 'password_reset_request', 'password_reset_success',
  'session_start', 'session_end', 'page_view',
  'add_to_cart', 'remove_from_cart', 'checkout_started',
  'payment_initiated', 'payment_success', 'payment_failed',
  'certification_view', 'practice_test_start', 'final_test_start',
  'review_submitted', 'site_error',
]);

const VALID_ACTION_TYPES = new Set([
  'password_changed', 'profile_updated', 'email_changed',
  'role_changed', 'account_locked', 'account_unlocked',
]);

/**
 * Sanitize and validate metadata object.
 * - Strips function values and circular refs via JSON round-trip.
 * - Enforces a 10 KB size cap.
 * @param {Object|null} metadata
 * @returns {Object|null}
 */
function sanitizeMetadata(metadata) {
  if (!metadata) return null;
  try {
    const serialized = JSON.stringify(metadata);
    if (serialized.length > METADATA_MAX_SIZE_BYTES) {
      logger.warn('analyticsLogger: metadata exceeds size limit – truncating', {
        size: serialized.length, limit: METADATA_MAX_SIZE_BYTES,
      });
      return { _truncated: true, reason: 'payload_too_large' };
    }
    return JSON.parse(serialized);
  } catch {
    logger.warn('analyticsLogger: metadata is not serializable – discarding');
    return null;
  }
}

/**
 * Retry a function up to maxAttempts times with exponential back-off.
 * Does NOT retry Prisma constraint/validation errors.
 * @param {() => Promise<any>} fn
 * @param {number} maxAttempts
 */
async function withRetry(fn, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      // Non-retriable Prisma errors
      if (err?.code === 'P2002' || err?.code === 'P2025') throw err;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, 100 * 2 ** (attempt - 1)));
      }
    }
  }
  throw lastError;
}

// ─── Docs placeholder kept below for IDE discoverability ─────────────────────
/**
 * @param {Object} params
 * @param {number|null} params.user_id
 * @param {string} params.session_id
 * @param {boolean} params.is_guest
 * @param {string} params.event_type
 * @param {string|null} params.page_url
 * @param {string|null} params.referrer_url
 * @param {Object|null} params.metadata
 * @param {string|null} params.ip_address
 * @param {string|null} params.device_type
 * @param {string|null} params.browser_name
 * @param {string|null} params.geo_country
 * @param {string|null} params.geo_city
 * @param {number|null} params.order_id
 * @param {number|null} params.amount
 * @param {string|null} params.currency
 * @returns {Promise<Object|null>}
 */
async function logEvent({
  user_id = null,
  session_id = null,
  is_guest = true,
  event_type,
  page_url = null,
  referrer_url = null,
  metadata = null,
  ip_address = null,
  device_type = null,
  browser_name = null,
  geo_country = null,
  geo_city = null,
  order_id = null,
  amount = null,
  currency = CURRENCY_DEFAULT,
}) {
  if (!session_id) {
    logger.warn('analyticsLogger.logEvent: session_id is required');
    return null;
  }

  let resolvedEventType = event_type;
  if (!VALID_EVENT_TYPES.has(event_type)) {
    logger.warn(`analyticsLogger.logEvent: invalid event_type "${event_type}" – falling back to site_error`);
    resolvedEventType = 'site_error';
  }

  const cleanMetadata = sanitizeMetadata(metadata);

  try {
    return await withRetry(() =>
      prisma.user_activity.create({
        data: {
          user_id: user_id || null,
          session_id,
          is_guest,
          event_type: resolvedEventType,
          page_url,
          referrer_url,
          metadata: cleanMetadata,
          ip_address,
          device_type,
          browser_name,
          geo_country,
          geo_city,
          order_id: order_id != null ? BigInt(order_id) : null,
          amount: amount != null ? String(amount) : null, // preserve precision as string
          currency,
          event_time: new Date(),
        },
      })
    );
  } catch (error) {
    // Analytics failure must NOT crash the caller
    logger.error('analyticsLogger.logEvent: failed after retries', {
      event_type: resolvedEventType,
      session_id,
      error: error.message,
    });
    return null;
  }
}

/**
 * Create or update a user session.
 * Uses Prisma upsert to eliminate TOCTOU race condition (Backend Issue #4).
 * @param {Object} params
 * @returns {Promise<Object|null>}
 */
async function createOrUpdateSession({
  session_id,
  user_id = null,
  is_guest = true,
  auth_method = 'guest',
  ip_address = null,
  geo_country = null,
  geo_city = null,
}) {
  if (!session_id) {
    logger.warn('analyticsLogger.createOrUpdateSession: session_id is required');
    return null;
  }

  try {
    return await withRetry(() =>
      prisma.user_sessions.upsert({
        where: { session_id },
        update: {
          last_seen_at: new Date(),
          ...(user_id && {
            user_id,
            is_guest: false,
            auth_method: auth_method !== 'guest' ? auth_method : undefined,
          }),
        },
        create: {
          session_id,
          user_id: user_id || null,
          is_guest,
          auth_method: user_id ? auth_method : 'guest',
          login_time: new Date(),
          last_seen_at: new Date(),
          ip_address,
          geo_country,
          geo_city,
        },
      })
    );
  } catch (error) {
    logger.error('analyticsLogger.createOrUpdateSession: failed', {
      session_id, error: error.message,
    });
    return null;
  }
}

/**
 * End a user session.
 * @param {string} session_id
 * @returns {Promise<Object|null>}
 */
async function endSession(session_id) {
  try {
    return await prisma.user_sessions.update({
      where: { session_id },
      data: { logout_time: new Date(), last_seen_at: new Date() },
    });
  } catch (error) {
    logger.error('analyticsLogger.endSession: failed', { session_id, error: error.message });
    return null;
  }
}

/**
 * Log an audit event.
 * @param {Object} params
 * @returns {Promise<Object|null>}
 */
async function logAuditEvent({
  user_id,
  action_type,
  performed_by = null,
  ip_address = null,
  old_value = null,
  new_value = null,
}) {
  if (!user_id) {
    logger.warn('analyticsLogger.logAuditEvent: user_id is required');
    return null;
  }
  if (!VALID_ACTION_TYPES.has(action_type)) {
    logger.warn(`analyticsLogger.logAuditEvent: invalid action_type "${action_type}"`);
    return null;
  }

  try {
    return await withRetry(() =>
      prisma.user_audit_log.create({
        data: {
          user_id,
          action_type,
          performed_by: performed_by || null,
          ip_address,
          old_value: sanitizeMetadata(old_value),
          new_value: sanitizeMetadata(new_value),
        },
      })
    );
  } catch (error) {
    logger.error('analyticsLogger.logAuditEvent: failed', {
      user_id, action_type, error: error.message,
    });
    return null;
  }
}

/**
 * Atomically log an event AND create/update its session in one $transaction.
 * Fixes Backend Issue #8 – multi-write consistency.
 * @param {Object} eventParams  - params for logEvent
 * @param {Object} sessionParams - params for createOrUpdateSession
 * @returns {Promise<{activity: Object|null, session: Object|null}>}
 */
async function logEventWithSession(eventParams, sessionParams) {
  try {
    const [activity, session] = await prisma.$transaction([
      prisma.user_activity.create({
        data: {
          user_id: eventParams.user_id || null,
          session_id: eventParams.session_id,
          is_guest: eventParams.is_guest ?? true,
          event_type: VALID_EVENT_TYPES.has(eventParams.event_type)
            ? eventParams.event_type : 'site_error',
          page_url: eventParams.page_url || null,
          referrer_url: eventParams.referrer_url || null,
          metadata: sanitizeMetadata(eventParams.metadata),
          ip_address: eventParams.ip_address || null,
          device_type: eventParams.device_type || null,
          browser_name: eventParams.browser_name || null,
          geo_country: eventParams.geo_country || null,
          geo_city: eventParams.geo_city || null,
          order_id: eventParams.order_id != null ? BigInt(eventParams.order_id) : null,
          amount: eventParams.amount != null ? String(eventParams.amount) : null,
          currency: eventParams.currency || CURRENCY_DEFAULT,
          event_time: new Date(),
        },
      }),
      prisma.user_sessions.upsert({
        where: { session_id: sessionParams.session_id },
        update: { last_seen_at: new Date() },
        create: {
          session_id: sessionParams.session_id,
          user_id: sessionParams.user_id || null,
          is_guest: sessionParams.is_guest ?? true,
          auth_method: sessionParams.auth_method || 'guest',
          login_time: new Date(),
          last_seen_at: new Date(),
          ip_address: sessionParams.ip_address || null,
          geo_country: sessionParams.geo_country || null,
          geo_city: sessionParams.geo_city || null,
        },
      }),
    ]);
    return { activity, session };
  } catch (error) {
    logger.error('analyticsLogger.logEventWithSession: transaction failed', {
      error: error.message,
    });
    return { activity: null, session: null };
  }
}

module.exports = {
  logEvent,
  createOrUpdateSession,
  endSession,
  logAuditEvent,
  logEventWithSession,
};
