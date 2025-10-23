import { NextResponse } from 'next/server';
import { IntegrationManagerService } from '@/services/integration-manager.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Perform health checks on all integrations
    const healthChecks = await IntegrationManagerService.performHealthChecks();

    const overallHealth = healthChecks.every(check => check.healthy);

    return NextResponse.json({
      success: true,
      data: {
        overall: overallHealth ? 'healthy' : 'unhealthy',
        checks: healthChecks,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // console.error('Error performing health checks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
