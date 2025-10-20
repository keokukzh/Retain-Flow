import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get dashboard stats
    const [
      totalMembers,
      activeSubscriptions,
      churnPredictions,
    ] = await Promise.all([
      // Mock data for now - replace with actual queries
      Promise.resolve(1250),
      prisma.subscription.count({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
      }),
      prisma.churnPrediction.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          score: 'desc',
        },
        take: 10,
      }),
    ]);

    // Calculate mock stats
    const stats = {
      totalMembers,
      activeSubscriptions, // Use the actual subscription count
      churnRate: 12.5, // Mock data
      retentionRate: 87.5, // Mock data
      activeCampaigns: 3, // Mock data
      revenue: 12500, // Mock data
      growth: 15.2, // Mock data
    };

    // Format churn predictions
    const formattedPredictions = churnPredictions.map((prediction: any) => ({
      userId: prediction.userId,
      riskScore: prediction.score,
      factors: prediction.factors as string[],
      lastActive: new Date().toISOString(), // Mock data
    }));

    return NextResponse.json({
      stats,
      churnPredictions: formattedPredictions,
    });

  } catch (error) {
    // console.error('Dashboard stats error:', error); // TODO: Add proper logging
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
