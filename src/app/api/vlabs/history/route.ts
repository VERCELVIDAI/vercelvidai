import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ success: true, generations: [], dubbingProjects: [] });
    }

    const userId = session.user.id;
    const generations = dbStore.getVlabsGenerations(userId);
    const dubbingProjects = dbStore.getVlabsDubbingProjects(userId);

    return NextResponse.json({
      success: true,
      generations,
      dubbingProjects,
    });
  } catch (err: any) {
    console.error('History fetch error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch history' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Generation ID is required' }, { status: 400 });
    }

    const deleted = dbStore.deleteVlabsGeneration(id, session.user.id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    console.error('History delete error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete record' }, { status: 500 });
  }
}
