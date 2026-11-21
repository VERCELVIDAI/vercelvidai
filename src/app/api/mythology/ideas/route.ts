import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { checkMythologyContentModeration } from '@/lib/mythology/moderation';
import { PURANIC_STORY_PRESETS } from '@/lib/mythology/constants';
import { geminiService } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { culture = 'hindu_epic', tone = 'epic', language = 'hi', topic = '' } = body;

    // 1. Cultural Content Moderation
    if (topic) {
      const moderation = checkMythologyContentModeration(topic);
      if (!moderation.allowed) {
        return NextResponse.json(
          { error: moderation.reason, category: moderation.category },
          { status: 400 }
        );
      }
    }

    // 2. Generate with Gemini if available, or return curated viral presets
    let ideas: Array<{ title: string; hook: string; source: string; summary: string }> = [];

    const isGeminiAvailable = geminiService.isConfigured();

    if (isGeminiAvailable) {
      try {
        const langInstruction =
          language === 'hi'
            ? 'Write the title and hook line in natural, captivating Hindi (Devanagari script).'
            : language === 'hi-en'
            ? 'Write the title and hook line in engaging conversational Hinglish (Hindi written in Roman script).'
            : 'Write the title and hook line in dramatic cinematic English.';

        const prompt = `You are a master mythological storyteller and viral video producer for YouTube Shorts and Instagram Reels.
Generate exactly 10 viral video story ideas from ${culture} mythology with tone "${tone}".
${topic ? `Focus around the topic: "${topic}".` : 'Choose fascinating, high-curiosity stories from the Ramayana, Mahabharata, Puranas, or ancient epics.'}
${langInstruction}

Return ONLY a valid JSON array of 10 objects conforming to this schema:
[
  {
    "title": "Title of the video",
    "hook": "First 3 seconds curiosity hook line question or startling statement",
    "source": "Ancient scripture name and chapter/kanda",
    "summary": "1-2 sentence core storyline"
  }
]
Do not wrap in markdown quotes if possible, output pure JSON.`;

        const res = await (geminiService as any).getClient()?.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const rawText = res?.text || '';
        const jsonMatch = rawText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          ideas = JSON.parse(jsonMatch[0]);
        }
      } catch (geminiErr: any) {
        console.warn('[Mythology Ideas] Gemini generation fallback to presets:', geminiErr.message);
      }
    }

    // Fallback to high-quality curated presets if Gemini is unavailable or failed
    if (!ideas || ideas.length === 0) {
      ideas = PURANIC_STORY_PRESETS.map((p) => ({
        title: language === 'hi' ? p.titleHindi : p.title,
        hook: p.hookLine,
        source: p.source,
        summary: p.summary,
      }));
    }

    return NextResponse.json({
      success: true,
      ideas: ideas.slice(0, 10),
      count: ideas.length,
    });
  } catch (err: any) {
    console.error('Error in /api/mythology/ideas:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate mythology ideas' },
      { status: 500 }
    );
  }
}
