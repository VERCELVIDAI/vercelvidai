import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, apiKey, text, voiceId, modelId, speed } = body;

    // 1. Fetch available voices using user's ElevenLabs API key
    if (action === 'get_voices') {
      if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk_')) {
        return NextResponse.json(
          { error: 'Please enter a valid ElevenLabs API key starting with sk_...' },
          { status: 400 }
        );
      }

      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey.trim(),
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return NextResponse.json(
          { error: errJson.detail?.message || 'Failed to load voices from ElevenLabs with this API key.' },
          { status: res.status }
        );
      }

      const data = await res.json();
      const voices = (data.voices || []).map((v: any) => ({
        voice_id: v.voice_id,
        name: v.name,
        category: v.category,
        preview_url: v.preview_url,
        accent: v.labels?.accent || v.labels?.description || '',
      }));

      return NextResponse.json({ voices });
    }

    // 2. Synthesize text to speech
    if (action === 'synthesize' || !action) {
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return NextResponse.json(
          { error: 'No narration text provided to synthesize.' },
          { status: 400 }
        );
      }

      const selectedVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default Rachel / Indian voice
      const selectedModelId = modelId || 'eleven_multilingual_v2';
      const cleanSpeed = typeof speed === 'number' ? Math.max(0.7, Math.min(1.3, speed)) : 1.0;

      // If user provided their own ElevenLabs API key
      if (apiKey && typeof apiKey === 'string' && apiKey.startsWith('sk_')) {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': apiKey.trim(),
            },
            body: JSON.stringify({
              text: text.trim(),
              model_id: selectedModelId,
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                speed: cleanSpeed,
              },
            }),
          }
        );

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return NextResponse.json(
            { error: errData.detail?.message || 'ElevenLabs synthesis failed with this API key.' },
            { status: response.status }
          );
        }

        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

        return NextResponse.json({
          success: true,
          audioUrl,
          characterCount: text.length,
          provider: 'elevenlabs',
        });
      }

      // Fallback: If no API key provided, inform user to provide key or use audio upload
      return NextResponse.json(
        {
          error: 'Please enter your ElevenLabs API key or switch to "My recording" to upload your own audio file.',
          needsKey: true,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Invalid voice action' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in /api/animated-video/voice:', err);
    return NextResponse.json(
      { error: err.message || 'Internal voice synthesis error' },
      { status: 500 }
    );
  }
}
