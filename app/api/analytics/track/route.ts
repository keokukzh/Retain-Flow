import { NextRequest, NextResponse } from 'next/server';
import { PostHogService } from '@/services/posthog.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, properties, userId } = body;

    // Validate required fields
    if (!event) {
      return NextResponse.json(
        { error: 'Missing required field: event' },
        { status: 400 }
      );
    }

    // Track event with PostHog
    const success = await PostHogService.trackEvent({
      event,
      properties,
      userId,
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to track event' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error) {
    // console.error('Error tracking event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
