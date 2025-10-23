import { NextRequest, NextResponse } from 'next/server';
import { ComposioService } from '@/services/composio.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const appId = params.appId;

    if (!appId) {
      return NextResponse.json(
        { error: 'App ID is required' },
        { status: 400 }
      );
    }

    // Get app actions
    const actions = await ComposioService.getAppActions(appId);

    return NextResponse.json({
      success: true,
      data: actions,
    });
  } catch (error) {
    // console.error('Error getting Composio app actions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
