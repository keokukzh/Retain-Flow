import { NextRequest, NextResponse } from 'next/server';
import { ChatwootService } from '@/services/chatwoot.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, name, customAttributes } = body;

    // Validate required fields
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email' },
        { status: 400 }
      );
    }

    // Sync user data to Chatwoot
    const contact = await ChatwootService.syncUser(userId, {
      email,
      name,
      customAttributes,
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Failed to sync user data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    // console.error('Error syncing user to Chatwoot:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
