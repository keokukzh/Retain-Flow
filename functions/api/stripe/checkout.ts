export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const { plan = 'pro', interval = 'monthly' } = await context.request.json();
    
    if (!context.env.STRIPE_SECRET_KEY) {
      return json({ error: 'Stripe not configured' }, 500);
    }

    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);
    
    // Determine price ID based on plan and interval
    let priceId;
    if (plan === 'pro' && interval === 'monthly') {
      priceId = context.env.STRIPE_PRICE_ID_PRO_MONTHLY;
    } else if (plan === 'pro' && interval === 'yearly') {
      priceId = context.env.STRIPE_PRICE_ID_PRO_YEARLY;
    } else {
      priceId = context.env.STRIPE_PRICE_ID_PRO_MONTHLY; // fallback
    }
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${context.env.PUBLIC_URL}/dashboard?success=true&plan=${plan}&interval=${interval}`,
      cancel_url: `${context.env.PUBLIC_URL}/dashboard?canceled=true`,
      metadata: {
        source: 'retainflow_dashboard',
        plan: plan,
        interval: interval,
      },
      allow_promotion_codes: true,
    });

    return json({ url: session.url }, 200);
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return json({ error: 'Failed to create checkout session' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
