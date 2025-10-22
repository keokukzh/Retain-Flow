import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signJWT } from '../../../lib/jwt-edge';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { name, email, password } = await context.request.json();

    if (!name || !email || !password) {
      return json({ message: 'Name, email and password are required' }, 400);
    }

    if (password.length < 8) {
      return json({ message: 'Password must be at least 8 characters long' }, 400);
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        return json({ message: 'User with this email already exists' }, 409);
      }

      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          emailVerified: false,
        },
      });

      const token = await signJWT({
        userId: user.id,
        email: user.email,
        provider: 'password'
      });

      const res = json({
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        }
      }, 201);

      setCookie(res, 'rf_token', token, 60 * 60);
      return res;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Registration error:', error);
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
