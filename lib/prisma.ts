import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize Prisma if DATABASE_URL is available (runtime, not build time)
export const prisma = globalForPrisma.prisma ?? 
  (process.env.DATABASE_URL ? new PrismaClient() : null as any);

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
