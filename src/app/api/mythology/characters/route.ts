import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { MythCharacter } from '@/lib/mythology/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const current = await getCurrentUser();
    const userId = current?.user?.id || 'guest_user';
    const characters = dbStore.getMythCharacters(userId);
    return NextResponse.json({ characters });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current?.user) {
      return NextResponse.json({ error: 'Please sign in to save custom characters.' }, { status: 401 });
    }

    const body = (await req.json()) as MythCharacter;
    if (!body.name || !body.appearance) {
      return NextResponse.json({ error: 'Character name and physical appearance are required.' }, { status: 400 });
    }

    const saved = dbStore.saveMythCharacter({
      ...body,
      userId: current.user.id,
    });

    return NextResponse.json({ success: true, character: saved }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Character ID is required.' }, { status: 400 });
    }

    const deleted = dbStore.deleteMythCharacter(id, current.user.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Character not found or access denied.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
