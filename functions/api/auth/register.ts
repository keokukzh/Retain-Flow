import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { name, email, password } = await context.request.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Name, email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ message: 'Password must be at least 6 characters' }), {
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
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new Response(JSON.stringify({ message: 'User already exists with this email' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          emailVerified: false, // Will be true after email verification
        },
      });

      // Generate JWT token
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
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });

      // Set HttpOnly cookie
      response.headers.set('Set-Cookie', `rf_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);

      return response;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
