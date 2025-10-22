import prisma from '@/lib/prisma';
import { ChurnPrediction } from '@prisma/client';

export interface ChurnPredictionData {
  userId: string;
  score: number; // 0-1, where 1 is highest churn risk
  factors: string[]; // Detailed breakdown of risk factors
  riskLevel: 'low' | 'medium' | 'high';
  lastActiveAt: Date;
  messageCount: number;
  subscriptionAttempts: number;
  emailOpenRate: number;
}

export class ChurnPredictionService {
  async calculateChurnScore(userId: string): Promise<ChurnPredictionData> {
    try {
      // Mock data for churn factors - replace with actual data fetching
      const lastActiveAt = new Date(); // User's last activity timestamp
      const messageCount = Math.floor(Math.random() * 100); // Messages in last 30 days
      const subscriptionAttempts = Math.floor(Math.random() * 3); // Number of times tried to cancel
      const emailOpenRate = Math.random(); // User's email open rate

      // Simple linear model for churn score (0-1)
      let score = 0.5; // Base score

      // Factor 1: Last active date (more recent activity = lower churn risk)
      const daysSinceLastActive = (Date.now() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24);
      score -= Math.min(daysSinceLastActive / 30, 1) * 0.2; // Max 20% impact over 30 days

      // Factor 2: Message count (higher engagement = lower churn risk)
      score -= Math.min(messageCount / 50, 1) * 0.3; // Max 30% impact for 50+ messages

      // Factor 3: Subscription cancel attempts (more attempts = higher churn risk)
      score += Math.min(subscriptionAttempts / 3, 1) * 0.2; // Max 20% impact for 3+ attempts

      // Factor 4: Email open rate (higher open rate = lower churn risk)
      score -= emailOpenRate * 0.1; // Max 10% impact

      score = Math.max(0, Math.min(1, score)); // Clamp score between 0 and 1

      const riskLevel: 'low' | 'medium' | 'high' =
        score <= 0.3 ? 'high' : score <= 0.6 ? 'medium' : 'low';

      const factors = [
        `Days since last active: ${daysSinceLastActive.toFixed(1)}`,
        `Message count (30 days): ${messageCount}`,
        `Subscription cancel attempts: ${subscriptionAttempts}`,
        `Email open rate: ${(emailOpenRate * 100).toFixed(1)}%`,
      ];

      const predictionData: ChurnPredictionData = {
        userId,
        score,
        factors,
        riskLevel,
        lastActiveAt,
        messageCount,
        subscriptionAttempts,
        emailOpenRate,
      };

      // Only save to database if DATABASE_URL is available
      if (process.env.DATABASE_URL) {
        try {
          // Save prediction to database
          const existingPrediction = await prisma.churnPrediction.findFirst({
            where: { userId },
          });

          if (existingPrediction) {
            await prisma.churnPrediction.update({
              where: { id: existingPrediction.id },
              data: {
                score,
                factors,
                confidence: 0.8, // Mock confidence
              },
            });
          } else {
            await prisma.churnPrediction.create({
              data: {
                userId,
                score,
                factors,
                confidence: 0.8, // Mock confidence
              },
            });
          }
        } catch (dbError) {
          console.warn('Database not available, using mock data only');
        }
      }

      return predictionData;
    } catch (error) {
      console.error('Error calculating churn score:', error);
      throw error;
    }
  }

  async getChurnPredictions(limit: number = 100): Promise<ChurnPredictionData[]> {
    try {
      // Return mock data if no database connection
      if (!process.env.DATABASE_URL) {
        return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
          userId: `demo-user-${i + 1}`,
          score: Math.random(),
          factors: [`Mock factor ${i + 1}`],
          riskLevel: Math.random() > 0.5 ? 'high' : 'medium' as const,
          lastActiveAt: new Date(),
          messageCount: Math.floor(Math.random() * 100),
          subscriptionAttempts: Math.floor(Math.random() * 3),
          emailOpenRate: Math.random(),
        }));
      }

      const predictions = await prisma.churnPrediction.findMany({
        where: {
          score: {
            lte: 0.3, // High churn risk (low scores)
          },
        },
        orderBy: {
          score: 'asc', // Lowest scores first (highest churn risk)
        },
        take: limit,
      });

      return predictions.map(p => ({
        userId: p.userId,
        score: p.score,
        factors: p.factors as string[],
        riskLevel: p.score <= 0.3 ? 'high' as const : p.score <= 0.6 ? 'medium' as const : 'low' as const,
        lastActiveAt: new Date(), // Mock data
        messageCount: 0, // Mock data
        subscriptionAttempts: 0, // Mock data
        emailOpenRate: 0.5, // Mock data
      }));
    } catch (error) {
      console.error('Error fetching churn predictions:', error);
      throw error;
    }
  }
}

export const churnPredictionService = new ChurnPredictionService();