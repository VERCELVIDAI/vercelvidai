import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { confirmAndFulfillPayment } from '@/lib/payments/razorpay';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment confirmation parameters.' }, { status: 400 });
    }

    const result = confirmAndFulfillPayment({
      userId: current.user.id,
      orderId,
      paymentId,
      signature,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Payment verification failed' }, { status: 400 });
  }
}
