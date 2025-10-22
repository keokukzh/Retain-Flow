import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-edge';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    // Generate state parameter for OAuth security
    const state = randomBytes(32).toString('hex');
    
    // Store state in database with expiration
    await prisma.oAuthState.create({
      data: {
        state,
        provider: 'discord',
        redirectTo,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Build Discord OAuth URL
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
    discordAuthUrl.searchParams.set('client_id', process.env.DISCORD_CLIENT_ID!);
    discordAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/discord/callback`);
    discordAuthUrl.searchParams.set('response_type', 'code');
    discordAuthUrl.searchParams.set('scope', 'identify email');
    discordAuthUrl.searchParams.set('state', state);

    return NextResponse.json({
      url: discordAuthUrl.toString(),
      state,
    });
  } catch (error) {
    console.error('Discord OAuth start error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Discord OAuth' },
      { status: 500 }
    );
  }
}
