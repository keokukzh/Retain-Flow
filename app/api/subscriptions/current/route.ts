import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';

    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['ACTIVE', 'PAST_DUE'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
      });
    }

    // Get subscription details from Stripe
    const stripeSubscription = await StripeService.getSubscription(subscription.stripeSubscriptionId);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.stripeSubscriptionId,
        status: subscription.status,
        currentPeriodEnd: stripeSubscription.current_period_end * 1000,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        plan: {
          name: 'Pro Plan', // This would come from Stripe product data
          price: 49,
          interval: stripeSubscription.items.data[0]?.price.recurring?.interval || 'month',
        },
      },
    });
  } catch (error) {
    // console.error('Error getting current subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
