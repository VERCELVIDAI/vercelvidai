import fs from 'fs';
import path from 'path';
import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';
import { geminiService, GEMINI_MODELS } from '../gemini';

export class GeminiImageAdapter extends BaseAIProviderAdapter {
  readonly id = 'gemini';
  readonly name = 'Google Gemini Imagen Vision Engine';
  readonly type = 'image' as const;

  isConfigured(): boolean {
    return geminiService.isConfigured();
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: false,
      supportsImage: true,
      supportsVoice: false,
      supportsScript: true,
      supportsWebhooks: false,
      availableResolutions: ['1024x1024', '1920x1080', '1080x1920'],
      availableAspectRatios: ['1:1', '16:9', '9:16', '4:3', '3:4'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API is not configured. Please supply a valid GEMINI_API_KEY.');
    }

    const ratio = (input.aspectRatio as '1:1' | '16:9' | '9:16' | '4:3' | '3:4') || '1:1';
    const result = await geminiService.generateImage({
      prompt: input.prompt,
      aspectRatio: ratio,
      negativePrompt: input.negativePrompt,
      model: GEMINI_MODELS.IMAGE_FLASH,
    });

    if (!result.success || !result.imageBuffer) {
      throw new Error(result.error || 'Gemini image generation failed.');
    }

    // Persist generated image to disk
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = result.mimeType?.includes('jpeg')
      ? 'jpg'
      : result.mimeType?.includes('webp')
      ? 'webp'
      : 'png';
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

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'completed',
      progressPercent: 100,
      isDemoSimulated: false,
      providerRequestId,
    };
  }
}
