import { NextRequest, NextResponse } from 'next/server';
import { IntegrationManagerService } from '@/services/integration-manager.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';

    // Get all integration statuses
    const statuses = await IntegrationManagerService.getAllIntegrationStatuses(userId);

    return NextResponse.json({
      success: true,
      data: statuses,
    });
  } catch (error) {
    // console.error('Error getting integration statuses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
