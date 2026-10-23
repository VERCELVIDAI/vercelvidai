import { getSupabaseServerClient, getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { dbStore } from '@/lib/db/store';
import { setSession, clearSession } from '@/lib/auth/session';
import { UserProfile, Workspace } from '@/lib/types';

export interface SupabaseAuthResult {
  isConfigured: boolean;
  success: boolean;
  requiresEmailVerification?: boolean;
  user?: UserProfile;
  workspace?: Workspace;
  workspaceId?: string;
  error?: string;
  status?: number;
  code?: string;
  message?: string;
}

export function isSupabaseAuthEnabled(): boolean {
  return isSupabaseConfigured();
}

/**
 * Handle user registration through Supabase Auth
 */
export async function supabaseSignUp(params: {
  email: string;
  password: string;
  displayName: string;
}): Promise<SupabaseAuthResult> {
  if (!isSupabaseConfigured()) {
    return { isConfigured: false, success: false };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { isConfigured: false, success: false };
  }

  const cleanEmail = params.email.trim().toLowerCase();
  const cleanDisplayName = params.displayName.trim();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: params.password,
      options: {
        data: {
          display_name: cleanDisplayName,
          full_name: cleanDisplayName,
        },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already registered') || msg.includes('user already exists')) {
        return {
          isConfigured: true,
          success: false,
          error: 'An account with this email address already exists. Please sign in or use password recovery.',
          status: 409,
          code: 'USER_EXISTS',
        };
      }
      return {
        isConfigured: true,
        success: false,
        error: error.message,
        status: 400,
        code: error.status?.toString() || 'SIGNUP_ERROR',
      };
    }

    if (!data.user) {
      return {
        isConfigured: true,
        success: false,
        error: 'Unable to initialize user account with Supabase.',
        status: 500,
      };
    }

    // In Supabase, if email enumeration protection is ON and user already exists,
    // signUp returns a user object with empty identities array.
    if (data.user.identities && data.user.identities.length === 0) {
      return {
        isConfigured: true,
        success: false,
        error: 'An account with this email address already exists. Please sign in or use password recovery.',
        status: 409,
        code: 'USER_EXISTS',
      };
    }

    // Attempt to upsert user profile in Supabase PostgreSQL 'profiles' table
    try {
      await supabase.from('profiles').upsert(
        {
          id: data.user.id,
          email: cleanEmail,
          display_name: cleanDisplayName,
          role: 'creator',
          auth_provider: 'email',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } catch (e) {
      // Non-blocking: trigger or fallback will manage profile
    }

    // Synchronize to dbStore for full local and billing compatibility
    const { profile, workspace } = dbStore.syncSupabaseProfile({
      userId: data.user.id,
      email: cleanEmail,
      displayName: cleanDisplayName,
      role: 'creator',
      authProvider: 'email',
    });

    // Check if email confirmation is required
    const requiresEmailVerification = !data.session;

    if (!requiresEmailVerification) {
      // Auto-confirmed or confirmations disabled in Supabase project: establish session
      await setSession({
        userId: profile.id,
        email: profile.email,
        role: profile.role,
        workspaceId: workspace.id,
      });

      dbStore.logAudit(profile.id, 'USER_SIGNUP_SUPABASE', 'profile', profile.id, {
        email: cleanEmail,
        confirmed: true,
      });

      return {
        isConfigured: true,
        success: true,
        requiresEmailVerification: false,
        user: profile,
        workspace,
        message: 'Account successfully registered with 100 free generative credits!',
      };
    }

    // Requires email confirmation
    return {
      isConfigured: true,
      success: true,
      requiresEmailVerification: true,
      user: profile,
      workspace,
      message: 'Account registered successfully! Please check your email inbox to verify your address before signing in.',
    };
  } catch (err: any) {
    console.error('[Supabase SignUp Error]:', err);
    return {
      isConfigured: true,
      success: false,
      error: err.message || 'Supabase registration failed.',
      status: 500,
    };
  }
}

/**
 * Handle user login through Supabase Auth
 */
export async function supabaseSignIn(params: {
  email: string;
  password: string;
}): Promise<SupabaseAuthResult> {
  if (!isSupabaseConfigured()) {
    return { isConfigured: false, success: false };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { isConfigured: false, success: false };
  }

  const cleanEmail = params.email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: params.password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('email not confirmed')) {
        return {
          isConfigured: true,
          success: false,
          error: 'Your email address has not been confirmed yet. Please check your inbox or spam folder for the confirmation email.',
          status: 403,
          code: 'EMAIL_NOT_CONFIRMED',
        };
      }
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        return {
          isConfigured: true,
          success: false,
          error: 'Invalid email address or password. Please verify your credentials.',
          status: 401,
          code: 'INVALID_CREDENTIALS',
        };
      }
      return {
        isConfigured: true,
        success: false,
        error: error.message,
        status: 400,
        code: error.status?.toString() || 'LOGIN_ERROR',
      };
    }

    if (!data.user) {
      return {
        isConfigured: true,
        success: false,
        error: 'Login verification failed. Please try again.',
        status: 401,
      };
    }

    // Resolve profile details from metadata or email
    const metadata = data.user.user_metadata || {};
    const displayName = metadata.display_name || metadata.full_name || cleanEmail.split('@')[0] || 'Creator';
    const avatarUrl = metadata.avatar_url || undefined;

    // Sync to local dbStore for seamless compatibility with PayU, credit ledger, and AI generators
    const { profile, workspace } = dbStore.syncSupabaseProfile({
      userId: data.user.id,
      email: data.user.email || cleanEmail,
      displayName,
      avatarUrl,
    });

    // Establish signed session cookie
    await setSession({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
      workspaceId: workspace.id,
    });

    dbStore.logAudit(profile.id, 'USER_LOGIN_SUPABASE', 'profile', profile.id, {
      email: profile.email,
      supabaseUserId: data.user.id,
    });

    return {
      isConfigured: true,
      success: true,
      user: profile,
      workspace,
      workspaceId: workspace.id,
    };
  } catch (err: any) {
    console.error('[Supabase SignIn Error]:', err);
    return {
      isConfigured: true,
      success: false,
      error: err.message || 'Supabase authentication failed.',
      status: 500,
    };
  }
}

/**
 * Handle user logout through Supabase Auth
 */
export async function supabaseSignOut(): Promise<{ success: boolean; error?: string }> {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
  } catch (err: any) {
    console.warn('[Supabase SignOut Warning]:', err.message);
  }

  await clearSession();
  return { success: true };
}

/**
 * Retrieve authenticated user from Supabase if available
 */
export async function getSupabaseCurrentUser(): Promise<{ user: UserProfile; workspace: Workspace } | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const metadata = user.user_metadata || {};
    const displayName = metadata.display_name || metadata.full_name || user.email?.split('@')[0] || 'Creator';

    const { profile, workspace } = dbStore.syncSupabaseProfile({
      userId: user.id,
      email: user.email || '',
      displayName,
      avatarUrl: metadata.avatar_url,
    });

    return { user: profile, workspace };
  } catch (err) {
    return null;
  }
}
