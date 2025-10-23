import { NextRequest, NextResponse } from 'next/server';
import { UnlockService } from '@/services/unlock.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user memberships
    const memberships = await UnlockService.getUserMemberships(userId);

    return NextResponse.json({
      success: true,
      data: memberships,
    });
  } catch (error) {
    // console.error('Error getting user memberships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const body = await request.json();
    const { userAddress } = body;

    if (!userId || !userAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userAddress' },
        { status: 400 }
      );
    }

    // Sync user memberships
    await UnlockService.syncUserMemberships(userAddress, userId);

    return NextResponse.json({
      success: true,
      message: 'Memberships synced successfully',
    });
  } catch (error) {
    // console.error('Error syncing user memberships:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
