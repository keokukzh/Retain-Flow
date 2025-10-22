import { NextRequest, NextResponse } from 'next/server';
import { DiscordService } from '@/services/discord.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';

    // Get user's connected Discord account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true },
    });

    if (!user?.discordId) {
      return NextResponse.json({
        success: true,
        guilds: [],
        message: 'No Discord account connected',
      });
    }

    // Get guilds where the user is a member
    const guilds = await prisma.discordGuild.findMany({
      include: {
        members: {
          where: { userId: user.discordId },
          select: {
            joinedAt: true,
            lastActiveAt: true,
            messageCount: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      guilds: guilds.map(guild => ({
        id: guild.guildId,
        name: guild.name,
        memberCount: guild.memberCount,
        joinedAt: guild.members[0]?.joinedAt,
        lastActiveAt: guild.members[0]?.lastActiveAt,
        messageCount: guild.members[0]?.messageCount || 0,
      })),
    });
    } catch (error) {
      // console.error('Error getting Discord guilds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guildId, userId } = body;

    if (!guildId || !userId) {
      return NextResponse.json(
        { error: 'Missing guildId or userId' },
        { status: 400 }
      );
    }

    // Register new guild
    await DiscordService.syncGuild({
      id: guildId,
      name: 'New Guild', // This would come from Discord API
      memberCount: 0,
    } as any);

    return NextResponse.json({
      success: true,
      message: 'Guild registered successfully',
    });
    } catch (error) {
      // console.error('Error registering guild:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
