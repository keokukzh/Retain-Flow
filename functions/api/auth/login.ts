import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { email, password } = await context.request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), {
        status: 400,
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
        where: { email },
      });

      if (!user) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!user.passwordHash) {
        return new Response(JSON.stringify({ message: 'Please use OAuth login' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!user.emailVerified) {
        return new Response(JSON.stringify({ 
          message: 'Please verify your email before logging in',
          requiresVerification: true 
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          name: user.name,
          provider: 'email'
        },
        context.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = new Response(JSON.stringify({ 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

      // Set HttpOnly cookie
      response.headers.set('Set-Cookie', `rf_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);

      return response;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
