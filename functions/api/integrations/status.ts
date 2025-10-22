export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    // Check KV for integration status
    const [discordData, stripeData, whopData, shopifyData] = await Promise.all([
      context.env.INTEGRATIONS_KV.get('discord:connection'),
      context.env.INTEGRATIONS_KV.get('stripe:connection'),
      context.env.INTEGRATIONS_KV.get('whop:api_key'),
      context.env.INTEGRATIONS_KV.get('shopify:connection'),
    ]);
    
    return json({
      integrations: {
        discord: { 
          connected: !!discordData,
          data: discordData ? JSON.parse(discordData) : null,
        },
        stripe: { 
          connected: !!stripeData,
          data: stripeData ? JSON.parse(stripeData) : null,
        },
        whop: { 
          connected: !!whopData,
          data: whopData ? JSON.parse(whopData) : null,
        },
        shopify: { 
          connected: !!shopifyData,
          data: shopifyData ? JSON.parse(shopifyData) : null,
        },
      },
    });
  } catch (error) {
    return json({ error: 'Failed to fetch integration status' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}


