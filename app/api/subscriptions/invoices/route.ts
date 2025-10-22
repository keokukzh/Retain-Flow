import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/services/stripe.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json({
        success: true,
        invoices: [],
      });
    }

    // Get invoices from Stripe
    const invoices = await StripeService.getInvoices(user.stripeCustomerId, limit);

    return NextResponse.json({
      success: true,
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        amount: invoice.amount_due || 0,
        status: invoice.status,
        created: invoice.created,
        invoicePdf: invoice.invoice_pdf || undefined,
        hostedInvoiceUrl: invoice.hosted_invoice_url || undefined,
      })),
    });
  } catch (error) {
    // console.error('Error getting invoices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
