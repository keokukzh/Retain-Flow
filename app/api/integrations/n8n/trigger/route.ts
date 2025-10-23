import { NextRequest, NextResponse } from 'next/server';
import { N8nService } from '@/services/n8n.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, data, userId } = body;

    // Validate required fields
    if (!workflowId || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, data' },
        { status: 400 }
      );
    }

    // Trigger n8n workflow
    const result = await N8nService.triggerWorkflow({
      workflowId,
      data,
      userId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to trigger workflow' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        executionId: result.executionId,
        workflowId,
        triggeredAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // console.error('Error triggering n8n workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
