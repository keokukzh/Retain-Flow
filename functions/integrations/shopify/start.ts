export async function onRequestGet(context: { env: any }) {
  if (!context.env.SHOPIFY_CLIENT_ID) {
    return new Response('Shopify not configured', { status: 500 });
  }
  
  const state = crypto.randomUUID();
  const redirectUri = `${context.env.PUBLIC_URL}/api/integrations/shopify/callback`;
  
  // Store state for verification
  await context.env.INTEGRATIONS_KV.put(`shopify:state:${state}`, 'pending', { expirationTtl: 600 });
  
  const params = new URLSearchParams({
    client_id: context.env.SHOPIFY_CLIENT_ID,
    scope: 'read_customers,read_orders',
    redirect_uri: redirectUri,
    state: state,
  });
  
  const shopifyUrl = `https://accounts.shopify.com/oauth/authorize?${params}`;
  return Response.redirect(shopifyUrl, 302);
}
