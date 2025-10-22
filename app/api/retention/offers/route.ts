import { NextRequest, NextResponse } from 'next/server';
import { retentionService } from '@/services/retention.service';

export async function GET() {
  try {
    // TODO: Get userId from authentication
    const userId = 'demo-user-id'; // Replace with actual user ID from auth

    const offers = await retentionService.getOffersForUser(userId);

    return NextResponse.json({
      success: true,
      offers,
    });
  } catch (error) {
    // console.error('Error fetching retention offers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { offerId, userId } = await request.json();

    const success = await retentionService.applyOffer(offerId, userId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Offer applied successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to apply offer' },
        { status: 400 }
      );
    }
  } catch (error) {
    // console.error('Error applying retention offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to apply offer' },
      { status: 500 }
    );
  }
}
