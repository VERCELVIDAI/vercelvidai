import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = dbStore.getMythProjects(current.user.id);
    return NextResponse.json({ projects, count: projects.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    const userId = current?.user?.id || `guest_${Date.now()}`;
    const workspaceId = current?.workspace?.id || `ws_${userId}`;

    const body = await req.json().catch(() => ({}));
    const project = dbStore.createMythProject({
      ...body,
      userId,
      workspaceId,
      title: body.title || 'Untitled Mythology Epic',
    });

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
