require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./src/prisma');
const logger = require('./src/utils/logger');
const AppError = require('./src/utils/AppError');

const app = express();
const port = process.env.PORT || 4001;

// ──────────────────────────────────────────
// Core Middleware
// ──────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ──────────────────────────────────────────
// Database connection check
// ──────────────────────────────────────────
(async () => {
  try {
    await prisma.$connect();
    logger.info('Connected to database via Prisma');
  } catch (err) {
    logger.error('Prisma connection error:', { error: err.message });
  }
})();

// ──────────────────────────────────────────
// Health check
// ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Analytics API Server',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    version: 'v1',
  });
});

// ──────────────────────────────────────────
// Issue #10 - API v1 routes
// ──────────────────────────────────────────
app.use('/api/v1/analytics', require('./src/routes/analyticsRoutes'));
app.use('/api/v1/user', require('./src/routes/userRoutes'));

// ──────────────────────────────────────────
// Issue #9 - Centralized error handling middleware
// ──────────────────────────────────────────
app.use((err, req, res, next) => {
  // Operational errors (AppError) expose their message; others are generic
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: isOperational ? err.message : 'Internal server error',
    // Issue #3 - only expose debug info in development
    ...(process.env.NODE_ENV === 'development' && { debug: err.message, stack: err.stack }),
  });
});

// ──────────────────────────────────────────
// Graceful shutdown
// ──────────────────────────────────────────
process.on('SIGINT', async () => {
  logger.info('Shutting down Analytics server...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  logger.info(`Analytics server running on http://localhost:${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.DATABASE_URL) {
    logger.warn('DATABASE_URL not set.');
  } else {
    logger.info('Using DATABASE_URL from environment');
  }
});


