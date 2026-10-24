import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user, workspace } = current;
    const { subscription, plan } = dbStore.getUserSubscription(user.id);
    const credits = dbStore.getCreditAccount(user.id);
    const ledger = dbStore.getCreditLedger(user.id);

    // Calculate purchased and spent credits from ledger
    const purchasedCredits = ledger
      .filter((l) => l.transactionType === 'purchase' || l.transactionType === 'subscription_grant')
      .reduce((sum, l) => sum + Math.abs(l.amount), 0);

    const creditsUsed = ledger
      .filter((l) => l.transactionType === 'generation_settle')
      .reduce((sum, l) => sum + Math.abs(l.amount), 0);

    const orders = dbStore.getPayUOrders(user.id, workspace.id);
    for (const o of orders) {
      if (o.status === 'success' && (!o.invoiceId || !o.receiptId)) {
        dbStore.ensureInvoiceAndReceiptForOrder(o);
      }
    }
    const successfulOrders = orders.filter((o) => o.status === 'success');
    const totalSpentInr = successfulOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const latestInvoices = dbStore.getInvoices(user.id, workspace.id).slice(0, 5);
    const latestReceipts = dbStore.getReceipts(user.id, workspace.id).slice(0, 5);
    const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'created').length;

    return NextResponse.json({
      subscription,
      plan,
      availableCredits: credits.availableBalance,
      reservedCredits: credits.reservedBalance,
      purchasedCredits,
      creditsUsed,
      totalSuccessfulPayments: successfulOrders.length,
      totalSpentInr: Math.round(totalSpentInr * 100) / 100,
      recentTransactions: orders.slice(0, 5),
      pendingOrdersCount,
      latestInvoices,
      latestReceipts,
    });
  } catch (err: any) {
    console.error('Error fetching billing overview:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch billing overview' }, { status: 500 });
  }
}
