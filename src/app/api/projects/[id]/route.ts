import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const project = dbStore.getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const project = dbStore.getProjectById(params.id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const body = await req.json();

  // Support duplicate action
  if (body.action === 'duplicate') {
    const duplicated = dbStore.duplicateProject(params.id, current.user.id);
    dbStore.logAudit(current.user.id, 'PROJECT_DUPLICATED', 'project', duplicated.id);
    return NextResponse.json({ project: duplicated });
  }

  const updated = dbStore.updateProject(params.id, body);
  dbStore.logAudit(current.user.id, 'PROJECT_UPDATED', 'project', params.id);

  return NextResponse.json({ project: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = dbStore.deleteProject(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  dbStore.logAudit(current.user.id, 'PROJECT_DELETED', 'project', params.id);
  return NextResponse.json({ success: true });
}
