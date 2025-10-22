export async function onRequestGet(context: { env: any }) {
  try {
    // Use test credentials if not configured
    const clientId = context.env.GOOGLE_CLIENT_ID || 'test-google-client-id';
    const publicUrl = context.env.PUBLIC_URL || 'https://d84348bc.retainflow-prod.pages.dev';
    
    // If no real credentials, redirect to a demo page
    if (!context.env.GOOGLE_CLIENT_ID) {
      return Response.redirect(`${publicUrl}/dashboard?demo_login=google&user=Demo User&email=demo@example.com`, 302);
    }

    const redirect = `${publicUrl}/api/auth/oauth/google/callback`;
    const scope = 'openid email profile';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(scope)}&access_type=online&prompt=consent`;
    return Response.redirect(url, 302);
  } catch (error) {
    console.error('Google OAuth start error:', error);
    return new Response(`OAuth start error: ${error.message}`, { status: 500 });
  }
}


