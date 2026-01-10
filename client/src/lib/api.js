/**
 * API Client Configuration
 * Follows EMS Code Implementation Design Pattern
 * 
 * This file serves as the centralized API communication layer between
 * the Next.js frontend and the Express backend.
 * 
 * Environment Variable: NEXT_PUBLIC_API_URL (defined in .env.local)
 * Default: http://localhost:4001
 */

import axios from 'axios';

// Step 1: Client-Side Configuration - Read from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

// Create centralized axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensures session cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch Overview Analytics
 * Endpoint: GET /api/analytics/overview
 * Returns today's metrics (visitors, users, revenue, orders)
 */
export const fetchOverview = async () => {
  try {
    const response = await api.get('/api/analytics/overview');
    return response.data;
  } catch (error) {
    console.error('Error fetching overview:', error);
    throw error;
  }
};

/**
 * Fetch Revenue Trend
 * Endpoint: GET /api/analytics/revenue-trend
 * @param {number} months - Number of months to fetch (default: 5)
 */
export const fetchRevenueTrend = async (months = 5) => {
  try {
    const response = await api.get(`/api/analytics/revenue-trend`, {
      params: { months }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue trend:', error);
    throw error;
  }
};

/**
 * Fetch Conversion Funnel Data
 * Endpoint: GET /api/analytics/funnel
 * @param {string} startDate - Start date for filtering (optional)
 * @param {string} endDate - End date for filtering (optional)
 */
export const fetchFunnel = async (startDate, endDate) => {
  try {
    const response = await api.get('/api/analytics/funnel', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    throw error;
  }
};

/**
 * Fetch User Analytics
 * Endpoint: GET /api/analytics/users
 * @param {string} startDate - Start date for filtering (optional)
 * @param {string} endDate - End date for filtering (optional)
 */
export const fetchUserAnalytics = async (startDate, endDate) => {
  try {
    const response = await api.get('/api/analytics/users', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    throw error;
  }
};

/**
 * Fetch User Profile (EMS Pattern Example)
 * Endpoint: GET /api/user/getUser
 * Note: This endpoint expects authentication via cookies (withCredentials: true)
 */
export const fetchUser = async () => {
  try {
    const response = await api.get('/api/user/getUser');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Fetch Detailed Analytics
 * Endpoint: GET /api/analytics/detailed
 * Returns signup methods, top certifications, and other detailed metrics
 */
export const fetchDetailedAnalytics = async () => {
  try {
    const response = await api.get('/api/analytics/detailed');
    return response.data;
  } catch (error) {
    console.error('Error fetching detailed analytics:', error);
    throw error;
  }
}

export default api;