import { NextResponse } from 'next/server';
import { DiscordBotAutomation } from '@/automation/discord-bot';

export async function POST() {
  try {
    // Run retention campaign
    await DiscordBotAutomation.runRetentionCampaign();

    return NextResponse.json({
      success: true,
      message: 'Retention campaign started successfully',
    });
    } catch (error) {
      // console.error('Error running retention campaign:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
