import { PrismaClient } from '@prisma/client';

// Prisma client optimized for Cloudflare Workers edge runtime
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize Prisma if DATABASE_URL is available
export const prisma = globalForPrisma.prisma ?? 
  (process.env.DATABASE_URL ? new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }) : null as any);

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}
