import { addEmailJob } from '../queues/email-queue';
import { retentionService } from '@/services/retention.service';

export async function triggerSubscriptionCancelled(
  userId: string, 
  email: string, 
  reason: string
): Promise<void> {
  try {
    // Generate retention offer
    const offer = await retentionService.generateOffer(userId, reason, 0.3); // Medium churn risk

    // Queue retention email with offer
    await addEmailJob({
      to: email,
      subject: `🎁 Special Offer: ${offer.discountPercent}% Off Your Next Month!`,
      template: 'retention',
      data: {
        offerCode: offer.discountCode,
        discount: offer.discountPercent,
      },
    });

    console.log(`Subscription cancellation triggers queued for ${email} with offer ${offer.discountCode}`);
  } catch (error) {
    console.error('Error triggering subscription cancellation automation:', error);
  }
}
