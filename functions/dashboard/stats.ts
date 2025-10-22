import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any }) {
  try {
    // Get token from cookie
    const cookieHeader = context.request.headers.get('cookie');
    if (!cookieHeader) {
      return json({ message: 'No authentication token found' }, 401);
    }

    const tokenMatch = cookieHeader.match(/rf_token=([^;]+)/);
    if (!tokenMatch) {
      return json({ message: 'No authentication token found' }, 401);
    }

    const token = tokenMatch[1];

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, context.env.JWT_SECRET) as any;
    } catch (error) {
      return json({ message: 'Invalid or expired token' }, 401);
    }

    // Initialize Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    try {
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
          },
          churnPredictions: {
            orderBy: { score: 'desc' },
            take: 10,
          },
        },
      });

      if (!user) {
        return json({ message: 'User not found' }, 404);
      }

      // Get integration statuses from KV
      const [discordData, stripeData, whopData, shopifyData] = await Promise.all([
        context.env.INTEGRATIONS_KV?.get('discord:connection'),
        context.env.INTEGRATIONS_KV?.get('stripe:connection'),
        context.env.INTEGRATIONS_KV?.get('whop:api_key'),
        context.env.INTEGRATIONS_KV?.get('shopify:connection'),
      ]);

      // Calculate stats
      const stats = {
        totalMembers: 1250, // Mock data - replace with actual Discord member count
        churnRate: 12.5, // Mock data - calculate from actual churn predictions
        retentionRate: 87.5, // Mock data - calculate from actual retention data
        activeCampaigns: 3, // Mock data - count active email campaigns
        revenue: 12500, // Mock data - calculate from subscription revenue
        growth: 15.2, // Mock data - calculate month-over-month growth
      };

      // Format churn predictions
      const formattedPredictions = user.churnPredictions.map((prediction: any) => ({
        userId: prediction.userId,
        riskScore: prediction.score,
        factors: prediction.factors as string[],
        lastActive: new Date().toISOString(), // Mock data - get from actual activity
      }));

      return json({
        stats,
        churnPredictions: formattedPredictions,
        integrations: {
          discord: { connected: !!discordData },
          stripe: { connected: !!stripeData },
          whop: { connected: !!whopData },
          shopify: { connected: !!shopifyData },
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return json({ message: 'Internal server error' }, 500);
  }
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
