import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dispatchGenerationJob, calculateEstimatedCredits } from '@/lib/ai/dispatcher';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Please sign in to generate AI content.' }, { status: 401 });
    }

    const body = await req.json();
    const { modelId, prompt, negativePrompt, aspectRatio, durationSec, resolution, referenceImageUrl, scriptText, voiceId, projectId } = body;

    if (!prompt && !scriptText && !referenceImageUrl) {
      return NextResponse.json({ error: 'Please provide a prompt or script to begin generation.' }, { status: 400 });
    }

    const selectedModelId = modelId || 'fluvia-cinematic-v1';
    const estimatedCost = calculateEstimatedCredits(selectedModelId, durationSec || 5);

    const creditAccount = dbStore.getCreditAccount(current.user.id);
    if (creditAccount.availableBalance < estimatedCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${estimatedCost} credits for this generation, but have ${creditAccount.availableBalance} available.`,
          requiredCredits: estimatedCost,
          availableBalance: creditAccount.availableBalance,
        },
        { status: 402 }
      );
    }

    const job = await dispatchGenerationJob({
      userId: current.user.id,
      workspaceId: current.workspace.id,
      projectId,
      modelId: selectedModelId,
      input: {
        prompt,
        negativePrompt,
        aspectRatio: aspectRatio || '16:9',
        durationSec: durationSec || 5,
        resolution: resolution || '1080p',
        referenceImageUrl,
        scriptText,
        voiceId,
      },
    });

    dbStore.logAudit(current.user.id, 'GENERATION_JOB_DISPATCHED', 'generation_job', job.id, {
      modelId: selectedModelId,
      estimatedCredits: estimatedCost,
    });

    return NextResponse.json({ success: true, job }, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
