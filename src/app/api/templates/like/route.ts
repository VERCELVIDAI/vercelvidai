import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { getTemplateById } from '@/lib/templates';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { error: 'Please sign in to like templates and save to your collection.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json({ error: 'templateId is required' }, { status: 400 });
    }

    const template = getTemplateById(templateId);
    const baseCount = template?.likesCount || 0;

    const result = dbStore.toggleTemplateLike(templateId, current.user.id, baseCount);

    return NextResponse.json({
      success: true,
      liked: result.liked,
      likeCount: result.likeCount,
      templateId,
    });
  } catch (err: any) {
    console.error('Error toggling template like:', err);
    return NextResponse.json({ error: err.message || 'Failed to update like' }, { status: 500 });
  }
}
