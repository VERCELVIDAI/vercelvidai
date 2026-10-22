import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalized = email.toLowerCase().trim();
    const tokenResult = dbStore.createPasswordResetToken(normalized);

    // Security best practice: Do not reveal whether email exists to prevent enumeration
    const responsePayload: Record<string, any> = {
      success: true,
      message: 'If an account exists for this email address, password reset instructions have been dispatched.',
    };

    // In local / development mode, provide the direct reset link to ease testing
    if (process.env.NODE_ENV !== 'production' && tokenResult) {
      responsePayload.devResetLink = tokenResult.resetLink;
      responsePayload.token = tokenResult.token;
    }

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to process password recovery.' },
      { status: 500 }
    );
  }
}
