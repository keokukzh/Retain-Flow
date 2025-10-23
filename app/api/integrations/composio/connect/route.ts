import { NextRequest, NextResponse } from 'next/server';
import { ComposioService } from '@/services/composio.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, appId, config } = body;

    // Validate required fields
    if (!userId || !appId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, appId' },
        { status: 400 }
      );
    }

    // Connect to Composio app
    const connection = await ComposioService.connectApp(userId, appId, config || {});

    return NextResponse.json({
      success: true,
      data: connection,
    });
  } catch (error) {
    // console.error('Error connecting to Composio app:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
