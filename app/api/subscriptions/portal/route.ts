import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, returnUrl } = body;

    // Validate required fields
    if (!userId || !returnUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, returnUrl' },
        { status: 400 }
      );
    }

    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'User does not have a Stripe customer ID' },
        { status: 404 }
      );
    }

    // Create portal session
    const session = await StripeService.createPortalSession(
      user.stripeCustomerId,
      returnUrl
    );

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    // console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
