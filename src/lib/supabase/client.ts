import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from './config';

let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton Supabase browser client for client-side components.
 * Returns null if Supabase is not configured yet.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClientInstance) {
    const url = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();
    browserClientInstance = createBrowserClient(url, anonKey);
  }

  return browserClientInstance;
}
