import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class FluviaCoreAdapter extends BaseAIProviderAdapter {
  readonly id = 'fluvia_core';
  readonly name = 'Fluvia Neural Motion Engine';
  readonly type = 'multimodal' as const;

  isConfigured(): boolean {
    return false;
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: true,
      supportsImage: true,
      supportsVoice: false,
      supportsScript: true,
      supportsWebhooks: false,
      maxDurationSec: 15,
      availableResolutions: ['720p', '1080p', '4k'],
      availableAspectRatios: ['16:9', '9:16', '1:1', '21:9'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'failed',
      progressPercent: 0,
      isDemoSimulated: false,
      error: 'Fluvia Cinematic Core is currently Coming Soon. Google Gemini (gemini-omni-1.1-flash) is the only active generation model.',
    };
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'failed',
      progressPercent: 0,
      isDemoSimulated: false,
      error: 'Fluvia Cinematic Core is currently Coming Soon.',
    };
  }
}

export const fluviaCoreAdapter = new FluviaCoreAdapter();
export const VidaiCoreAdapter = FluviaCoreAdapter;
