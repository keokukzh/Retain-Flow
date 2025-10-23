import { NextRequest, NextResponse } from 'next/server';
import { PostHogService } from '@/services/posthog.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';
    const query = searchParams.get('query') ? JSON.parse(searchParams.get('query')!) : {};

    // Get insights from PostHog
    const insights = await PostHogService.getInsights(userId, query);

    return NextResponse.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    // console.error('Error getting analytics insights:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
