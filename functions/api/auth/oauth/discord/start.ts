export async function onRequestGet(context: { env: any }) {
  try {
    // Use test credentials if not configured
    const clientId = context.env.DISCORD_CLIENT_ID || 'test-discord-client-id';
    const publicUrl = context.env.PUBLIC_URL || 'https://d84348bc.retainflow-prod.pages.dev';
    
    // If no real credentials, redirect to a demo page
    if (!context.env.DISCORD_CLIENT_ID) {
      return Response.redirect(`${publicUrl}/dashboard?demo_login=discord&user=Demo User#1234&email=demo@example.com`, 302);
    }

    const redirect = `${publicUrl}/api/auth/oauth/discord/callback`;
    const scope = 'identify email guilds';
    const url = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}`;
    return Response.redirect(url, 302);
  } catch (error) {
    console.error('Discord OAuth start error:', error);
    return new Response(`OAuth start error: ${error.message}`, { status: 500 });
  }
}


