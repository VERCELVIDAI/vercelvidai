import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: 'Email, reset authorization token, and new password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const normalized = email.toLowerCase().trim();
    const isReset = dbStore.resetPasswordWithToken(normalized, token, password);

    if (!isReset) {
      return NextResponse.json(
        { error: 'Invalid or expired password reset link. Please request a new link.' },
        { status: 400 }
      );
    }

    const user = dbStore.getProfileByEmail(normalized);
    if (user) {
      dbStore.logAudit(user.id, 'PASSWORD_RESET_COMPLETED', 'profile', user.id);
    }

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully updated. You may now sign in with your new credentials.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update password.' },
      { status: 500 }
    );
  }
}
