import { IAIProviderAdapter } from './types';
import { VidaiCoreAdapter } from './adapters/vidai-core';
import { RunwayAdapter } from './adapters/runway';
import { LumaAdapter } from './adapters/luma';
import { FalAdapter } from './adapters/fal';
import { ElevenLabsAdapter } from './adapters/elevenlabs';
import { OpenAIAdapter } from './adapters/openai';

class ProviderRegistry {
  private adapters: Map<string, IAIProviderAdapter> = new Map();

  constructor() {
    this.register(new VidaiCoreAdapter());
    this.register(new RunwayAdapter());
    this.register(new LumaAdapter());
    this.register(new FalAdapter());
    this.register(new ElevenLabsAdapter());
    this.register(new OpenAIAdapter());
  }

  register(adapter: IAIProviderAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): IAIProviderAdapter | undefined {
    return this.adapters.get(id);
  }

  getAll(): IAIProviderAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const aiProviderRegistry = new ProviderRegistry();
