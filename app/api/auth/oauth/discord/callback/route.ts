import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-edge';
import { generateJWT } from '@/lib/jwt-edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/login?error=missing_parameters', request.url)
      );
    }

    // Verify state parameter
    const oauthState = await prisma.oAuthState.findUnique({
      where: { state },
    });

    if (!oauthState || oauthState.expiresAt < new Date()) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_state', request.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/discord/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();

    // Get user info from Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const discordUser = await userResponse.json();

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { discordId: discordUser.id },
          { email: discordUser.email },
        ],
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: discordUser.email,
          name: discordUser.username,
          discordId: discordUser.id,
          emailVerified: true,
        },
      });
    } else if (!user.discordId) {
      // Link Discord account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: { discordId: discordUser.id },
      });
    }

    // Generate JWT token
    const token = await generateJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Clean up OAuth state
    await prisma.oAuthState.delete({
      where: { id: oauthState.id },
    });

    // Set cookie and redirect
    const response = NextResponse.redirect(
      new URL(oauthState.redirectTo || '/dashboard', request.url)
    );

    response.cookies.set('rf_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_callback_failed', request.url)
    );
  }
}
