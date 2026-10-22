import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class LumaAdapter extends BaseAIProviderAdapter {
  readonly id = 'luma';
  readonly name = 'Luma Dream Machine Ray';
  readonly type = 'video' as const;

  isConfigured(): boolean {
    return !!process.env.LUMA_API_KEY;
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: true,
      supportsImage: false,
      supportsVoice: false,
      supportsScript: false,
      supportsWebhooks: true,
      maxDurationSec: 10,
      availableResolutions: ['1080p'],
      availableAspectRatios: ['16:9', '9:16', '1:1'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    const apiKey = process.env.LUMA_API_KEY;

    if (!apiKey) {
      return {
        status: 'completed',
        videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        progressPercent: 100,
        progressMessage: 'Demo Mode — Luma Dream Machine API not connected. Seeded demo asset provided.',
        isDemoSimulated: true,
        providerRequestId: `luma_sim_${jobId}`,
      };
    }

    try {
      const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.prompt,
          aspect_ratio: input.aspectRatio || '16:9',
        }),
      });

      if (!response.ok) {
        throw new Error(`Luma API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: 'processing',
        progressPercent: 15,
        progressMessage: 'Luma ray tracing simulation started',
        isDemoSimulated: false,
        providerRequestId: data.id,
      };
    } catch (err: any) {
      throw new Error(`Luma generation error: ${err.message}`);
    }
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      return {
        status: 'completed',
        progressPercent: 100,
        isDemoSimulated: true,
        videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
      };
    }

    const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${providerRequestId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    const data = await response.json();

    if (data.state === 'completed') {
      return {
        status: 'completed',
        progressPercent: 100,
        videoUrl: data.assets?.video,
        isDemoSimulated: false,
      };
    } else if (data.state === 'failed') {
      return {
        status: 'failed',
        progressPercent: 0,
        error: data.failure_reason || 'Luma generation failed',
        isDemoSimulated: false,
      };
    }

    return {
      status: 'processing',
      progressPercent: 50,
      isDemoSimulated: false,
    };
  }
}
