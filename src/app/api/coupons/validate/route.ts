import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { validateCoupon } from '@/lib/coupons/service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    const body = await req.json();

    const {
      code,
      paymentType,
      itemPlanOrPackId,
      billingInterval,
      customerState,
    } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Please provide a coupon code.' },
        { status: 400 }
      );
    }

    if (!paymentType || !itemPlanOrPackId) {
      return NextResponse.json(
        { valid: false, error: 'Checkout item and paymentType are required.' },
        { status: 400 }
      );
    }

    const result = validateCoupon({
      code,
      userId: current?.user?.id,
      paymentType,
      itemPlanOrPackId,
      billingInterval: billingInterval === 'year' ? 'year' : 'month',
      customerState: customerState || 'Delhi',
    });

    if (!result.valid) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('Coupon validation error:', err);
    return NextResponse.json(
      { valid: false, error: 'Failed to validate coupon. Please try again.' },
      { status: 500 }
    );
  }
}
