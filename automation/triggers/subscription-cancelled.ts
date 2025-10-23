import { addEmailJob } from '../queues/email-queue';
import { retentionService } from '@/services/retention.service';
import { N8nService } from '@/services/n8n.service';
import { PostHogService } from '@/services/posthog.service';
import { ChatwootService } from '@/services/chatwoot.service';
import { ComposioService } from '@/services/composio.service';

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

    // Track cancellation event with PostHog
    await PostHogService.trackSubscriptionCancelled(userId, 'pro', reason);

    // Trigger n8n workflow for cross-platform sync
    await N8nService.triggerWorkflow({
      workflowId: 'subscription-cancelled',
      data: {
        userId,
        email,
        reason,
        offerCode: offer.discountCode,
        discountPercent: offer.discountPercent,
      },
    });

    // Create Chatwoot conversation for support follow-up
    await ChatwootService.createConversation(
      userId,
      `User ${email} cancelled subscription. Reason: ${reason}. Offer sent: ${offer.discountCode}`,
      'high'
    );

    // Send Slack notification via Composio (if connected)
    try {
      await ComposioService.executeAction(
        userId,
        'slack',
        'send_message',
        {
          channel: '#alerts',
          text: `🚨 Subscription Cancelled\nUser: ${email}\nReason: ${reason}\nOffer: ${offer.discountPercent}% off (${offer.discountCode})`,
        }
      );
    } catch (error) {
      console.log('Slack notification failed (Composio not connected):', error);
    }

    console.log(`Subscription cancellation triggers queued for ${email} with offer ${offer.discountCode}`);
  } catch (error) {
    console.error('Error triggering subscription cancellation automation:', error);
  }
}
