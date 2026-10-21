import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { setSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const profile = dbStore.getProfileByEmail(email);
    if (!profile) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isValid = dbStore.verifyPassword(profile.id, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const workspaces = dbStore.getUserWorkspaces(profile.id);
    const workspaceId = workspaces[0]?.id || 'ws_default';

    await setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      workspaceId,
    });

    dbStore.logAudit(profile.id, 'USER_LOGIN', 'profile', profile.id);

    return NextResponse.json({ success: true, user: profile, workspaceId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed' }, { status: 500 });
  }
}
