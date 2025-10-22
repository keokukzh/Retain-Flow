export async function onRequestGet(context: { request: Request }) {
  const cookie = context.request.headers.get('Cookie') || '';
  const discord = /discord_connected=true/.test(cookie);
  const stripe = /stripe_connected=true/.test(cookie);
  const whop = /whop_connected=true/.test(cookie);
  const shopify = /shopify_connected=true/.test(cookie);
  return json({
    integrations: {
      discord: { connected: discord },
      stripe: { connected: stripe },
      whop: { connected: whop },
      shopify: { connected: shopify },
    },
  });
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}


