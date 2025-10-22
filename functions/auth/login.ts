import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { email, password } = await context.request.json();
    
    // Validate input
    if (!email || !password) {
      return json({ message: 'Email and password are required' }, 400);
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
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return json({ message: 'Invalid credentials' }, 401);
      }

      // Check if user has a password (OAuth users might not have one)
      if (!user.passwordHash) {
        return json({ message: 'Please use OAuth login for this account' }, 401);
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return json({ message: 'Invalid credentials' }, 401);
      }

      // Check if email is verified
      if (!user.emailVerified) {
        return json({ 
          message: 'Please verify your email before logging in',
          requiresVerification: true 
        }, 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          provider: 'password' 
        }, 
        context.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      const res = json({ 
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }, 200);
      
      // Set HttpOnly cookie
      setCookie(res, 'rf_token', token, 60 * 60);
      
      return res;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Login error:', error);
    return json({ message: 'Internal server error' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function setCookie(res: Response, name: string, value: string, maxAgeSeconds: number) {
  const cookie = `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
  res.headers.append('Set-Cookie', cookie);
}


