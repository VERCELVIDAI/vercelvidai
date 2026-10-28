import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { elevenLabsService } from '@/lib/ai/elevenlabs';
import { dbStore } from '@/lib/db/store';

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: 'Please sign in to generate voiceovers.' }, { status: 401 });
    }

    const body = await req.json();
    const { text, voiceId, modelId } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Please provide text for voiceover synthesis.' }, { status: 400 });
    }

    if (!elevenLabsService.isConfigured()) {
      return NextResponse.json(
        {
          error: 'ElevenLabs is not configured on the server. Please ensure ELEVENLABS_API_KEY is configured in .env.local.',
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    // Voiceover cost: 2 credits
    const creditCost = 2;
    const creditAccount = dbStore.getCreditAccount(current.user.id);
    if (creditAccount.availableBalance < creditCost) {
      return NextResponse.json(
        {
          error: `Insufficient credits. You need ${creditCost} credits to generate an AI voiceover, but currently have ${creditAccount.availableBalance} credits available.`,
          requiredCredits: creditCost,
          availableBalance: creditAccount.availableBalance,
        },
        { status: 402 }
      );
    }

    // Reserve credits
    const reservationRef = `voice_${Date.now()}`;
    const reserved = dbStore.reserveCredits(current.user.id, creditCost, reservationRef);
    if (!reserved) {
      return NextResponse.json({ error: 'Failed to reserve credits for voiceover.' }, { status: 500 });
    }

    const result = await elevenLabsService.generateVoiceover({
      text: text.trim(),
      voiceId: voiceId || 'JBFqnCBsd6RMkjVDRZzb',
      modelId: modelId || 'eleven_v4',
    });

    if (!result.success || !result.audioUrl) {
      // Refund credits
      dbStore.refundCredits(current.user.id, creditCost, 'ElevenLabs Voiceover Failed Refund', reservationRef);
      return NextResponse.json(
        { error: result.error || 'Voiceover generation failed.', errorCode: result.errorCode },
        { status: 500 }
      );
    }

    // Deduct credits permanently
    dbStore.settleCredits(current.user.id, reservationRef, creditCost, creditCost);

    dbStore.logAudit(current.user.id, 'VOICEOVER_GENERATED', 'audio', result.audioUrl, {
      voiceId: result.voiceId,
      modelUsed: result.modelUsed,
      creditsDeducted: creditCost,
    });

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      voiceId: result.voiceId,
      modelUsed: result.modelUsed,
      text: result.text,
      creditsDeducted: creditCost,
      newBalance: dbStore.getCreditAccount(current.user.id).availableBalance,
    });
  } catch (err: any) {
    console.error('[API AI Voice] Exception:', err);
    return NextResponse.json({ error: err.message || 'Voiceover synthesis error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isConfigured = elevenLabsService.isConfigured();
    const rawVoices = isConfigured ? await elevenLabsService.getVoices() : [];
    const voices = rawVoices.slice(0, 30).map((v: any) => ({
      id: v.voiceId || v.voice_id || v.id,
      voiceId: v.voiceId || v.voice_id || v.id,
      name: v.name,
      category: v.category,
      gender: v.labels?.gender || 'Neural',
      accent: v.labels?.accent || 'Natural',
      previewUrl: v.previewUrl || v.preview_url,
      description: v.description,
    }));
    return NextResponse.json({
      isConfigured,
      voices,
    });
  } catch (err: any) {
    return NextResponse.json({ isConfigured: elevenLabsService.isConfigured(), voices: [] });
  }
}
