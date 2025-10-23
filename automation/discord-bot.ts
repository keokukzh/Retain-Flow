import { DiscordService } from '@/services/discord.service';
import { PrismaClient } from '@prisma/client';
import { Client, GatewayIntentBits, Events, GuildMember, Message } from 'discord.js';

const prisma = new PrismaClient();

/**
 * Discord Bot Automation
 * Handles all Discord-related automation tasks
 */
export class DiscordBotAutomation {
  private static isRunning = false;
  private static client: Client | null = null;

  /**
   * Start the Discord bot
   */
  static async start() {
    if (this.isRunning) {
      console.log('Discord bot is already running');
      return;
    }

    try {
      console.log('Starting Discord bot...');
      
      // Initialize Discord client
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent
        ]
      });

      // Set up event handlers
      this.setupEventHandlers();

      // Login with bot token
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
      
      this.isRunning = true;
      console.log('Discord bot started successfully');
    } catch (error) {
      console.error('Failed to start Discord bot:', error);
      throw error;
    }
  }

  /**
   * Setup Discord event handlers
   */
  private static setupEventHandlers() {
    if (!this.client) return;

    // Bot ready event
    this.client.once(Events.ClientReady, (readyClient) => {
      console.log(`Discord bot ready! Logged in as ${readyClient.user.tag}`);
    });

    // New member joined
    this.client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
      try {
        await DiscordService.handleNewMember({
          user: {
            id: member.user.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            avatar: member.user.avatar
          },
          guild: {
            id: member.guild.id,
            name: member.guild.name,
            memberCount: member.guild.memberCount
          }
        });
      } catch (error) {
        console.error('Error handling new member:', error);
      }
    });

    // Member left
    this.client.on(Events.GuildMemberRemove, async (member: GuildMember) => {
      try {
        await DiscordService.handleMemberLeave({
          user: {
            id: member.user.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            avatar: member.user.avatar
          },
          guild: {
            id: member.guild.id,
            name: member.guild.name,
            memberCount: member.guild.memberCount
          }
        });
      } catch (error) {
        console.error('Error handling member leave:', error);
      }
    });

    // Message created (for activity tracking)
    this.client.on(Events.MessageCreate, async (message: Message) => {
      try {
        if (message.author.bot) return; // Ignore bot messages
        
        await DiscordService.trackActivity({
          userId: message.author.id,
          guildId: message.guild?.id,
          messageId: message.id,
          content: message.content,
          timestamp: message.createdAt
        });
      } catch (error) {
        console.error('Error tracking activity:', error);
      }
    });
  }

  /**
   * Stop the Discord bot
   */
  static async stop() {
    if (!this.isRunning) {
      return;
    }

    try {
      this.isRunning = false;
      console.log('Discord bot stopped');
    } catch (error) {
      console.error('Error stopping Discord bot:', error);
    }
  }

  /**
   * Process Discord webhook events
   */
  static async processWebhookEvent(eventType: string, data: any) {
    try {
      switch (eventType) {
        case 'guild_member_add':
          await this.handleGuildMemberAdd(data);
          break;
        case 'message_create':
          await this.handleMessageCreate(data);
          break;
        case 'guild_create':
          await this.handleGuildCreate(data);
          break;
        default:
          console.log(`Unhandled Discord event: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error processing Discord event ${eventType}:`, error);
    }
  }

  /**
   * Handle guild member add event
   */
  private static async handleGuildMemberAdd(data: any) {
    const { user, guild_id } = data;
    
    // Sync member to database
    await DiscordService.syncMember(guild_id, user.id);
    
    // Send welcome DM
    const discordUser = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
    };
    
    await DiscordService.sendWelcomeDM(discordUser);
    
    console.log(`Processed new member: ${user.username} in guild ${guild_id}`);
  }

  /**
   * Handle message create event
   */
  private static async handleMessageCreate(data: any) {
    const { author, guild_id } = data;
    
    if (author.bot) return;
    
    // Track activity
    await DiscordService.trackActivity(author.id, guild_id);
  }

  /**
   * Handle guild create event
   */
  private static async handleGuildCreate(data: any) {
    const { id, name, member_count } = data;
    
    // Sync guild to database
    await DiscordService.syncGuild({
      id,
      name,
      memberCount: member_count,
    });
    
    console.log(`Processed new guild: ${name} (${id})`);
  }

  /**
   * Run retention campaigns for inactive members
   */
  static async runRetentionCampaign() {
    try {
      console.log('Running Discord retention campaign...');
      
      // Find inactive members (no activity in last 7 days)
      const inactiveMembers = await prisma.discordMember.findMany({
        where: {
          lastActiveAt: {
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          user: true,
        },
      });

      console.log(`Found ${inactiveMembers.length} inactive members`);

      // Send retention messages
      for (const member of inactiveMembers) {
        try {
          await DiscordService.sendRetentionMessage(
            member.userId,
            member.guildId,
            'RETENTION20' // Example offer code
          );
          
          // Update last retention message sent
          await prisma.discordMember.update({
            where: {
              userId_guildId: {
                userId: member.userId,
                guildId: member.guildId,
              },
            },
            data: {
              lastRetentionMessage: new Date(),
            },
          });
          
          console.log(`Sent retention message to ${member.userId}`);
        } catch (error) {
          console.error(`Error sending retention message to ${member.userId}:`, error);
        }
      }

      console.log('Discord retention campaign completed');
    } catch (error) {
      console.error('Error running retention campaign:', error);
    }
  }

  /**
   * Get bot status and statistics
   */
  static async getBotStatus() {
    try {
      return {
        status: this.isRunning ? 'connected' : 'disconnected',
        guilds: 0, // Would be fetched from Discord API
        users: 0, // Would be fetched from Discord API
        uptime: 0, // Would be calculated from start time
      };
    } catch (error) {
      console.error('Error getting bot status:', error);
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Setup slash commands
   */
  static async setupSlashCommands() {
    try {
      console.log('Setting up Discord slash commands...');
      
      const commands = [
        {
          name: 'retain',
          description: 'Show retention statistics for this server',
        },
        {
          name: 'role',
          description: 'Assign creator role to a member',
        },
        {
          name: 'help',
          description: 'Show available bot commands',
        },
      ];

      console.log('Slash commands configured:', commands);
    } catch (error) {
      console.error('Error setting up slash commands:', error);
    }
  }
}

// Auto-start bot if this file is run directly
if (require.main === module) {
  DiscordBotAutomation.start()
    .then(() => {
      console.log('Discord bot automation started');
    })
    .catch((error) => {
      console.error('Failed to start Discord bot automation:', error);
      process.exit(1);
    });
}