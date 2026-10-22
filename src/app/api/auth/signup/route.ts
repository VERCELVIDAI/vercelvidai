import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { setSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, confirmPassword, agreeTerms } = body;
    const displayName = body.displayName || body.fullName || '';

    if (!displayName || typeof displayName !== 'string' || displayName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your full name or creator handle (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match. Please verify both fields.' },
        { status: 400 }
      );
    }

    if (agreeTerms !== undefined && agreeTerms !== true) {
      return NextResponse.json(
        { error: 'Please accept the Terms of Service and Privacy Policy to create your account.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanDisplayName = displayName.trim();

    const existing = dbStore.getProfileByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in or use password recovery.' },
        { status: 409 }
      );
    }

    const { profile, workspace } = dbStore.createProfile({
      email: normalizedEmail,
      displayName: cleanDisplayName,
      passwordPlainText: password,
      role: 'creator',
    });

    await setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      workspaceId: workspace.id,
    });

    dbStore.logAudit(profile.id, 'USER_SIGNUP', 'profile', profile.id, {
      email: normalizedEmail,
      authProvider: 'password',
    });

    return NextResponse.json({
      success: true,
      user: profile,
      workspace,
      message: 'Account successfully registered with 100 free generative credits!',
    });
  } catch (err: any) {
    console.error('[Signup API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
