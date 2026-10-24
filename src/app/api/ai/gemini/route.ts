import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { geminiService } from '@/lib/ai/gemini';
import { getCurrentUser, getSession } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Check optional authentication for user tracking
    const session = await getSession();

    switch (action) {
      case 'status': {
        return NextResponse.json({
          configured: geminiService.isConfigured(),
          model: geminiService.getModelName(),
          capabilities: [
            'prompt_enhancement',
            'scriptwriting',
            'storyboard_generation',
            'cinematic_direction',
            'marketing_copilot',
            'creative_assistant',
          ],
        });
      }

      case 'enhance-prompt': {
        const { prompt, aspectRatio, cameraMovement, stylePreference } = body;
        if (!prompt || typeof prompt !== 'string') {
          return NextResponse.json({ error: 'Valid prompt string is required.' }, { status: 400 });
        }
        const result = await geminiService.enhancePrompt({
          prompt,
          aspectRatio,
          cameraMovement,
          stylePreference,
        });
        return NextResponse.json({ success: true, ...result });
      }

      case 'generate-script': {
        const { topic, platform, tone, durationSec } = body;
        if (!topic) {
          return NextResponse.json({ error: 'Topic or concept is required.' }, { status: 400 });
        }
        const result = await geminiService.generateScript({
          topic,
          platform,
          tone,
          durationSec: Number(durationSec) || 15,
        });
        return NextResponse.json({ success: true, script: result });
      }

      case 'generate-storyboard': {
        const { concept, targetAudience, aspectRatio, sceneCount } = body;
        if (!concept) {
          return NextResponse.json({ error: 'Concept description is required.' }, { status: 400 });
        }
        const storyboard = await geminiService.generateStoryboard({
          concept,
          targetAudience,
          aspectRatio,
          sceneCount: Number(sceneCount) || 3,
        });
        return NextResponse.json({ success: true, storyboard });
      }

      case 'marketing-copilot': {
        const { productName, productDescription, platform, targetAudience, tone } = body;
        if (!productName || !productDescription) {
          return NextResponse.json(
            { error: 'Product name and description are required.' },
            { status: 400 }
          );
        }
        const campaign = await geminiService.marketingCopilot({
          productName,
          productDescription,
          platform,
          targetAudience,
          tone,
        });
        return NextResponse.json({ success: true, campaign });
      }

      case 'assistant': {
        const { message, context } = body;
        if (!message) {
          return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
        }
        const reply = await geminiService.creativeAssistant({ message, context });
        return NextResponse.json({ success: true, ...reply });
      }

      case 'generate-image': {
        const current = await getCurrentUser();
        if (!current) {
          return NextResponse.json(
            { error: 'Please sign in to generate images with Gemini.' },
            { status: 401 }
          );
        }

        const { prompt, aspectRatio, negativePrompt, model } = body;
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
          return NextResponse.json(
            { error: 'A creative prompt is required for image generation.' },
            { status: 400 }
          );
        }

        const trimmedPrompt = prompt.trim();
        if (trimmedPrompt.length > 2000) {
          return NextResponse.json(
            { error: 'Prompt length exceeds the 2000 character maximum limit.' },
            { status: 400 }
          );
        }

        // 5 credits per image generation
        const creditCost = 5;
        const creditAccount = dbStore.getCreditAccount(current.user.id);
        if (creditAccount.availableBalance < creditCost) {
          return NextResponse.json(
            {
              error: `Insufficient credits. You need ${creditCost} credits for Gemini image generation, but currently have ${creditAccount.availableBalance} available.`,
              requiredCredits: creditCost,
              availableBalance: creditAccount.availableBalance,
            },
            { status: 402 }
          );
        }

        // Atomically reserve the credits before invoking Gemini
        const reservationId = `gemini_img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        dbStore.reserveCredits(current.user.id, creditCost, reservationId);

        try {
          const genResult = await geminiService.generateImage({
            prompt: trimmedPrompt,
            aspectRatio: aspectRatio || '1:1',
            negativePrompt,
            model,
          });

          if (!genResult.success || !genResult.imageBuffer) {
            // Refund reserved credits immediately upon provider error
            dbStore.refundCredits(
              current.user.id,
              creditCost,
              `Gemini Image Error: ${genResult.errorCode || 'FAILED'} - ${genResult.error}`,
              reservationId
            );

            const httpStatus = genResult.errorCode === 'QUOTA_EXHAUSTED' ? 429 : 502;
            return NextResponse.json(
              {
                success: false,
                error: genResult.error || 'Gemini image generation failed.',
                errorCode: genResult.errorCode || 'PROVIDER_ERROR',
                rawDetails: genResult.rawDetails,
                preservedPrompt: trimmedPrompt,
                modelUsed: genResult.modelUsed,
              },
              { status: httpStatus }
            );
          }

          // Write binary image to public/uploads/generated
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const ext = genResult.mimeType?.includes('jpeg')
            ? 'jpg'
            : genResult.mimeType?.includes('webp')
            ? 'webp'
            : 'png';
          const filename = `gemini_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, genResult.imageBuffer);

          const publicUrl = `/uploads/generated/${filename}`;

          // Create persistent asset in user workspace
          const asset = dbStore.createAsset({
            workspaceId: current.workspace.id,
            ownerId: current.user.id,
            name: trimmedPrompt.slice(0, 48) + (trimmedPrompt.length > 48 ? '...' : ''),
            assetType: 'image',
            storageKey: `uploads/generated/${filename}`,
            url: publicUrl,
            mimeType: genResult.mimeType || 'image/png',
            fileSize: genResult.imageBuffer.length,
            metadata: {
              prompt: trimmedPrompt,
              aspectRatio: genResult.aspectRatio,
              model: genResult.modelUsed,
              provider: 'gemini',
              generatedAt: new Date().toISOString(),
            },
          });

          // Settle the reserved credits
          dbStore.settleCredits(current.user.id, reservationId, creditCost, creditCost);

          dbStore.logAudit(current.user.id, 'GEMINI_IMAGE_GENERATED', 'asset', asset.id, {
            model: genResult.modelUsed,
            prompt: trimmedPrompt.slice(0, 80),
            credits: creditCost,
          });

          const updatedAccount = dbStore.getCreditAccount(current.user.id);

          return NextResponse.json({
            success: true,
            imageUrl: publicUrl,
            asset,
            prompt: trimmedPrompt,
            aspectRatio: genResult.aspectRatio,
            modelUsed: genResult.modelUsed,
            creditsDeducted: creditCost,
            availableBalance: updatedAccount.availableBalance,
          });
        } catch (execErr: any) {
          // Safeguard refund
          try {
            dbStore.refundCredits(
              current.user.id,
              creditCost,
              `Unexpected failure: ${execErr.message}`,
              reservationId
            );
          } catch (refundErr) {
            console.error('[Fluvia Gemini] Refund failed:', refundErr);
          }

          return NextResponse.json(
            {
              success: false,
              error: execErr.message || 'Image generation processing failed.',
              errorCode: 'PROVIDER_ERROR',
              preservedPrompt: trimmedPrompt,
            },
            { status: 500 }
          );
        }
      }

      case 'generate-video': {
        const current = await getCurrentUser();
        if (!current) {
          return NextResponse.json(
            { error: 'Please sign in to generate videos with Gemini.' },
            { status: 401 }
          );
        }

        const { prompt, aspectRatio, durationSec, referenceImageUrl, model } = body;
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
          return NextResponse.json(
            { error: 'A creative prompt is required for video generation.' },
            { status: 400 }
          );
        }

        const trimmedPrompt = prompt.trim();
        // Fixed 15 credits per video requirement
        const creditCost = 15;
        const creditAccount = dbStore.getCreditAccount(current.user.id);
        if (creditAccount.availableBalance < creditCost) {
          return NextResponse.json(
            {
              error: `Insufficient credits. You need ${creditCost} credits for Gemini video generation, but currently have ${creditAccount.availableBalance} available.`,
              requiredCredits: creditCost,
              availableBalance: creditAccount.availableBalance,
            },
            { status: 402 }
          );
        }

        const reservationId = `gemini_vid_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        dbStore.reserveCredits(current.user.id, creditCost, reservationId);

        try {
          const genResult = await geminiService.generateVideo({
            prompt: trimmedPrompt,
            aspectRatio: aspectRatio || '16:9',
            durationSec: Number(durationSec) || 5,
            referenceImageUrl,
            model: model || 'gemini-omni-1.1-flash',
            jobId: reservationId,
          });

          if (!genResult.success || !genResult.videoUrl) {
            // Immediate refund on failure
            dbStore.refundCredits(
              current.user.id,
              creditCost,
              `Gemini Video Error: ${genResult.errorCode || 'FAILED'} - ${genResult.error}`,
              reservationId
            );

            const httpStatus = genResult.errorCode === 'QUOTA_EXHAUSTED' ? 429 : 502;
            return NextResponse.json(
              {
                success: false,
                error: genResult.error || 'Gemini video generation failed.',
                errorCode: genResult.errorCode || 'PROVIDER_ERROR',
                rawDetails: genResult.rawDetails,
                preservedPrompt: trimmedPrompt,
                modelUsed: genResult.modelUsed,
                refundedCredits: creditCost,
              },
              { status: httpStatus }
            );
          }

          // Settle the reserved credits
          dbStore.settleCredits(current.user.id, reservationId, creditCost, creditCost);

          const updatedAccount = dbStore.getCreditAccount(current.user.id);

          return NextResponse.json({
            success: true,
            videoUrl: genResult.videoUrl,
            thumbnailUrl: genResult.thumbnailUrl,
            prompt: trimmedPrompt,
            aspectRatio: genResult.aspectRatio,
            durationSec: genResult.durationSec,
            modelUsed: genResult.modelUsed,
            creditsDeducted: creditCost,
            availableBalance: updatedAccount.availableBalance,
          });
        } catch (execErr: any) {
          try {
            dbStore.refundCredits(
              current.user.id,
              creditCost,
              `Unexpected failure: ${execErr.message}`,
              reservationId
            );
          } catch (refundErr) {
            console.error('[Fluvia Gemini Video] Refund failed:', refundErr);
          }

          return NextResponse.json(
            {
              success: false,
              error: execErr.message || 'Video generation processing failed.',
              errorCode: 'PROVIDER_ERROR',
              preservedPrompt: trimmedPrompt,
              refundedCredits: creditCost,
            },
            { status: 500 }
          );
        }
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: "${action}". Supported: generate-video, generate-image, enhance-prompt, generate-script, generate-storyboard, marketing-copilot, assistant, status.` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[FluviaFlow Gemini API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Gemini processing failed.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Fluvia Flow Gemini AI Service',
    status: 'online',
    configured: geminiService.isConfigured(),
    model: geminiService.getModelName(),
  });
}
