import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export interface VoiceoverOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface VoiceoverResult {
  success: boolean;
  audioUrl?: string;
  audioBuffer?: Buffer;
  voiceId: string;
  modelUsed: string;
  text: string;
  durationSec?: number;
  error?: string;
  errorCode?: string;
}

class ElevenLabsService {
  private client: ElevenLabsClient | null = null;

  getClient(): ElevenLabsClient | null {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key || key.trim() === '' || key.startsWith('your_')) {
      return null;
    }
    if (!this.client) {
      this.client = new ElevenLabsClient({ apiKey: key.trim() });
    }
    return this.client;
  }

  isConfigured(): boolean {
    return Boolean(this.getClient());
  }

  /**
   * Synthesize natural speech from text using ElevenLabs SDK
   * Defaults to eleven_v4 model with George voice
   */
  async generateVoiceover(options: VoiceoverOptions, jobId?: string): Promise<VoiceoverResult> {
    const client = this.getClient();
    const voiceId = options.voiceId || 'JBFqnCBsd6RMkjVDRZzb'; // George default narrative
    const modelId = options.modelId || 'eleven_v4';

    if (!client) {
      return {
        success: false,
        voiceId,
        modelUsed: modelId,
        text: options.text,
        error: 'ElevenLabs API key is not configured. Please configure ELEVENLABS_API_KEY in .env.local.',
        errorCode: 'UNCONFIGURED',
      };
    }

    try {
      console.log(`[ElevenLabs] Synthesizing speech with voice ${voiceId} and model ${modelId}...`);
      const audioStream = await client.textToSpeech.convert(voiceId, {
        text: options.text,
        modelId,
        voiceSettings: {
          stability: options.stability ?? 0.5,
          similarityBoost: options.similarityBoost ?? 0.75,
        },
      });

      const chunks: Buffer[] = [];
      const nodeReadable = Readable.fromWeb(audioStream as any);

      for await (const chunk of nodeReadable) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const audioBuffer = Buffer.concat(chunks);

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `elevenlabs_${jobId || Date.now()}_${Date.now()}.mp3`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, audioBuffer);

      const audioUrl = `/uploads/audio/${filename}`;

      return {
        success: true,
        audioUrl,
        audioBuffer,
        voiceId,
        modelUsed: modelId,
        text: options.text,
      };
    } catch (err: any) {
      console.error('[ElevenLabs Voiceover Error]:', err);
      return {
        success: false,
        voiceId,
        modelUsed: modelId,
        text: options.text,
        error: err.message || 'ElevenLabs voice synthesis failed.',
        errorCode: 'PROVIDER_ERROR',
      };
    }
  }

  /**
   * Fetch available voices from ElevenLabs account
   */
  async getVoices() {
    const client = this.getClient();
    if (!client) return [];
    try {
      const response = await client.voices.getAll();
      return response.voices || [];
    } catch (e) {
      console.warn('[ElevenLabs] Failed to fetch voices:', e);
      return [];
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
