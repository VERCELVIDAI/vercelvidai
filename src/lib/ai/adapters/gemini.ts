import fs from 'fs';
import path from 'path';
import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';
import { geminiService, GEMINI_MODELS } from '../gemini';

export class GeminiAdapter extends BaseAIProviderAdapter {
  readonly id = 'gemini';
  readonly name = 'Google Gemini Omni Flash Video Engine';
  readonly type = 'multimodal' as const;

  isConfigured(): boolean {
    return geminiService.isConfigured();
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: true,
      supportsImage: true,
      supportsVoice: false,
      supportsScript: true,
      supportsWebhooks: false,
      maxDurationSec: 10,
      availableResolutions: ['360p', '720p', '1080p', '4k'],
      availableAspectRatios: ['16:9', '9:16', '1:1', '4:5', '2.39:1'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    if (!this.isConfigured()) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: 'Gemini API key is not configured. Please supply a valid GEMINI_API_KEY in the server environment (.env.local).',
      };
    }

    // Default to video generation
    const isImageRequest = (input.style === 'image' || (input as any).mediaType === 'image') && !input.durationSec;

    if (isImageRequest) {
      const ratio = (input.aspectRatio as '1:1' | '16:9' | '9:16' | '4:3' | '3:4') || '1:1';
      const result = await geminiService.generateImage({
        prompt: input.prompt,
        aspectRatio: ratio,
        negativePrompt: input.negativePrompt,
        model: GEMINI_MODELS.IMAGE_FLASH,
      });

      if (!result.success || !result.imageBuffer) {
        return {
          status: 'failed',
          progressPercent: 0,
          isDemoSimulated: false,
          error: result.error || 'Gemini image generation failed.',
          metadata: { errorCode: result.errorCode, rawDetails: result.rawDetails },
        };
      }

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = result.mimeType?.includes('jpeg') ? 'jpg' : result.mimeType?.includes('webp') ? 'webp' : 'png';
      const filename = `gemini_${jobId}_${Date.now()}.${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, result.imageBuffer);

      const publicUrl = `/uploads/generated/${filename}`;

      return {
        status: 'completed',
        imageUrl: publicUrl,
        thumbnailUrl: publicUrl,
        progressPercent: 100,
        progressMessage: 'Gemini visual synthesis completed',
        isDemoSimulated: false,
        providerRequestId: `gemini_${jobId}`,
      };
    }

    // Video generation via Gemini Omni 1.1 Flash
    const ratio = input.aspectRatio || '16:9';
    const videoResult = await geminiService.generateVideo({
      prompt: input.prompt,
      aspectRatio: ratio,
      durationSec: input.durationSec || 5,
      referenceImageUrl: input.referenceImageUrl || input.sourceImageUrl,
      model: GEMINI_MODELS.VIDEO_OMNI_FLASH,
      jobId,
    });

    if (!videoResult.success) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: videoResult.error || 'Gemini video generation failed.',
        metadata: {
          errorCode: videoResult.errorCode,
          rawDetails: videoResult.rawDetails,
          refundedCredits: 15,
        },
      };
    }

    return {
      status: 'completed',
      videoUrl: videoResult.videoUrl,
      thumbnailUrl: videoResult.thumbnailUrl,
      progressPercent: 100,
      progressMessage: 'Gemini Omni 1.1 Flash video generation completed successfully',
      isDemoSimulated: false,
      providerRequestId: `gemini_omni_${jobId}`,
      metadata: {
        modelUsed: videoResult.modelUsed,
        aspectRatio: videoResult.aspectRatio,
        durationSec: videoResult.durationSec,
      },
    };
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'completed',
      progressPercent: 100,
      isDemoSimulated: false,
      providerRequestId,
    };
  }
}

// Backward compatibility alias
export const GeminiImageAdapter = GeminiAdapter;
