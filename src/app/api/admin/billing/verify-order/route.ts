import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { verifyPaymentWithPayU, fulfillPayUPayment } from '@/lib/payments/payu';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { txnid } = await req.json();
    if (!txnid) {
      return NextResponse.json({ error: 'txnid is required' }, { status: 400 });
    }

    const order = dbStore.getPayUOrderByTxnid(txnid);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const payuCheck = await verifyPaymentWithPayU(txnid);

    let fulfillment = null;
    if (payuCheck.verified && payuCheck.status === 'success' && order.status !== 'success') {
      fulfillment = await fulfillPayUPayment({
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

      dbStore.logAudit(current.user.id, 'ADMIN_RECONCILE_PAYU_ORDER', 'payment_order', order.id, {
        txnid,
        previousStatus: order.status,
        newStatus: 'success',
      });
    }

    return NextResponse.json({
      success: true,
      order: dbStore.getPayUOrderByTxnid(txnid),
      payuCheck,
      fulfillment,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to verify order' }, { status: 500 });
  }
}
