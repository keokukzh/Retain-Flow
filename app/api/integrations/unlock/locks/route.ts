import { NextRequest, NextResponse } from 'next/server';
import { UnlockService } from '@/services/unlock.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const network = searchParams.get('network');

    // Get available locks
    const locks = await UnlockService.getAvailableLocks(network || undefined);

    return NextResponse.json({
      success: true,
      data: locks,
    });
  } catch (error) {
    // console.error('Error getting Unlock locks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, symbol, price, currency, duration, maxNumberOfKeys } = body;

    // Validate required fields
    if (!name || !symbol || !price || !currency || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields: name, symbol, price, currency, duration' },
        { status: 400 }
      );
    }

    // Create lock
    const lock = await UnlockService.createLock({
      name,
      symbol,
      price,
      currency,
      duration,
      maxNumberOfKeys,
    });

    if (!lock) {
      return NextResponse.json(
        { error: 'Failed to create lock' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lock,
    });
  } catch (error) {
    // console.error('Error creating Unlock lock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
