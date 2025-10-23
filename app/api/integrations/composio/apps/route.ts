import { NextResponse } from 'next/server';
import { ComposioService } from '@/services/composio.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get available apps
    const apps = await ComposioService.getAvailableApps();

    return NextResponse.json({
      success: true,
      data: apps,
    });
  } catch (error) {
    // console.error('Error getting Composio apps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
