const prisma = require('../prisma');

/**
 * Centralized Analytics Event Logger
 * Logs user activities and events to the database
 * Updated to match Word document schema (v1.1)
 * 
 * @param {Object} params
 * @param {number|null} params.user_id - User ID (null for guests)
 * @param {string} params.session_id - Session ID (VARCHAR, not INT)
 * @param {boolean} params.is_guest - Whether this is a guest user
 * @param {string} params.event_type - Event type (see enum)
 * @param {string|null} params.page_url - Current page URL
 * @param {string|null} params.referrer_url - Referrer URL
 * @param {Object|null} params.metadata - Additional event data
 * @param {string|null} params.ip_address - IP address
 * @param {string|null} params.device_type - Device type (desktop, mobile, tablet)
 * @param {string|null} params.browser_name - Browser name
 * @param {string|null} params.geo_country - Country
 * @param {string|null} params.geo_city - City
 * @param {number|null} params.order_id - Order ID (for commerce events)
 * @param {number|null} params.amount - Amount (for commerce events)
 * @param {string|null} params.currency - Currency (default: INR)
 * @returns {Promise<Object>} Created activity record
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
  currency = 'INR',
}) {
  try {
    if (!session_id) {
      console.warn('logEvent: session_id is required');
      return null;
    }

    // Validate event_type
    const validEventTypes = [
      'login_success', 'login_failed', 'logout',
      'register_email', 'register_google',
      'password_changed', 'password_reset_request', 'password_reset_success',
      'session_start', 'session_end', 'page_view',
      'add_to_cart', 'remove_from_cart', 'checkout_started',
      'payment_initiated', 'payment_success', 'payment_failed',
      'certification_view', 'practice_test_start', 'final_test_start',
      'review_submitted', 'site_error',
    ];

    if (!validEventTypes.includes(event_type)) {
      console.warn(`Invalid event_type: ${event_type}. Using 'site_error' instead.`);
      event_type = 'site_error';
    }

    // Create activity record
    const activity = await prisma.user_activity.create({
      data: {
        user_id: user_id || null,
        session_id: session_id, // Required, VARCHAR(100)
        is_guest,
        event_type,
        page_url,
        referrer_url,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        ip_address,
        device_type,
        browser_name,
        geo_country,
        geo_city,
        order_id: order_id ? BigInt(order_id) : null,
        amount: amount ? parseFloat(amount) : null,
        currency,
        event_time: new Date(),
      },
    });

    return activity;
  } catch (error) {
    console.error('Error logging analytics event:', error);
    // Don't throw - analytics logging should not break the application
    return null;
  }
}

/**
 * Create or update a user session
 * Updated to match Word document schema (v1.1)
 * 
 * @param {Object} params
 * @param {string} params.session_id - Unique session ID (VARCHAR, primary key)
 * @param {number|null} params.user_id - User ID (null for guests)
 * @param {boolean} params.is_guest - Whether this is a guest session
 * @param {string} params.auth_method - Auth method (email, google, guest)
 * @param {string|null} params.ip_address - IP address
 * @param {string|null} params.geo_country - Country
 * @param {string|null} params.geo_city - City
 * @returns {Promise<Object>} Session record
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
  try {
    if (!session_id) {
      console.warn('createOrUpdateSession: session_id is required');
      return null;
    }

    // Check if session exists
    const existingSession = await prisma.user_sessions.findUnique({
      where: { session_id },
    });

    if (existingSession) {
      // Update existing session - update last_seen_at
      return await prisma.user_sessions.update({
        where: { session_id },
        data: {
          last_seen_at: new Date(),
          // Update user_id if it changed (guest -> registered)
          user_id: user_id || existingSession.user_id,
          is_guest: user_id ? false : existingSession.is_guest,
          auth_method: user_id ? (auth_method !== 'guest' ? auth_method : existingSession.auth_method) : 'guest',
        },
      });
    } else {
      // Create new session
      return await prisma.user_sessions.create({
        data: {
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
      });
    }
  } catch (error) {
    console.error('Error creating/updating session:', error);
    return null;
  }
}

/**
 * End a user session
 * Updated to match Word document schema (v1.1)
 * 
 * @param {string} session_id - Session ID
 * @returns {Promise<Object>} Updated session record
 */
async function endSession(session_id) {
  try {
    return await prisma.user_sessions.update({
      where: { session_id },
      data: {
        logout_time: new Date(),
        last_seen_at: new Date(),
      },
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return null;
  }
}

/**
 * Log an audit event
 * Updated to match Word document schema (v1.1)
 * 
 * @param {Object} params
 * @param {number} params.user_id - User ID (required)
 * @param {string} params.action_type - Action type
 * @param {number|null} params.performed_by - User ID who performed action (admin or self)
 * @param {string|null} params.ip_address - IP address
 * @param {Object|null} params.old_value - Old value (JSON)
 * @param {Object|null} params.new_value - New value (JSON)
 * @returns {Promise<Object>} Created audit log record
 */
async function logAuditEvent({
  user_id,
  action_type,
  performed_by = null,
  ip_address = null,
  old_value = null,
  new_value = null,
}) {
  try {
    if (!user_id) {
      console.warn('logAuditEvent: user_id is required');
      return null;
    }

    const validActionTypes = [
      'password_changed',
      'profile_updated',
      'email_changed',
      'role_changed',
      'account_locked',
      'account_unlocked',
    ];

    if (!validActionTypes.includes(action_type)) {
      console.warn(`Invalid action_type: ${action_type}`);
      return null;
    }

    return await prisma.user_audit_log.create({
      data: {
        user_id,
        action_type,
        performed_by: performed_by || null,
        ip_address,
        old_value: old_value ? JSON.parse(JSON.stringify(old_value)) : null,
        new_value: new_value ? JSON.parse(JSON.stringify(new_value)) : null,
      },
    });
  } catch (error) {
    console.error('Error logging audit event:', error);
    return null;
  }
}

module.exports = {
  logEvent,
  createOrUpdateSession,
  endSession,
  logAuditEvent,
};
