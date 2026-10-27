import fs from 'fs';
import path from 'path';

export interface PollinationsImageOptions {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
  negativePrompt?: string;
}

export interface PollinationsVideoOptions {
  prompt: string;
  model?: string;
  durationSec?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface PollinationsGenerationResult {
  success: boolean;
  mediaUrl?: string;
  mediaBuffer?: Buffer;
  modelUsed: string;
  error?: string;
  errorCode?: string;
}

class PollinationsService {
  private readonly baseUrl = 'https://gen.pollinations.ai';

  getApiKey(): string | null {
    const key = process.env.POLLINATIONS_API_KEY;
    if (!key || key.trim() === '' || key.startsWith('your_')) {
      return null;
    }
    return key.trim();
  }

  isConfigured(): boolean {
    return Boolean(this.getApiKey());
  }

  private getAuthHeaders(): Record<string, string> {
    const key = this.getApiKey();
    return key ? { Authorization: `Bearer ${key}` } : {};
  }

  /**
   * Generate an image using Pollinations AI
   * Supports models like: black-forest-labs/flux-3-image, google/gemini-nano-banana-2.1, bytedance/seedream-5.0-flash
   */
  async generateImage(options: PollinationsImageOptions, jobId?: string): Promise<PollinationsGenerationResult> {
    const model = options.model || 'black-forest-labs/flux-3-image';
    const width = options.width || 1024;
    const height = options.height || 1024;

    const encodedPrompt = encodeURIComponent(options.prompt);
    let url = `${this.baseUrl}/image/${encodedPrompt}?model=${encodeURIComponent(model)}&width=${width}&height=${height}&nologo=true`;
    if (options.seed) {
      url += `&seed=${options.seed}`;
    }

    try {
      console.log(`[Pollinations] Requesting image with model ${model} at ${url.slice(0, 100)}...`);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Pollinations Image Error ${response.status}]:`, errText);
        return {
          success: false,
          modelUsed: model,
          error: `Pollinations image generation failed (HTTP ${response.status}): ${errText.slice(0, 200)}`,
          errorCode: response.status === 401 ? 'UNAUTHORIZED' : 'PROVIDER_ERROR',
        };
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `pollinations_${jobId || Date.now()}_${Date.now()}.png`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      return {
        success: true,
        mediaUrl: `/uploads/generated/${filename}`,
        mediaBuffer: buffer,
        modelUsed: model,
      };
    } catch (err: any) {
      console.error('[Pollinations Image Exception]:', err);
      return {
        success: false,
        modelUsed: model,
        error: err.message || 'Network exception connecting to Pollinations API',
        errorCode: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Generate a video using Pollinations AI
   * Supports models like: google/gemini-omni-1.1-flash, google/veo-3.1-fast, bytedance/seedance-2.0
   */
  async generateVideo(options: PollinationsVideoOptions, jobId?: string): Promise<PollinationsGenerationResult> {
    const model = options.model || 'google/gemini-omni-1.1-flash';
    const duration = options.durationSec || 5;

    const encodedPrompt = encodeURIComponent(options.prompt);
    const url = `${this.baseUrl}/video/${encodedPrompt}?model=${encodeURIComponent(model)}&duration=${duration}`;

    try {
      console.log(`[Pollinations] Requesting video with model ${model} at ${url.slice(0, 100)}...`);
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Pollinations Video Error ${response.status}]:`, errText);
        return {
          success: false,
          modelUsed: model,
          error: `Pollinations video generation failed (HTTP ${response.status}): ${errText.slice(0, 200)}`,
          errorCode: response.status === 401 ? 'UNAUTHORIZED' : 'PROVIDER_ERROR',
        };
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `pollinations_vid_${jobId || Date.now()}_${Date.now()}.mp4`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);

      return {
        success: true,
        mediaUrl: `/uploads/generated/${filename}`,
        mediaBuffer: buffer,
        modelUsed: model,
      };
    } catch (err: any) {
      console.error('[Pollinations Video Exception]:', err);
      return {
        success: false,
        modelUsed: model,
        error: err.message || 'Network exception connecting to Pollinations API',
        errorCode: 'NETWORK_ERROR',
      };
    }
  }
}

export const pollinationsService = new PollinationsService();
