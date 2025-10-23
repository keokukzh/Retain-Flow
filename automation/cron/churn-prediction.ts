import { churnPredictionService } from '@/services/churn-prediction.service';
import { triggerChurnPrediction } from '../triggers/churn-prediction';
import prisma from '@/lib/prisma';

export async function runChurnPredictionCron(): Promise<void> {
  try {
    console.log('Starting daily churn prediction cron job...');

    // Get all active users
    const users = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'ACTIVE',
          },
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    console.log(`Processing ${users.length} users for churn prediction`);

    // Process users in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (user: any) => {
          try {
            await triggerChurnPrediction(user.id);
          } catch (error) {
            console.error(`Error processing churn prediction for user ${user.id}:`, error);
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('Daily churn prediction cron job completed');
  } catch (error) {
    console.error('Error in churn prediction cron job:', error);
  }
}
