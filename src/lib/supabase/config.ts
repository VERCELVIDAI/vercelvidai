/**
 * Supabase Environment Configuration & Helper utilities
 * Safely handles environment variable detection without exposing service-role keys.
 */

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  ).trim();
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ''
  ).trim();
}

export function getSupabaseServiceRoleKey(): string {
  // Server-side ONLY. Never expose via NEXT_PUBLIC_
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim();
}

/**
 * Checks whether valid Supabase credentials have been configured
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) return false;
  // Guard against unedited placeholder values
  if (
    url.includes('your-project') ||
    url.includes('example.supabase.co') ||
    anonKey === 'your-anon-key' ||
    anonKey.length < 20
  ) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}
