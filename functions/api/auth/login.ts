import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signJWT } from '../../../lib/jwt-edge';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { email, password } = await context.request.json();

    if (!email || !password) {
      return json({ message: 'Email and password are required' }, 400);
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return json({ message: 'Invalid credentials' }, 401);
      }

      if (!user.passwordHash) {
        return json({ message: 'Please use social login for this account' }, 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return json({ message: 'Invalid credentials' }, 401);
      }

      if (!user.emailVerified) {
        return json({
          message: 'Please verify your email before logging in',
          requiresVerification: true
        }, 401);
      }

      const token = await signJWT({
        userId: user.id,
        email: user.email,
        provider: 'password'
      });

      const res = json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }, 200);

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

function setCookie(response: Response, name: string, value: string, maxAge: number) {
  response.headers.append('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}
