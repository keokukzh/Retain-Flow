import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const { searchParams } = new URL(context.request.url);
    const redirectTo = searchParams.get('redirect') || '/dashboard';
    
    // Generate state parameter for CSRF protection
    const state = crypto.randomUUID();
    
    // Store state in database for validation
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      // Store state with expiration (5 minutes)
      await prisma.oAuthState.create({
        data: {
          state,
          provider: 'google',
          redirectTo,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
      });
    } finally {
      await prisma.$disconnect();
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', context.env.GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', `${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/google/callback`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    return Response.redirect(googleAuthUrl.toString(), 302);
  } catch (error) {
    console.error('Google OAuth start error:', error);
    return new Response(JSON.stringify({ message: 'OAuth initialization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
