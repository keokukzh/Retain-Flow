import { NextRequest, NextResponse } from 'next/server';
import { N8nService } from '@/services/n8n.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';

    // Check n8n connection health
    const isConnected = await N8nService.checkConnection();

    // Get integration status
    const integration = await N8nService.getIntegration(userId);

    // Get available workflows if connected
    let workflows: any[] = [];
    if (isConnected) {
      try {
        workflows = await N8nService.getWorkflows();
      } catch (error) {
        // Error getting workflows
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        connected: isConnected,
        integration: integration ? {
          id: integration.id,
          active: integration.active,
          createdAt: integration.createdAt,
          updatedAt: integration.updatedAt,
        } : null,
        workflows: workflows.map(workflow => ({
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          createdAt: workflow.createdAt,
        })),
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    // console.error('Error checking n8n status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
