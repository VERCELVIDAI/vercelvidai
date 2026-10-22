import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    let receipts = dbStore.getReceipts(current.user.id, current.workspace.id);

    if (search) {
      receipts = receipts.filter(
        (r) =>
          r.receiptNumber.toLowerCase().includes(search) ||
          r.txnid.toLowerCase().includes(search) ||
          (r.payuMihpayid && r.payuMihpayid.toLowerCase().includes(search)) ||
          r.customerName.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ receipts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list receipts' }, { status: 500 });
  }
}
