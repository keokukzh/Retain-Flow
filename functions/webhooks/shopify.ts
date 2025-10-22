export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.text();
    const hmac = context.request.headers.get('x-shopify-hmac-sha256');
    
    if (!context.env.SHOPIFY_WEBHOOK_SECRET) {
      return new Response('Shopify webhook secret not configured', { status: 500 });
    }
    
    // Verify webhook signature
    const crypto = require('crypto');
    const expectedHmac = crypto
      .createHmac('sha256', context.env.SHOPIFY_WEBHOOK_SECRET)
      .update(body, 'utf8')
      .digest('base64');
    
    if (hmac !== expectedHmac) {
      return new Response('Invalid HMAC', { status: 401 });
    }
    
    const event = JSON.parse(body);
    const topic = context.request.headers.get('x-shopify-topic');
    
    // Handle the event
    switch (topic) {
      case 'customers/create':
        const newCustomer = event;
        await context.env.INTEGRATIONS_KV.put(
          `shopify:customer:${newCustomer.id}`,
          JSON.stringify({
            customerId: newCustomer.id,
            email: newCustomer.email,
            firstName: newCustomer.first_name,
            lastName: newCustomer.last_name,
            createdAt: new Date().toISOString(),
          })
        );
        break;
      case 'customers/update':
        const updatedCustomer = event;
        await context.env.INTEGRATIONS_KV.put(
          `shopify:customer:${updatedCustomer.id}`,
          JSON.stringify({
            customerId: updatedCustomer.id,
            email: updatedCustomer.email,
            firstName: updatedCustomer.first_name,
            lastName: updatedCustomer.last_name,
            updatedAt: new Date().toISOString(),
          })
        );
        break;
      default:
        console.log(`Unhandled Shopify topic ${topic}`);
    }
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Shopify webhook error:', error);
    return new Response('Webhook Error', { status: 400 });
  }
}
