import { NextRequest, NextResponse } from 'next/server';
import { IntegrationManagerService } from '@/services/integration-manager.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, provider, config } = body;

    // Validate required fields
    if (!userId || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, provider' },
        { status: 400 }
      );
    }

    // Connect integration
    const success = await IntegrationManagerService.connectIntegration(userId, provider, config || {});

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to connect integration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Integration connected successfully',
    });
  } catch (error) {
    // console.error('Error connecting integration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
