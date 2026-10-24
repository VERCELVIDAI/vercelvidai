import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { error: 'Please sign in to follow creators.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { creatorId } = body;

    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId is required' }, { status: 400 });
    }

    const result = dbStore.toggleFollowCreator(creatorId, current.user.id);

    return NextResponse.json({
      success: true,
      following: result.following,
      followerCount: result.followerCount,
      creatorId,
    });
  } catch (err: any) {
    console.error('Error toggling creator follow:', err);
    return NextResponse.json({ error: err.message || 'Failed to update follow' }, { status: 500 });
  }
}
