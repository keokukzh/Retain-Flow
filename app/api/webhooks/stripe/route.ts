import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe.service';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = StripeService.verifyWebhookSignature(body, signature);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        // console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;

    if (!userId || !subscriptionId) {
      // console.error('Missing userId or subscriptionId in checkout session');
      return;
    }

    // Get subscription details
    const subscription = await StripeService.getSubscription(subscriptionId);
    
    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: subscriptionId,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id || 'unknown',
        status: subscription.status === 'active' ? 'ACTIVE' : 'PAUSED',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        startedAt: new Date(subscription.current_period_start * 1000),
        endedAt: subscription.cancel_at_period_end 
          ? new Date(subscription.current_period_end * 1000) 
          : null,
      },
    });

    // console.log(`Subscription created for user ${userId}`);
  } catch (error) {
    // console.error('Error handling checkout session completed:', error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    
    if (!userId) {
      // console.error('Missing userId in subscription metadata');
      return;
    }

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status === 'active' ? 'ACTIVE' : 'PAUSED',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id || 'unknown',
        status: subscription.status === 'active' ? 'ACTIVE' : 'PAUSED',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        startedAt: new Date(subscription.current_period_start * 1000),
      },
    });

    // console.log(`Subscription created for user ${userId}`);
  } catch (error) {
    // console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const status = subscription.status === 'active' ? 'ACTIVE' : 
                  subscription.status === 'canceled' ? 'CANCELED' : 'PAUSED';

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        endedAt: subscription.cancel_at_period_end 
          ? new Date(subscription.current_period_end * 1000) 
          : null,
      },
    });

    // console.log(`Subscription updated: ${subscription.id}`);
  } catch (error) {
    // console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'CANCELED',
        endedAt: new Date(),
      },
    });

    // console.log(`Subscription cancelled: ${subscription.id}`);
  } catch (error) {
    // console.error('Error handling subscription deleted:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    
    if (subscriptionId) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: 'ACTIVE',
        },
      });
    }

    // console.log(`Payment succeeded for invoice: ${invoice.id}`);
  } catch (error) {
    // console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    
    if (subscriptionId) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: 'PAST_DUE',
        },
      });
    }

    // console.log(`Payment failed for invoice: ${invoice.id}`);
  } catch (error) {
    // console.error('Error handling payment failed:', error);
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  try {
    // TODO: Send trial ending email notification to customer
    const subscriptionId = subscription.id;
    // Will implement email sending in Phase 4
    void subscriptionId;
  } catch (error) {
    // console.error('Error handling trial will end:', error);
  }
}
