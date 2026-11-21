import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { checkMythologyContentModeration, augmentMythologyPromptWithDignity } from '@/lib/mythology/moderation';
import { MYTH_ART_STYLES } from '@/lib/mythology/constants';
import { MythScene } from '@/lib/mythology/types';
import { geminiService } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      storyConcept,
      sourceNote,
      culture = 'hindu_epic',
      language = 'hi',
      targetDurationSec = 30,
      tone = 'devotional',
      artStyleId = 'classical_oil_painting',
      characterBible = [],
    } = body;

    if (!storyConcept || typeof storyConcept !== 'string' || storyConcept.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a valid story concept or select an epic from the library.' },
        { status: 400 }
      );
    }

    // 1. Cultural Moderation Check
    const moderation = checkMythologyContentModeration(`${storyConcept} ${sourceNote || ''}`);
    if (!moderation.allowed) {
      return NextResponse.json(
        { error: moderation.reason, category: moderation.category },
        { status: 400 }
      );
    }

    // 2. Authentication & Credit Reservation (2 credits for script generation)
    const current = await getCurrentUser();
    const SCRIPT_CREDITS = 2;
    let reservationRef: string | undefined;

    if (current?.user) {
      const creditAccount = dbStore.getCreditAccount(current.user.id);
      if (creditAccount.availableBalance < SCRIPT_CREDITS) {
        return NextResponse.json(
          {
            error: `Insufficient credits. Script generation requires ${SCRIPT_CREDITS} credits, but you have ${creditAccount.availableBalance} credits available.`,
            requiredCredits: SCRIPT_CREDITS,
            availableBalance: creditAccount.availableBalance,
          },
          { status: 402 }
        );
      }
      reservationRef = `myth_script_${Date.now()}`;
      dbStore.reserveCredits(current.user.id, SCRIPT_CREDITS, reservationRef);
    }

    // 3. Resolve Art Style prompt prefix
    const selectedStyle = MYTH_ART_STYLES.find((s) => s.id === artStyleId) || MYTH_ART_STYLES[0];

    // 4. Generate structured scenes via Gemini or dynamic intelligent generator
    const targetScenesCount = Math.max(3, Math.min(8, Math.round(targetDurationSec / 6)));
    let scenes: MythScene[] = [];
    let hookStrengthScore = 88;
    let hookFeedback = 'Powerful curiosity question in the opening 3 seconds.';

    const isGeminiConfigured = geminiService.isConfigured();

    if (isGeminiConfigured) {
      try {
        const langGuide =
          language === 'hi'
            ? 'Write all narration and onScreenText in pure, evocative Hindi in Devanagari script.'
            : language === 'hi-en'
            ? 'Write narration in conversational Hinglish and onScreenText in bilingual Hindi/English.'
            : 'Write narration and onScreenText in dramatic cinematic English.';

        const charDescriptions = (characterBible as any[])
          .map((c) => `${c.name}: ${c.appearance}, wearing ${c.attire}, carrying ${c.weaponOrVahana}`)
          .join('; ');

        const prompt = `You are an elite mythological screenwriter and viral video director for YouTube Shorts and Instagram Reels.
Write a structured script for a ${targetDurationSec}-second video about: "${storyConcept}".
Source tradition: ${sourceNote || 'Ancient sacred scriptures'}.
Culture: ${culture}. Tone: ${tone}.
Total scenes: exactly ${targetScenesCount} scenes.
${langGuide}
${charDescriptions ? `Character Bible to include in visual prompts: ${charDescriptions}.` : ''}

CRITICAL RULES:
1. Scene 1 MUST be a 3-second viral hook with high curiosity (a startling question or paradox).
2. Each scene narration must be 12 to 18 words, matching spoken pacing (~5 seconds).
3. "visualPrompt" must be a descriptive prompt ready for image generation, describing the scene action, character pose, lighting, and composition. Do not include style prefixes; those will be added automatically.
4. "cameraMove" must be one of: "pan_left", "pan_right", "zoom_in", "zoom_out", "orbital_slow", "celestial_tilt".
5. "sfxTag" must be one of: "conch_shell", "temple_bell", "thunder_strike", "flute_melody", "war_drums", "fire_whoosh".
6. "onScreenText" should be short, bold 2-5 words for vertical video captions.

Return ONLY a JSON object conforming to this schema:
{
  "hookStrengthScore": 92,
  "hookFeedback": "Specific advice on viral retention",
  "scenes": [
    {
      "sceneNumber": 1,
      "narration": "Narration text",
      "onScreenText": "BOLD CAPTION",
      "characters": ["Lord Krishna"],
      "visualPrompt": "Descriptive visual prompt",
      "negativePrompt": "low quality, cartoon",
      "mood": "devotional",
      "cameraMove": "zoom_in",
      "estimatedDurationSec": 5,
      "sfxTag": "conch_shell"
    }
  ]
}`;

        const res = await (geminiService as any).getClient()?.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const raw = res?.text || '';
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed.scenes) && parsed.scenes.length > 0) {
            scenes = parsed.scenes.map((s: any, idx: number) => ({
              id: `scene_${idx + 1}_${Date.now()}`,
              sceneNumber: idx + 1,
              narration: s.narration || '',
              onScreenText: s.onScreenText || '',
              characters: Array.isArray(s.characters) ? s.characters : [],
              visualPrompt: augmentMythologyPromptWithDignity(s.visualPrompt || storyConcept, selectedStyle.promptPrefix),
              negativePrompt: selectedStyle.negativePrompt,
              mood: s.mood || tone,
              cameraMove: s.cameraMove || 'zoom_in',
              estimatedDurationSec: s.estimatedDurationSec || 5,
              sfxTag: s.sfxTag || 'conch_shell',
            }));
            hookStrengthScore = parsed.hookStrengthScore || 85;
            hookFeedback = parsed.hookFeedback || 'Strong opening hook.';
          }
        }
      } catch (geminiErr: any) {
        console.warn('[Mythology Script] Gemini fallback triggered:', geminiErr.message);
      }
    }

    // Dynamic fallback generation if Gemini didn't return valid scenes
    if (scenes.length === 0) {
      const isHindi = language === 'hi';
      const cleanTitle = storyConcept.slice(0, 30);

      const templates = [
        {
          narration: isHindi
            ? `क्या आप जानते हैं कि ${cleanTitle} के पीछे का सबसे बड़ा रहस्य क्या है?`
            : `Did you know the profound cosmic secret hidden behind ${cleanTitle}?`,
          onScreenText: isHindi ? 'प्राचीन रहस्य' : 'THE SACRED SECRET',
          move: 'zoom_in' as const,
          sfx: 'conch_shell' as const,
        },
        {
          narration: isHindi
            ? 'जब ब्रह्मांड की शक्तियां एक साथ टकराईं, तब एक अभूतपूर्व घटना घटी।'
            : 'When the forces of destiny aligned, an extraordinary event shook the heavens.',
          onScreenText: isHindi ? 'दिव्य संघर्ष' : 'DIVINE POWER',
          move: 'pan_right' as const,
          sfx: 'thunder_strike' as const,
        },
        {
          narration: isHindi
            ? 'शास्त्रों में लिखा है कि इस क्षण ने पूरे इतिहास की दिशा हमेशा के लिए बदल दी।'
            : 'Ancient scriptures record that this sacred moment altered history forever.',
          onScreenText: isHindi ? 'अमर गाथा' : 'ETERNAL LEGEND',
          move: 'orbital_slow' as const,
          sfx: 'temple_bell' as const,
        },
        {
          narration: isHindi
            ? 'सत्य, धर्म और भक्ति की यह अमर विजय आज भी हमें प्रेरित करती है।'
            : 'This eternal triumph of Dharma and devotion echoes across time.',
          onScreenText: isHindi ? 'सत्यमेव जयते' : 'TRIUMPH OF DHARMA',
          move: 'zoom_out' as const,
          sfx: 'flute_melody' as const,
        },
      ];

      scenes = templates.slice(0, targetScenesCount).map((t, idx) => ({
        id: `scene_${idx + 1}_${Date.now()}`,
        sceneNumber: idx + 1,
        narration: t.narration,
        onScreenText: t.onScreenText,
        characters: [],
        visualPrompt: augmentMythologyPromptWithDignity(
          `Scene ${idx + 1} depicting ${storyConcept}, highly detailed mythological composition`,
          selectedStyle.promptPrefix
        ),
        negativePrompt: selectedStyle.negativePrompt,
        mood: tone,
        cameraMove: t.move,
        estimatedDurationSec: Math.round(targetDurationSec / targetScenesCount),
        sfxTag: t.sfx,
      }));
    }

    // 5. Settle reserved credits upon success
    if (current?.user && reservationRef) {
      dbStore.settleCredits(
        current.user.id,
        reservationRef,
        SCRIPT_CREDITS,
        SCRIPT_CREDITS
      );
    }

    return NextResponse.json({
      success: true,
      scenes,
      hookStrengthScore,
      hookFeedback,
      scenesCount: scenes.length,
      estimatedDurationSec: scenes.reduce((acc, s) => acc + s.estimatedDurationSec, 0),
    });
  } catch (err: any) {
    console.error('Error in /api/mythology/script:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate script' },
      { status: 500 }
    );
  }
}
