import { cookies } from 'next/headers';
import { dbStore } from '../db/store';
import { UserProfile, Workspace } from '../types';

const SESSION_COOKIE_NAME = 'vidai_session';

export interface SessionData {
  userId: string;
  email: string;
  role: 'creator' | 'admin' | 'enterprise';
  workspaceId: string;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    const val = decodeURIComponent(sessionCookie.value);
    const raw = Buffer.from(val, 'base64').toString('utf-8');
    const parsed: SessionData = JSON.parse(raw);
    const profile = dbStore.getProfileById(parsed.userId);
    if (!profile) return null;
    return parsed;
  } catch (err) {
    return null;
  }
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = cookies();
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https');
  cookieStore.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: isHttps ? true : false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  const isHttps = process.env.NEXT_PUBLIC_APP_URL?.startsWith('https');
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: isHttps ? true : false,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
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
