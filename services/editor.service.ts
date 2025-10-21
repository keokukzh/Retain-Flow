import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EditorProjectData {
  userId: string;
  name: string;
  html: string;
  css: string;
  thumbnail?: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface EditorProjectUpdate {
  name?: string;
  html?: string;
  css?: string;
  thumbnail?: string;
  isPublic?: boolean;
  tags?: string[];
}

export class EditorService {
  /**
   * Save editor content to database
   */
  static async saveEditorContent(data: EditorProjectData) {
    try {
      const project = await prisma.editorProject.create({
        data: {
          userId: data.userId,
          name: data.name,
          html: data.html,
          css: data.css,
          thumbnail: data.thumbnail,
          isPublic: data.isPublic || false,
          tags: data.tags || [],
        },
      });

      return project;
    } catch (error) {
      console.error('Error saving editor content:', error);
      throw new Error('Failed to save editor content');
    }
  }

  /**
   * Update existing editor project
   */
  static async updateEditorContent(projectId: string, data: EditorProjectUpdate) {
    try {
      const project = await prisma.editorProject.update({
        where: { id: projectId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return project;
    } catch (error) {
      console.error('Error updating editor content:', error);
      throw new Error('Failed to update editor content');
    }
  }

  /**
   * Get editor content by project ID
   */
  static async getEditorContent(projectId: string) {
    try {
      const project = await prisma.editorProject.findUnique({
        where: { id: projectId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      console.error('Error getting editor content:', error);
      throw new Error('Failed to get editor content');
    }
  }

  /**
   * Get all projects for a user
   */
  static async getUserProjects(userId: string) {
    try {
      const projects = await prisma.editorProject.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          thumbnail: true,
          isPublic: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return projects;
    } catch (error) {
      console.error('Error getting user projects:', error);
      throw new Error('Failed to get user projects');
    }
  }

  /**
   * Get public projects
   */
  static async getPublicProjects(limit = 20) {
    try {
      const projects = await prisma.editorProject.findMany({
        where: { isPublic: true },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          name: true,
          thumbnail: true,
          tags: true,
          createdAt: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      return projects;
    } catch (error) {
      console.error('Error getting public projects:', error);
      throw new Error('Failed to get public projects');
    }
  }

  /**
   * Delete editor project
   */
  static async deleteEditorProject(projectId: string, userId: string) {
    try {
      // Verify ownership
      const project = await prisma.editorProject.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        throw new Error('Project not found or access denied');
      }

      await prisma.editorProject.delete({
        where: { id: projectId },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting editor project:', error);
      throw new Error('Failed to delete editor project');
    }
  }

  /**
   * Convert HTML/CSS to JSX component
   */
  static exportToJSX(html: string, css: string, componentName = 'CustomComponent') {
    // Basic HTML to JSX conversion
    let jsx = html
      .replace(/class=/g, 'className=')
      .replace(/for=/g, 'htmlFor=')
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Create React component template
    const componentTemplate = `import React from 'react';

const ${componentName} = () => {
  return (
    <>
      <style jsx>{\`
        ${css}
      \`}</style>
      <div>
        ${jsx}
      </div>
    </>
  );
};

export default ${componentName};`;

    return componentTemplate;
  }

  /**
   * Generate thumbnail from HTML content
   */
  static generateThumbnail(html: string): string {
    // Simple thumbnail generation - in production, use a service like Puppeteer
    const preview = html
      .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[\s\S]*?<\/style>/gi, '') // Remove styles
      .substring(0, 200); // Truncate for preview

    return `data:text/html;base64,${Buffer.from(preview).toString('base64')}`;
  }
}
