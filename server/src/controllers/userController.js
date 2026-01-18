const { getUserById, getDemoUser: getDemoUserFromModel } = require('../models/userModel');

/**
 * User Controller
 * Handles HTTP requests and responses for user endpoints
 */

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
    const user = await getUserById(Number(userId));

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

/**
 * Get demo user for unauthenticated access
 */
async function getDemoUser(req, res) {
  try {
    const user = await getDemoUserFromModel();

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching demo user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch demo user',
      message: error.message,
    });
  }
}

module.exports = {
  getUser,
  getDemoUser,
};