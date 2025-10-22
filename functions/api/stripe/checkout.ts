export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { priceId = context.env.STRIPE_PRICE_ID_PRO } = await context.request.json();
    
    if (!context.env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured' }, 500);
    }

    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${context.env.PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${context.env.PUBLIC_URL}/dashboard?canceled=true`,
      metadata: {
        source: 'retainflow_dashboard',
      },
    });

    return json({ url: session.url }, 200);
  } catch (error) {
    return json({ error: 'Failed to create checkout session' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
