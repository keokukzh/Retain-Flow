export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.text();
    const signature = context.request.headers.get('x-whop-signature');
    
    if (!context.env.WHOP_WEBHOOK_SECRET) {
      return new Response('Whop webhook secret not configured', { status: 500 });
    }
    
    // Verify webhook signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', context.env.WHOP_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return new Response('Invalid signature', { status: 401 });
    }
    
    const event = JSON.parse(body);
    
    // Handle the event
    switch (event.type) {
      case 'membership.created':
        const newMembership = event.data;
        await context.env.INTEGRATIONS_KV.put(
          `whop:membership:${newMembership.id}`,
          JSON.stringify({
            membershipId: newMembership.id,
            userId: newMembership.user_id,
            planId: newMembership.plan_id,
            status: 'active',
            createdAt: new Date().toISOString(),
          })
        );
        break;
      case 'membership.cancelled':
        const cancelledMembership = event.data;
        await context.env.INTEGRATIONS_KV.put(
          `whop:membership:${cancelledMembership.id}`,
          JSON.stringify({
            membershipId: cancelledMembership.id,
            userId: cancelledMembership.user_id,
            planId: cancelledMembership.plan_id,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          })
        );
        break;
      default:
        console.log(`Unhandled Whop event type ${event.type}`);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Whop webhook error:', error);
    return new Response('Webhook Error', { status: 400 });
  }
}
