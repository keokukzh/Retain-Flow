import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Discord.js types for server-side only
interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
}

interface DiscordGuild {
  id: string;
  name: string;
  memberCount: number;
}

interface DiscordMember {
  user: DiscordUser;
  guild: DiscordGuild;
}

export class DiscordService {
  /**
   * Handle new member joining
   */
  static async handleNewMember(member: DiscordMember) {
    try {
      // Send welcome DM
      await this.sendWelcomeDM(member.user);

      // Sync member to database
      await this.syncMember(member.guild.id, member.user.id);

      console.log(`New member processed: ${member.user.username} in ${member.guild.name}`);
    } catch (error) {
      console.error('Error handling new member:', error);
    }
  }

  /**
   * Send welcome DM to new member
   */
  static async sendWelcomeDM(user: DiscordUser) {
    try {
      // In a real implementation, this would use Discord API
      console.log(`Sending welcome DM to ${user.username}`);
      
      // Mock welcome message
      const welcomeMessage = {
        title: '🎉 Welcome to RetainFlow!',
        description: 'Thanks for joining our community! We\'re here to help you retain your audience and grow your creator business.',
        color: 0x00ff00,
        timestamp: new Date().toISOString(),
      };

      // Log to database
      await prisma.emailLog.create({
        data: {
          to: `${user.username}#${user.discriminator}`,
          subject: 'Welcome to RetainFlow',
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      console.log(`Welcome DM sent to ${user.username}`);
    } catch (error) {
      console.error('Error sending welcome DM:', error);
    }
  }

  /**
   * Track member activity
   */
  static async trackActivity(userId: string, guildId: string | null) {
    if (!guildId) return;

    try {
      await prisma.discordMember.upsert({
        where: {
          userId_guildId: {
            userId,
            guildId,
          },
        },
        update: {
          lastActiveAt: new Date(),
          messageCount: {
            increment: 1,
          },
        },
        create: {
          userId,
          guildId,
          discordId: userId,
          username: `user_${userId}`,
          roles: [],
          lastActiveAt: new Date(),
          messageCount: 1,
        },
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  /**
   * Sync guild to database
   */
  static async syncGuild(guild: DiscordGuild) {
    try {
      await prisma.discordGuild.upsert({
        where: { guildId: guild.id },
        update: {
          name: guild.name,
          memberCount: guild.memberCount,
          updatedAt: new Date(),
        },
        create: {
          guildId: guild.id,
          name: guild.name,
          ownerId: 'unknown', // Would come from Discord API
          memberCount: guild.memberCount,
        },
      });

      console.log(`Synced guild: ${guild.name} (${guild.id})`);
    } catch (error) {
      console.error('Error syncing guild:', error);
    }
  }

  /**
   * Sync member to database
   */
  static async syncMember(guildId: string, userId: string) {
    try {
      await prisma.discordMember.upsert({
        where: {
          userId_guildId: {
            userId,
            guildId,
          },
        },
        update: {
          joinedAt: new Date(),
        },
        create: {
          userId,
          guildId,
          discordId: userId, // Using userId as discordId for now
          username: `user_${userId}`,
          roles: [],
          joinedAt: new Date(),
          messageCount: 0,
        },
      });

      console.log(`Synced member: ${userId} in guild ${guildId}`);
    } catch (error) {
      console.error('Error syncing member:', error);
    }
  }

  /**
   * Get guild statistics
   */
  static async getGuildStats(guildId: string) {
    try {
      const guild = await prisma.discordGuild.findUnique({
        where: { guildId },
        include: {
          members: {
            orderBy: { lastActiveAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!guild) {
        return null;
      }

      const totalMembers = await prisma.discordMember.count({
        where: { guildId },
      });

      const activeMembers = await prisma.discordMember.count({
        where: {
          guildId,
          lastActiveAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      });

      return {
        guild,
        totalMembers,
        activeMembers,
        activityRate: totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0,
      };
    } catch (error) {
      console.error('Error getting guild stats:', error);
      return null;
    }
  }

  /**
   * Get member activity data
   */
  static async getMemberActivity(userId: string, guildId: string) {
    try {
      const member = await prisma.discordMember.findUnique({
        where: {
          userId_guildId: {
            userId,
            guildId,
          },
        },
      });

      return member;
    } catch (error) {
      console.error('Error getting member activity:', error);
      return null;
    }
  }

  /**
   * Send retention message to member
   */
  static async sendRetentionMessage(userId: string, guildId: string, offerCode?: string) {
    try {
      console.log(`Sending retention message to ${userId} in guild ${guildId}`);
      
      // Mock retention message
      const retentionMessage = {
        title: '🎯 Special Retention Offer!',
        description: 'We noticed you haven\'t been active lately. Don\'t miss out on our exclusive creator tools!',
        offerCode: offerCode || 'RETENTION20',
        timestamp: new Date().toISOString(),
      };

      // Log to database
      await prisma.emailLog.create({
        data: {
          to: `discord_user_${userId}`,
          subject: 'Special Retention Offer',
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      console.log(`Retention message sent to ${userId}`);
    } catch (error) {
      console.error('Error sending retention message:', error);
    }
  }
}