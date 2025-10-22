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
        provider: 'google',
        redirectTo,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/google/callback`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    return NextResponse.json({
      url: googleAuthUrl.toString(),
      state,
    });
  } catch (error) {
    // console.error('Google OAuth start error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}
