import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const token = context.request.headers.get('Cookie')?.split('; ').find(row => row.startsWith('rf_token='))?.split('=')[1];

    if (!token) {
      return new Response(JSON.stringify({ message: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, context.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
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
          subscriptions: {
            select: {
              id: true,
              status: true,
              plan: true,
              currentPeriodEnd: true,
            }
          }
        },
      });

      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ user }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Auth /me error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
