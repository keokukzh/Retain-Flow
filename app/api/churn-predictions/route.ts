import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-edge';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json({ predictions: formattedPredictions });
  } catch (error) {
    console.error('Churn predictions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch churn predictions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId, score, factors, confidence } = body;

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

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error('Create churn prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to create churn prediction' },
      { status: 500 }
    );
  }
}
