export async function onRequestGet(context: { env: any }) {
  try {
    // Require Discord OAuth credentials
    if (!context.env.DISCORD_CLIENT_ID) {
      return new Response('Discord OAuth not configured. Please set DISCORD_CLIENT_ID environment variable in Cloudflare Pages settings.', { status: 500 });
    }

    const publicUrl = context.env.PUBLIC_URL || 'https://2f17e891.retainflow-prod.pages.dev';
    const redirect = `${publicUrl}/api/auth/oauth/discord/callback`;
    const scope = 'identify email guilds';
    const url = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(context.env.DISCORD_CLIENT_ID)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}`;
    return Response.redirect(url, 302);
  } catch (error) {
    console.error('Discord OAuth start error:', error);
    return new Response(`OAuth start error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}


