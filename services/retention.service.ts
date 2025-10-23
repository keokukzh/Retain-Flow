import prisma from '@/lib/prisma';
import { StripeService } from './stripe.service';

export interface RetentionOffer {
  id: string;
  userId: string;
  offerType: 'discount' | 'free_trial' | 'feature_upgrade';
  discountPercent?: number;
  discountCode?: string;
  description: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export class RetentionService {
  async generateOffer(
    userId: string, 
    churnReason: string,
    churnScore: number
  ): Promise<RetentionOffer> {
    try {
      // Determine offer type based on churn score and reason
      let offerType: 'discount' | 'free_trial' | 'feature_upgrade';
      let discountPercent: number | undefined;
      let description: string;

      if (churnScore < 0.3) {
        // High churn risk - offer significant discount
        offerType = 'discount';
        discountPercent = 50;
        description = '50% off your next 3 months - we want to keep you!';
      } else if (churnScore < 0.5) {
        // Medium churn risk - offer moderate discount
        offerType = 'discount';
        discountPercent = 30;
        description = '30% off your next month - let\'s work together!';
      } else {
        // Lower churn risk - offer feature upgrade
        offerType = 'feature_upgrade';
        description = 'Free upgrade to Pro features for 1 month';
      }

      // Generate unique discount code
      const discountCode = await this.generateDiscountCode();

      // Create retention offer
      const offer = await prisma.retentionOffer.create({
        data: {
          userId,
          reason: churnReason,
          discountPercent: discountPercent || 0,
          description,
          offerCode: discountCode,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      });

      // Create Stripe discount if applicable
      if (offerType === 'discount' && discountPercent) {
        await this.createStripeDiscount(userId, discountPercent, discountCode);
      }

      return {
        id: offer.id,
        userId: offer.userId || userId,
        offerType,
        discountPercent: offer.discountPercent || undefined,
        discountCode: offer.offerCode || discountCode || '',
        description: offer.description,
        expiresAt: offer.expiresAt,
        isUsed: false,
        createdAt: offer.createdAt,
      };
    } catch (error) {
      console.error('Error generating retention offer:', error);
      throw error;
    }
  }

  async getOffersForUser(userId: string): Promise<RetentionOffer[]> {
    try {
      const offers = await prisma.retentionOffer.findMany({
        where: {
          userId,
          expiresAt: {
            gt: new Date(), // Not expired
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return offers.map((offer: any) => ({
        id: offer.id,
        userId: offer.userId || userId,
        offerType: offer.discountPercent ? 'discount' : 'feature_upgrade',
        discountPercent: offer.discountPercent || undefined,
        discountCode: offer.offerCode || undefined,
        description: offer.description,
        expiresAt: offer.expiresAt,
        isUsed: false, // This would need to be tracked separately
        createdAt: offer.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching retention offers:', error);
      throw error;
    }
  }

  async applyOffer(offerId: string, userId: string): Promise<boolean> {
    try {
      const offer = await prisma.retentionOffer.findFirst({
        where: {
          id: offerId,
          userId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!offer) {
        return false;
      }

      // Apply the offer (this would integrate with Stripe)
      if (offer.discountPercent) {
        // Apply discount to user's subscription
        await this.applyDiscountToSubscription(userId, offer.discountPercent);
      } else {
        // Apply feature upgrade
        await this.applyFeatureUpgrade(userId);
      }

      // Mark offer as used
      await prisma.retentionOffer.update({
        where: { id: offerId },
        data: { used: true },
      });

      return true;
    } catch (error) {
      console.error('Error applying retention offer:', error);
      return false;
    }
  }

  private async generateDiscountCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RETAIN${result}`;
  }

  private async createStripeDiscount(
    userId: string, 
    discountPercent: number, 
    discountCode: string
  ): Promise<void> {
    try {
      // This would create a Stripe coupon and apply it to the customer
      // Implementation depends on your Stripe setup
      console.log(`Creating Stripe discount: ${discountPercent}% off for user ${userId} with code ${discountCode}`);
    } catch (error) {
      console.error('Error creating Stripe discount:', error);
    }
  }

  private async applyDiscountToSubscription(userId: string, discountPercent: number): Promise<void> {
    try {
      // Apply discount to user's active subscription
      console.log(`Applying ${discountPercent}% discount to user ${userId}'s subscription`);
    } catch (error) {
      console.error('Error applying discount to subscription:', error);
    }
  }

  private async applyFeatureUpgrade(userId: string): Promise<void> {
    try {
      // Upgrade user's plan temporarily
      console.log(`Applying feature upgrade for user ${userId}`);
    } catch (error) {
      console.error('Error applying feature upgrade:', error);
    }
  }
}

export const retentionService = new RetentionService();
