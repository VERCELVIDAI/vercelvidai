import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { setSession } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, displayName, password } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Display name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = dbStore.getProfileByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const { profile, workspace } = dbStore.createProfile({
      email,
      displayName,
      passwordPlainText: password,
      role: 'creator',
    });

    await setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      workspaceId: workspace.id,
    });

    dbStore.logAudit(profile.id, 'USER_SIGNUP', 'profile', profile.id, { email });

    return NextResponse.json({
      success: true,
      user: profile,
      workspace,
      message: 'Account created with 100 welcome credits!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Signup failed' }, { status: 500 });
  }
}
