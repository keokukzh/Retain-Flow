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
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: context.env.GOOGLE_CLIENT_ID,
          client_secret: context.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/google/callback`,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();

      // Get user info from Google
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const googleUser = await userResponse.json();

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { googleId: googleUser.id },
      });

      if (!user) {
        // Check if user exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: googleUser.email },
        });

        if (existingUser) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: googleUser.id,
              name: existingUser.name || googleUser.name,
              emailVerified: true,
            },
          });
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              googleId: googleUser.id,
              name: googleUser.name,
              email: googleUser.email,
              emailVerified: true,
            },
          });
        }
      }

      // Generate JWT token
      const token = await signJWT({
        userId: user.id,
        email: user.email,
        provider: 'google',
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
    console.error('Google OAuth callback error:', error);
    return Response.redirect(`${context.env.PUBLIC_URL || 'https://retain-flow-new.pages.dev'}/login?error=oauth_failed`, 302);
  }
}
