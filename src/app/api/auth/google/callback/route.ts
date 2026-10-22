import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { dbStore } from '@/lib/db/store';
import { setSession, validateRedirectUrl } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') || (req.nextUrl.protocol ? req.nextUrl.protocol.replace(':', '') : 'http');
  const requestOrigin = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin || 'http://localhost:3000').replace(/\/+$/, '');
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || requestOrigin).replace(/\/+$/, '');
  const { searchParams } = new URL(req.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // 1. Handle user cancellation or OAuth provider rejection
  if (oauthError) {
    const isCancelled = oauthError === 'access_denied' || oauthError.includes('cancel');
    const msg = isCancelled
      ? encodeURIComponent('Google sign-in was cancelled.')
      : encodeURIComponent(errorDescription || `Google OAuth error: ${oauthError}`);
    return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
  }

  if (!code || !state) {
    const msg = encodeURIComponent('Missing authorization code or state from Google OAuth callback.');
    return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
  }

  // 2. Validate state cookie against CSRF
  const cookieStore = cookies();
  const stateCookie = cookieStore.get('fluvia_oauth_state');

  let savedState: { state: string; nonce: string; returnUrl: string; createdAt: number } | null = null;
  try {
    if (stateCookie?.value) {
      savedState = JSON.parse(stateCookie.value);
    }
  } catch (e) {
    savedState = null;
  }

  // Clear the single-use state cookie immediately
  cookieStore.set('fluvia_oauth_state', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
  });

  if (!savedState || savedState.state !== state) {
    const msg = encodeURIComponent('Security verification failed: OAuth state mismatch or session expired.');
    return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
  }

  const returnUrl = validateRedirectUrl(savedState.returnUrl, '/dashboard');

  // 3. Exchange authorization code for access & ID tokens
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `${requestOrigin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    const msg = encodeURIComponent('Server configuration error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing.');
    return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const tokenErr = await tokenResponse.text();
      console.error('[Google OAuth] Token exchange error:', tokenErr);
      const msg = encodeURIComponent('Failed to exchange authorization token with Google.');
      return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      const msg = encodeURIComponent('No access token received from Google.');
      return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
    }

    // 4. Fetch verified profile from Google UserInfo endpoint
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userinfoResponse.ok) {
      const msg = encodeURIComponent('Failed to retrieve user profile from Google.');
      return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
    }

    const userinfo = await userinfoResponse.json();

    const googleId = userinfo.sub;
    const email = (userinfo.email || '').toLowerCase().trim();
    const displayName = userinfo.name || userinfo.given_name || email.split('@')[0] || 'Creator';
    const avatarUrl = userinfo.picture || undefined;

    if (!googleId || !email) {
      const msg = encodeURIComponent('Google account did not provide a verified email address.');
      return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
    }

    // 5. Account Resolution & Profile Initialization (Handles new vs returning seamlessly)
    const { profile, workspace } = dbStore.createGoogleProfile({
      googleId,
      email,
      displayName,
      avatarUrl,
    });

    // 6. Establish signed session
    await setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      workspaceId: workspace.id,
    });

    dbStore.logAudit(profile.id, 'USER_LOGIN_GOOGLE', 'profile', profile.id, {
      googleId,
      email,
      isNewUser: profile.createdAt === profile.updatedAt,
    });

    return NextResponse.redirect(`${appUrl}${returnUrl}`);
  } catch (err: any) {
    console.error('[Google OAuth Callback] Unexpected exception:', err);
    const msg = encodeURIComponent(err.message || 'Unexpected error during Google authentication.');
    return NextResponse.redirect(`${appUrl}/login?error=${msg}`);
  }
}
