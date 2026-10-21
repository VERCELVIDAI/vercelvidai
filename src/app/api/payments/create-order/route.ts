import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createRazorpayOrder } from '@/lib/payments/razorpay';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentType, itemPlanOrPackId } = await req.json();

    let amountInr = 999;
    if (paymentType === 'credit_pack') {
      const pack = dbStore.getCreditPacks().find((p) => p.id === itemPlanOrPackId);
      if (pack) amountInr = pack.priceInr;
    } else if (paymentType === 'subscription') {
      const plan = dbStore.getPlans().find((p) => p.id === itemPlanOrPackId);
      if (plan) amountInr = plan.priceInr;
    }

    const orderData = createRazorpayOrder({
      userId: current.user.id,
      amountInr,
      paymentType,
      itemPlanOrPackId,
    });

    return NextResponse.json(orderData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Could not initiate order' }, { status: 500 });
  }
}
