import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        { error: 'Please sign in to publish your AI video template.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, prompt, category, aspect, thumbnail, videoPreview } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Template title is required' }, { status: 400 });
    }

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: 'AI generation prompt is required' }, { status: 400 });
    }

    const validAspects = ['16:9', '9:16', '1:1', '4:5', '2.39:1'];
    const chosenAspect = validAspects.includes(aspect) ? aspect : '16:9';

    const published = dbStore.publishCustomTemplate({
      title: title.trim(),
      description: description ? description.trim() : '',
      prompt: prompt.trim(),
      category: category || 'Product Commercial',
      aspect: chosenAspect,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      videoPreview: videoPreview || '/media/templates/tmpl-01-cinematic-product.mp4',
      creatorId: current.user.id,
      creatorName: `@${current.user.displayName?.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'creator'}`,
      creatorAvatar: current.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    });

    dbStore.logAudit(current.user.id, 'TEMPLATE_PUBLISHED', 'template', published.id, {
      title: published.title,
      category: published.category,
    });

    return NextResponse.json({
      success: true,
      template: published,
    });
  } catch (err: any) {
    console.error('Error publishing template:', err);
    return NextResponse.json({ error: err.message || 'Failed to publish template' }, { status: 500 });
  }
}
