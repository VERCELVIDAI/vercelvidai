import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { verifyPaymentWithPayU, fulfillPayUPayment } from '@/lib/payments/payu';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { txnid } = await req.json();
    if (!txnid) {
      return NextResponse.json({ error: 'Missing transaction identifier (txnid).' }, { status: 400 });
    }

    const order = dbStore.getPayUOrderByTxnid(txnid);
    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Verify ownership
    const isOwner = order.userId === current.user.id;
    const isWorkspace = order.workspaceId === current.workspace.id;
    const isAdmin = current.user.role === 'admin';
    if (!isOwner && !isWorkspace && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Access denied to this order.' }, { status: 403 });
    }

    // If already fulfilled
    if (order.status === 'success') {
      const invoice = order.invoiceId ? dbStore.getInvoiceById(order.invoiceId) : undefined;
      const receipt = order.receiptId ? dbStore.getReceiptById(order.receiptId) : undefined;
      return NextResponse.json({
        verified: true,
        status: 'success',
        order,
        invoice,
        receipt,
      });
    }

    // If order was created or pending, recheck with official PayU API
    const payuCheck = await verifyPaymentWithPayU(txnid);

    if (payuCheck.verified && payuCheck.status === 'success') {
      const fulfillment = await fulfillPayUPayment({
        txnid,
        payuPayload: {
          mihpayid: payuCheck.mihpayid,
          bank_ref_num: payuCheck.bankRefNum,
          mode: payuCheck.paymentMode,
          status: 'success',
          amount: payuCheck.amount?.toString() || order.totalAmount.toString(),
        },
        skipHashCheckIfAlreadyVerified: true,
      });

      return NextResponse.json({
        verified: true,
        status: 'success',
        order: fulfillment.order,
        invoice: fulfillment.invoice,
        receipt: fulfillment.receipt,
      });
    } else if (payuCheck.status === 'pending') {
      dbStore.updatePayUOrder(order.id, { status: 'pending' });
      return NextResponse.json({
        verified: false,
        status: 'pending',
        order: dbStore.getPayUOrderById(order.id),
        message: 'Payment is currently pending confirmation from PayU.',
      });
    } else {
      return NextResponse.json({
        verified: false,
        status: order.status,
        order,
        message: payuCheck.message || 'Payment has not been confirmed yet.',
      });
    }
  } catch (err: any) {
    console.error('Error in PayU verification endpoint:', err);
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 500 });
  }
}
