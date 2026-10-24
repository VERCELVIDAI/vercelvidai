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
    const { modelId, prompt, negativePrompt, aspectRatio, durationSec, resolution, scriptText, voiceId, projectId } = body;
    const referenceImageUrl = body.referenceImageUrl || body.referenceUrl;

    if (!prompt && !scriptText && !referenceImageUrl) {
      return NextResponse.json({ error: 'Please provide a prompt or script to begin generation.' }, { status: 400 });
    }

    const selectedModelId = modelId || 'gemini-omni-1.1-flash';

    // Enforcement: Gemini is the ONLY active model. All other models must be Coming Soon.
    const allowedModels = ['gemini-omni-1.1-flash', 'gemini-omni-flash', 'gemini'];
    if (!allowedModels.includes(selectedModelId)) {
      return NextResponse.json(
        {
          error: `Model '${selectedModelId}' is currently Coming Soon. Google Gemini (gemini-omni-1.1-flash) is the only active generation engine in Fluvia Flow.`,
          isComingSoon: true,
          activeModel: 'gemini-omni-1.1-flash',
        },
        { status: 400 }
      );
    }

    // Fluvia Flow Requirement: Exactly 15 credits per video generation
    const estimatedCost = calculateEstimatedCredits(selectedModelId, durationSec || 5); // 15 credits

    const creditAccount = dbStore.getCreditAccount(current.user.id);
    if (creditAccount.availableBalance < estimatedCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${estimatedCost} credits to generate an AI video, but currently have ${creditAccount.availableBalance} credits available.`,
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
      modelId: 'gemini-omni-1.1-flash',
      input: {
        prompt: prompt?.trim(),
        negativePrompt: negativePrompt?.trim(),
        aspectRatio: aspectRatio || '16:9',
        durationSec: durationSec || 5,
        resolution: resolution || '720p',
        referenceImageUrl,
        scriptText,
        voiceId,
      },
    });

    dbStore.logAudit(current.user.id, 'GENERATION_JOB_DISPATCHED', 'generation_job', job.id, {
      modelId: 'gemini-omni-1.1-flash',
      estimatedCredits: estimatedCost,
    });

    return NextResponse.json({ success: true, job }, { status: 202 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}
