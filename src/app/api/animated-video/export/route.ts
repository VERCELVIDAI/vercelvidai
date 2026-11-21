import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';

const VIDEO_EXPORT_CREDIT_COST = 20;

export async function GET(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ projects: [] });
    }

    const projects = dbStore.getMythProjects(current.user.id);
    return NextResponse.json({ projects });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json(
        {
          error: 'Please sign in or select a plan to export videos. Exports require an active plan or video credits.',
          requiresAuth: true,
          upgradeUrl: '/checkout?plan=plan_mythos_20',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, styleId, scenes, aspectRatio, audioUrl, duration } = body;

    const userId = current.user.id;
    const account = dbStore.getCreditAccount(userId);

    if (account.availableBalance < VIDEO_EXPORT_CREDIT_COST) {
      return NextResponse.json(
        {
          error: `Insufficient video credits. You need ${VIDEO_EXPORT_CREDIT_COST} credits to export this video, but your wallet has ${account.availableBalance} credits. Please upgrade to a Mythos Creator plan to continue.`,
          requiredCredits: VIDEO_EXPORT_CREDIT_COST,
          availableBalance: account.availableBalance,
          upgradeUrl: '/checkout?plan=plan_mythos_20',
        },
        { status: 402 }
      );
    }

    // Deduct / reserve credits
    const exportRef = `vid_${Date.now()}`;
    const reserved = dbStore.reserveCredits(userId, VIDEO_EXPORT_CREDIT_COST, exportRef);
    if (!reserved) {
      return NextResponse.json(
        { error: 'Failed to reserve video credits. Please try again.' },
        { status: 500 }
      );
    }

    // Save generated project in DB
    const savedProject = dbStore.createMythProject({
      userId,
      title: title || 'Untitled Mythology Video',
      storyConcept: title || 'Mythology animated video',
      culture: 'hindu_vedic',
      language: 'hi',
      targetDurationSec: 30,
      tone: 'epic',
      artStyleId: styleId || 'mythology',
      voiceId: 'eleven_multilingual_v2',
      bgmMoodId: 'epic_war_drums',
      status: 'ready',
    });

    return NextResponse.json({
      success: true,
      project: savedProject,
      creditsDeducted: VIDEO_EXPORT_CREDIT_COST,
      remainingCredits: account.availableBalance - VIDEO_EXPORT_CREDIT_COST,
      message: `Export authorized! ${VIDEO_EXPORT_CREDIT_COST} credits deducted.`,
    });
  } catch (err: any) {
    console.error('Error in /api/animated-video/export:', err);
    return NextResponse.json(
      { error: err.message || 'Internal video export error' },
      { status: 500 }
    );
  }
}
