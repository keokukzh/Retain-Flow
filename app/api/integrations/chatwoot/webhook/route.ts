import { NextRequest, NextResponse } from 'next/server';
import { ChatwootService } from '@/services/chatwoot.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-chatwoot-signature');

    // Verify webhook signature if configured
    if (process.env.CHATWOOT_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(body, signature);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid webhook signature' },
          { status: 401 }
        );
      }
    }

    // Handle webhook
    const success = await ChatwootService.handleWebhook(body);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    // console.error('Error processing Chatwoot webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function verifyWebhookSignature(payload: any, signature: string): boolean {
  // Implement webhook signature verification
  // This is a placeholder - implement according to Chatwoot's webhook security guidelines
  try {
    const crypto = require('crypto');
    const secret = process.env.CHATWOOT_WEBHOOK_SECRET;
    if (!secret) return false;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
        // Error verifying webhook signature
    return false;
  }
}
