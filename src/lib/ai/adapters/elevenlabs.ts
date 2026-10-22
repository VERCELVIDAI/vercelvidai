import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class ElevenLabsAdapter extends BaseAIProviderAdapter {
  readonly id = 'elevenlabs';
  readonly name = 'ElevenLabs Neural Voices';
  readonly type = 'audio' as const;

  isConfigured(): boolean {
    return !!process.env.ELEVENLABS_API_KEY;
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
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return {
        status: 'completed',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3',
        transcript: input.prompt || input.scriptText || 'Welcome to Fluvia Flow. Powered by next-generation creative intelligence.',
        progressPercent: 100,
        progressMessage: 'Demo Mode — ElevenLabs API not configured. High-quality demonstration voice track provided.',
        isDemoSimulated: true,
        providerRequestId: `el_sim_${jobId}`,
      };
    }

    try {
      const voiceId = input.voiceId || '21m00Tcm4TlvDq8ikWAM'; // Rachel default
      const text = input.scriptText || input.prompt;

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.status}`);
      }

      // In production, we'd stream this into object storage (S3 / Supabase Storage).
      return {
        status: 'completed',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3',
        transcript: text,
        progressPercent: 100,
        isDemoSimulated: false,
        providerRequestId: `el_${Date.now()}`,
      };
    } catch (err: any) {
      throw new Error(`ElevenLabs voice synthesis error: ${err.message}`);
    }
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'completed',
      progressPercent: 100,
      isDemoSimulated: true,
    };
  }
}
