import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { validateRedirectUrl } from '@/lib/auth/session';
import { getGoogleOAuthCredentials, resolveGoogleRedirectUri } from '@/lib/auth/google-config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawReturnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || '/dashboard';
  const returnUrl = validateRedirectUrl(rawReturnUrl, '/dashboard');

  const { clientId, clientSecret } = getGoogleOAuthCredentials();

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol ? req.nextUrl.protocol.replace(':', '') : 'http');
  const requestOrigin = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin || 'http://localhost:3000').replace(/\/+$/, '');
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || requestOrigin).replace(/\/+$/, '');
  const redirectUri = resolveGoogleRedirectUri(requestOrigin, '/api/auth/google/callback');

  // Informative fallback if credentials cannot be resolved
  if (!clientId || !clientSecret) {
    const errorMsg = encodeURIComponent(
      'Google OAuth is not configured on this server. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.'
    );
    return NextResponse.redirect(`${appUrl}/login?error=${errorMsg}&authProvider=google_unconfigured`);
  }

  // Generate cryptographically secure random state to prevent CSRF
  const state = crypto.randomBytes(24).toString('hex');

  const oauthStatePayload = JSON.stringify({
    state,
    returnUrl,
    redirectUri,
    createdAt: Date.now(),
  });

  const isHttps = appUrl.startsWith('https://') || (process.env.NODE_ENV === 'production' && !appUrl.includes('localhost'));

  const cookieStore = cookies();
  cookieStore.set('fluvia_oauth_state', oauthStatePayload, {
    httpOnly: true,
    secure: isHttps,
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
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl.toString());
}
