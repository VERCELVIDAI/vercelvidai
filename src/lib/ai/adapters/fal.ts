import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class FalAdapter extends BaseAIProviderAdapter {
  readonly id = 'fal_ai';
  readonly name = 'Fal.ai Flux Vision Engine';
  readonly type = 'image' as const;

  isConfigured(): boolean {
    return !!process.env.FAL_KEY;
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: false,
      supportsImage: true,
      supportsVoice: false,
      supportsScript: false,
      supportsWebhooks: true,
      availableResolutions: ['1024x1024', '1920x1080', '1080x1920'],
      availableAspectRatios: ['1:1', '16:9', '9:16'],
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    const apiKey = process.env.FAL_KEY;

    if (!apiKey) {
      // Seeded high resolution realistic AI visual demo
      return {
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        progressPercent: 100,
        progressMessage: 'Demo Mode — Fal.ai Key not connected. Curated Flux visual sample returned.',
        isDemoSimulated: true,
        providerRequestId: `fal_sim_${jobId}`,
      };
    }

    try {
      const response = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input.prompt,
          image_size: input.aspectRatio === '9:16' ? 'portrait_16_9' : input.aspectRatio === '16:9' ? 'landscape_16_9' : 'square_hd',
        }),
      });

      if (!response.ok) {
        throw new Error(`Fal.ai API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        status: 'completed',
        imageUrl: data.images?.[0]?.url,
        thumbnailUrl: data.images?.[0]?.url,
        progressPercent: 100,
        isDemoSimulated: false,
        providerRequestId: data.request_id || `fal_${Date.now()}`,
      };
    } catch (err: any) {
      throw new Error(`Fal.ai generation error: ${err.message}`);
    }
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    return {
      status: 'completed',
      progressPercent: 100,
      isDemoSimulated: true,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85',
    };
  }
}
