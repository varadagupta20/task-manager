// src/lib/prisma.js
const { PrismaClient } = require('@prisma/client');
 
// In development, hot-reloading can create many database connections.
// This pattern reuses a single connection across reloads.
const globalForPrisma = globalThis;
 
const prisma = globalForPrisma.prisma ?? new PrismaClient();
 
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
 
module.exports = prisma;
