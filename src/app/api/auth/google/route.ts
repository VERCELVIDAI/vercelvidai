import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { validateRedirectUrl } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawReturnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || '/dashboard';
  const returnUrl = validateRedirectUrl(rawReturnUrl, '/dashboard');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `${appUrl}/api/auth/google/callback`;

  // Informative fallback if credentials are not configured yet
  if (!clientId || !clientSecret) {
    const errorMsg = encodeURIComponent(
      'Google OAuth is not configured on this server. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.'
    );
    return NextResponse.redirect(`${appUrl}/login?error=${errorMsg}&authProvider=google_unconfigured`);
  }

  // Generate cryptographically secure random state & nonce to prevent CSRF / replay attacks
  const state = crypto.randomBytes(24).toString('hex');
  const nonce = crypto.randomBytes(24).toString('hex');

  const oauthStatePayload = JSON.stringify({
    state,
    nonce,
    returnUrl,
    createdAt: Date.now(),
  });

  const isHttps = process.env.NODE_ENV === 'production' || appUrl.startsWith('https');

  const cookieStore = cookies();
  cookieStore.set('fluvia_oauth_state', oauthStatePayload, {
    httpOnly: true,
    secure: isHttps ? true : false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  });

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('nonce', nonce);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl.toString());
}
