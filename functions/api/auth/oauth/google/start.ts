export async function onRequestGet(context: { env: any }) {
  const clientId = context.env.GOOGLE_CLIENT_ID;
  const redirect = context.env.PUBLIC_URL + '/api/auth/oauth/google/callback';
  const scope = 'openid email profile';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}&access_type=online&prompt=consent`;
  return Response.redirect(url, 302);
}


