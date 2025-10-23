import { DiscordBotAutomation } from '../../../automation/discord-bot';

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.json();
    
    // Verify webhook signature (in production, you should verify Discord's signature)
    // const signature = context.request.headers.get('x-signature-ed25519');
    // const timestamp = context.request.headers.get('x-signature-timestamp');
    
    // Handle Discord webhook event
    await DiscordBotAutomation.handleWebhookEvent(body);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Discord webhook error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process Discord webhook' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
