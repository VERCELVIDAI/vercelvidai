import { NextResponse } from 'next/server';
import { clearSession, getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function POST() {
  const current = await getCurrentUser();
  if (current) {
    dbStore.logAudit(current.user.id, 'USER_LOGOUT', 'profile', current.user.id);
  }
  await clearSession();
  return NextResponse.json({ success: true });
}
