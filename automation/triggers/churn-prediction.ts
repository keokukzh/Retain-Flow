import { addEmailJob } from '../queues/email-queue';
import { churnPredictionService } from '@/services/churn-prediction.service';
import { retentionService } from '@/services/retention.service';
import prisma from '@/lib/prisma';

export async function triggerChurnPrediction(userId: string): Promise<void> {
  try {
    // Calculate churn score
    const prediction = await churnPredictionService.calculateChurnScore(userId);

    // Only trigger for high-risk users
    if (prediction.riskLevel === 'high') {
      // Get user email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user) {
        console.error(`User ${userId} not found for churn prediction trigger`);
        return;
      }

      // Generate retention offer
      const offer = await retentionService.generateOffer(
        userId, 
        prediction.factors.join(', '), 
        prediction.score
      );

      // Queue churn prevention email
      await addEmailJob({
        to: user.email,
        subject: '⚠️ We noticed you might be leaving...',
        template: 'churn_prevention',
        data: {
          reason: prediction.factors.join(', '),
        },
      });

      console.log(`Churn prediction triggers queued for ${user.email} (score: ${prediction.score})`);
    }
  } catch (error) {
    console.error('Error triggering churn prediction automation:', error);
  }
}
