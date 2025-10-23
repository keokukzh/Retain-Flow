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

    // Get Discord guilds for user
    const guilds = await prisma.discordGuild.findMany({
      where: { botEnabled: true },
      include: {
        members: {
          where: { userId },
          select: {
            discordId: true,
            username: true,
            roles: true,
            lastActiveAt: true,
            messageCount: true
          }
        }
      }
    });

    await prisma.$disconnect();

    return new Response(JSON.stringify({ guilds }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Discord guilds error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Discord guilds' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
