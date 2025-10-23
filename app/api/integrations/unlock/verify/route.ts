import { NextRequest, NextResponse } from 'next/server';
import { UnlockService } from '@/services/unlock.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, lockAddress } = body;

    // Validate required fields
    if (!userAddress || !lockAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: userAddress, lockAddress' },
        { status: 400 }
      );
    }

    // Verify membership
    const result = await UnlockService.hasActiveMembership(userAddress, lockAddress);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        hasMembership: result.hasMembership,
        membership: result.membership,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // console.error('Error verifying Unlock membership:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
