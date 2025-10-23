import { NextRequest, NextResponse } from 'next/server';
import { IntegrationManagerService } from '@/services/integration-manager.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get available integrations
    const integrations = await IntegrationManagerService.getAvailableIntegrations(userId || undefined);

    return NextResponse.json({
      success: true,
      data: integrations,
    });
  } catch (error) {
    // console.error('Error getting available integrations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
