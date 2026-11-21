import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { elevenLabsService } from '@/lib/ai/elevenlabs';
import { MYTH_VOICES } from '@/lib/mythology/constants';
import { WordTimestamp } from '@/lib/mythology/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text, voiceId = 'voice_devotional_hindi_m', speed = 1.0 } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required for voice synthesis.' }, { status: 400 });
    }

    // 1. Credit Check & Reservation (4 credits)
    const current = await getCurrentUser();
    const VOICE_CREDITS = 4;
    let reservationRef: string | undefined;

    if (current?.user) {
      const creditAccount = dbStore.getCreditAccount(current.user.id);
      if (creditAccount.availableBalance < VOICE_CREDITS) {
        return NextResponse.json(
          {
            error: `Insufficient credits. Voiceover synthesis requires ${VOICE_CREDITS} credits, but you have ${creditAccount.availableBalance} available.`,
            requiredCredits: VOICE_CREDITS,
            availableBalance: creditAccount.availableBalance,
          },
          { status: 402 }
        );
      }
      reservationRef = `myth_voice_${Date.now()}`;
      dbStore.reserveCredits(current.user.id, VOICE_CREDITS, reservationRef);
    }

    // 2. Resolve Voice Config
    const selectedVoice = MYTH_VOICES.find((v) => v.id === voiceId) || MYTH_VOICES[0];
    const elevenLabsVoiceId = selectedVoice.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb';

    let audioUrl = '';
    let durationSec = 30;

    // 3. Call ElevenLabs if configured
    if (elevenLabsService.isConfigured()) {
      try {
        const result = await elevenLabsService.generateVoiceover({
          text: text.trim(),
          voiceId: elevenLabsVoiceId,
          modelId: 'eleven_multilingual_v2',
        });
        if (result.success && result.audioUrl) {
          audioUrl = result.audioUrl;
          durationSec = result.durationSec || 30;
        }
      } catch (voiceErr: any) {
        console.warn('[Mythology Voice] ElevenLabs fallback:', voiceErr.message);
      }
    }

    // Fallback sample audio if ElevenLabs is offline or in demo mode
    if (!audioUrl) {
      audioUrl = selectedVoice.sampleUrl || '/demos/audio-sample-hindi-kabir.mp3';
    }

    // 4. Generate synchronized word-level timestamps
    const words = text.trim().split(/\s+/).filter(Boolean);
    const avgWordDuration = durationSec / Math.max(1, words.length);
    const timestamps: WordTimestamp[] = words.map((w: string, i: number) => ({
      word: w,
      startSec: Number((i * avgWordDuration).toFixed(2)),
      endSec: Number(((i + 1) * avgWordDuration).toFixed(2)),
    }));

    // 5. Settle credits
    if (current?.user && reservationRef) {
      dbStore.settleCredits(
        current.user.id,
        reservationRef,
        VOICE_CREDITS,
        VOICE_CREDITS
      );
    }

    return NextResponse.json({
      success: true,
      audioUrl,
      durationSec,
      voiceId,
      timestamps,
      wordsCount: words.length,
    });
  } catch (err: any) {
    console.error('Error in /api/mythology/voice:', err);
    return NextResponse.json(
      { error: err.message || 'Voiceover generation failed' },
      { status: 500 }
    );
  }
}
