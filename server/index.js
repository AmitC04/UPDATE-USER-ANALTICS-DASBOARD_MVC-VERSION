require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./src/prisma');
const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Test database connection
(async () => {
  try {
    await prisma.$connect();
    console.log('✓ Connected to database via Prisma');
  } catch (err) {
    console.error('✗ Prisma connection error:', err.message || err);
  }
})();

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Analytics API Server',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Analytics routes
app.use('/api/analytics', require('./src/routes/analyticsRoutes'));

// User routes
app.use('/api/user', require('./src/routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down Analytics server...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`✓ Analytics server running on http://localhost:${port}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!process.env.DATABASE_URL) {
    console.log('⚠ Warning: DATABASE_URL not set.');
  } else {
    console.log('✓ Using DATABASE_URL from environment');
  }
});

