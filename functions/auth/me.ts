import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    // Get token from cookie
    const cookieHeader = context.request.headers.get('cookie');
    if (!cookieHeader) {
      return json({ message: 'No authentication token found' }, 401);
    }

    const tokenMatch = cookieHeader.match(/rf_token=([^;]+)/);
    if (!tokenMatch) {
      return json({ message: 'No authentication token found' }, 401);
    }

    const token = tokenMatch[1];

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, context.env.JWT_SECRET) as any;
    } catch (error) {
      return json({ message: 'Invalid or expired token' }, 401);
    }

    // Initialize Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      // Get user from database
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
            where: { status: 'ACTIVE' },
            select: {
              id: true,
              status: true,
              plan: true,
              currentPeriodEnd: true,
            },
          },
        },
      });

      if (!user) {
        return json({ message: 'User not found' }, 404);
      }

      return json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          subscription: user.subscriptions[0] || null,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Get user error:', error);
    return json({ message: 'Internal server error' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
