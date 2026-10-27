import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';
import { pollinationsService } from '../pollinations';

export class PollinationsAdapter extends BaseAIProviderAdapter {
  readonly id = 'pollinations';
  readonly name = 'Pollinations.ai Multi-Model Engine';
  readonly type = 'multimodal' as const;

  isConfigured(): boolean {
    return pollinationsService.isConfigured();
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: true,
      supportsImage: true,
      supportsVoice: false,
      supportsScript: true,
      supportsWebhooks: false,
      maxDurationSec: 10,
      availableResolutions: ['720p', '1080p'],
      availableAspectRatios: ['16:9', '9:16', '1:1'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    if (!this.isConfigured()) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: 'Pollinations API key is not configured. Please supply POLLINATIONS_API_KEY in the server environment (.env.local). Get keys at https://enter.pollinations.ai/keys.',
      };
    }

    const isImageRequest = (input.style === 'image' || (input as any).mediaType === 'image') && !input.durationSec;

    if (isImageRequest) {
      const result = await pollinationsService.generateImage({
        prompt: input.prompt,
        model: 'black-forest-labs/flux-3-image',
      }, jobId);

      if (!result.success || !result.mediaUrl) {
        return {
          status: 'failed',
          progressPercent: 0,
          isDemoSimulated: false,
          error: result.error || 'Pollinations image generation failed.',
          metadata: { errorCode: result.errorCode },
        };
      }

      return {
        status: 'completed',
        imageUrl: result.mediaUrl,
        thumbnailUrl: result.mediaUrl,
        progressPercent: 100,
        progressMessage: 'Pollinations visual synthesis completed',
        isDemoSimulated: false,
        providerRequestId: `pollinations_${jobId}`,
      };
    }

    // Video generation
    const result = await pollinationsService.generateVideo({
      prompt: input.prompt,
      model: 'google/gemini-omni-1.1-flash',
      durationSec: input.durationSec || 5,
      aspectRatio: input.aspectRatio || '16:9',
    }, jobId);

    if (!result.success || !result.mediaUrl) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: result.error || 'Pollinations video generation failed.',
        metadata: { errorCode: result.errorCode },
      };
    }

    return {
      status: 'completed',
      videoUrl: result.mediaUrl,
      thumbnailUrl: result.mediaUrl,
      progressPercent: 100,
      progressMessage: 'Pollinations video generation completed',
      isDemoSimulated: false,
      providerRequestId: `pollinations_${jobId}`,
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
