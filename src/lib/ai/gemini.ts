/**
 * ==============================================================================
 * FLUVIA FLOW — GEMINI AI INTEGRATION SERVICE
 * ==============================================================================
 * Dedicated server-side Gemini service using official @google/genai SDK.
 * Handles: Prompt Enhancement, Scriptwriting, Structured Storyboard JSON,
 * Cinematic Director Guidance, Marketing Copilot, and Workspace AI Assistant.
 */

import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { pollinationsService } from './pollinations';

// Configurable model IDs
export const GEMINI_MODELS = {
  FLASH: process.env.GEMINI_FLASH_MODEL || 'gemini-3.5-flash',
  PRO: process.env.GEMINI_PRO_MODEL || 'gemini-3.5-flash',
  NEXT: process.env.GEMINI_NEXT_MODEL || 'gemini-3.5-flash',
  IMAGE_FLASH: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image',
  IMAGE_PRO: 'gemini-3-pro-image',
  IMAGE_FALLBACK: 'gemini-2.5-flash-image',
  VIDEO_OMNI_FLASH: process.env.GEMINI_VIDEO_MODEL || 'gemini-omni-1.1-flash',
} as const;

// Structured Storyboard Schema
export const StoryboardSceneSchema = z.object({
  sceneNumber: z.number(),
  sceneDuration: z.number().default(5),
  narration: z.string().default(''),
  visualPrompt: z.string(),
  cameraDirection: z.enum([
    'Static',
    'Dolly in',
    'Dolly out',
    'Tracking shot',
    'Orbit',
    'Crane movement',
    'Handheld',
    'Aerial movement',
  ]).default('Static'),
  transition: z.string().default('Cut'),
  requiredAssets: z.array(z.string()).default([]),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '21:9']).default('16:9'),
  suggestedModel: z.string().default('fluvia-cinematic-v1'),
});

export const StoryboardSchema = z.object({
  projectTitle: z.string(),
  concept: z.string(),
  targetAudience: z.string().default('General Creators'),
  visualDirection: z.string(),
  totalDurationSec: z.number().default(15),
  scenes: z.array(StoryboardSceneSchema),
});

export type StoryboardScene = z.infer<typeof StoryboardSceneSchema>;
export type StoryboardData = z.infer<typeof StoryboardSchema>;

export interface PromptEnhancementResult {
  originalPrompt: string;
  enhancedPrompt: string;
  cinematicStyle: string;
  lightingCues: string;
  cameraMovement: string;
  suggestedAspectRatio: string;
  suggestedDuration: number;
  negativePrompt: string;
  isSimulated?: boolean;
}

export interface ScriptGenerationResult {
  title: string;
  targetPlatform: string;
  hook: string;
  bodyNarration: string;
  callToAction: string;
  estimatedDurationSec: number;
  voiceoverDirection: string;
  scenes: Array<{
    timestamp: string;
    narration: string;
    visualDirection: string;
  }>;
  isSimulated?: boolean;
}

export interface MarketingCopilotResult {
  productName: string;
  campaignTitle: string;
  hookAngles: string[];
  primaryScript: string;
  creativeDirections: string[];
  storyboard: StoryboardData;
  targetAudienceAnalysis: string;
  isSimulated?: boolean;
}

