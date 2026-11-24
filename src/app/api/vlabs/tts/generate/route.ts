import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { VlabsAiProviderService } from '@/lib/vlabs/ai-provider';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    const userId = session?.user?.id || 'usr_guest_vlabs';

    const body = await req.json();
    const {
      text,
      voiceId,
      language,
      format,
      speed,
      pitch,
      stability,
      similarity,
      style,
      emotion,
      model,
    } = body;

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Please enter text to generate speech.' },
        { status: 400 }
      );
    }

    // Call modular AI Provider Service
    const result = await VlabsAiProviderService.generateTTS({
      userId,
      text: text.trim(),
      voiceId: voiceId || 'voice_in_male_1',
      language,
      format: format || 'wav',
      speed: typeof speed === 'number' ? speed : 1.0,
      pitch: typeof pitch === 'number' ? pitch : 0,
      stability,
      similarity,
      style,
      emotion,
      model,
    });

    // Save generation record to history if authenticated
    let generationRecord = null;
    if (session?.user?.id) {
      generationRecord = dbStore.createVlabsGeneration({
        userId: session.user.id,
        type: 'tts',
        title: text.trim().slice(0, 60) + (text.length > 60 ? '...' : ''),
        inputText: text.trim(),
        audioUrl: result.audioUrl,
        durationSec: result.durationSec,
        voiceId: voiceId || 'voice_in_male_1',
        voiceName: result.voiceName,
        language: result.language,
        format: 'wav',
        settings: {
          speed: speed || 1.0,
          pitch: pitch || 0,
          stability,
          similarity,
          style,
          emotion,
          model,
        },
        fileSizeKb: result.fileSizeKb,
        status: 'completed',
      });
    }

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      durationSec: result.durationSec,
      fileSizeKb: result.fileSizeKb,
      voiceName: result.voiceName,
      language: result.language,
      provider: result.provider,
      isDemoMode: result.isDemoMode,
      warning: result.warning,
      generationId: generationRecord?.id,
    });
  } catch (err: any) {
    console.error('TTS Generation error:', err);
    return NextResponse.json(
      { error: err.message || 'Speech generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
