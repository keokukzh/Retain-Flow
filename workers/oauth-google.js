/**
 * Google OAuth Worker
 * Handles Google OAuth flow for Retain Flow
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/oauth/google/start') {
      return handleGoogleOAuthStart(request, env);
    } else if (path === '/oauth/google/callback') {
      return handleGoogleOAuthCallback(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleGoogleOAuthStart(request, env) {
  try {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') || '/dashboard';

    // Generate state parameter
    const state = crypto.randomUUID();
    
    // Store state in KV (optional, for production)
    if (env.OAUTH_STATES) {
      await env.OAUTH_STATES.put(state, JSON.stringify({
        provider: 'google',
        redirectTo,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      }), { expirationTtl: 600 });
    }

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', `${env.PUBLIC_URL}/oauth/google/callback`);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('state', state);
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'consent');

    return Response.json({
      url: googleAuthUrl.toString(),
      state,
    });
  } catch (error) {
    console.error('Google OAuth start error:', error);
    return Response.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}

async function handleGoogleOAuthCallback(request, env) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return Response.redirect(`${env.PUBLIC_URL}/login?error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return Response.redirect(`${env.PUBLIC_URL}/login?error=missing_parameters`);
    }

    // Verify state parameter
    let oauthState = null;
    if (env.OAUTH_STATES) {
      const stateData = await env.OAUTH_STATES.get(state);
      if (stateData) {
        oauthState = JSON.parse(stateData);
        if (oauthState.expiresAt < Date.now()) {
          return Response.redirect(`${env.PUBLIC_URL}/login?error=invalid_state`);
        }
      }
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${env.PUBLIC_URL}/oauth/google/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const googleUser = await userResponse.json();

    // Create or update user in database
    const user = await createOrUpdateUser(googleUser, 'google', env);

    // Generate JWT token
    const token = await generateJWT(user, env);

    // Clean up state
    if (env.OAUTH_STATES) {
      await env.OAUTH_STATES.delete(state);
    }

    // Redirect with token
    const redirectUrl = new URL(oauthState?.redirectTo || '/dashboard', env.PUBLIC_URL);
    redirectUrl.searchParams.set('token', token);

    return Response.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return Response.redirect(`${env.PUBLIC_URL}/login?error=oauth_callback_failed`);
  }
}

async function createOrUpdateUser(oauthUser, provider, env) {
  // This would integrate with your database
  // For now, return a mock user
  return {
    id: oauthUser.id,
    email: oauthUser.email,
    name: oauthUser.name,
    provider,
  };
}

async function generateJWT(user, env) {
  // This would generate a JWT token
  // For now, return a mock token
  return 'mock_jwt_token';
}
