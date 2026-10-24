import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { fulfillPayUPayment } from '@/lib/payments/payu';
import { dbStore } from '@/lib/db/store';
import { logPaymentEvent } from '@/lib/payments/rateLimiter';

export const dynamic = 'force-dynamic';

function getAppUrl(req: NextRequest): string {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'https://fluviaflow.online');
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_cb_${crypto.randomBytes(6).toString('hex')}`;
  const hostUrl = getAppUrl(req);

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

    if (!txnid) {
      logPaymentEvent({
        requestId,
        category: 'callback',
        statusCode: 400,
        durationMs: Date.now() - startTime,
        error: 'Missing transaction identifier in PayU callback',
      });
      return NextResponse.redirect(`${hostUrl}/payment/status?status=failed&error=Missing+transaction+identifier`, 303);
    }

    if (status === 'success') {
      try {
        const result = await fulfillPayUPayment({
          txnid,
          payuPayload: payload,
        });

        logPaymentEvent({
          requestId,
          category: 'callback',
          statusCode: 200,
          durationMs: Date.now() - startTime,
          txnid,
          status: 'success',
          orderId: result.order.id,
          userId: result.order.userId,
        });

        return NextResponse.redirect(`${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=success`, 303);
      } catch (fulfillErr: any) {
        console.error('PayU callback fulfillment error:', fulfillErr);
        logPaymentEvent({
          requestId,
          category: 'callback',
          statusCode: 400,
          durationMs: Date.now() - startTime,
          txnid,
          status: 'failed',
          error: fulfillErr.message,
        });

        return NextResponse.redirect(
          `${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=failed&error=${encodeURIComponent(fulfillErr.message)}`,
          303
        );
      }
    } else if (status === 'cancel' || status === 'cancelled') {
      dbStore.cancelCouponRedemption(txnid);
      dbStore.updatePayUOrder(txnid, {
        status: 'cancelled',
        payuError: payload.error_Message || 'Transaction cancelled by customer on PayU portal',
      });

      logPaymentEvent({
        requestId,
        category: 'callback',
        statusCode: 200,
        durationMs: Date.now() - startTime,
        txnid,
        status: 'cancelled',
      });

      return NextResponse.redirect(`${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=cancelled`, 303);
    } else {
      dbStore.cancelCouponRedemption(txnid);
      dbStore.updatePayUOrder(txnid, {
        status: 'failed',
        payuError: payload.error_Message || `Transaction failed with status: ${status}`,
      });

      logPaymentEvent({
        requestId,
        category: 'callback',
        statusCode: 200,
        durationMs: Date.now() - startTime,
        txnid,
        status: 'failed',
        error: payload.error_Message || `Status: ${status}`,
      });

      return NextResponse.redirect(
        `${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=failed&error=${encodeURIComponent(payload.error_Message || 'Payment was declined by issuing bank')}`,
        303
      );
    }
  } catch (err: any) {
    console.error('Fatal PayU callback exception:', err);
    logPaymentEvent({
      requestId,
      category: 'callback',
      statusCode: 500,
      durationMs: Date.now() - startTime,
      error: err.message || 'Unexpected callback error',
    });
    return NextResponse.redirect(`${hostUrl}/payment/status?status=failed&error=Unexpected+callback+error`, 303);
  }
}

export async function GET(req: NextRequest) {
  const hostUrl = getAppUrl(req);
  const { searchParams } = new URL(req.url);
  const txnid = searchParams.get('txnid') || '';
  const status = (searchParams.get('status') || '').toLowerCase();

  if (txnid) {
    return NextResponse.redirect(
      `${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=${encodeURIComponent(status || 'pending')}`,
      303
    );
  }

  return NextResponse.redirect(`${hostUrl}/dashboard/billing`, 303);
}