class GeminiService {
  private getClient(): GoogleGenAI | null {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.trim() === '' || key.startsWith('your_')) {
      return null;
    }
    try {
      return new GoogleGenAI({ apiKey: key.trim() });
    } catch {
      return null;
    }
  }

  private async generateWithFallback(
    client: GoogleGenAI,
    request: { model?: string; contents: any }
  ) {
    const primaryModel = request.model || GEMINI_MODELS.FLASH;
    try {
      return await client.models.generateContent({
        ...request,
        model: primaryModel,
      });
    } catch (primaryErr: any) {
      const errMsg = primaryErr?.message || String(primaryErr);
      console.warn(`[FluviaFlow Gemini] Primary model ${primaryModel} failed: ${errMsg}`);
      // Fallback to flash-lite if primary model has demand spike (503) or quota issues
      const fallbackModel = primaryModel === GEMINI_MODELS.NEXT ? 'gemini-3.8-flash' : GEMINI_MODELS.NEXT;
      console.info(`[FluviaFlow Gemini] Retrying with fallback model ${fallbackModel}...`);
      return await client.models.generateContent({
        ...request,
        model: fallbackModel,
      });
    }
  }

  public isConfigured(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return Boolean(key && key.trim() !== '' && !key.startsWith('your_'));
  }

  public getModelName(): string {
    return GEMINI_MODELS.FLASH;
  }

  /**
   * Capability A & D: Prompt Enhancement & Cinematic Direction
   */
  async enhancePrompt(params: {
    prompt: string;
    aspectRatio?: string;
    stylePreference?: string;
    cameraMovement?: string;
  }): Promise<PromptEnhancementResult> {
    const client = this.getClient();
    const ratio = params.aspectRatio || '16:9';
    const camera = params.cameraMovement || 'Dolly in';
    const style = params.stylePreference || 'Cinematic Photoreal';

    if (!client) {
      // High-quality simulated fallback matching Fluvia Flow's creative standard
      return {
        originalPrompt: params.prompt,
        enhancedPrompt: `${params.prompt}, shot on 35mm anamorphic lens, Kodak 2383 color timing, volumetric atmospheric haze, hyper-detailed texture, shallow depth of field, ${camera.toLowerCase()}, hyper-realistic 8k cinema render.`,
        cinematicStyle: style,
        lightingCues: 'Soft cinematic key light with cool rim separation and diffused amber fill',
        cameraMovement: camera,
        suggestedAspectRatio: ratio,
        suggestedDuration: 5,
        negativePrompt: 'blurry, oversaturated, low-res, plastic texture, distorted geometry, cartoonish, watermark',
        isSimulated: true,
      };
    }

    try {
      const systemInstruction = `You are the Cinematic Prompt Director at Fluvia Flow, a world-class AI video studio.
Your job is to transform raw user ideas into production-ready prompts for video generation models (Runway, Luma, Fal Flux).
Focus on: camera lenses (e.g. 35mm anamorphic), lighting setups, physics, texture fidelity, cinematic color science.
Output strictly valid JSON with keys:
{
  "enhancedPrompt": string,
  "cinematicStyle": string,
  "lightingCues": string,
  "cameraMovement": string,
  "suggestedAspectRatio": string,
  "suggestedDuration": number,
  "negativePrompt": string
}`;

      const response = await this.generateWithFallback(client, {
        model: GEMINI_MODELS.FLASH,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nUser Idea: "${params.prompt}"\nPreferred Camera Movement: "${camera}"\nAspect Ratio: "${ratio}"\nStyle: "${style}"`,
              },
            ],
          },
        ],
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        originalPrompt: params.prompt,
        enhancedPrompt: parsed.enhancedPrompt || params.prompt,
        cinematicStyle: parsed.cinematicStyle || style,
        lightingCues: parsed.lightingCues || 'Volumetric lighting',
        cameraMovement: parsed.cameraMovement || camera,
        suggestedAspectRatio: parsed.suggestedAspectRatio || ratio,
        suggestedDuration: parsed.suggestedDuration || 5,
        negativePrompt: parsed.negativePrompt || 'blurry, distorted, low quality',
        isSimulated: false,
      };
    } catch (err) {
      console.warn('[FluviaFlow Gemini] Fallback used due to API error:', err);
      return {
        originalPrompt: params.prompt,
        enhancedPrompt: `${params.prompt}, cinematic composition, 35mm anamorphic photography, master lighting, rich depth of field, subtle film grain, ${camera.toLowerCase()}.`,
        cinematicStyle: style,
        lightingCues: 'Atmospheric natural lighting with gentle backlight',
        cameraMovement: camera,
        suggestedAspectRatio: ratio,
        suggestedDuration: 5,
        negativePrompt: 'low quality, blurry, deformed, noisy artifacts',
        isSimulated: true,
      };
    }
  }

  /**
   * Capability B: Scriptwriting for short-form, advertising & narration
   */
  async generateScript(params: {
    topic: string;
    platform?: 'reels' | 'youtube' | 'commercial' | 'explainer';
    tone?: string;
    durationSec?: number;
  }): Promise<ScriptGenerationResult> {
    const client = this.getClient();
    const platform = params.platform || 'reels';
    const tone = params.tone || 'Dynamic & Engaging';
    const targetSec = params.durationSec || 15;

    if (!client) {
      return {
        title: `Visual Journey: ${params.topic}`,
        targetPlatform: platform,
        hook: `Stop scrolling. What if everything you knew about ${params.topic} was about to change?`,
        bodyNarration: `Inside every moment lies a cinematic transformation waiting to unfold. Experience the precision of next-generation visual design.`,
        callToAction: `Create your vision in motion now with Fluvia Flow.`,
        estimatedDurationSec: targetSec,
        voiceoverDirection: 'Confident, measured, cinematic tone with subtle gravitas.',
        scenes: [
          {
            timestamp: '00:00 - 00:05',
            narration: `Stop scrolling. What if everything you knew about ${params.topic} was about to change?`,
            visualDirection: 'Extreme close up, dynamic focus rack with anamorphic lens flares.',
          },
          {
            timestamp: '00:05 - 00:10',
            narration: `Inside every moment lies a cinematic transformation waiting to unfold.`,
            visualDirection: 'Fluid camera dolly through luminous atmospheric particles.',
          },
          {
            timestamp: '00:10 - 00:15',
            narration: `Create your vision in motion now with Fluvia Flow.`,
            visualDirection: 'Epic wide perspective reveal with brand typography and playframe mark.',
          },
        ],
        isSimulated: true,
      };
    }

    try {
      const systemInstruction = `You are Fluvia Flow's Principal Scriptwriter. Write a commercial or creative script optimized for ${platform} with tone: ${tone}.
Target duration: ${targetSec} seconds.
Output strictly valid JSON with schema:
{
  "title": string,
  "targetPlatform": string,
  "hook": string,
  "bodyNarration": string,
  "callToAction": string,
  "estimatedDurationSec": number,
  "voiceoverDirection": string,
  "scenes": [
    { "timestamp": string, "narration": string, "visualDirection": string }
  ]
}`;

      const response = await this.generateWithFallback(client, {
        model: GEMINI_MODELS.FLASH,
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nConcept / Topic: "${params.topic}"` }],
          },
        ],
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        ...parsed,
        isSimulated: false,
      };
    } catch {
      return this.generateScript({ ...params, platform }); // return fallback
    }
  }

  /**
   * Capability C: Structured Storyboard Generation with Zod Schema Validation
   */
  async generateStoryboard(params: {
    concept: string;
    targetAudience?: string;
    aspectRatio?: '16:9' | '9:16' | '1:1' | '21:9';
    sceneCount?: number;
  }): Promise<StoryboardData> {
    const client = this.getClient();
    const ratio = params.aspectRatio || '16:9';
    const sceneCount = params.sceneCount || 3;

    if (!client) {
      const fallback: StoryboardData = {
        projectTitle: `Cinematic Project: ${params.concept.slice(0, 30)}`,
        concept: params.concept,
        targetAudience: params.targetAudience || 'Modern Creators & Brand Marketers',
        visualDirection: 'Moody high-contrast cinematic realism, soft natural rim lighting, deep charcoal tones.',
        totalDurationSec: sceneCount * 5,
        scenes: [
          {
            sceneNumber: 1,
            sceneDuration: 5,
            narration: 'Every great narrative begins with a single defining frame.',
            visualPrompt: `Opening establishing scene for ${params.concept}, cinematic wide angle, dusk lighting, 35mm anamorphic.`,
            cameraDirection: 'Dolly in',
            transition: 'Cut',
            requiredAssets: ['reference_visual_1'],
            aspectRatio: ratio,
            suggestedModel: 'fluvia-cinematic-v1',
          },
          {
            sceneNumber: 2,
            sceneDuration: 5,
            narration: 'Movement reveals the emotion beneath the surface.',
            visualPrompt: `Dynamic kinetic sequence detailing ${params.concept}, high frame-rate motion blur, rich atmospheric mist.`,
            cameraDirection: 'Tracking shot',
            transition: 'Whip Pan',
            requiredAssets: ['motion_element_2'],
            aspectRatio: ratio,
            suggestedModel: 'runway-gen3',
          },
          {
            sceneNumber: 3,
            sceneDuration: 5,
            narration: 'Your imagination, transformed into reality.',
            visualPrompt: `Culminating triumphant visual framing for ${params.concept}, pristine lighting, elegant depth of field.`,
            cameraDirection: 'Crane movement',
            transition: 'Fade to black',
            requiredAssets: ['hero_asset_3'],
            aspectRatio: ratio,
            suggestedModel: 'luma-ray',
          },
        ],
      };
      return fallback;
    }

    try {
      const systemInstruction = `You are Fluvia Flow's AI Storyboard Director.
Break down the concept into a structured ${sceneCount}-scene storyboard.
Valid cameraDirection must be one of: "Static", "Dolly in", "Dolly out", "Tracking shot", "Orbit", "Crane movement", "Handheld", "Aerial movement".
Valid aspectRatio must be: "${ratio}".
Return strictly valid JSON matching this schema:
{
  "projectTitle": string,
  "concept": string,
  "targetAudience": string,
  "visualDirection": string,
  "totalDurationSec": number,
  "scenes": [
    {
      "sceneNumber": number,
      "sceneDuration": number,
      "narration": string,
      "visualPrompt": string,
      "cameraDirection": string,
      "transition": string,
      "requiredAssets": string[],
      "aspectRatio": string,
      "suggestedModel": string
    }
  ]
}`;

      const response = await this.generateWithFallback(client, {
        model: GEMINI_MODELS.FLASH,
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nConcept: "${params.concept}"` }],
          },
        ],
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const raw = JSON.parse(cleanJson);

      // Validate against Zod schema
      return StoryboardSchema.parse(raw);
    } catch (err) {
      console.warn('[FluviaFlow Gemini] Storyboard parse error, falling back:', err);
      return this.generateStoryboard({ ...params, concept: params.concept });
    }
  }

  /**
   * Capability E: Marketing Copilot for Brand & Ecom Campaigns
   */
  async marketingCopilot(params: {
    productName: string;
    productDescription: string;
    platform?: 'reels' | 'youtube' | 'commercial';
    targetAudience?: string;
    tone?: string;
  }): Promise<MarketingCopilotResult> {
    const client = this.getClient();
    const platform = params.platform || 'reels';
    const ratio = platform === 'reels' ? '9:16' : '16:9';

    if (!client) {
      const storyboard = await this.generateStoryboard({
        concept: `${params.productName}: ${params.productDescription}`,
        aspectRatio: ratio,
      });

      return {
        productName: params.productName,
        campaignTitle: `${params.productName} Launch Campaign`,
        hookAngles: [
          `Tired of the ordinary? Meet ${params.productName}.`,
          `This one change transformed everything. Here's why.`,
          `Why top creators are switching to ${params.productName}.`,
        ],
        primaryScript: `Here is the secret behind ${params.productName}. Engineered for those who refuse to compromise on design, speed, and elegance. Experience the upgrade today.`,
        creativeDirections: [
          'High-contrast luxury product showcase with macro textures',
          'Fast-paced UGC problem-and-solution narrative with relatable hook',
          'Minimalist aesthetic commercial with slow-motion fluid dynamics',
        ],
        storyboard,
        targetAudienceAnalysis: `High-intent digital consumers and creators seeking premium quality and seamless performance.`,
        isSimulated: true,
      };
    }

    try {
      const prompt = `You are Fluvia Flow's Marketing Studio AI Copilot.
Create a high-converting campaign plan for product: "${params.productName}"
Description: "${params.productDescription}"
Target Platform: ${platform}
Output strictly valid JSON with keys:
{
  "productName": "${params.productName}",
  "campaignTitle": string,
  "hookAngles": string[],
  "primaryScript": string,
  "creativeDirections": string[],
  "targetAudienceAnalysis": string
}`;

      const response = await this.generateWithFallback(client, {
        model: GEMINI_MODELS.FLASH,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const storyboard = await this.generateStoryboard({
        concept: `${params.productName} — ${parsed.campaignTitle || 'Commercial'}`,
        aspectRatio: ratio,
      });

      return {
        ...parsed,
        storyboard,
        isSimulated: false,
      };
    } catch {
      return this.marketingCopilot({ ...params, productName: params.productName });
    }
  }

  /**
   * Capability F: In-workspace Creative Assistant
   */
  async creativeAssistant(params: {
    message: string;
    context?: {
      currentPrompt?: string;
      activeModel?: string;
      aspectRatio?: string;
      studio?: string;
    };
  }): Promise<{ reply: string; suggestedPrompt?: string; isSimulated?: boolean }> {
    const client = this.getClient();

    if (!client) {
      return {
        reply: `As your Fluvia Flow creative assistant, I recommend refining the composition with 35mm anamorphic framing and a gentle Dolly-in camera movement. This accentuates dimensional depth and eliminates flat visual artifacts.`,
        suggestedPrompt: params.context?.currentPrompt
          ? `${params.context.currentPrompt}, cinematic lighting, 35mm anamorphic lens, subtle camera dolly in, photorealistic depth of field`
          : undefined,
        isSimulated: true,
      };
    }

    try {
      const systemInstruction = `You are Fluvia Flow's in-app AI Creative Assistant.
Help the creator optimize their prompt, camera motions, scene pacing, and aesthetic styling.
Keep answers concise, direct, and actionable (2-3 sentences).
If applicable, suggest a refined prompt in your response.
Output strictly JSON:
{
  "reply": string,
  "suggestedPrompt": string | null
}`;

      const response = await this.generateWithFallback(client, {
        model: GEMINI_MODELS.FLASH,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\nContext: ${JSON.stringify(params.context || {})}\nUser question: "${params.message}"`,
              },
            ],
          },
        ],
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        reply: parsed.reply,
        suggestedPrompt: parsed.suggestedPrompt || undefined,
        isSimulated: false,
      };
    } catch {
      return {
        reply: `Consider adding subtle volumetric lighting and an anamorphic lens profile to your prompt to bring more cinematic atmosphere to the scene.`,
        suggestedPrompt: params.context?.currentPrompt
          ? `${params.context.currentPrompt}, volumetric atmospheric lighting, 35mm anamorphic`
          : undefined,
        isSimulated: true,
      };
    }
  }

  /**
   * Capability: Native Gemini-Powered Image Generation
   * Generates high-fidelity visual assets using the official Google Gen AI SDK.
   * Model: gemini-3.1-flash-image (with fallback to gemini-3-pro-image and gemini-2.5-flash-image).
   */
  async generateImage(params: {
    prompt: string;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    negativePrompt?: string;
    model?: string;
  }): Promise<{
    success: boolean;
    imageBuffer?: Buffer;
    mimeType?: string;
    modelUsed: string;
    aspectRatio: string;
    prompt: string;
    error?: string;
    errorCode?: 'QUOTA_EXHAUSTED' | 'INVALID_KEY' | 'UNCONFIGURED' | 'PROVIDER_ERROR';
    rawDetails?: string;
  }> {
    const client = this.getClient();
    const ratio = params.aspectRatio || '1:1';
    const primaryModel = params.model || GEMINI_MODELS.IMAGE_FLASH;

    if (!client) {
      return {
        success: false,
        modelUsed: primaryModel,
        aspectRatio: ratio,
        prompt: params.prompt,
        error: 'Gemini API key is not configured. Please configure GEMINI_API_KEY in server environment.',
        errorCode: 'UNCONFIGURED',
      };
    }

    // Enhance prompt with aspect ratio guidance
    let promptWithGuidance = params.prompt.trim();
    if (params.aspectRatio && !promptWithGuidance.toLowerCase().includes('aspect ratio')) {
      promptWithGuidance += `, aspect ratio ${ratio}`;
    }
    if (params.negativePrompt && params.negativePrompt.trim()) {
      promptWithGuidance += ` (Do not include: ${params.negativePrompt.trim()})`;
    }

    const candidateModels = [
      primaryModel,
      GEMINI_MODELS.IMAGE_PRO,
      GEMINI_MODELS.IMAGE_FALLBACK,
    ];

    let lastError: any = null;

    for (const modelCandidate of candidateModels) {
      try {
        console.log(`[Fluvia Gemini] Requesting image generation with model: ${modelCandidate}`);
        const response = await client.models.generateContent({
          model: modelCandidate,
          contents: promptWithGuidance,
        });

        const candidates = response.candidates || [];
        for (const candidate of candidates) {
          const parts = candidate.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
              const mimeType = part.inlineData.mimeType || 'image/png';
              const buffer = Buffer.from(part.inlineData.data, 'base64');

              // Validate binary header (PNG, JPEG, WEBP)
              const isValidImage = buffer.length > 50 && (
                (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) || // PNG
                (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) || // JPEG
                (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) // WEBP/RIFF
              );

              if (isValidImage) {
                return {
                  success: true,
                  imageBuffer: buffer,
                  mimeType,
                  modelUsed: modelCandidate,
                  aspectRatio: ratio,
                  prompt: params.prompt,
                };
              }
            }
          }
        }

        lastError = new Error(`Model '${modelCandidate}' completed without returning image payload.`);
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        console.warn(`[Fluvia Gemini] Model ${modelCandidate} failed:`, msg);

        // If quota limit is 0 on free tier, breaking avoids redundant repeated quota errors
        if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('limit: 0') || msg.includes('quota')) {
          break;
        }
      }
    }

    // Fallback: If Pollinations AI is configured, generate image via Pollinations
    if (pollinationsService.isConfigured()) {
      try {
        console.log('[Fluvia Gemini Image] Attempting Pollinations image fallback...');
        const pollRes = await pollinationsService.generateImage({
          prompt: params.prompt,
          model: 'black-forest-labs/flux-3-image',
        });
        if (pollRes.success && pollRes.mediaBuffer) {
          return {
            success: true,
            imageBuffer: pollRes.mediaBuffer,
            mimeType: 'image/png',
            modelUsed: 'black-forest-labs/flux-3-image (via Pollinations)',
            aspectRatio: ratio,
            prompt: params.prompt,
          };
        }
      } catch (pollErr) {
        console.warn('[Fluvia Gemini Image] Pollinations fallback failed:', pollErr);
      }
    }

    // Classify error for clear user guidance
    const errText = String(lastError?.message || lastError || 'Unknown provider error');
    let errorCode: 'QUOTA_EXHAUSTED' | 'INVALID_KEY' | 'UNCONFIGURED' | 'PROVIDER_ERROR' = 'PROVIDER_ERROR';
    let userFacingError = errText;

    if (errText.includes('RESOURCE_EXHAUSTED') || errText.includes('429') || errText.includes('quota') || errText.includes('limit: 0')) {
      errorCode = 'QUOTA_EXHAUSTED';
      userFacingError = 'Google Gemini image generation quota is currently not enabled for this API key tier. In Google AI Studio, image generation models (gemini-3.1-flash-image) require an attached billing account / Pay-As-You-Go plan (https://ai.google.dev/pricing).';
    } else if (errText.includes('API_KEY_INVALID') || errText.includes('403') || errText.includes('401')) {
      errorCode = 'INVALID_KEY';
      userFacingError = 'Invalid or unauthorized Gemini API key. Please check your GEMINI_API_KEY setting.';
    }

    return {
      success: false,
      modelUsed: primaryModel,
      aspectRatio: ratio,
      prompt: params.prompt,
      error: userFacingError,
      errorCode,
      rawDetails: errText,
    };
  }

  /**
   * Capability: Native Gemini Omni Flash Video Generation via Interactions API
   * Endpoint: https://generativelanguage.googleapis.com/v1beta/interactions
   * Model: gemini-omni-1.1-flash
   */
  async generateVideo(params: {
    prompt: string;
    aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5' | '2.39:1';
    durationSec?: number;
    referenceImageUrl?: string;
    model?: string;
    jobId?: string;
  }): Promise<{
    success: boolean;
    videoUrl?: string;
    thumbnailUrl?: string;
    modelUsed: string;
    prompt: string;
    aspectRatio: string;
    durationSec: number;
    error?: string;
    errorCode?: 'QUOTA_EXHAUSTED' | 'INVALID_KEY' | 'UNCONFIGURED' | 'PROVIDER_ERROR' | 'UNSUPPORTED_TIER';
    rawDetails?: string;
  }> {
    const key = process.env.GEMINI_API_KEY;
    const modelUsed = params.model || process.env.GEMINI_VIDEO_MODEL || 'gemini-omni-1.1-flash';
    const ratio = params.aspectRatio === '9:16' || params.aspectRatio === '1:1' ? params.aspectRatio : '16:9';
    const duration = params.durationSec || 5;

    if (!key || key.trim() === '' || key.startsWith('your_')) {
      return {
        success: false,
        modelUsed,
        prompt: params.prompt,
        aspectRatio: ratio,
        durationSec: duration,
        error: 'Gemini API key is not configured. Please supply a valid GEMINI_API_KEY in the server environment (.env.local).',
        errorCode: 'UNCONFIGURED',
      };
    }

    try {
      let inputPayload: any = params.prompt;
      if (params.referenceImageUrl) {
        inputPayload = [
          {
            type: 'image',
            uri: params.referenceImageUrl,
          },
          {
            type: 'text',
            text: params.prompt,
          },
        ];
      }

      const requestPayload = {
        model: modelUsed,
        input: inputPayload,
        response_format: {
          type: 'video',
          delivery: 'uri',
          aspect_ratio: ratio,
        },
      };

      console.log(`[Fluvia Gemini Video] Dispatching video request to Interactions API with model: ${modelUsed}`);
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${key}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const rawText = await response.text();
      let responseData: any = {};
      try {
        responseData = JSON.parse(rawText);
      } catch {
        responseData = { error: { message: rawText } };
      }

      if (!response.ok) {
        const errorMsg = String(responseData?.error?.message || responseData?.error || rawText || `HTTP ${response.status}`);
        console.warn(`[Fluvia Gemini Video] API responded with error ${response.status}:`, errorMsg);

        let errorCode: 'QUOTA_EXHAUSTED' | 'INVALID_KEY' | 'UNCONFIGURED' | 'PROVIDER_ERROR' | 'UNSUPPORTED_TIER' = 'PROVIDER_ERROR';
        let userFacingError = errorMsg;

        if (
          errorMsg.includes('Free Tier') ||
          errorMsg.includes('limit: 0') ||
          errorMsg.includes('rate-limit') ||
          errorMsg.includes('Rate limit exceeded') ||
          response.status === 429
        ) {
          errorCode = 'QUOTA_EXHAUSTED';
          userFacingError =
            'Google Gemini video generation quota is currently not enabled for this API key tier. In Google AI Studio, video generation models (gemini-omni-1.1-flash) require an attached billing account / Pay-As-You-Go plan (https://ai.google.dev/pricing). Reserved 15 credits have been automatically refunded to your wallet.';
        } else if (
          errorMsg.includes('API_KEY_INVALID') ||
          errorMsg.includes('403') ||
          errorMsg.includes('401') ||
          response.status === 401 ||
          response.status === 403
        ) {
          errorCode = 'INVALID_KEY';
          userFacingError = 'Invalid or unauthorized Gemini API key. Please check your GEMINI_API_KEY setting.';
        }

        // Fallback: If Pollinations AI is configured, generate video via Pollinations
        if (pollinationsService.isConfigured()) {
          try {
            console.log('[Fluvia Gemini Video] Attempting Pollinations Omni Flash video fallback...');
            const pollVidRes = await pollinationsService.generateVideo({
              prompt: params.prompt,
              model: 'google/gemini-omni-1.1-flash',
              durationSec: duration,
              aspectRatio: ratio as any,
            }, params.jobId);
            if (pollVidRes.success && pollVidRes.mediaUrl) {
              return {
                success: true,
                videoUrl: pollVidRes.mediaUrl,
                thumbnailUrl: pollVidRes.mediaUrl,
                modelUsed: 'google/gemini-omni-1.1-flash (via Pollinations)',
                prompt: params.prompt,
                aspectRatio: ratio,
                durationSec: duration,
              };
            }
          } catch (pollErr) {
            console.warn('[Fluvia Gemini Video] Pollinations fallback failed:', pollErr);
          }
        }

        return {
          success: false,
          modelUsed,
          prompt: params.prompt,
          aspectRatio: ratio,
          durationSec: duration,
          error: userFacingError,
          errorCode,
          rawDetails: errorMsg,
        };
      }

      const outputVideo = responseData?.output_video || responseData?.interaction?.output_video || responseData?.output;
      const videoUri = outputVideo?.uri || outputVideo?.url;

      if (!videoUri) {
        // Fallback: If Pollinations AI is configured, generate video via Pollinations
        if (pollinationsService.isConfigured()) {
          try {
            console.log('[Fluvia Gemini Video] Attempting Pollinations Omni Flash video fallback...');
            const pollVidRes = await pollinationsService.generateVideo({
              prompt: params.prompt,
              model: 'google/gemini-omni-1.1-flash',
              durationSec: duration,
              aspectRatio: ratio as any,
            }, params.jobId);
            if (pollVidRes.success && pollVidRes.mediaUrl) {
              return {
                success: true,
                videoUrl: pollVidRes.mediaUrl,
                thumbnailUrl: pollVidRes.mediaUrl,
                modelUsed: 'google/gemini-omni-1.1-flash (via Pollinations)',
                prompt: params.prompt,
                aspectRatio: ratio,
                durationSec: duration,
              };
            }
          } catch (pollErr) {
            console.warn('[Fluvia Gemini Video] Pollinations fallback failed:', pollErr);
          }
        }

        return {
          success: false,
          modelUsed,
          prompt: params.prompt,
          aspectRatio: ratio,
          durationSec: duration,
          error: 'Gemini Interactions API completed without returning a video payload.',
          errorCode: 'PROVIDER_ERROR',
          rawDetails: JSON.stringify(responseData),
        };
      }

      // Persist the generated video asset to public/uploads/generated
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'generated');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `gemini_${params.jobId || 'vid'}_${Date.now()}.mp4`;
      const localFilePath = path.join(uploadsDir, filename);

      try {
        const downloadRes = await fetch(videoUri);
        if (downloadRes.ok) {
          const arrayBuffer = await downloadRes.arrayBuffer();
          fs.writeFileSync(localFilePath, Buffer.from(arrayBuffer));
        }
      } catch (dlErr: any) {
        console.warn('[Fluvia Gemini Video] Could not write local video file, referencing remote URI directly:', dlErr.message);
      }

      const publicVideoUrl = fs.existsSync(localFilePath)
        ? `/uploads/generated/${filename}`
        : videoUri;

      return {
        success: true,
        videoUrl: publicVideoUrl,
        thumbnailUrl: params.referenceImageUrl || '/images/fluvia-flow-social-banner.jpg',
        modelUsed,
        prompt: params.prompt,
        aspectRatio: ratio,
        durationSec: duration,
      };
    } catch (err: any) {
      console.error('[Fluvia Gemini Video] Unexpected exception:', err);
      return {
        success: false,
        modelUsed,
        prompt: params.prompt,
        aspectRatio: ratio,
        durationSec: duration,
        error: err.message || 'An unexpected error occurred while communicating with Gemini API.',
        errorCode: 'PROVIDER_ERROR',
        rawDetails: String(err),
      };
    }
  }
}

export const geminiService = new GeminiService();
