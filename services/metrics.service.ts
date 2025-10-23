import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MetricsService {
  /**
   * Calculate churn rate for a user
   */
  static async calculateChurnRate(userId: string, period: 'month' | 'quarter' | 'year' = 'month'): Promise<number> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const totalSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    });

    const canceledSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        status: 'CANCELED',
        createdAt: { gte: startDate }
      }
    });

    return totalSubscriptions > 0 ? (canceledSubscriptions / totalSubscriptions) * 100 : 0;
  }

  /**
   * Calculate retention rate for a user
   */
  static async calculateRetentionRate(userId: string, period: 'month' | 'quarter' | 'year' = 'month'): Promise<number> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const activeSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        status: 'ACTIVE',
        createdAt: { gte: startDate }
      }
    });

    const totalSubscriptions = await prisma.subscription.count({
      where: {
        userId,
        createdAt: { gte: startDate }
      }
    });

    return totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions) * 100 : 0;
  }

  /**
   * Calculate growth rate
   */
  static async calculateGrowthRate(userId: string, period: 'month' | 'quarter' | 'year' = 'month'): Promise<number> {
    const now = new Date();
    let currentPeriodStart: Date;
    let previousPeriodStart: Date;
    let previousPeriodEnd: Date;

    switch (period) {
      case 'month':
        currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        previousPeriodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousPeriodEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        currentPeriodStart = new Date(now.getFullYear(), quarter * 3, 1);
        previousPeriodStart = new Date(now.getFullYear(), (quarter - 1) * 3, 1);
        previousPeriodEnd = new Date(now.getFullYear(), quarter * 3, 0);
        break;
      case 'year':
        currentPeriodStart = new Date(now.getFullYear(), 0, 1);
        previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
        previousPeriodEnd = new Date(now.getFullYear() - 1, 11, 31);
        break;
    }

    const currentPeriodUsers = await prisma.user.count({
      where: {
        createdAt: { gte: currentPeriodStart }
      }
    });

    const previousPeriodUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd
        }
      }
    });

    return previousPeriodUsers > 0 ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100 : 0;
  }

  /**
   * Calculate Lifetime Value (LTV)
   */
  static async calculateLTV(userId: string): Promise<number> {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      select: {
        plan: true,
        currentPeriodStart: true,
        currentPeriodEnd: true
      }
    });

    let totalRevenue = 0;
    const planPrices = {
      'FREE': 0,
      'PRO': 49,
      'GROWTH': 199,
      'ENTERPRISE': 499
    };

    for (const subscription of subscriptions) {
      const monthsActive = this.calculateMonthsBetween(
        subscription.currentPeriodStart,
        subscription.currentPeriodEnd
      );
      totalRevenue += (planPrices[subscription.plan] || 0) * monthsActive;
    }

    return totalRevenue;
  }

  /**
   * Get comprehensive dashboard metrics
   */
  static async getDashboardMetrics(userId: string) {
    const [
      churnRate,
      retentionRate,
      growthRate,
      ltv
    ] = await Promise.all([
      this.calculateChurnRate(userId),
      this.calculateRetentionRate(userId),
      this.calculateGrowthRate(userId),
      this.calculateLTV(userId)
    ]);

    return {
      churnRate: Math.round(churnRate * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
      growthRate: Math.round(growthRate * 100) / 100,
      ltv: Math.round(ltv * 100) / 100
    };
  }

  /**
   * Helper: Calculate months between two dates
   */
  private static calculateMonthsBetween(startDate: Date, endDate: Date): number {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return yearDiff * 12 + monthDiff + 1; // +1 to include both start and end months
  }
}
