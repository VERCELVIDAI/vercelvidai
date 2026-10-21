import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mediaType = searchParams.get('mediaType') || undefined;
  const status = searchParams.get('status') || undefined;
  const favoriteOnly = searchParams.get('favoriteOnly') === 'true';

  const projects = dbStore.getProjects(current.workspace.id, {
    mediaType,
    status,
    favoriteOnly,
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const project = dbStore.createProject({
    workspaceId: current.workspace.id,
    ownerId: current.user.id,
    title: body.title || 'Untitled AI Project',
    description: body.description,
    mediaType: body.mediaType || 'video',
    thumbnailUrl: body.thumbnailUrl,
    timeline: body.timeline,
  });

  dbStore.logAudit(current.user.id, 'PROJECT_CREATED', 'project', project.id, { title: project.title });

  return NextResponse.json({ project }, { status: 201 });
}
