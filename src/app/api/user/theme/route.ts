import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { getThemeById } from '@/lib/themes';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prefs = current.user.themePreferences || {
      colorTheme: 'midnight-violet',
      mode: 'dark',
      completed: false,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      themePreferences: prefs,
      themeDetails: getThemeById(prefs.colorTheme),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch theme preferences' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { colorTheme, mode, completed } = body;

    const validatedTheme = getThemeById(colorTheme || 'midnight-violet');
    const validatedMode = mode === 'light' || mode === 'dark' || mode === 'system' ? mode : 'dark';

    const newPreferences = {
      colorTheme: validatedTheme.id,
      mode: validatedMode,
      completed: completed === true || completed === false ? completed : true,
      updatedAt: new Date().toISOString(),
    };

    const updatedProfile = dbStore.updateProfile(current.user.id, {
      themePreferences: newPreferences,
    });

    dbStore.logAudit(
      current.user.id,
      'UPDATE_THEME_PREFERENCE',
      'user_profile',
      current.user.id,
      { colorTheme: validatedTheme.id, mode: validatedMode, completed: newPreferences.completed }
    );

    return NextResponse.json({
      success: true,
      themePreferences: updatedProfile.themePreferences,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update theme preferences' }, { status: 500 });
  }
}
