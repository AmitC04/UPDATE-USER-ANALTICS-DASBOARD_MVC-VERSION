const { getUserProfile, getDemoUserProfile } = require('../services/userService');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * User Controller
 * Issue #8 - HTTP handling ONLY; business logic lives in userService.js
 */

/**
 * GET /api/v1/user/getUser
 * Issue #1 - IDOR fixed: users can only access their own data;
 *            admins can request any user via ?id=
 */
async function getUser(req, res, next) {
  try {
    // req.user is guaranteed to exist (requireAuth middleware runs first)
    const requestedId = req.query.id ? Number(req.query.id) : null;

    // Validate that ?id= is a positive integer when provided
    if (req.query.id && (!Number.isInteger(requestedId) || requestedId <= 0)) {
      return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const user = await getUserProfile(req.user, requestedId);

    res.json({ success: true, data: user });
  } catch (error) {
    next(error); // Issue #9 - delegate to centralized error handler
  }
}

/**
 * GET /api/v1/user/getDemoUser  (development only – see userRoutes.js)
 * Issue #2 - route guarded by NODE_ENV check in routes file
 */
async function getDemoUser(req, res, next) {
  try {
    const user = await getDemoUserProfile();
    res.json({ success: true, data: user });
  } catch (error) {
    // Issue #3 - log internally, surface only safe message
    logger.error('Error fetching demo user:', { error: error.message });
    next(error);
  }
}

module.exports = { getUser, getDemoUser };
