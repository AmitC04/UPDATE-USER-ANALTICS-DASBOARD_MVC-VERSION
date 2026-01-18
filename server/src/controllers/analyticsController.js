const {
  getOverviewData,
  getFunnelData,
  getUserAnalyticsData,
  getRevenueTrendData,
  getDetailedAnalyticsData,
} = require('../models/analyticsModel');

/**
 * Analytics Controller
 * Handles HTTP requests and responses for analytics endpoints
 */

/**
 * Get overview analytics (today's metrics)
 */
async function getOverview(req, res) {
  try {
    const data = await getOverviewData();
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching overview analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview analytics',
      message: error.message,
    });
  }
}

/**
 * Get conversion funnel data
 */
async function getFunnel(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const data = await getFunnelData(startDate, endDate);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch funnel data',
      message: error.message,
    });
  }
}

/**
 * Get user analytics
 */
async function getUserAnalytics(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const data = await getUserAnalyticsData(startDate, endDate);
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics',
      message: error.message,
    });
  }
}

/**
 * Get revenue trend (last N months)
 */
async function getRevenueTrend(req, res) {
  try {
    const { months = 5 } = req.query;
    const data = await getRevenueTrendData(parseInt(months));
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching revenue trend:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue trend',
      message: error.message,
    });
  }
}

/**
 * Get detailed analytics for charts and advanced metrics
 */
async function getDetailedAnalytics(req, res) {
  try {
    const data = await getDetailedAnalyticsData();
    
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detailed analytics',
      message: error.message,
    });
  }
}

module.exports = {
  getOverview,
  getFunnel,
  getUserAnalytics,
  getRevenueTrend,
  getDetailedAnalytics,
};