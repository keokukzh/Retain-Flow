import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export interface CreateCheckoutSessionData {
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  customerName?: string;
}

export interface CreateCustomerData {
  email: string;
  name?: string;
  userId: string;
}

export interface UpdateSubscriptionData {
  subscriptionId: string;
  priceId: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export class StripeService {
  /**
   * Create a new Stripe customer
   */
  static async createCustomer(data: CreateCustomerData) {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: {
          userId: data.userId,
        },
      });

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: data.userId },
        data: { stripeCustomerId: customer.id },
      });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }

  /**
   * Get or create customer for user
   */
  static async getOrCreateCustomer(userId: string, email: string, name?: string) {
    try {
      // Check if user already has a Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      });

      if (user?.stripeCustomerId) {
        // Return existing customer
        return await stripe.customers.retrieve(user.stripeCustomerId);
      }

      // Create new customer
      return await this.createCustomer({ userId, email, name });
    } catch (error) {
      console.error('Error getting/creating customer:', error);
      throw new Error('Failed to get or create customer');
    }
  }

  /**
   * Create checkout session for subscription
   */
  static async createCheckoutSession(data: CreateCheckoutSessionData) {
    try {
      // Get or create customer
      const customer = await this.getOrCreateCustomer(
        data.userId,
        data.customerEmail || '',
        data.customerName
      );

      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [
          {
            price: data.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        metadata: {
          userId: data.userId,
        },
        subscription_data: {
          metadata: {
            userId: data.userId,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        tax_id_collection: {
          enabled: true,
        },
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create portal session for customer management
   */
  static async createPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw new Error('Failed to create portal session');
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer', 'items.data.price'],
      });

      return subscription;
    } catch (error) {
      console.error('Error getting subscription:', error);
      throw new Error('Failed to get subscription');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd,
        metadata: {
          cancelledAt: new Date().toISOString(),
        },
      });

      // Update database
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: 'CANCELED',
          endedAt: cancelAtPeriodEnd ? null : new Date(),
        },
      });

      return subscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  static async updateSubscription(data: UpdateSubscriptionData) {
    try {
      const subscription = await stripe.subscriptions.retrieve(data.subscriptionId);
      
      const updatedSubscription = await stripe.subscriptions.update(data.subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: data.priceId,
          },
        ],
        proration_behavior: data.prorationBehavior || 'create_prorations',
        metadata: {
          updatedAt: new Date().toISOString(),
        },
      });

      // Update database
      await prisma.subscription.update({
        where: { stripeSubscriptionId: data.subscriptionId },
        data: {
          updatedAt: new Date(),
        },
      });

      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  /**
   * Get customer's subscriptions
   */
  static async getCustomerSubscriptions(customerId: string) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.latest_invoice', 'data.items.data.price'],
      });

      return subscriptions.data;
    } catch (error) {
      console.error('Error getting customer subscriptions:', error);
      throw new Error('Failed to get customer subscriptions');
    }
  }

  /**
   * Create discount coupon
   */
  static async createDiscountCoupon(
    percentOff: number,
    duration: 'once' | 'repeating' | 'forever',
    durationInMonths?: number,
    maxRedemptions?: number
  ) {
    try {
      const coupon = await stripe.coupons.create({
        percent_off: percentOff,
        duration,
        duration_in_months: durationInMonths,
        max_redemptions: maxRedemptions,
        metadata: {
          createdBy: 'retainflow-system',
        },
      });

      return coupon;
    } catch (error) {
      console.error('Error creating discount coupon:', error);
      throw new Error('Failed to create discount coupon');
    }
  }

  /**
   * Get invoice history
   */
  static async getInvoices(customerId: string, limit = 10) {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit,
        expand: ['data.payment_intent'],
      });

      return invoices.data;
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw new Error('Failed to get invoices');
    }
  }

  /**
   * Get upcoming invoice
   */
  static async getUpcomingInvoice(customerId: string) {
    try {
      const invoice = await stripe.invoices.retrieveUpcoming({
        customer: customerId,
      });

      return invoice;
    } catch (error) {
      console.error('Error getting upcoming invoice:', error);
      throw new Error('Failed to get upcoming invoice');
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string) {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      throw new Error('Invalid webhook signature');
    }
  }
}
