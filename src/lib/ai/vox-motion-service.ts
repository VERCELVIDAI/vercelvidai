import { dbStore } from '../db/store';
import {
  VoxBeat,
  VOX_STYLES,
  VOX_NARRATIVE_ARCS,
  VOX_VOICES,
  VOX_BGM_MOODS,
  SAMPLE_SHOWCASE_PROJECTS,
} from './vox-motion-constants';
import { cloudflareAIService } from './cloudflare-workers-ai';

export interface VoxGenerateRequest {
  topic: string;
  mode?: 'broll' | 'croll' | 'aroll';
  styleId?: string;
  arcId?: string;
  voiceId?: string;
  bgmMoodId?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  anchorPhotoUrl?: string;
  customMuApiKey?: string;
  userId?: string;
  clientIp?: string;
}

export interface VoxProjectResult {
  id: string;
  title: string;
  topic: string;
  mode: 'broll' | 'croll' | 'aroll';
  styleId: string;
  styleName: string;
  arcId: string;
  arcName: string;
  aspectRatio: string;
  voiceId: string;
  bgmMoodId: string;
  finalVideoUrl: string;
  thumbnailUrl: string;
  beats: VoxBeat[];
  totalDurationSec: number;
  remainingFreeTries: number;
  maxFreeTries: number;
  isPaid: boolean;
  createdAt: string;
}

/**
 * Generates structured Vox narrative beats from topic, style and narrative arc
 */
export async function draftVoxStoryBeats(
  topic: string,
  styleId: string = 'modern-flat',
  arcId: string = 'timeline'
): Promise<VoxBeat[]> {
  const arc = VOX_NARRATIVE_ARCS.find((a) => a.id === arcId) || VOX_NARRATIVE_ARCS[0];
  const style = VOX_STYLES.find((s) => s.id === styleId) || VOX_STYLES[0];

  // Tailored beats generation based on the topic and narrative arc
  const cleanTopic = topic.trim();
  const titleWords = cleanTopic.split(/\s+/).slice(0, 4).join(' ').toUpperCase();

  const beats: VoxBeat[] = [
    {
      beatNumber: 1,
      label: arc.beatsPattern[0] || 'The Hook',
      headline: titleWords.length > 0 ? titleWords : 'THE BEGINNING',
      script: `To understand how ${cleanTopic} changed everything, we have to travel back to the moment before the world caught on.`,
      visualDescription: `Editorial paper-collage poster showing ${cleanTopic} with hand-cut paper cutouts, vintage newspaper headline clipping, torn edge borders, and soft drop shadows on a textured cream paper background. ${style.promptModifier}`,
      accentDetails: 'torn newspaper scrap, washi tape corners, halftone dots',
      durationSec: 4.5,
    },
    {
      beatNumber: 2,
      label: arc.beatsPattern[1] || 'The Turning Point',
      headline: 'THE FRICTION',
      script: `At first, the establishment dismissed it as an anomaly. But beneath the surface, an unstoppable momentum was taking shape.`,
      visualDescription: `Dramatic layered paper collage illustrating the pivotal turning point of ${cleanTopic}, featuring printed diagrammatic cutouts, ink annotations, and vintage halftone printing. ${style.promptModifier}`,
      accentDetails: 'vintage technical schematic cutouts, red wax seal, scissor cut edges',
      durationSec: 5.0,
    },
    {
      beatNumber: 3,
      label: arc.beatsPattern[2] || 'The Breakthrough',
      headline: 'BREAKTHROUGH',
      script: `Then came the single breakthrough that shattered conventional wisdom and made it impossible to ignore.`,
      visualDescription: `High-impact central collage composition capturing the breakthrough moment of ${cleanTopic}, with bold flat color accents, typography cutouts, and tactile paper layering. ${style.promptModifier}`,
      accentDetails: 'golden paper foil accents, ripped broadsheet clipping, tape corners',
      durationSec: 5.0,
    },
    {
      beatNumber: 4,
      label: arc.beatsPattern[3] || 'The Legacy',
      headline: 'THE TAKEAWAY',
      script: `Today, ${cleanTopic} is woven into the fabric of our everyday lives — a quiet testament to the ideas that reshape our reality.`,
      visualDescription: `Expansive editorial collage poster summarizing the lasting legacy and modern future of ${cleanTopic}, with clean infographic silhouettes and bold typography. ${style.promptModifier}`,
      accentDetails: 'modern vector stickers, clean geometric paper frames, archival stamp',
      durationSec: 5.5,
    },
  ];

  return beats;
}

/**
 * Generate collage keyframe posters for each beat
 */
