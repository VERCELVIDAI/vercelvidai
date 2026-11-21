import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { dbStore } from '@/lib/db/store';
import { ExportedVideoRecord } from '@/lib/mythology/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { projectId, aspectRatios = ['9:16'] } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required for rendering.' }, { status: 400 });
    }

    const project = dbStore.getMythProjectById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const current = await getCurrentUser();
    let hasWatermark = true;
    let resolution: '720p' | '1080p' = '720p';

    if (current?.user) {
      const { subscription, plan } = dbStore.getUserSubscription(current.user.id);
      if (subscription && subscription.status === 'active' && plan) {
        hasWatermark = plan.entitlements.watermark;
        resolution = plan.entitlements.maxResolution === '4k' || plan.entitlements.maxResolution === '1080p' ? '1080p' : '720p';
      }
    }

    const exportedVideos: ExportedVideoRecord[] = aspectRatios.map((ratio: '9:16' | '4:5' | '1:1' | '16:9') => ({
      aspectRatio: ratio,
      resolution,
      hasWatermark,
      videoUrl: project.scenes[0]?.animatedVideoUrl || project.scenes[0]?.imageUrl || '/demos/vidai-astronaut-spacewalk.mp4',
      createdAt: new Date().toISOString(),
    }));

    // Auto-generate Viral Social Pack
    const cleanTitle = project.title || 'Sacred Mythology Legend';
    const isHindi = project.language === 'hi';

    const viralPack = {
      suggestedTitles: [
        isHindi ? `क्यों हुआ ऐसा? ${cleanTitle} का अनसुना रहस्य 🚩` : `The Untold Mystery of ${cleanTitle} Explained 🔥`,
        isHindi ? `शास्त्रों में छिपा सबसे बड़ा सत्य: ${cleanTitle} 🕉️` : `What Ancient Scriptures Say About ${cleanTitle} ⚡`,
        isHindi ? `जब भगवान ने उठाया यह कदम! ${cleanTitle} गाथा` : `The Moment That Changed Destiny: ${cleanTitle}`,
      ],
      description: `${project.storyConcept}\n\n📖 संदर्भ: ${project.sourceNote || 'प्राचीन पौराणिक कथाएं'}\n\n🎨 Visual Style: ${project.artStyleId}\n⚡ Produced on Fluvia Flow Mythology Studio (https://www.fluviaflow.online/mythology)\n\n#SanatanDharma #Mythology #FluviaMythos #Reels #AIAnimation`,
      hashtags: [
        '#Mythology',
        '#SanatanDharma',
        '#HinduMythology',
        '#Ramayana',
        '#Mahabharata',
        '#Krishna',
        '#Shiva',
        '#Hanuman',
        '#BhaktiReels',
        '#ShortsIndia',
        '#Devotional',
        '#AIAnimation',
        '#AncientWisdom',
        '#IndianCulture',
        '#FluviaFlow',
      ],
    };

    const updated = dbStore.updateMythProject(projectId, {
      status: 'ready',
      currentStep: 7,
      exportedVideos,
      thumbnailUrl: project.scenes[0]?.imageUrl || project.thumbnailUrl,
      viralPack,
    });

    return NextResponse.json({
      success: true,
      project: updated,
      exportedVideos,
      viralPack,
      hasWatermark,
      resolution,
    });
  } catch (err: any) {
    console.error('Error in /api/mythology/render:', err);
    return NextResponse.json(
      { error: err.message || 'Video export failed' },
      { status: 500 }
    );
  }
}
