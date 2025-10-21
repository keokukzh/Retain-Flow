import { NextRequest, NextResponse } from 'next/server';
import { EditorService } from '@/services/editor.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const publicOnly = searchParams.get('public') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (publicOnly) {
      // Get public projects
      const projects = await EditorService.getPublicProjects(limit);
      return NextResponse.json({
        success: true,
        projects,
      });
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user projects
    const projects = await EditorService.getUserProjects(userId);

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    // console.error('Error getting editor projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
