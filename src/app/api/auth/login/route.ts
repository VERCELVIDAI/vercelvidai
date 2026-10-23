import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { setSession, setVaultCookie, parseSignedVaultToken, VAULT_COOKIE } from '@/lib/auth/session';
import { isSupabaseAuthEnabled, supabaseSignIn } from '@/lib/auth/supabaseAuth';

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

    const normalizedEmail = (email || '').toLowerCase().trim();

    // 1. Supabase Auth if configured
    if (isSupabaseAuthEnabled()) {
      const result = await supabaseSignIn({
        email: normalizedEmail,
        password,
      });

      if (result.isConfigured) {
        if (!result.success) {
          return NextResponse.json(
            { error: result.error, code: result.code },
            { status: result.status || 400 }
          );
        }

        return NextResponse.json({
          success: true,
          user: result.user,
          workspaceId: result.workspaceId,
        });
      }
    }

    // 2. Verified fallback mode (Local dbStore with scrypt verification)
    dbStore.forceReload();
    let profile = dbStore.getProfileByEmail(normalizedEmail);

    // If profile not found in local disk (e.g. serverless container separation), check signed vault cookie or header
    if (!profile) {
      const vaultCookie = req.cookies.get(VAULT_COOKIE)?.value;
      const vaultHeader = req.headers.get('x-fluvia-vault');
      const token = vaultCookie || vaultHeader;
      if (token) {
        const vaultData = parseSignedVaultToken(token);
        if (vaultData && vaultData.email.toLowerCase().trim() === normalizedEmail) {
          const rehydrated = dbStore.rehydrateFromVault(vaultData);
          profile = rehydrated.profile;
        }
      }
    }

    if (!profile) {
      return NextResponse.json(
        {
          error: 'No account found with this email address. Please click "Create an account" below to register, or check for typos.',
          code: 'USER_NOT_FOUND',
        },
        { status: 401 }
      );
    }

    let hasPass = dbStore.hasPassword(profile.id);
    if (!hasPass) {
      // Check vault for password hash if container has missing credentials
      const vaultCookie = req.cookies.get(VAULT_COOKIE)?.value || req.headers.get('x-fluvia-vault');
      if (vaultCookie) {
        const vaultData = parseSignedVaultToken(vaultCookie);
        if (vaultData?.passwordHash) {
          dbStore.rehydrateFromVault(vaultData);
          hasPass = dbStore.hasPassword(profile.id);
        }
      }
    }

    if (!hasPass) {
      if (profile.authProvider === 'google' || profile.googleId) {
        return NextResponse.json(
          {
            error: 'This account was created with Google Sign-In. Please sign in using the "Continue with Google" button below.',
            code: 'GOOGLE_AUTH_REQUIRED',
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: 'No password has been set for this account. Please use password reset or sign in with your linked provider.',
          code: 'NO_PASSWORD_SET',
        },
        { status: 400 }
      );
    }

    // Verify password with safe trim fallback for accidental mobile keyboard spaces
    let isValid = dbStore.verifyPassword(profile.id, password);
    if (!isValid && typeof password === 'string' && password.trim() !== password) {
      isValid = dbStore.verifyPassword(profile.id, password.trim());
    }

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Incorrect password for this email address. Please verify your credentials or click "Forgot password?".',
          code: 'INVALID_PASSWORD',
        },
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

    const storedHash = dbStore.getPasswordHash(profile.id);
    let vaultToken: string | undefined;
    if (storedHash) {
      vaultToken = await setVaultCookie({
        userId: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        role: profile.role,
        passwordHash: storedHash,
        workspaceId: workspace.id,
        createdAt: profile.createdAt,
      });
    }

    dbStore.logAudit(profile.id, 'USER_LOGIN', 'profile', profile.id, {
      email: profile.email,
      authProvider: 'password',
    });

    return NextResponse.json({
      success: true,
      user: profile,
      workspaceId: workspace.id,
      vaultToken,
    });
  } catch (err: any) {
    console.error('[Login API Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
