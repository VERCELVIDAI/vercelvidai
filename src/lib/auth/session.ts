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

function signPayload(payloadStr: string): string {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('hex');
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(PRIMARY_COOKIE) || cookieStore.get(LEGACY_COOKIE);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const val = decodeURIComponent(sessionCookie.value);
    let payloadStr = '';

    // Check if token has signature: format payloadBase64.signatureHex
    const dotIndex = val.lastIndexOf('.');
    if (dotIndex !== -1) {
      const payloadBase64 = val.substring(0, dotIndex);
      const signatureHex = val.substring(dotIndex + 1);
      const expectedSig = signPayload(payloadBase64);

      const sigBuf = Buffer.from(signatureHex);
      const expBuf = Buffer.from(expectedSig);
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        console.warn('Session signature mismatch — rejecting tampered cookie');
        return null;
      }
      payloadStr = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    } else {
      // Legacy unsigned base64 token fallback
      payloadStr = Buffer.from(val, 'base64').toString('utf-8');
    }

    const parsed: SessionData = JSON.parse(payloadStr);
    const profile = dbStore.getProfileById(parsed.userId);
    if (!profile) return null;

    // Securely ensure role and email match the canonical database record to prevent privilege escalation
    parsed.role = profile.role as 'creator' | 'admin' | 'enterprise';
    parsed.email = profile.email;

    return parsed;
  } catch (err) {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = cookies();
  const payloadBase64 = Buffer.from(JSON.stringify(data)).toString('base64');
  const signature = signPayload(payloadBase64);
  const signedToken = `${payloadBase64}.${signature}`;

  const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https');
  const cookieOpts = {
    httpOnly: true,
    secure: isHttps ? true : false,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
  cookieStore.set(PRIMARY_COOKIE, signedToken, cookieOpts);
  cookieStore.set(LEGACY_COOKIE, signedToken, cookieOpts);
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https');
  const clearOpts = {
    httpOnly: true,
    secure: isHttps ? true : false,
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

  const workspaces = dbStore.getUserWorkspaces(user.id);
  const workspace = workspaces.find((w) => w.id === session.workspaceId) || workspaces[0];

  return { user, workspace };
}
