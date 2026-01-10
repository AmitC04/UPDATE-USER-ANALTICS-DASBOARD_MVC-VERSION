// Centralized Prisma client (singleton) to avoid connection leaks in dev/prod
const { PrismaClient } = require('@prisma/client');

// Reuse client across hot reloads (Next.js/Node)
const globalForPrisma = globalThis || global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
