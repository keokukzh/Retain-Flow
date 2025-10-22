import { NextRequest, NextResponse } from 'next/server';
import { DiscordService } from '@/services/discord.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guildId = searchParams.get('guildId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!guildId) {
      return NextResponse.json(
        { error: 'Missing guildId parameter' },
        { status: 400 }
      );
    }

    // Get guild statistics
    const stats = await DiscordService.getGuildStats(guildId);
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Guild not found' },
        { status: 404 }
      );
    }

    // Get members with activity data
    const members = await prisma.discordMember.findMany({
      where: { guildId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            discordId: true,
          },
        },
      },
      orderBy: { lastActiveAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      success: true,
      guild: stats.guild,
      stats: {
        totalMembers: stats.totalMembers,
        activeMembers: stats.activeMembers,
        activityRate: stats.activityRate,
      },
      members: members.map(member => ({
        userId: member.userId,
        email: member.user.email,
        discordId: member.user.discordId,
        joinedAt: member.joinedAt,
        lastActiveAt: member.lastActiveAt,
        messageCount: member.messageCount,
        lastRetentionMessage: member.lastRetentionMessage,
      })),
      pagination: {
        limit,
        offset,
        total: stats.totalMembers,
      },
    });
  } catch (error) {
    // console.error('Error getting Discord members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
