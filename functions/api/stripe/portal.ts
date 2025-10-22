export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    if (!context.env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable in Cloudflare Pages settings.' }, 500);
    }

    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);
    const publicUrl = context.env.PUBLIC_URL || 'https://2f17e891.retainflow-prod.pages.dev';
    
    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      return_url: `${publicUrl}/dashboard`,
    });

    return json({ url: session.url }, 200);
  } catch (error) {
    console.error('Stripe portal error:', error);
    return json({ error: 'Failed to create portal session' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
