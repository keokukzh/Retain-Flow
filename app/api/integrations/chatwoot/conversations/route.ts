import { NextRequest, NextResponse } from 'next/server';
import { ChatwootService } from '@/services/chatwoot.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, message, priority } = body;

    // Validate required fields
    if (!userId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, message' },
        { status: 400 }
      );
    }

    // Create conversation
    const conversation = await ChatwootService.createConversation(
      userId,
      message,
      priority || 'medium'
    );

    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    // console.error('Error creating Chatwoot conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
