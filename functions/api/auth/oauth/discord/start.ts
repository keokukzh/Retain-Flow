export async function onRequestGet(context: { env: any }) {
  const clientId = context.env.DISCORD_CLIENT_ID;
  const redirect = context.env.PUBLIC_URL + '/api/auth/oauth/discord/callback';
  const scope = 'identify email guilds';
  const url = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(clientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}`;
  return Response.redirect(url, 302);
}


