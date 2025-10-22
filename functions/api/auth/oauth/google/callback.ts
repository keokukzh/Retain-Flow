import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    if (error) {
      return new Response(`OAuth Error: ${error}`, { status: 400 });
    }
    
    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    // Check if environment variables are configured
    if (!context.env.GOOGLE_CLIENT_ID || !context.env.GOOGLE_CLIENT_SECRET) {
      return new Response('Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables in Cloudflare Pages settings.', { status: 500 });
    }

    const redirectUri = `${context.env.PUBLIC_URL || 'https://retainflow-prod.pages.dev'}/api/auth/oauth/google/callback`;
    
    const body = new URLSearchParams({
      client_id: context.env.GOOGLE_CLIENT_ID,
      client_secret: context.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    });

    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    
    if (!tokenResp.ok) {
      const errorText = await tokenResp.text();
      console.error('Token exchange failed:', errorText);
      return new Response(`OAuth token exchange failed: ${errorText}`, { status: 400 });
    }
    
    const tokenSet = await tokenResp.json();

    const userResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenSet.access_token}` },
    });
    
    if (!userResp.ok) {
      return new Response('Failed to fetch user info', { status: 400 });
    }
    
    const googleUser = await userResp.json();

    // Initialize Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      // Check if user exists by email or Google ID
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: googleUser.email },
            { googleId: googleUser.sub }
          ]
        }
      });

      if (user) {
        // Update existing user with Google ID if not already set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              googleId: googleUser.sub,
              emailVerified: true, // Google emails are verified
              name: user.name || googleUser.name,
            }
          });
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            name: googleUser.name,
            email: googleUser.email,
            googleId: googleUser.sub,
            emailVerified: true, // Google emails are verified
            passwordHash: null, // OAuth users don't have passwords
          }
        });
      }

      // Store Google connection in KV if available
      if (context.env.INTEGRATIONS_KV) {
        try {
          await context.env.INTEGRATIONS_KV.put(
            'google:connection',
            JSON.stringify({
              accessToken: tokenSet.access_token,
              refreshToken: tokenSet.refresh_token,
              userId: googleUser.sub,
              email: googleUser.email,
              name: googleUser.name,
              picture: googleUser.picture,
              connectedAt: new Date().toISOString(),
            })
          );
        } catch (kvError) {
          console.warn('KV storage not available:', kvError);
        }
      }

      // Create JWT token
      if (!context.env.JWT_SECRET) {
        return new Response('JWT_SECRET not configured. Please set JWT_SECRET environment variable in Cloudflare Pages settings.', { status: 500 });
      }
      
      const jwtToken = jwt.sign({ 
        userId: user.id,
        email: user.email, 
        name: user.name,
        provider: 'google' 
      }, context.env.JWT_SECRET, { expiresIn: '1h' });
      
      const publicUrl = context.env.PUBLIC_URL || 'https://retainflow-prod.pages.dev';
      const res = Response.redirect(`${publicUrl}/dashboard?google_connected=true`, 302);
      res.headers.append('Set-Cookie', `rf_token=${jwtToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
      return res;
    } finally {
      await prisma.$disconnect();
    }
    
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return new Response(`OAuth callback error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}


