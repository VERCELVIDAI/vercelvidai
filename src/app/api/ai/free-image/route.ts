import { NextRequest, NextResponse } from 'next/server';
import { cloudflareAIService, CLOUDFLARE_MODELS } from '@/lib/ai/cloudflare-workers-ai';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    configured: cloudflareAIService.isConfigured(),
    defaultModel: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    models: CLOUDFLARE_MODELS,
    dailyLimit: '100,000 free calls / day (Cloudflare Workers AI)',
    repoUrl: 'https://github.com/saurav-z/free-image-generation-api',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, model, workerUrl, apiKey, aspectRatio, numSteps, guidance } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'A text prompt is required to generate an image.' },
        { status: 400 }
      );
    }

    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length > 2500) {
      return NextResponse.json(
        { error: 'Prompt exceeds the 2,500 character limit.' },
        { status: 400 }
      );
    }

    const result = await cloudflareAIService.generateImage({
      prompt: trimmedPrompt,
      model: model || '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      workerUrl,
      apiKey,
      aspectRatio: aspectRatio || '1:1',
      numSteps: Number(numSteps) || 20,
      guidance: Number(guidance) || 7.5,
    });

    if (!result.success || !result.imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to generate image via Cloudflare Workers AI.',
        },
        { status: 500 }
      );
    }

    // Optional: save to user asset library if user is logged in
    let asset = null;
    try {
      const current = await getCurrentUser();
      if (current) {
        asset = dbStore.createAsset({
          workspaceId: current.workspace.id,
          ownerId: current.user.id,
          name: trimmedPrompt.slice(0, 48) + (trimmedPrompt.length > 48 ? '...' : ''),
          assetType: 'image',
          storageKey: result.imageUrl.startsWith('/') ? result.imageUrl.slice(1) : result.imageUrl,
          url: result.imageUrl,
          mimeType: 'image/jpeg',
          fileSize: 512 * 1024,
          metadata: {
            model: result.modelUsed,
            provider: result.provider,
            prompt: trimmedPrompt,
            aspectRatio: aspectRatio || '1:1',
          },
        });
      }
    } catch {}

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      modelUsed: result.modelUsed,
      provider: result.provider,
      latencyMs: result.latencyMs,
      asset,
    });
  } catch (err: any) {
    console.error('[/api/ai/free-image Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Image generation failed.' },
      { status: 500 }
    );
  }
}
