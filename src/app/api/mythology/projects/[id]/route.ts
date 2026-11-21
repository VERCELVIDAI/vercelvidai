import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = dbStore.getMythProjectById(params.id);
    if (!project) {
      return NextResponse.json({ error: 'Mythology project not found' }, { status: 404 });
    }

    const current = await getCurrentUser();
    // Allow guest or owner or admin
    if (current?.user && project.userId !== current.user.id && current.user.role !== 'admin' && !project.userId.startsWith('guest_')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    const project = dbStore.getMythProjectById(params.id);

    if (!project) {
      return NextResponse.json({ error: 'Mythology project not found' }, { status: 404 });
    }

    if (current?.user && project.userId !== current.user.id && current.user.role !== 'admin' && !project.userId.startsWith('guest_')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await req.json().catch(() => ({}));
    const updated = dbStore.updateMythProject(params.id, updates);

    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser();
    if (!current?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = dbStore.deleteMythProject(params.id, current.user.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
