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
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let orders = dbStore.getPayUOrders(current.user.id, current.workspace.id);
    for (const o of orders) {
      if (o.status === 'success' && (!o.invoiceId || !o.receiptId)) {
        dbStore.ensureInvoiceAndReceiptForOrder(o);
      }
    }

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status === status);
    }

    if (startDate) {
      const startMs = new Date(startDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() >= startMs);
    }

    if (endDate) {
      const endMs = new Date(endDate).getTime();
      orders = orders.filter((o) => new Date(o.createdAt).getTime() <= endMs);
    }

    if (search) {
      orders = orders.filter(
        (o) =>
          o.txnid.toLowerCase().includes(search) ||
          o.productInfo.toLowerCase().includes(search) ||
          (o.payuMihpayid && o.payuMihpayid.toLowerCase().includes(search)) ||
          (o.payuBankRefNum && o.payuBankRefNum.toLowerCase().includes(search))
      );
    }

    const totalCount = orders.length;
    const startIndex = (page - 1) * limit;
    const paginatedOrders = orders.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      transactions: paginatedOrders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list transactions' }, { status: 500 });
  }
}
