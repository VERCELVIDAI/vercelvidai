import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class RunwayAdapter extends BaseAIProviderAdapter {
  readonly id = 'runway';
  readonly name = 'Runway Gen-3 Alpha';
  readonly type = 'video' as const;

  isConfigured(): boolean {
    return !!process.env.RUNWAY_API_KEY;
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
    const apiKey = process.env.RUNWAY_API_KEY;

    if (!apiKey) {
      // Return honest Demo Mode fallback
      return {
        status: 'completed',
        videoUrl: '/media/templates/tmpl-04-fashion-campaign.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
        progressPercent: 100,
        progressMessage: 'Demo Mode — Runway API Key not connected. Returning high-fidelity sample.',
        isDemoSimulated: true,
        providerRequestId: `rwy_sim_${jobId}`,
      };
    }

    try {
      const payload: Record<string, any> = {
        promptText: input.prompt,
        model: 'gen3a_turbo',
        duration: input.durationSec === 10 ? 10 : 5,
        ratio: input.aspectRatio === '9:16' ? '9:16' : '16:9',
        promptImage: input.sourceImageUrl || input.referenceImageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1280&auto=format&fit=crop&q=80',
      };

      const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-Runway-Version': '2024-09-13',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Runway API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        status: 'processing',
        progressPercent: 20,
        progressMessage: 'Task submitted to Runway Gen-3 rendering queue',
        isDemoSimulated: false,
        providerRequestId: data.id,
      };
    } catch (err: any) {
      throw new Error(`Runway generation failed: ${err.message}`);
    }
  }

  async checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload> {
    const apiKey = process.env.RUNWAY_API_KEY;
    if (!apiKey) {
      return {
        status: 'completed',
        progressPercent: 100,
        isDemoSimulated: true,
        videoUrl: '/media/templates/tmpl-04-fashion-campaign.mp4',
      };
    }

    const response = await fetch(`https://api.dev.runwayml.com/v1/tasks/${providerRequestId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Runway-Version': '2024-09-13',
      },
    });

    const data = await response.json();
    if (data.status === 'SUCCEEDED') {
      return {
        status: 'completed',
        progressPercent: 100,
        videoUrl: data.output?.[0],
        isDemoSimulated: false,
      };
    } else if (data.status === 'FAILED') {
      return {
        status: 'failed',
        progressPercent: 0,
        error: data.failure || 'Runway task failed',
        isDemoSimulated: false,
      };
    }

    return {
      status: 'processing',
      progressPercent: Math.round((data.progress || 0.4) * 100),
      isDemoSimulated: false,
    };
  }
}
