import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const order =
      dbStore.getPayUOrderById(params.id) ||
      dbStore.getPayUOrderByTxnid(params.id);

    if (!order) {
      return NextResponse.json({ error: 'Transaction order not found' }, { status: 404 });
    }

    const isOwner = order.userId === current.user.id;
    const isWorkspace = order.workspaceId === current.workspace.id;
    const isAdmin = current.user.role === 'admin';

    if (!isOwner && !isWorkspace && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this transaction' }, { status: 403 });
    }

    const invoice = order.invoiceId ? dbStore.getInvoiceById(order.invoiceId) : undefined;
    const receipt = order.receiptId ? dbStore.getReceiptById(order.receiptId) : undefined;

    return NextResponse.json({
      order,
      invoice,
      receipt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch transaction' }, { status: 500 });
  }
}
