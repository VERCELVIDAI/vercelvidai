// ==============================================================================
// VERCEL VIDAI - AI PROVIDER ARCHITECTURE INTERFACES (SECTION 9)
// ==============================================================================

export interface AIProviderCapabilities {
  supportsVideo: boolean;
  supportsImage: boolean;
  supportsVoice: boolean;
  supportsScript: boolean;
  supportsWebhooks: boolean;
  maxDurationSec?: number;
  availableResolutions?: string[];
  availableAspectRatios?: string[];
}

export interface GenerationInputPayload {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  durationSec?: number;
  resolution?: string;
  referenceImageUrl?: string;
  sourceImageUrl?: string;
  scriptText?: string;
  voiceId?: string;
  style?: string;
  seed?: number;
}

export interface GenerationResultPayload {
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  transcript?: string;
  progressPercent: number;
  progressMessage?: string;
  isDemoSimulated: boolean;
  providerRequestId?: string;
  metadata?: Record<string, any>;
  error?: string;
}

export interface IAIProviderAdapter {
  readonly id: string;
  readonly name: string;
  readonly type: 'video' | 'image' | 'audio' | 'text' | 'multimodal';

  isConfigured(): boolean;
  getCapabilities(): AIProviderCapabilities;
  validateInput(input: GenerationInputPayload): { valid: boolean; error?: string };
  startGeneration(input: GenerationInputPayload, jobId: string): Promise<GenerationResultPayload>;
  checkStatus(providerRequestId: string, jobId: string): Promise<GenerationResultPayload>;
}
