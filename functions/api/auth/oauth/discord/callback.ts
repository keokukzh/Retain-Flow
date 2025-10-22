import jwt from 'jsonwebtoken';

export async function onRequestGet(context: { request: Request; env: any }) {
  const url = new URL(context.request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const redirect = context.env.PUBLIC_URL + '/api/auth/oauth/discord/callback';
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
  if (!tokenResp.ok) return new Response('OAuth exchange failed', { status: 400 });
  const tokenSet = await tokenResp.json();

  const userResp = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenSet.access_token}` },
  });
  const user = await userResp.json();

  // Store Discord connection in KV
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

  const jwtToken = jwt.sign({ sub: user.id, email: user.email, provider: 'discord' }, context.env.JWT_SECRET, { expiresIn: '1h' });
  const res = Response.redirect(context.env.PUBLIC_URL + '/dashboard', 302);
  res.headers.append('Set-Cookie', `rf_token=${jwtToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
  return res;
}


