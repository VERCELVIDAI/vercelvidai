import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';
import { elevenLabsService } from '../elevenlabs';

export class ElevenLabsAdapter extends BaseAIProviderAdapter {
  readonly id = 'elevenlabs';
  readonly name = 'ElevenLabs Neural Voices';
  readonly type = 'audio' as const;

  isConfigured(): boolean {
    return elevenLabsService.isConfigured();
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: false,
      supportsImage: false,
      supportsVoice: true,
      supportsScript: false,
      supportsWebhooks: false,
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    if (!this.isConfigured()) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: 'ElevenLabs API key is not configured. Please supply ELEVENLABS_API_KEY in the server environment (.env.local).',
      };
    }

    const text = input.scriptText || input.prompt;
    if (!text) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: 'Please provide script text or prompt for voiceover generation.',
      };
    }

    const result = await elevenLabsService.generateVoiceover({
      text,
      voiceId: input.voiceId || 'JBFqnCBsd6RMkjVDRZzb',
      modelId: 'eleven_v4',
    }, jobId);

    if (!result.success || !result.audioUrl) {
      return {
        status: 'failed',
        progressPercent: 0,
        isDemoSimulated: false,
        error: result.error || 'ElevenLabs voice generation failed.',
        metadata: { errorCode: result.errorCode },
      };
    }

    return {
      status: 'completed',
      audioUrl: result.audioUrl,
      transcript: text,
      progressPercent: 100,
      progressMessage: 'ElevenLabs neural speech synthesis completed',
      isDemoSimulated: false,
      providerRequestId: `el_${jobId}`,
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
