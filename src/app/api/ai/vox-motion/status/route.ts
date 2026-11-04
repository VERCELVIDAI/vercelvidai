import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import {
  VOX_STYLES,
  VOX_NARRATIVE_ARCS,
  VOX_VOICES,
  VOX_BGM_MOODS,
  SAMPLE_SHOWCASE_PROJECTS,
} from '@/lib/ai/vox-motion-constants';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    let userId: string | undefined = current?.user?.id;
    let isPaidUser = false;
    let userPlanName = 'Free Explorer';

    if (userId) {
      const userSub = dbStore.getUserSubscription(userId);
      if (userSub && userSub.subscription && userSub.subscription.status === 'active') {
        const planId = userSub.subscription.planId;
        if (
          planId === 'plan_creator' ||
          planId === 'plan_max' ||
          planId === 'plan_business' ||
          planId.startsWith('plan_openhiggs')
        ) {
          isPaidUser = true;
          userPlanName = userSub.plan?.name || 'Pro Plan';
        }
      }
    }

    const identifier = userId || clientIp;
    const usage = dbStore.getVoxMotionUsage(identifier, isPaidUser);

    return NextResponse.json({
      success: true,
      authenticated: Boolean(current),
      userId: userId || null,
      identifier,
      isPaid: isPaidUser,
      planName: userPlanName,
      maxFreeTries: usage.maxFreeTries,
      remainingFreeTries: usage.remainingFreeTries,
      usedCount: usage.usedCount,
      canGenerate: usage.canGenerate,
      styles: VOX_STYLES,
      narrativeArcs: VOX_NARRATIVE_ARCS,
      voices: VOX_VOICES,
      bgmMoods: VOX_BGM_MOODS,
      showcaseProjects: SAMPLE_SHOWCASE_PROJECTS,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve Vox Motion status',
      },
      { status: 500 }
    );
  }
}
