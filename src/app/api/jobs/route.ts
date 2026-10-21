import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobs = dbStore.getUserJobs(current.user.id);
  return NextResponse.json({ jobs });
}
