export async function onRequestGet(context: { env: any }) {
  try {
    // Check if Discord OAuth is configured
    if (!context.env.DISCORD_CLIENT_ID) {
      return new Response('Discord OAuth not configured. Please set DISCORD_CLIENT_ID environment variable.', { status: 500 });
    }

    const publicUrl = context.env.PUBLIC_URL || 'https://e30251a6.retainflow-prod.pages.dev';
    const redirect = `${publicUrl}/api/auth/oauth/discord/callback`;
    const scope = 'identify email guilds';
    const url = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(context.env.DISCORD_CLIENT_ID)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}`;
    return Response.redirect(url, 302);
  } catch (error) {
    console.error('Discord OAuth start error:', error);
    return new Response(`OAuth start error: ${error.message}`, { status: 500 });
  }
}


