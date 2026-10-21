import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET() {
  const current = await getCurrentUser();
  if (!current || current.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const profiles = dbStore.getAllProfiles();
  const usersWithAccounts = profiles.map((p) => ({
    ...p,
    credits: dbStore.getCreditAccount(p.id),
  }));

  return NextResponse.json({ users: usersWithAccounts });
}

export async function POST(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current || current.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { targetUserId, adjustmentAmount, reason } = await req.json();

  if (!targetUserId || !adjustmentAmount) {
    return NextResponse.json({ error: 'Target user and amount are required' }, { status: 400 });
  }

  const account = dbStore.addCredits(
    targetUserId,
    adjustmentAmount,
    'admin_adjustment',
    undefined,
    `admin_adj_${Date.now()}_${targetUserId}`,
    { reason, adjustedBy: current.user.email }
  );

  dbStore.logAudit(current.user.id, 'ADMIN_CREDIT_ADJUSTMENT', 'credit_account', targetUserId, {
    amount: adjustmentAmount,
    reason,
  });

  return NextResponse.json({ success: true, account });
}
