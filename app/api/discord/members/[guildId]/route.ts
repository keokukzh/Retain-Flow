import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { guildId } = params;

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

    return NextResponse.json({ members: formattedMembers });
  } catch (error) {
    console.error('Discord members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Discord members' },
      { status: 500 }
    );
  }
}
