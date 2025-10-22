import { NextRequest, NextResponse } from 'next/server';
import { whopService } from '@/services/whop.service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('whop-signature');

    // Verify webhook signature
    if (!signature) {
      return NextResponse.json(
        { success: false, message: 'Missing signature' },
        { status: 401 }
      );
    }

    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { success: false, message: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const success = await whopService.handleWebhookEvent(event);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to process webhook' },
        { status: 500 }
      );
    }
  } catch (error) {
    // console.error('Whop webhook error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
