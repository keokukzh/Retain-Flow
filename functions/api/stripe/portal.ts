export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    if (!context.env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured' }, 500);
    }

    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);
    
    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      return_url: `${context.env.PUBLIC_URL}/dashboard`,
    });

    return json({ url: session.url }, 200);
  } catch (error) {
    return json({ error: 'Failed to create portal session' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
