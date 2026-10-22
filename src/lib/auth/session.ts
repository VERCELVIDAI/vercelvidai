import { cookies } from 'next/headers';
import crypto from 'crypto';
import { dbStore } from '../db/store';
import { UserProfile, Workspace } from '../types';

const PRIMARY_COOKIE = 'fluvia_session';
const LEGACY_COOKIE = 'vidai_session';
const SESSION_SECRET = process.env.APP_SECRET || 'fluvia-flow-production-super-secret-key-32-chars-minimum-fallback';

export interface SessionData {
  userId: string;
  email: string;
  role: 'creator' | 'admin' | 'enterprise';
  workspaceId: string;
}

function getSessionSecret(): string {
  return process.env.APP_SECRET || 'fluvia-flow-production-super-secret-key-32-chars-minimum-fallback';
}

function signPayload(payloadStr: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(payloadStr).digest('hex');
}

export function createSignedSessionToken(data: SessionData): string {
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function parseSignedSessionToken(token: string): SessionData | null {
  try {
    if (!token || typeof token !== 'string') return null;
    let clean = token.trim();
    if (clean.startsWith('"') && clean.endsWith('"')) {
      clean = clean.slice(1, -1);
    }

    const dotIndex = clean.lastIndexOf('.');
    if (dotIndex === -1) {
      // Legacy unsigned fallback
      try {
        const decoded = Buffer.from(clean, 'base64url').toString('utf-8');
        if (decoded.startsWith('{')) return JSON.parse(decoded);
      } catch {}
      const fallback = Buffer.from(clean, 'base64').toString('utf-8');
      return JSON.parse(fallback);
    }

    const payload = clean.substring(0, dotIndex);
    const signature = clean.substring(dotIndex + 1);

    // Verify signature against payload
    const expectedSig = signPayload(payload);
    let isValid = false;

    if (signature.length === expectedSig.length) {
      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expectedSig);
      if (crypto.timingSafeEqual(sigBuf, expBuf)) {
        isValid = true;
      }
    }

    // Check fallback for decoded payload if URL encoding changed characters
    if (!isValid) {
      const altPayload = decodeURIComponent(payload);
      const altSig = signPayload(altPayload);
      if (signature.length === altSig.length) {
        const sigBuf = Buffer.from(signature);
        const altBuf = Buffer.from(altSig);
        if (crypto.timingSafeEqual(sigBuf, altBuf)) {
          isValid = true;
        }
      }
    }

    if (!isValid) {
      console.warn('[Session] Signature mismatch on token verification');
      return null;
    }

    // Decode JSON from base64url or standard base64
    let jsonStr = Buffer.from(payload, 'base64url').toString('utf-8');
    if (!jsonStr.startsWith('{')) {
      jsonStr = Buffer.from(payload, 'base64').toString('utf-8');
    }
    return JSON.parse(jsonStr) as SessionData;
  } catch (err) {
    console.warn('[Session] Parse error:', err);
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(PRIMARY_COOKIE) || cookieStore.get(LEGACY_COOKIE);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const parsed = parseSignedSessionToken(sessionCookie.value);
  if (!parsed || !parsed.userId) return null;

  const profile = dbStore.getProfileById(parsed.userId);
  if (!profile) return null;

  // Securely ensure role and email match the canonical database record to prevent privilege escalation
  parsed.role = profile.role as 'creator' | 'admin' | 'enterprise';
  parsed.email = profile.email;

  return parsed;
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = cookies();
  const signedToken = createSignedSessionToken(data);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const isHttps = appUrl.startsWith('https://') || (process.env.NODE_ENV === 'production' && !appUrl.includes('localhost'));
  const cookieOpts = {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
  cookieStore.set(PRIMARY_COOKIE, signedToken, cookieOpts);
  cookieStore.set(LEGACY_COOKIE, signedToken, cookieOpts);
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const isHttps = appUrl.startsWith('https://') || (process.env.NODE_ENV === 'production' && !appUrl.includes('localhost'));
  const clearOpts = {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
  cookieStore.set(PRIMARY_COOKIE, '', clearOpts);
  cookieStore.set(LEGACY_COOKIE, '', clearOpts);
}

export async function getCurrentUser(): Promise<{ user: UserProfile; workspace: Workspace } | null> {
  const session = await getSession();
  if (!session) return null;

  const user = dbStore.getProfileById(session.userId);
  if (!user) return null;

  const workspace = dbStore.ensureUserWorkspace(user.id, user.displayName);

  return { user, workspace };
}

/**
 * Validate redirect URL to prevent Open Redirect vulnerabilities
 */
export function validateRedirectUrl(url: string | null | undefined, defaultUrl: string = '/dashboard'): string {
  if (!url) return defaultUrl;
  // Relative internal path only (starts with / but not // or /\)
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
    return url;
  }
  return defaultUrl;
}
