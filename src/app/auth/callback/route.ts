import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase';
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
  const next = validateRedirectUrl(searchParams.get('next') || searchParams.get('returnUrl'), '/dashboard');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (errorParam) {
    const errorMsg = encodeURIComponent(errorDescription || `Supabase authentication error: ${errorParam}`);
    return NextResponse.redirect(`${appUrl}/login?error=${errorMsg}`);
  }

  if (code && isSupabaseConfigured()) {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('[Supabase Auth Callback] Exchange error:', error);
        const errorMsg = encodeURIComponent(error.message || 'Verification link expired or invalid.');
        return NextResponse.redirect(`${appUrl}/login?error=${errorMsg}`);
      }

      if (data?.user) {
        const metadata = data.user.user_metadata || {};
        const displayName = metadata.display_name || metadata.full_name || data.user.email?.split('@')[0] || 'Creator';
        const avatarUrl = metadata.avatar_url;

        // Sync to profiles table and local dbStore
        try {
          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              email: (data.user.email || '').toLowerCase().trim(),
              display_name: displayName,
              avatar_url: avatarUrl,
              role: 'creator',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        } catch {
          // Non-blocking
        }

        const { profile, workspace } = dbStore.syncSupabaseProfile({
          userId: data.user.id,
          email: data.user.email || '',
          displayName,
          avatarUrl,
        });

        await setSession({
          userId: profile.id,
          email: profile.email,
          role: profile.role,
          workspaceId: workspace.id,
        });

        dbStore.logAudit(profile.id, 'USER_EMAIL_VERIFIED', 'profile', profile.id, {
          email: profile.email,
        });

        const successMsg = encodeURIComponent('Your email has been verified! Welcome to Fluvia Flow.');
        return NextResponse.redirect(`${appUrl}${next}?verified=true&message=${successMsg}`);
      }
    }
  }

  return NextResponse.redirect(`${appUrl}${next}`);
}
