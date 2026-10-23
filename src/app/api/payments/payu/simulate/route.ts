import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { fulfillPayUPayment } from '@/lib/payments/payu';

export const dynamic = 'force-dynamic';

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

    // Ownership check
    if (order.userId !== current.user.id && current.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If already fulfilled
    if (order.status === 'success') {
      const invoice = order.invoiceId ? dbStore.getInvoiceById(order.invoiceId) : undefined;
      const receipt = order.receiptId ? dbStore.getReceiptById(order.receiptId) : undefined;
      return NextResponse.json({
        success: true,
        order,
        invoice,
        receipt,
      });
    }

    const mihpayid = `sim_mih_${Date.now()}`;
    const bankRefNum = `SIM_BNK_${Date.now()}`;

    const fulfillment = await fulfillPayUPayment({
      txnid,
      payuPayload: {
        mihpayid,
        bank_ref_num: bankRefNum,
        mode: 'UPI / Simulation',
        status: 'success',
        amount: order.totalAmount.toString(),
      },
      skipHashCheckIfAlreadyVerified: true,
    });

    return NextResponse.json({
      success: true,
      order: fulfillment.order,
      invoice: fulfillment.invoice,
      receipt: fulfillment.receipt,
    });
  } catch (err: any) {
    console.error('Error in PayU simulation endpoint:', err);
    return NextResponse.json({ error: err.message || 'Payment simulation failed' }, { status: 500 });
  }
}
