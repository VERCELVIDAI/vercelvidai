import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { executeVoxMotionPipeline } from '@/lib/ai/vox-motion-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const body = await req.json().catch(() => ({}));
    const {
      topic,
      mode = 'broll',
      styleId = 'modern-flat',
      arcId = 'timeline',
      voiceId = 'male-vox',
      bgmMoodId = 'investigative',
      aspectRatio = '16:9',
      anchorPhotoUrl,
      customMuApiKey,
    } = body;

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a topic or concept for your Vox motion graphics video.',
        },
        { status: 400 }
      );
    }

    const result = await executeVoxMotionPipeline({
      topic: topic.trim(),
      mode,
      styleId,
      arcId,
      voiceId,
      bgmMoodId,
      aspectRatio,
      anchorPhotoUrl,
      customMuApiKey,
      userId: current?.user?.id,
      clientIp,
    });

    return NextResponse.json({
      success: true,
      project: result,
    });
  } catch (error: any) {
    const errorMsg = error.message || 'Failed to generate Vox Motion Graphics';
    const isExhausted = errorMsg.includes('FREE_TRIES_EXHAUSTED');

    return NextResponse.json(
      {
        success: false,
        code: isExhausted ? 'FREE_TRIES_EXHAUSTED' : 'GENERATION_ERROR',
        error: errorMsg,
        upgradeUrl: '/checkout?type=subscription&id=plan_creator',
      },
      { status: isExhausted ? 403 : 500 }
    );
  }
}
