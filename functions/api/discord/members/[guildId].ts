import { PrismaClient } from '@prisma/client';

export async function onRequestGet(context: { request: Request; env: any; params: { guildId: string } }) {
  try {
    const userId = context.request.headers.get('x-user-id');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { guildId } = context.params;

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: context.env.DATABASE_URL,
        },
      },
    });

    // Get guild members
    const members = await prisma.discordMember.findMany({
      where: { guildId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { lastActiveAt: 'desc' }
    });

    // Format members for frontend
    const formattedMembers = members.map(member => ({
      id: member.id,
      discordId: member.discordId,
      username: member.username,
      roles: member.roles,
      lastActiveAt: member.lastActiveAt,
      messageCount: member.messageCount,
      joinedAt: member.joinedAt,
      user: member.user
    }));

    await prisma.$disconnect();

    return new Response(JSON.stringify({ members: formattedMembers }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Discord members error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch Discord members' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
