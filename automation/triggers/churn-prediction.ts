import { addEmailJob } from '../queues/email-queue';
import { churnPredictionService } from '@/services/churn-prediction.service';
import { retentionService } from '@/services/retention.service';
import { N8nService } from '@/services/n8n.service';
import { PostHogService } from '@/services/posthog.service';
import { ChatwootService } from '@/services/chatwoot.service';
import { ComposioService } from '@/services/composio.service';
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

      // Track churn prediction with PostHog
      await PostHogService.trackChurnPrediction(userId, prediction.score, prediction.riskLevel);

      // Trigger n8n alert workflow
      await N8nService.triggerWorkflow({
        workflowId: 'churn-prediction-alert',
        data: {
          userId,
          email: user.email,
          churnScore: prediction.score,
          riskLevel: prediction.riskLevel,
          factors: prediction.factors,
          offerCode: offer.discountCode,
        },
      });

      // Create Chatwoot conversation for proactive support
      await ChatwootService.createConversation(
        userId,
        `High churn risk detected for user ${user.email}. Score: ${prediction.score}, Risk: ${prediction.riskLevel}. Factors: ${prediction.factors.join(', ')}`,
        'urgent'
      );

      // Send multi-channel notifications via Composio
      try {
        // Slack notification
        await ComposioService.executeAction(
          userId,
          'slack',
          'send_message',
          {
            channel: '#churn-alerts',
            text: `🚨 High Churn Risk Alert\nUser: ${user.email}\nScore: ${prediction.score}\nRisk Level: ${prediction.riskLevel}\nFactors: ${prediction.factors.join(', ')}`,
          }
        );

        // Notion database update
        await ComposioService.executeAction(
          userId,
          'notion',
          'create_page',
          {
            parent: { database_id: process.env.NOTION_CHURN_DATABASE_ID },
            properties: {
              'User Email': { title: [{ text: { content: user.email } }] },
              'Churn Score': { number: prediction.score },
              'Risk Level': { select: { name: prediction.riskLevel } },
              'Factors': { rich_text: [{ text: { content: prediction.factors.join(', ') } }] },
              'Date': { date: { start: new Date().toISOString() } },
            },
          }
        );
      } catch (error) {
        console.log('Multi-channel notifications failed (Composio not connected):', error);
      }

      console.log(`Churn prediction triggers queued for ${user.email} (score: ${prediction.score})`);
    }
  } catch (error) {
    console.error('Error triggering churn prediction automation:', error);
  }
}
