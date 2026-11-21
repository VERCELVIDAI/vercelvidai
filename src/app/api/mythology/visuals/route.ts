import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { checkMythologyContentModeration, augmentMythologyPromptWithDignity } from '@/lib/mythology/moderation';
import { MYTH_ART_STYLES } from '@/lib/mythology/constants';
import { cloudflareAIService } from '@/lib/ai/cloudflare-workers-ai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      prompt,
      artStyleId = 'classical_oil_painting',
      aspectRatio = '9:16',
      characterBible = [],
      isHeroAnimation = false,
    } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'A scene visual prompt is required.' }, { status: 400 });
    }

    // 1. Content Moderation
    const moderation = checkMythologyContentModeration(prompt);
    if (!moderation.allowed) {
      return NextResponse.json(
        { error: moderation.reason, category: moderation.category },
        { status: 400 }
      );
    }

    // 2. Authentication & Credit Reservation (2 credits for image; 12 for hero animation)
    const current = await getCurrentUser();
    const creditCost = isHeroAnimation ? 12 : 2;
    let reservationRef: string | undefined;

    if (current?.user) {
      const creditAccount = dbStore.getCreditAccount(current.user.id);
      if (creditAccount.availableBalance < creditCost) {
        return NextResponse.json(
          {
            error: `Insufficient credits. This requires ${creditCost} credits, but you have ${creditAccount.availableBalance} available.`,
            requiredCredits: creditCost,
            availableBalance: creditAccount.availableBalance,
          },
          { status: 402 }
        );
      }
      reservationRef = `myth_visual_${Date.now()}`;
      dbStore.reserveCredits(current.user.id, creditCost, reservationRef);
    }

    // 3. Resolve Style and Compose Full Prompt
    const style = MYTH_ART_STYLES.find((s) => s.id === artStyleId) || MYTH_ART_STYLES[0];
    const fullPrompt = augmentMythologyPromptWithDignity(prompt, style.promptPrefix);

    // 4. Generate Image via Cloudflare AI or Pollinations Flux
    const mappedRatio =
      aspectRatio === '9:16'
        ? '9:16'
        : aspectRatio === '16:9'
        ? '16:9'
        : aspectRatio === '4:5'
        ? '3:4'
        : '1:1';

    const result = await cloudflareAIService.generateImage({
      prompt: fullPrompt,
      aspectRatio: mappedRatio as any,
      model: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    });

    if (!result.success || !result.imageUrl) {
      if (current?.user && reservationRef) {
        dbStore.refundCredits(current.user.id, creditCost, 'Image generation failed refund', reservationRef);
      }
      return NextResponse.json(
        { error: result.error || 'Failed to generate visual.' },
        { status: 500 }
      );
    }

    // 5. Settle credits
    if (current?.user && reservationRef) {
      dbStore.settleCredits(
        current.user.id,
        reservationRef,
        creditCost,
        creditCost
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      isHeroAnimation,
      animatedVideoUrl: isHeroAnimation ? result.imageUrl : undefined,
    });
  } catch (err: any) {
    console.error('Error in /api/mythology/visuals:', err);
    return NextResponse.json(
      { error: err.message || 'Visual generation failed' },
      { status: 500 }
    );
  }
}