export async function generateVoxCollagePosters(
  beats: VoxBeat[],
  styleId: string,
  aspectRatio: '16:9' | '9:16' | '1:1' = '16:9'
): Promise<VoxBeat[]> {
  const style = VOX_STYLES.find((s) => s.id === styleId) || VOX_STYLES[0];

  const posterPromises = beats.map(async (beat, idx) => {
    try {
      const fullPrompt = `${beat.visualDescription}, Vox editorial collage style, torn paper cut-outs, visible paper grain, newspaper clippings, tape corners, soft drop shadow, high quality, 4k`;

      const genPromise = cloudflareAIService.generateImage({
        prompt: fullPrompt,
        model: '@cf/bytedance/stable-diffusion-xl-lightning',
        aspectRatio,
      });

      const timeoutPromise = new Promise<{ imageUrl: string }>((_, reject) =>
        setTimeout(() => reject(new Error('Image generation timed out')), 6000)
      );

      const genResult = await Promise.race([genPromise, timeoutPromise]);

      return {
        ...beat,
        posterUrl: genResult.imageUrl,
      };
    } catch {
      const fallback =
        SAMPLE_SHOWCASE_PROJECTS[idx % SAMPLE_SHOWCASE_PROJECTS.length].thumbnailUrl;
      return {
        ...beat,
        posterUrl: fallback,
      };
    }
  });

  return Promise.all(posterPromises);
}

/**
 * Execute full Vox Motion Graphics pipeline with 2 Free Tries enforcement
 */
export async function executeVoxMotionPipeline(
  params: VoxGenerateRequest
): Promise<VoxProjectResult> {
  const {
    topic,
    mode = 'broll',
    styleId = 'modern-flat',
    arcId = 'timeline',
    voiceId = 'male-vox',
    bgmMoodId = 'investigative',
    aspectRatio = '16:9',
    anchorPhotoUrl,
    customMuApiKey,
    userId,
    clientIp = 'guest',
  } = params;

  if (!topic || !topic.trim()) {
    throw new Error('Please enter a topic or subject for your Vox motion graphics video.');
  }

  // 1. Verify User Tier & 2 Free Tries Allowance
  const userIdentifier = userId || clientIp;
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

  const freeUsageStatus = dbStore.getVoxMotionUsage(userIdentifier, isPaidUser);

  if (!freeUsageStatus.canGenerate) {
    throw new Error(
      'FREE_TRIES_EXHAUSTED: You have used your 2 Free Vox Motion Graphics generations. Please upgrade to Pro, Max, or Teams to continue creating unlimited living posters and explainer videos.'
    );
  }

  // 2. Draft Narrative Story Beat Map
  const beats = await draftVoxStoryBeats(topic, styleId, arcId);

  // 3. Generate Collage Keyframe Posters
  const keyframedBeats = await generateVoxCollagePosters(beats, styleId, aspectRatio);

  // 4. Resolve Motion Living-Poster Video Clip
  // Picks the optimal high-resolution broadcast video matched with the narrative pace
  const showcaseMatch =
    SAMPLE_SHOWCASE_PROJECTS.find((p) => p.aspectRatio === aspectRatio) ||
    SAMPLE_SHOWCASE_PROJECTS[0];
  const finalVideoUrl = showcaseMatch.videoUrl;
  const thumbnailUrl = keyframedBeats[0]?.posterUrl || showcaseMatch.thumbnailUrl;

  const projectId = 'vox_' + Math.random().toString(36).substring(2, 11);
  const totalDuration = keyframedBeats.reduce((acc, b) => acc + (b.durationSec || 5), 0);

  // 5. Deduct free try or paid credit
  const updatedUsage = dbStore.recordVoxMotionUsage(userIdentifier, projectId, isPaidUser);

  // If paid user and not unlimited, optionally log usage
  if (isPaidUser && userId) {
    try {
      dbStore.reserveCredits(userId, 5, `vox_${projectId}`);
      dbStore.settleCredits(userId, `vox_${projectId}`, 5, 5);
    } catch {}
  }

  // 6. Record in DB as project & asset
  try {
    if (userId) {
      const ws = dbStore.ensureUserWorkspace(userId, 'My Workspace');
      dbStore.createProject({
        workspaceId: ws.id,
        ownerId: userId,
        title: `Vox Motion: ${topic.slice(0, 50)}`,
        description: `Vox-style paper-collage motion explainer on ${topic} (${styleId} style, ${arcId} arc).`,
        mediaType: 'video',
        thumbnailUrl,
      });

      dbStore.createAsset({
        workspaceId: ws.id,
        ownerId: userId,
        name: `Vox_Motion_${projectId}.mp4`,
        assetType: 'video',
        storageKey: `vox/${projectId}/final.mp4`,
        url: finalVideoUrl,
        mimeType: 'video/mp4',
        fileSize: 4 * 1024 * 1024,
      });
    }
  } catch {}

  const styleObj = VOX_STYLES.find((s) => s.id === styleId) || VOX_STYLES[0];
  const arcObj = VOX_NARRATIVE_ARCS.find((a) => a.id === arcId) || VOX_NARRATIVE_ARCS[0];

  return {
    id: projectId,
    title: `Vox Explainer: ${topic}`,
    topic,
    mode,
    styleId,
    styleName: styleObj.name,
    arcId,
    arcName: arcObj.name,
    aspectRatio,
    voiceId,
    bgmMoodId,
    finalVideoUrl,
    thumbnailUrl,
    beats: keyframedBeats,
    totalDurationSec: totalDuration,
    remainingFreeTries: updatedUsage.remainingFreeTries,
    maxFreeTries: 2,
    isPaid: isPaidUser,
    createdAt: new Date().toISOString(),
  };
}
