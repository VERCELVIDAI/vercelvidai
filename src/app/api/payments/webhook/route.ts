import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbStore } from '@/lib/db/store';
import { confirmAndFulfillPayment } from '@/lib/payments/razorpay';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'vidai_webhook_secret_789';

    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 });
    }

    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const signatureBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expected);

    if (
      signatureBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(signatureBuf, expectedBuf)
    ) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody || '{}');
    const event = payload.event;
    const eventId = payload.event_id || payload.id;

    // Check duplicate event delivery (replay protection)
    if (eventId && dbStore.isWebhookProcessed(eventId)) {
      return NextResponse.json({ status: 'ok', note: 'Duplicate event already processed' });
    }

    if (eventId) {
      dbStore.logWebhookEvent({ eventId, eventType: event || 'unknown', payload });
    }

    if (event === 'payment.captured' || event === 'order.paid') {
      const orderId = payload.payload?.payment?.entity?.order_id || payload.payload?.order?.entity?.id;
      const paymentId = payload.payload?.payment?.entity?.id;

      if (orderId && paymentId) {
        const payments = dbStore.getAllPayments();
        const paymentRecord = payments.find((p) => p.orderId === orderId);
        if (paymentRecord) {
          confirmAndFulfillPayment({
            userId: paymentRecord.userId,
            orderId,
            paymentId,
            signature: 'simulated_valid_sig_webhook',
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
