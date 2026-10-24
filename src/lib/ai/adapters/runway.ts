import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class RunwayAdapter extends BaseAIProviderAdapter {
  readonly id = 'runway';
  readonly name = 'Runway Gen-3 Alpha';
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
      supportsWebhooks: true,
      maxDurationSec: 15,
      availableResolutions: ['1080p', '4k'],
      availableAspectRatios: ['16:9', '9:16'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'failed',
      progressPercent: 0,
      isDemoSimulated: false,
      error: 'Runway Gen-3 is currently Coming Soon. Google Gemini (gemini-omni-1.1-flash) is the only active generation model.',
    };
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'failed',
      progressPercent: 0,
      isDemoSimulated: false,
      error: 'Runway Gen-3 is currently Coming Soon.',
    };
  }
}

export const runwayAdapter = new RunwayAdapter();
