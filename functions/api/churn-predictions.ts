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

    // Get churn predictions with user data
    const predictions = await prisma.churnPrediction.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      take: 10, // Top 10 highest risk users
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            subscriptions: {
              where: { status: 'ACTIVE' },
              select: {
                plan: true,
                currentPeriodEnd: true
              }
            }
          }
        }
      }
    });

    // Format predictions for frontend
    const formattedPredictions = predictions.map(prediction => ({
      userId: prediction.user.id,
      userName: prediction.user.name || 'Unknown',
      userEmail: prediction.user.email,
      riskScore: Math.round(prediction.score * 100) / 100,
      confidence: Math.round(prediction.confidence * 100) / 100,
      factors: prediction.factors,
      lastActive: prediction.user.createdAt,
      subscription: prediction.user.subscriptions[0] || null,
      modelVersion: prediction.modelVersion,
      predictedAt: prediction.predictedAt
    }));

    await prisma.$disconnect();

    return new Response(JSON.stringify({ predictions: formattedPredictions }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Churn predictions error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch churn predictions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const userId = context.request.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await context.request.json();
    const { targetUserId, score, factors, confidence } = body;

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    // Create new churn prediction
    const prediction = await prisma.churnPrediction.create({
      data: {
        userId: targetUserId,
        score,
        factors,
        confidence,
        modelVersion: 'v1.0'
      }
    });

    await prisma.$disconnect();

    return new Response(JSON.stringify({ prediction }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create churn prediction error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create churn prediction' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
