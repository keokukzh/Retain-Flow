import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, priceId, prorationBehavior } = body;

    // Validate required fields
    if (!subscriptionId || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId, priceId' },
        { status: 400 }
      );
    }

    // Verify subscription exists
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      include: { user: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update subscription
    const updatedSubscription = await StripeService.updateSubscription({
      subscriptionId,
      priceId,
      prorationBehavior,
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        items: updatedSubscription.items.data.map((item: any) => ({
          priceId: item.price.id,
          productId: item.price.product,
        })),
      },
    });
  } catch (error) {
    // console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
