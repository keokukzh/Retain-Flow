/**
 * Discord OAuth Worker
 * Handles Discord OAuth flow for Retain Flow
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/oauth/discord/start') {
      return handleDiscordOAuthStart(request, env);
    } else if (path === '/oauth/discord/callback') {
      return handleDiscordOAuthCallback(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};

async function handleDiscordOAuthStart(request, env) {
  try {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get('redirect') || '/dashboard';

    // Generate state parameter
    const state = crypto.randomUUID();
    
    // Store state in KV (optional, for production)
    if (env.OAUTH_STATES) {
      await env.OAUTH_STATES.put(state, JSON.stringify({
        provider: 'discord',
        redirectTo,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      }), { expirationTtl: 600 });
    }

    // Build Discord OAuth URL
    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize');
    discordAuthUrl.searchParams.set('client_id', env.DISCORD_CLIENT_ID);
    discordAuthUrl.searchParams.set('redirect_uri', `${env.PUBLIC_URL}/oauth/discord/callback`);
    discordAuthUrl.searchParams.set('response_type', 'code');
    discordAuthUrl.searchParams.set('scope', 'identify email');
    discordAuthUrl.searchParams.set('state', state);

    return Response.json({
      url: discordAuthUrl.toString(),
      state,
    });
  } catch (error) {
    console.error('Discord OAuth start error:', error);
    return Response.json(
      { error: 'Failed to initiate Discord OAuth' },
      { status: 500 }
    );
  }
}

async function handleDiscordOAuthCallback(request, env) {
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
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.DISCORD_CLIENT_ID,
        client_secret: env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${env.PUBLIC_URL}/oauth/discord/callback`,
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

    // Create or update user in database
    const user = await createOrUpdateUser(discordUser, 'discord', env);

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
    console.error('Discord OAuth callback error:', error);
    return Response.redirect(`${env.PUBLIC_URL}/login?error=oauth_callback_failed`);
  }
}

async function createOrUpdateUser(oauthUser, provider, env) {
  // This would integrate with your database
  // For now, return a mock user
  return {
    id: oauthUser.id,
    email: oauthUser.email,
    name: oauthUser.username,
    provider,
  };
}

async function generateJWT(user, env) {
  // This would generate a JWT token
  // For now, return a mock token
  return 'mock_jwt_token';
}
