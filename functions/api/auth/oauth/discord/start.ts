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
          provider: 'discord',
          redirectTo,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
      });
    } finally {
      await prisma.$disconnect();
    }

    // Build Discord OAuth URL
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
    discordAuthUrl.searchParams.set('client_id', context.env.DISCORD_CLIENT_ID);
    discordAuthUrl.searchParams.set('redirect_uri', `${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/discord/callback`);
    discordAuthUrl.searchParams.set('response_type', 'code');
    discordAuthUrl.searchParams.set('scope', 'identify email');
    discordAuthUrl.searchParams.set('state', state);

    return Response.redirect(discordAuthUrl.toString(), 302);
  } catch (error) {
    console.error('Discord OAuth start error:', error);
    return new Response(JSON.stringify({ message: 'OAuth initialization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
