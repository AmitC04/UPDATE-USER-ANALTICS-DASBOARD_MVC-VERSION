const prisma = require('../prisma');

/**
 * User Model
 * Contains all database logic for user operations
 */

// Get user profile by ID
async function getUserById(userId) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: Number(userId) // Ensure it's a number for Prisma
      },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        auth_provider: true,
        password_changed_at: true,
      }
    });

    return user;
  } catch (error) {
    throw error;
  }
}

// Get demo user for unauthenticated access
async function getDemoUser() {
  try {
    // Return a sample user for demo purposes
    const demoUser = {
      user_id: 1,
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      auth_provider: 'email',
      password_changed_at: new Date().toISOString()
    };

    return demoUser;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUserById,
  getDemoUser,
};