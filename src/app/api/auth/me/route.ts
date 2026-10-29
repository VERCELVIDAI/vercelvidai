import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const creditAccount = dbStore.getCreditAccount(current.user.id);
  const subscription = dbStore.getUserSubscription(current.user.id);
  const isEligibleFirstCoupon = dbStore.isUserEligibleForFirstCoupon(current.user.id);

  return NextResponse.json({
    authenticated: true,
    user: current.user,
    workspace: current.workspace,
    credits: creditAccount,
    subscription,
    eligibleForFirstCoupon: isEligibleFirstCoupon,
  });
}
