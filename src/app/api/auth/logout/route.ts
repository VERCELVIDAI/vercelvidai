import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { supabaseSignOut } from '@/lib/auth/supabaseAuth';
import { dbStore } from '@/lib/db/store';

export async function POST() {
  const current = await getCurrentUser();
  if (current) {
    dbStore.logAudit(current.user.id, 'USER_LOGOUT', 'profile', current.user.id);
  }
  await supabaseSignOut();
  return NextResponse.json({ success: true });
}
