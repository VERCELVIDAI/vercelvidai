import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { ALL_CURATED_TEMPLATES } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || (current.user.role as string) !== 'admin') {
      return NextResponse.json({ error: 'Administrative access required' }, { status: 403 });
    }

    const report = dbStore.getTemplateAuditReport();
    const publishedCustom = dbStore.getPublishedTemplates();

    return NextResponse.json({
      success: true,
      report,
      publishedCustomCount: publishedCustom.length,
      curatedTemplates: ALL_CURATED_TEMPLATES.map((t) => ({
        id: t.id,
        title: t.title,
        type: t.type || 'video',
        category: t.category,
        aspect: t.aspect,
        estimatedCredits: t.estimatedCredits,
        generationWorkflow: t.generationWorkflow,
        hasPreview: Boolean(t.videoPreview || t.thumbnail),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit failed' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || (current.user.role as string) !== 'admin') {
      return NextResponse.json({ error: 'Administrative access required' }, { status: 403 });
    }

    const body = await req.json();
    const { templateId, status } = body;

    if (!templateId || !status) {
      return NextResponse.json({ error: 'templateId and status are required' }, { status: 400 });
    }

    const updated = dbStore.updateTemplateStatus(templateId, status);
    return NextResponse.json({ success: updated, templateId, status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 500 });
  }
}
