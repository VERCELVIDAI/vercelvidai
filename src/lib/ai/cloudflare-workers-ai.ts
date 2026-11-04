import fs from 'fs';
import path from 'path';
import { CLOUDFLARE_MODELS, CloudflareModelInfo } from './cloudflare-constants';

export { CLOUDFLARE_MODELS };
export type { CloudflareModelInfo };

export interface CloudflareGenerateOptions {
  prompt: string;
  model?: string;
  workerUrl?: string;
  apiKey?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';
  width?: number;
  height?: number;
  numSteps?: number;
  guidance?: number;
  jobId?: string;
}

export interface CloudflareGenerateResult {
  success: boolean;
  imageUrl: string;
  modelUsed: string;
  provider: 'cloudflare-worker' | 'cloudflare-direct' | 'free-flux-fallback';
  latencyMs: number;
  error?: string;
}

export class CloudflareWorkersAIService {
  private defaultWorkerUrl = process.env.CLOUDFLARE_IMAGE_WORKER_URL || '';
  private defaultApiKey = process.env.CLOUDFLARE_IMAGE_API_KEY || '';
  private accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
  private apiToken = process.env.CLOUDFLARE_API_TOKEN || '';

  /**
   * Determine whether custom Cloudflare Worker or direct Cloudflare API credentials exist
   */
  isConfigured(): boolean {
    return Boolean(
      (this.defaultWorkerUrl && this.defaultApiKey) ||
      (this.accountId && this.apiToken)
    );
  }

  getModels(): CloudflareModelInfo[] {
    return CLOUDFLARE_MODELS;
  }

  /**
   * Calculate width & height according to aspect ratio
   */
  getDimensions(aspectRatio: string = '1:1'): { width: number; height: number } {
    switch (aspectRatio) {
      case '16:9':
        return { width: 1024, height: 576 };
      case '9:16':
        return { width: 576, height: 1024 };
      case '4:3':
        return { width: 1024, height: 768 };
      case '3:4':
        return { width: 768, height: 1024 };
      case '21:9':
        return { width: 1280, height: 544 };
      case '1:1':
      default:
        return { width: 1024, height: 1024 };
    }
  }

