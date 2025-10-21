import { NextRequest, NextResponse } from 'next/server';
import { EditorService } from '@/services/editor.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, html, css, thumbnail, isPublic, tags } = body;

    // Validate required fields
    if (!userId || !name || !html || !css) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, html, css' },
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

    // Generate thumbnail if not provided
    const projectThumbnail = thumbnail || EditorService.generateThumbnail(html);

    // Save editor content
    const project = await EditorService.saveEditorContent({
      userId,
      name,
      html,
      css,
      thumbnail: projectThumbnail,
      isPublic: isPublic || false,
      tags: tags || [],
    });

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        thumbnail: project.thumbnail,
        isPublic: project.isPublic,
        tags: project.tags,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    // console.error('Error saving editor content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, name, html, css, thumbnail, isPublic, tags } = body;

    // Validate required fields
    if (!projectId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, userId' },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingProject = await prisma.editorProject.findFirst({
      where: { id: projectId, userId },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Update editor content
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (html !== undefined) updateData.html = html;
    if (css !== undefined) updateData.css = css;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (tags !== undefined) updateData.tags = tags;

    const project = await EditorService.updateEditorContent(projectId, updateData);

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.name,
        thumbnail: project.thumbnail,
        isPublic: project.isPublic,
        tags: project.tags,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    // console.error('Error updating editor content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
