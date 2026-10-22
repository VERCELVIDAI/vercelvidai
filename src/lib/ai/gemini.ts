/**
 * ==============================================================================
 * FLUVIA FLOW — GEMINI AI INTEGRATION SERVICE
 * ==============================================================================
 * Dedicated server-side Gemini service using official @google/genai SDK.
 * Handles: Prompt Enhancement, Scriptwriting, Structured Storyboard JSON,
 * Cinematic Director Guidance, Marketing Copilot, and Workspace AI Assistant.
 */

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

// Configurable model IDs
export const GEMINI_MODELS = {
  FLASH: process.env.GEMINI_FLASH_MODEL || 'gemini-flash-latest',
  PRO: process.env.GEMINI_PRO_MODEL || 'gemini-flash-latest',
  NEXT: process.env.GEMINI_NEXT_MODEL || 'gemini-flash-lite-latest',
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
      const fallbackModel = primaryModel === GEMINI_MODELS.NEXT ? 'gemini-flash-latest' : GEMINI_MODELS.NEXT;
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
}

export const geminiService = new GeminiService();
