import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-edge';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
        botToken: !!process.env.DISCORD_BOT_TOKEN,
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

    return NextResponse.json({ integrations });
  } catch (error) {
    console.error('Integrations status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations status' },
      { status: 500 }
    );
  }
}
