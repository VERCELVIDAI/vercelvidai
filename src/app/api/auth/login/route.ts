import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { setSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both your email address and password.' },
        { status: 400 }
      );
    }

    dbStore.forceReload();
    const normalizedEmail = (email || '').toLowerCase().trim();
    const profile = dbStore.getProfileByEmail(normalizedEmail);

    if (!profile) {
      return NextResponse.json(
        { error: 'Invalid email address or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    const hasPass = dbStore.hasPassword(profile.id);
    if (!hasPass && profile.authProvider === 'google') {
      return NextResponse.json(
        { error: 'This account was created with Google Sign-In. Please sign in using the "Continue with Google" button below.' },
        { status: 400 }
      );
    }

    const isValid = dbStore.verifyPassword(profile.id, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email address or password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Ensure a workspace is guaranteed to exist for this user
    const workspace = dbStore.ensureUserWorkspace(profile.id, profile.displayName);

    await setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      workspaceId: workspace.id,
    });

    dbStore.logAudit(profile.id, 'USER_LOGIN', 'profile', profile.id, {
      email: profile.email,
      authProvider: 'password',
    });

    return NextResponse.json({
      success: true,
      user: profile,
      workspaceId: workspace.id,
    });
  } catch (err: any) {
    console.error('[Login API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
