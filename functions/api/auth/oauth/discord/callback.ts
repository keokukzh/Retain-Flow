import jwt from 'jsonwebtoken';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    if (error) {
      return new Response(`Discord OAuth Error: ${error}`, { status: 400 });
    }
    
    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    // Check if environment variables are configured
    if (!context.env.DISCORD_CLIENT_ID || !context.env.DISCORD_CLIENT_SECRET) {
      return new Response('Discord OAuth not configured. Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET environment variables in Cloudflare Pages settings.', { status: 500 });
    }

    if (!context.env.JWT_SECRET) {
      return new Response('JWT_SECRET not configured. Please set JWT_SECRET environment variable in Cloudflare Pages settings.', { status: 500 });
    }

    const publicUrl = context.env.PUBLIC_URL || 'https://2f17e891.retainflow-prod.pages.dev';
    const redirect = `${publicUrl}/api/auth/oauth/discord/callback`;
    
    const body = new URLSearchParams({
      client_id: context.env.DISCORD_CLIENT_ID,
      client_secret: context.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirect,
    });

    const tokenResp = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    
    if (!tokenResp.ok) {
      const errorText = await tokenResp.text();
      console.error('Discord token exchange failed:', errorText);
      return new Response(`Discord OAuth token exchange failed: ${errorText}`, { status: 400 });
    }
    
    const tokenSet = await tokenResp.json();

    const userResp = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenSet.access_token}` },
    });
    
    if (!userResp.ok) {
      return new Response('Failed to fetch Discord user info', { status: 400 });
    }
    
    const user = await userResp.json();

    // Store Discord connection in KV if available
    if (context.env.INTEGRATIONS_KV) {
      try {
        await context.env.INTEGRATIONS_KV.put(
          'discord:connection',
          JSON.stringify({
            accessToken: tokenSet.access_token,
            refreshToken: tokenSet.refresh_token,
            userId: user.id,
            username: user.username,
            email: user.email,
            connectedAt: new Date().toISOString(),
          })
        );
      } catch (kvError) {
        console.warn('KV storage not available:', kvError);
      }
    }

    const jwtToken = jwt.sign({ sub: user.id, email: user.email, provider: 'discord' }, context.env.JWT_SECRET, { expiresIn: '1h' });
    const res = Response.redirect(`${publicUrl}/dashboard?discord_connected=true`, 302);
    res.headers.append('Set-Cookie', `rf_token=${jwtToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
    return res;
    
  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return new Response(`Discord OAuth callback error: ${error.message}`, { status: 500 });
  }
}


