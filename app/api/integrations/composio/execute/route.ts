import { NextRequest, NextResponse } from 'next/server';
import { ComposioService } from '@/services/composio.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appId, actionId, parameters } = body;

    // Validate required fields
    if (!userId || !appId || !actionId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, appId, actionId' },
        { status: 400 }
      );
    }

    // Execute Composio action
    const result = await ComposioService.executeAction(
      userId,
      appId,
      actionId,
      parameters || {}
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to execute action' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        executionId: result.executionId,
        result: result.data,
        executedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // console.error('Error executing Composio action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
