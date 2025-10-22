// Cloudflare Worker for Discord OAuth
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/auth/oauth/discord/start') {
      return handleDiscordOAuthStart(request, env);
    } else if (url.pathname === '/api/auth/oauth/discord/callback') {
      return handleDiscordOAuthCallback(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleDiscordOAuthStart(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    // Generate state parameter for OAuth security
    const state = crypto.randomUUID();

    // Build Discord OAuth URL
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
    discordAuthUrl.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
    discordAuthUrl.searchParams.set('redirect_uri', `${env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/discord/callback`);
    discordAuthUrl.searchParams.set('response_type', 'code');
    discordAuthUrl.searchParams.set('scope', 'identify email');
    discordAuthUrl.searchParams.set('state', state);
    discordAuthUrl.searchParams.set('prompt', 'consent');

    return new Response(null, {
      status: 302,
      headers: {
        Location: discordAuthUrl.toString(),
        'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to initiate Discord OAuth' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleDiscordOAuthCallback(request, env) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return new Response('Missing code or state parameter', { status: 400 });
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/discord/callback`,
        scope: 'identify email',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response('Failed to exchange Discord token', { status: 400 });
    }

    // Get user info from Discord
    const userInfoResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      return new Response('Failed to get Discord user info', { status: 400 });
    }

    // Generate JWT token (simplified for demo)
    const jwtToken = await generateJWT({
      userId: userInfo.id,
      email: userInfo.email,
      provider: 'discord',
    }, env.JWT_SECRET);

    const redirectUrl = new URL('/dashboard', request.url);
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl.toString(),
      },
    });

    response.headers.append(
      'Set-Cookie',
      `rf_token=${jwtToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}` // 7 days
    );

    return response;
  } catch (error) {
    return new Response('Internal server error during Discord OAuth callback', { status: 500 });
  }
}

async function generateJWT(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}