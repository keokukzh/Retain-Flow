export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const url = new URL(context.request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const shop = url.searchParams.get('shop');
    
    if (!code || !state || !shop) {
      return new Response('Missing required parameters', { status: 400 });
    }
    
    // Verify state parameter
    const storedState = await context.env.INTEGRATIONS_KV.get(`shopify:state:${state}`);
    if (!storedState) {
      return new Response('Invalid state parameter', { status: 400 });
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: context.env.SHOPIFY_CLIENT_ID,
        client_secret: context.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });
    
    if (!tokenResponse.ok) {
      return new Response('Failed to exchange code for token', { status: 400 });
    }
    
    const tokenData = await tokenResponse.json();
    
    // Store access token and shop info
    await context.env.INTEGRATIONS_KV.put(
      'shopify:connection',
      JSON.stringify({
        accessToken: tokenData.access_token,
        shop: shop,
        scope: tokenData.scope,
        connectedAt: new Date().toISOString(),
      })
    );
    
    // Clean up state
    await context.env.INTEGRATIONS_KV.delete(`shopify:state:${state}`);
    
    return Response.redirect(`${context.env.PUBLIC_URL}/dashboard?shopify_connected=true`, 302);
  } catch (error) {
    console.error('Shopify OAuth error:', error);
    return new Response('OAuth Error', { status: 500 });
  }
}
