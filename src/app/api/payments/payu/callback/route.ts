import { NextRequest, NextResponse } from 'next/server';
import { fulfillPayUPayment } from '@/lib/payments/payu';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

function getAppUrl(req: NextRequest): string {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || 'http';
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
}

export async function POST(req: NextRequest) {
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
      return NextResponse.redirect(`${hostUrl}/payment/status?status=failed&error=Missing+transaction+identifier`, 303);
    }

    if (status === 'success') {
      try {
        await fulfillPayUPayment({
          txnid,
          payuPayload: payload,
        });
        return NextResponse.redirect(`${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=success`, 303);
      } catch (fulfillErr: any) {
        console.error('PayU callback fulfillment error:', fulfillErr);
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
      return NextResponse.redirect(`${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=cancelled`, 303);
    } else {
      dbStore.cancelCouponRedemption(txnid);
      dbStore.updatePayUOrder(txnid, {
        status: 'failed',
        payuError: payload.error_Message || `Transaction failed with status: ${status}`,
      });
      return NextResponse.redirect(
        `${hostUrl}/payment/status?txnid=${encodeURIComponent(txnid)}&status=failed&error=${encodeURIComponent(payload.error_Message || 'Payment was declined by issuing bank')}`,
        303
      );
    }
  } catch (err: any) {
    console.error('Fatal PayU callback exception:', err);
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
