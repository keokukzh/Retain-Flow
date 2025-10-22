export async function onRequestGet(context: { env: any }) {
  try {
    // Require Google OAuth credentials
    if (!context.env.GOOGLE_CLIENT_ID) {
      return new Response('Google OAuth not configured. Please set GOOGLE_CLIENT_ID environment variable in Cloudflare Pages settings.', { status: 500 });
    }

    const publicUrl = context.env.PUBLIC_URL || 'https://2f17e891.retainflow-prod.pages.dev';
    const redirect = `${publicUrl}/api/auth/oauth/google/callback`;
    const scope = 'openid email profile';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(context.env.GOOGLE_CLIENT_ID)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}&access_type=online&prompt=consent`;
    return Response.redirect(url, 302);
  } catch (error) {
    console.error('Google OAuth start error:', error);
    return new Response(`OAuth start error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}


