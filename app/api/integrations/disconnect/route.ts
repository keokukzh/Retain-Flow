import { NextRequest, NextResponse } from 'next/server';
import { IntegrationManagerService } from '@/services/integration-manager.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, provider } = body;

    // Validate required fields
    if (!userId || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, provider' },
        { status: 400 }
      );
    }

    // Disconnect integration
    const success = await IntegrationManagerService.disconnectIntegration(userId, provider);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to disconnect integration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Integration disconnected successfully',
    });
  } catch (error) {
    // console.error('Error disconnecting integration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
