import { PrismaClient } from '@prisma/client';
import { signJWT } from '../../../../lib/jwt-edge';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const { searchParams } = new URL(context.request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return Response.redirect(`${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/login?error=oauth_denied`, 302);
    }

    if (!code || !state) {
      return Response.redirect(`${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/login?error=invalid_oauth_response`, 302);
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      // Verify state parameter
      const oauthState = await prisma.oAuthState.findUnique({
        where: { state },
      });

      if (!oauthState || oauthState.expiresAt < new Date()) {
        return Response.redirect(`${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/login?error=invalid_state`, 302);
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: context.env.DISCORD_CLIENT_ID,
          client_secret: context.env.DISCORD_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/discord/callback`,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();

      // Get user info from Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info from Discord');
      }

      const discordUser = await userResponse.json();

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { discordId: discordUser.id },
      });

      if (!user) {
        // Check if user exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: discordUser.email },
        });

        if (existingUser) {
          // Link Discord account to existing user
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              discordId: discordUser.id,
              name: existingUser.name || discordUser.username,
              emailVerified: true,
            },
          });
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              discordId: discordUser.id,
              name: discordUser.username,
              email: discordUser.email,
              emailVerified: true,
            },
          });
        }
      }

      // Generate JWT token
      const token = await signJWT({
        userId: user.id,
        email: user.email,
        provider: 'discord',
      });

      // Clean up OAuth state
      await prisma.oAuthState.delete({
        where: { id: oauthState.id },
      });

      // Create response with redirect
      const redirectUrl = oauthState.redirectTo || '/dashboard';
      const response = Response.redirect(`${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}${redirectUrl}`, 302);
      
      // Set JWT cookie
      response.headers.set('Set-Cookie', `rf_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
      
      return response;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return Response.redirect(`${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/login?error=oauth_failed`, 302);
  }
}
