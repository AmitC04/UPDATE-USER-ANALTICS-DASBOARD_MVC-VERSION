const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get user profile
 */
async function getUser(req, res) {
  try {
    // In a real implementation, you would get the user ID from req.user after authentication
    // For now, we'll return a sample user profile
    const userId = req.query.id || req.user?.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Fetch user data from the users table
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

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message,
    });
  }
}

module.exports = {
  getUser
};