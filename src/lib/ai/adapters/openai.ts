import { BaseAIProviderAdapter } from './base';
import { AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export class OpenAIAdapter extends BaseAIProviderAdapter {
  readonly id = 'openai';
  readonly name = 'OpenAI Script & Storyboard Engine';
  readonly type = 'text' as const;

  isConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
  }

  getCapabilities(): AIProviderCapabilities {
    return {
      supportsVideo: false,
      supportsImage: false,
      supportsVoice: false,
      supportsScript: true,
      supportsWebhooks: false,
    };
  }

  async startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // High-quality structured storyboard response for Script-to-Video demo
      const prompt = input.prompt || 'product ad';
      const sampleStoryboard = {
        title: `Cinematic Script: ${prompt.slice(0, 40)}`,
        scenes: [
          {
            sceneNumber: 1,
            visualPrompt: `Dramatic slow motion hook displaying ${prompt}. Cinematic lighting, shallow depth of field.`,
            narration: 'What if you could turn simple thoughts into viral video moments with one click?',
            durationSec: 4,
          },
          {
            sceneNumber: 2,
            visualPrompt: `Dynamic camera glide showcasing core value proposition and sleek design details.`,
            narration: 'Engineered for top creators and marketing teams who refuse to settle.',
            durationSec: 5,
          },
          {
            sceneNumber: 3,
            visualPrompt: `High-energy concluding shot with radiant lighting and prominent brand CTA overlay.`,
            narration: 'Start creating the future today with Fluvia Flow.',
            durationSec: 5,
          },
        ],
      };

      return {
        status: 'completed',
        transcript: JSON.stringify(sampleStoryboard),
        progressPercent: 100,
        progressMessage: 'Demo Mode — OpenAI API key not connected. Curated AI storyboard generated.',
        isDemoSimulated: true,
        providerRequestId: `oai_sim_${jobId}`,
        metadata: sampleStoryboard,
      };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an award-winning video director and copywriter. Format your output as JSON with title and scenes array (each scene having sceneNumber, visualPrompt, narration, durationSec).',
            },
            {
              role: 'user',
              content: `Create a video script and storyboard for: "${input.prompt}". Target duration: ${input.durationSec || 15} seconds.`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      return {
        status: 'completed',
        transcript: content,
        progressPercent: 100,
        isDemoSimulated: false,
        providerRequestId: data.id,
        metadata: JSON.parse(content || '{}'),
      };
    } catch (err: any) {
      throw new Error(`OpenAI script generation error: ${err.message}`);
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
