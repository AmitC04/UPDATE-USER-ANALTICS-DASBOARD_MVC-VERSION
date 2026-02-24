/**
 * User Service
 * Issue #8 / #20 - Service layer for user business logic.
 */
const { getUserById, getDemoUser } = require('../models/userModel');
const AppError = require('../utils/AppError');

/**
 * Get a user's profile.
 * Issue #1 - Authorization enforced at service level.
 *
 * @param {object} requestingUser - The authenticated user (from req.user)
 * @param {number|null} requestedId - The requested user ID (from query param, optional)
 */
async function getUserProfile(requestingUser, requestedId) {
  // Determine the target user ID
  const targetId = requestedId ? Number(requestedId) : requestingUser.user_id;

  // If someone requests a DIFFERENT user's data, they must be an admin
  if (requestedId && Number(requestedId) !== requestingUser.user_id) {
    if (requestingUser.role !== 'admin') {
      throw new AppError('Forbidden: Cannot access another user\'s data', 403);
    }
  }

  const user = await getUserById(targetId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

/**
 * Get demo user (development only).
 */
async function getDemoUserProfile() {
  return getDemoUser();
}

module.exports = {
  getUserProfile,
  getDemoUserProfile,
};
