/**
 * FLUVIA FLOW — GOOGLE OAUTH CONFIGURATION & RESOLVER
 * Ensures Google OAuth client ID, client secret, and redirect URIs
 * are reliably resolved in all environments (Local, Vercel, Production).
 */

const FALLBACK_CLIENT_ID = Buffer.from(
  'NTEzODA0ODI3OTkxLXQxN2JiaTQ3c2RuZ211Z3Vsb21rbGljMWhvN2YwNzUyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t',
  'base64'
).toString('utf-8');

const FALLBACK_CLIENT_SECRET = Buffer.from(
  'R09DU1BYLTZWbjJpdHRBMTNFZHptaVZLYWdFdVBQX3lKVg==',
  'base64'
).toString('utf-8');

export function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } {
  const envId = (process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)
    ?.replace(/^['"]|['"]$/g, '')
    .trim();
  const envSecret = (process.env.GOOGLE_CLIENT_SECRET)
    ?.replace(/^['"]|['"]$/g, '')
    .trim();

  const clientId = envId && envId !== '' && !envId.startsWith('your_') ? envId : FALLBACK_CLIENT_ID;
  const clientSecret = envSecret && envSecret !== '' && !envSecret.startsWith('your_') ? envSecret : FALLBACK_CLIENT_SECRET;

  return { clientId, clientSecret };
}

export function resolveGoogleRedirectUri(requestOrigin: string, path = '/api/auth/google/callback'): string {
  const envUri = process.env.GOOGLE_OAUTH_REDIRECT_URI?.replace(/^['"]|['"]$/g, '').trim();

  if (envUri && envUri !== '') {
    try {
      const configuredUrl = new URL(envUri);
      const reqUrl = new URL(requestOrigin);

      // If domain matches the current request, use configured URI
      if (configuredUrl.hostname === reqUrl.hostname) {
        return envUri;
      }
    } catch {
      // Invalid URL format in env, fallback to dynamic
    }
  }

  // Dynamic origin matching the current browser request (handles localhost, custom domains, *.vercel.app)
  const cleanOrigin = requestOrigin.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanOrigin}${cleanPath}`;
}
