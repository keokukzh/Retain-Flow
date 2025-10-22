export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.text();
    const sig = context.request.headers.get('stripe-signature');
    
    if (!context.env.STRIPE_SECRET_KEY || !context.env.STRIPE_WEBHOOK_SECRET) {
      return new Response('Stripe not configured', { status: 500 });
    }
    
    // Verify webhook signature
    const stripe = require('stripe')(context.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(body, sig, context.env.STRIPE_WEBHOOK_SECRET);
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Store subscription info in KV
        await context.env.INTEGRATIONS_KV.put(
          `stripe:${session.customer}`,
          JSON.stringify({
            customerId: session.customer,
            subscriptionId: session.subscription,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        );
        break;
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await context.env.INTEGRATIONS_KV.put(
          `stripe:${subscription.customer}`,
          JSON.stringify({
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            status: subscription.status,
            updatedAt: new Date().toISOString(),
          })
        );
        break;
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await context.env.INTEGRATIONS_KV.put(
          `stripe:${deletedSubscription.customer}`,
          JSON.stringify({
            customerId: deletedSubscription.customer,
            subscriptionId: deletedSubscription.id,
            status: 'canceled',
            canceledAt: new Date().toISOString(),
          })
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook Error', { status: 400 });
  }
}
