import { IAIProviderAdapter } from './types';
import { FluviaCoreAdapter } from './adapters/fluvia-core';
import { RunwayAdapter } from './adapters/runway';
import { LumaAdapter } from './adapters/luma';
import { FalAdapter } from './adapters/fal';
import { ElevenLabsAdapter } from './adapters/elevenlabs';
import { OpenAIAdapter } from './adapters/openai';

class ProviderRegistry {
  private adapters: Map<string, IAIProviderAdapter> = new Map();

  constructor() {
    const fluviaCore = new FluviaCoreAdapter();
    this.register(fluviaCore);
    // Backward-compatibility alias for stored records referencing 'vidai_core'
    this.adapters.set('vidai_core', fluviaCore);

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
    // Return unique adapters
    return Array.from(new Set(this.adapters.values()));
  }
}

export const aiProviderRegistry = new ProviderRegistry();
