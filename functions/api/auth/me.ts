import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '../../../lib/jwt-edge';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const token = context.request.headers.get('Cookie')?.split('; ').find(row => row.startsWith('rf_token='))?.split('=')[1];

    if (!token) {
      return json({ message: 'Authentication required' }, 401);
    }

    let decoded;
    try {
      decoded = await verifyJWT(token);
    } catch (error) {
      return json({ message: 'Invalid or expired token' }, 401);
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          subscriptions: {
            select: {
              id: true,
              status: true,
              plan: true,
              currentPeriodEnd: true,
            },
            where: { status: 'ACTIVE' },
            take: 1,
          },
        },
      });

      if (!user) {
        return json({ message: 'User not found' }, 404);
      }

      return json({
        user: {
          ...user,
          subscription: user.subscriptions.length > 0 ? user.subscriptions[0] : null,
        }
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Auth /me error:', error);
    return json({ message: 'Internal server error' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
