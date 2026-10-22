import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const assets = dbStore.getAssets(current.workspace.id);
  return NextResponse.json({ assets });
}

export async function POST(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const asset = dbStore.createAsset({
    workspaceId: current.workspace.id,
    ownerId: current.user.id,
    projectId: body.projectId,
    name: body.name || 'Uploaded Creative Asset',
    assetType: body.assetType || 'video',
    storageKey: `uploads/${current.workspace.id}/${Date.now()}_${body.name || 'asset'}`,
    url: body.url || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    mimeType: body.mimeType || (body.assetType === 'video' ? 'video/mp4' : 'image/png'),
    fileSize: body.fileSize || 1024000,
    metadata: body.metadata,
  });

  dbStore.logAudit(current.user.id, 'ASSET_UPLOADED', 'asset', asset.id, { name: asset.name });

  return NextResponse.json({ asset }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let id = req.nextUrl.searchParams.get('id');
  if (!id) {
    try {
      const body = await req.json();
      id = body?.id;
    } catch (e) {
      // ignore json parse error if empty body
    }
  }

  if (!id) {
    return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
  }

  const asset = dbStore.getAssetById(id);
  if (!asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  const isOwner = asset.ownerId === current.user.id;
  const isWorkspace = asset.workspaceId === current.workspace.id;
  const isAdmin = current.user.role === 'admin';

  if (!isOwner && !isWorkspace && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden: Access denied to this asset' }, { status: 403 });
  }

  dbStore.deleteAsset(id);
  dbStore.logAudit(current.user.id, 'ASSET_DELETED', 'asset', id, { name: asset.name });

  return NextResponse.json({ success: true });
}
