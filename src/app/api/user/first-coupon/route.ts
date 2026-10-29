import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const current = await getCurrentUser();
  if (!current?.user) {
    return NextResponse.json({ eligible: false }, { status: 401 });
  }

  const eligible = dbStore.isUserEligibleForFirstCoupon(current.user.id);
  return NextResponse.json({ eligible });
}

export async function POST(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    if (body.action === 'dismiss' || body.dismiss) {
      dbStore.markFirstCouponSeen(current.user.id);
      return NextResponse.json({ success: true, dismissed: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
