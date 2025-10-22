import { NextRequest, NextResponse } from 'next/server';
import { DiscordBotAutomation } from '@/automation/discord-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, data } = body;

    // Verify webhook signature (implement proper verification)
    const signature = request.headers.get('x-discord-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    // Process the Discord event
    await DiscordBotAutomation.processWebhookEvent(event_type, data);

    return NextResponse.json({ success: true });
    } catch (error) {
      // console.error('Discord webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
