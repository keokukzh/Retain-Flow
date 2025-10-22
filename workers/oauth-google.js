// Cloudflare Worker for Google OAuth
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/api/auth/oauth/google/start') {
      return handleGoogleOAuthStart(request, env);
    } else if (url.pathname === '/api/auth/oauth/google/callback') {
      return handleGoogleOAuthCallback(request, env);
    }
    
    return new Response('Not Found', { status: 404 });
  }
};

async function handleGoogleOAuthStart(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    // Generate state parameter for OAuth security
    const state = crypto.randomUUID();

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', `${env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/google/callback`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    return new Response(null, {
      status: 302,
      headers: {
        Location: googleAuthUrl.toString(),
        'Set-Cookie': `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to initiate Google OAuth' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleGoogleOAuthCallback(request, env) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return new Response('Missing code or state parameter', { status: 400 });
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${env.NEXTAUTH_URL || 'https://retain-flow-new.pages.dev'}/api/auth/oauth/google/callback`,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new Response('Failed to exchange Google token', { status: 400 });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      return new Response('Failed to get Google user info', { status: 400 });
    }

    // Generate JWT token (simplified for demo)
    const jwtToken = await generateJWT({
      userId: userInfo.sub,
      email: userInfo.email,
      provider: 'google',
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
    return new Response('Internal server error during Google OAuth callback', { status: 500 });
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