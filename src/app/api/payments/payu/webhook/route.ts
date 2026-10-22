import { NextRequest, NextResponse } from 'next/server';
import { verifyPayUResponseHash, fulfillPayUPayment, getPayUConfig } from '@/lib/payments/payu';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: Record<string, any> = {};

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = value.toString();
      });
    } else {
      payload = await req.json();
    }

    const txnid = payload.txnid;
    const status = (payload.status || '').toLowerCase();
    const eventId = payload.mihpayid || payload.txnid || `wh_payu_${Date.now()}`;
    const config = getPayUConfig();

    if (!txnid) {
      return NextResponse.json({ error: 'Missing txnid' }, { status: 400 });
    }

    // Check duplicate event processing (replay prevention)
    if (dbStore.isWebhookProcessed(eventId)) {
      return NextResponse.json({ status: 'ok', note: 'Webhook event already processed (idempotent)' });
    }

    // Verify PayU Response Hash
    const isValidHash = verifyPayUResponseHash(payload, config.merchantSalt);
    if (!isValidHash) {
      console.warn(`PayU webhook reverse hash verification failed for txnid ${txnid}`);
      return NextResponse.json({ error: 'Invalid PayU webhook signature' }, { status: 400 });
    }

    // Record webhook event in immutable store
    dbStore.logWebhookEvent({
      eventId,
      eventType: `payu.payment.${status}`,
      payload,
    });

    if (status === 'success') {
      await fulfillPayUPayment({
        txnid,
        payuPayload: payload,
      });
    } else {
      if (status !== 'pending') {
        dbStore.cancelCouponRedemption(txnid);
      }
      dbStore.updatePayUOrder(txnid, {
        status: status === 'pending' ? 'pending' : 'failed',
        payuError: payload.error_Message || `Webhook notified status: ${status}`,
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('PayU webhook processing error:', err);
    return NextResponse.json({ error: err.message || 'Webhook internal failure' }, { status: 500 });
  }
}
