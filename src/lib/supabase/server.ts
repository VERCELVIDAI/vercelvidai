import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import {
  getSupabaseUrl,
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  isSupabaseConfigured,
} from './config';

/**
 * Creates a server-side Supabase client with Next.js App Router cookie handling.
 * Returns null if Supabase credentials are not configured.
 */
export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // If called from a Server Component, setting cookies can fail gracefully
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Graceful fallback
        }
      },
    },
  });
}

/**
 * Creates a privileged Admin client using the service-role key.
 * Strictly SERVER-SIDE ONLY. Never import into client components.
 */
export function getSupabaseAdminClient() {
  const url = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey || serviceRoleKey.length < 20 || serviceRoleKey.includes('your-service-role')) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
