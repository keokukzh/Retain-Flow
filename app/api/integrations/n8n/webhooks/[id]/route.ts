import { NextRequest, NextResponse } from 'next/server';
import { N8nService } from '@/services/n8n.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const webhookId = params.id;
    const body = await request.json();
    const headers = Object.fromEntries(request.headers.entries());

    // Validate webhook ID
    if (!webhookId) {
      return NextResponse.json(
        { error: 'Webhook ID is required' },
        { status: 400 }
      );
    }

    // Handle webhook
    const success = await N8nService.handleWebhook({
      webhookId,
      payload: body,
      headers,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      webhookId,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    // console.error('Error processing n8n webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