  /**
   * Core image generation method:
   * 1. Attempts Cloudflare Worker (if workerUrl configured or provided)
   * 2. Attempts Direct Cloudflare Workers AI API (if accountId & token configured)
   * 3. Fallback to resilient Pollinations Flux AI so the user ALWAYS gets an image
   */
  async generateImage(options: CloudflareGenerateOptions): Promise<CloudflareGenerateResult> {
    const startTime = Date.now();
    const prompt = options.prompt.trim();
    const model = options.model || '@cf/stabilityai/stable-diffusion-xl-base-1.0';
    const workerUrl = (options.workerUrl || this.defaultWorkerUrl || '').trim();
    const apiKey = (options.apiKey || this.defaultApiKey || '').trim();
    const { width, height } = this.getDimensions(options.aspectRatio);

    // ------------------------------------------------------------------------
    // Method 1: Custom Cloudflare Worker from saurav-z/free-image-generation-api
    // ------------------------------------------------------------------------
    if (workerUrl) {
      try {
        console.log(`[Cloudflare Worker AI] Sending prompt to worker: ${workerUrl}`);
        const cleanWorkerUrl = workerUrl.endsWith('/') ? workerUrl.slice(0, -1) : workerUrl;
        
        const response = await fetch(cleanWorkerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({
            prompt,
            model,
            num_steps: options.numSteps || 20,
            guidance: options.guidance || 7.5,
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('image') || contentType.includes('application/octet-stream')) {
            const buffer = Buffer.from(await response.arrayBuffer());
            const filename = `cf_${options.jobId || Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
            const publicUrl = await this.saveImageLocally(filename, buffer);

            return {
              success: true,
              imageUrl: publicUrl,
              modelUsed: model,
              provider: 'cloudflare-worker',
              latencyMs: Date.now() - startTime,
            };
          }
        } else {
          console.warn(`[Cloudflare Worker AI] Worker returned HTTP ${response.status}:`, await response.text().catch(() => ''));
        }
      } catch (err: any) {
        console.warn('[Cloudflare Worker AI] Worker request failed, falling back to direct or engine:', err.message);
      }
    }

    // ------------------------------------------------------------------------
    // Method 2: Direct Cloudflare Workers AI REST API
    // ------------------------------------------------------------------------
    if (this.accountId && this.apiToken) {
      try {
        console.log(`[Cloudflare Direct AI] Calling Cloudflare Workers AI: ${model}`);
        const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/ai/run/${model}`;
        
        const response = await fetch(cfEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiToken}`,
          },
          body: JSON.stringify({
            prompt,
            num_steps: options.numSteps || 20,
            guidance: options.guidance || 7.5,
          }),
        });

        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          const filename = `cf_direct_${options.jobId || Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
          const publicUrl = await this.saveImageLocally(filename, buffer);

          return {
            success: true,
            imageUrl: publicUrl,
            modelUsed: model,
            provider: 'cloudflare-direct',
            latencyMs: Date.now() - startTime,
          };
        }
      } catch (err: any) {
        console.warn('[Cloudflare Direct AI] Exception calling direct API:', err.message);
      }
    }

    // ------------------------------------------------------------------------
    // Method 3: Resilient Free AI Fallback Engine (Pollinations Flux / SDXL)
    // ------------------------------------------------------------------------
    try {
      console.log(`[Cloudflare Engine Fallback] Generating free image with Flux for prompt: "${prompt.slice(0, 40)}..."`);
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(prompt);
      
      // Map Cloudflare model choice to appropriate free engine model
      let fallbackModel = 'flux';
      if (model.includes('dreamshaper')) {
        fallbackModel = 'flux-anime';
      } else if (model.includes('lightning')) {
        fallbackModel = 'turbo';
      }

      const freeUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${fallbackModel}&nologo=true`;

      // In serverless environments (Vercel), return the direct CDN URL directly to avoid read-only filesystem issues
      const isServerless = Boolean(
        process.env.VERCEL || 
        process.env.AWS_LAMBDA_FUNCTION_NAME || 
        (typeof process.cwd === 'function' && process.cwd().startsWith('/var/task'))
      );

      if (isServerless) {
        return {
          success: true,
          imageUrl: freeUrl,
          modelUsed: model,
          provider: 'free-flux-fallback',
          latencyMs: Date.now() - startTime,
        };
      }

      // In local node environment, attempt saving locally with safe fallback
      try {
        const fallbackResp = await fetch(freeUrl);
        if (fallbackResp.ok) {
          const buffer = Buffer.from(await fallbackResp.arrayBuffer());
          const filename = `cf_free_${options.jobId || Date.now()}_${Math.random().toString(36).slice(2, 8)}.jpg`;
          const publicUrl = await this.saveImageLocally(filename, buffer, freeUrl);

          return {
            success: true,
            imageUrl: publicUrl,
            modelUsed: model,
            provider: 'free-flux-fallback',
            latencyMs: Date.now() - startTime,
          };
        }
      } catch {
        // Fallback to direct URL if buffer fetch fails
      }

      return {
        success: true,
        imageUrl: freeUrl,
        modelUsed: model,
        provider: 'free-flux-fallback',
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.error('[Cloudflare Engine Error]:', err);
      return {
        success: false,
        imageUrl: '',
        modelUsed: model,
        provider: 'free-flux-fallback',
        latencyMs: Date.now() - startTime,
        error: err.message || 'Image generation failed',
      };
    }
  }

  /**
   * Helper to write buffer into public/uploads/generated with serverless (Vercel) safety
   */
  private async saveImageLocally(filename: string, buffer: Buffer, fallbackUrl?: string): Promise<string> {
    try {
      const isServerless = Boolean(
        process.env.VERCEL || 
        process.env.AWS_LAMBDA_FUNCTION_NAME || 
        (typeof process.cwd === 'function' && process.cwd().startsWith('/var/task'))
      );

      if (isServerless) {
        if (fallbackUrl) return fallbackUrl;
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, buffer);
      return `/uploads/generated/${filename}`;
    } catch (err: any) {
      console.warn('[Cloudflare Workers AI] Local write skipped (Serverless/read-only filesystem):', err.message);
      if (fallbackUrl) return fallbackUrl;
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  }
}

export const cloudflareAIService = new CloudflareWorkersAIService();
