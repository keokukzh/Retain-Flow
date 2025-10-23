import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    const userId = context.request.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    // Get user's subscriptions
    const userSubscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate metrics
    const totalMembers = await prisma.user.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    });
    const canceledSubscriptions = await prisma.subscription.count({
      where: { status: 'CANCELED' }
    });
    const activeCampaigns = await prisma.emailCampaign.count({
      where: { status: 'SENDING' }
    });

    // Calculate churn rate
    const totalSubscriptions = activeSubscriptions + canceledSubscriptions;
    const churnRate = totalSubscriptions > 0 ? (canceledSubscriptions / totalSubscriptions) * 100 : 0;
    
    // Calculate retention rate
    const retentionRate = totalSubscriptions > 0 ? (activeSubscriptions / totalSubscriptions) * 100 : 0;

    // Calculate revenue (simplified - in real app would sum from Stripe)
    const revenue = userSubscriptions
      .filter(sub => sub.status === 'ACTIVE')
      .reduce((sum, sub) => {
        // Mock revenue calculation based on plan
        const planRevenue = {
          'FREE': 0,
          'PRO': 49,
          'GROWTH': 199,
          'ENTERPRISE': 499
        };
        return sum + (planRevenue[sub.plan] || 0);
      }, 0);

    // Calculate growth rate (simplified)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const newUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });
    
    const totalUsers = await prisma.user.count();
    const growth = totalUsers > 0 ? (newUsersLastMonth / totalUsers) * 100 : 0;

    const stats = {
      totalMembers,
      churnRate: Math.round(churnRate * 100) / 100,
      retentionRate: Math.round(retentionRate * 100) / 100,
      activeCampaigns,
      revenue,
      growth: Math.round(growth * 100) / 100,
      activeSubscriptions,
      canceledSubscriptions
    };

    await prisma.$disconnect();

    return new Response(JSON.stringify({ stats }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch dashboard stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
