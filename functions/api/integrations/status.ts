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

    // Get user data to check integrations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        discordId: true,
        stripeCustomerId: true,
        whopId: true,
        shopifyId: true
      }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check Discord integration
    const discordConnected = !!user.discordId;
    const discordGuilds = await prisma.discordGuild.count({
      where: { botEnabled: true }
    });

    // Check Stripe integration
    const stripeConnected = !!user.stripeCustomerId;
    const stripeSubscriptions = await prisma.subscription.count({
      where: { userId, status: 'ACTIVE' }
    });

    // Check Whop integration
    const whopConnected = !!user.whopId;

    // Check Shopify integration
    const shopifyConnected = !!user.shopifyId;

    const integrations = {
      discord: {
        connected: discordConnected,
        guilds: discordGuilds,
        botToken: !!context.env.DISCORD_BOT_TOKEN,
        status: discordConnected ? 'active' : 'disconnected'
      },
      stripe: {
        connected: stripeConnected,
        subscriptions: stripeSubscriptions,
        status: stripeConnected ? 'active' : 'disconnected'
      },
      whop: {
        connected: whopConnected,
        status: whopConnected ? 'active' : 'disconnected'
      },
      shopify: {
        connected: shopifyConnected,
        status: shopifyConnected ? 'active' : 'disconnected'
      }
    };

    await prisma.$disconnect();

    return new Response(JSON.stringify({ integrations }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Integrations status error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch integrations status' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
