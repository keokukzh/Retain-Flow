import { NextRequest, NextResponse } from 'next/server';
import { ComposioService } from '@/services/composio.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';

    // Get user connections
    const connections = await ComposioService.listConnections(userId);

    return NextResponse.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    // console.error('Error getting Composio connections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';
    const appId = searchParams.get('appId');

    if (!appId) {
      return NextResponse.json(
        { error: 'Missing required field: appId' },
        { status: 400 }
      );
    }

    // Disconnect app
    const success = await ComposioService.disconnectApp(userId, appId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to disconnect app' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'App disconnected successfully',
    });
  } catch (error) {
    // console.error('Error disconnecting Composio app:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
