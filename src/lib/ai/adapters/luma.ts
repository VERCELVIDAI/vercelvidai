import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class LumaAdapter extends BaseAIProviderAdapter {
  readonly id = 'luma';
  readonly name = 'Luma Dream Machine Ray';
  readonly type = 'video' as const;

  isConfigured(): boolean {
    return false;
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: true,
      supportsImage: false,
      supportsVoice: false,
      supportsScript: false,
      supportsWebhooks: false,
      maxDurationSec: 10,
      availableResolutions: ['1080p'],
      availableAspectRatios: ['16:9', '9:16', '1:1'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'failed',
      progressPercent: 0,
      isDemoSimulated: false,
      error: 'Luma Dream Machine Ray is currently Coming Soon. Google Gemini (gemini-omni-1.1-flash) is the only active generation model.',
    };
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'failed',
      progressPercent: 0,
      isDemoSimulated: false,
      error: 'Luma Dream Machine Ray is currently Coming Soon.',
    };
  }
}

export const lumaAdapter = new LumaAdapter();
