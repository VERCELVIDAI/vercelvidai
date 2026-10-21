import { IAIProviderAdapter, AIProviderCapabilities, GenerationInputPayload, GenerationResultPayload } from '../types';

export abstract class BaseAIProviderAdapter implements IAIProviderAdapter {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly type: 'video' | 'image' | 'audio' | 'text' | 'multimodal';

  abstract isConfigured(): boolean;
  abstract getCapabilities(): AIProviderCapabilities;

  validateInput(input: GenerationInputPayload): { valid: boolean; error?: string } {
    if (!input.prompt && !input.scriptText && !input.referenceImageUrl) {
      return { valid: false, error: 'A prompt, script text, or reference image is required.' };
    }
    return { valid: true };
  }

  abstract startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload>;
  abstract checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload>;
}
