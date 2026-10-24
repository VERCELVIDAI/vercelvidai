import { dbStore } from '../db/store';
import { aiProviderRegistry } from './registry';
import { GenerationInputPayload } from './types';
import { GenerationJob } from '../types';

/**
 * Fluvia Flow Pricing Requirement: Exactly 15 credits per generated video.
 */
export function calculateEstimatedCredits(modelId?: string, durationSec: number = 5): number {
  return 15;
}

export async function dispatchGenerationJob(params: {
  userId: string;
  workspaceId: string;
  projectId?: string;
  modelId: string;
  input: GenerationInputPayload;
}): Promise<GenerationJob> {
  const selectedModelId = params.modelId || 'gemini-omni-1.1-flash';

  // Enforcement: Gemini is the ONLY active model in this implementation
  const allowedActiveModels = ['gemini-omni-1.1-flash', 'gemini-omni-flash', 'gemini'];
  if (!allowedActiveModels.includes(selectedModelId)) {
    throw new Error(
      `Model '${params.modelId}' is currently Coming Soon. Only Google Gemini (gemini-omni-1.1-flash) is active for video generation.`
    );
  }

  const provider = aiProviderRegistry.get('gemini');
  if (!provider) {
    throw new Error("Provider 'gemini' adapter not registered.");
  }

  // Pre-flight validation
  const validation = provider.validateInput(params.input);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid generation parameters.');
  }

  // Fluvia Flow requirement: Exactly 15 credits per video
  const requiredCredits = 15;
  const creditAccount = dbStore.getCreditAccount(params.userId);
  if (creditAccount.availableBalance < requiredCredits) {
    throw new Error(
      `Insufficient credits. Video generation requires ${requiredCredits} credits, but you have ${creditAccount.availableBalance} available.`
    );
  }

  // Check user balance and create job (this atomically reserves the 15 credits in dbStore)
  const job = dbStore.createGenerationJob({
    userId: params.userId,
    workspaceId: params.workspaceId,
    projectId: params.projectId,
    providerId: 'gemini',
    modelId: 'gemini-omni-1.1-flash',
    input: params.input,
    estimatedCredits: requiredCredits,
  });

  // Background execution without blocking caller
  setTimeout(async () => {
    try {
      dbStore.updateJobStatus(job.id, 'processing', {
        progressPercent: 35,
        progressMessage: 'Connecting to Google Gemini Omni 1.1 Flash inference pipeline...',
      });

      // Provider call (real Gemini Interactions API)
      const result = await provider.startGeneration(params.input, job.id);

      if (result.status === 'completed') {
        finishJobSuccess(job, result);
      } else {
        // Automatically triggers dbStore.refundCredits for the 15 reserved credits
        dbStore.updateJobStatus(job.id, 'failed', {
          progressPercent: 0,
          errorMessage: result.error || 'Generation failed.',
          errorCode: result.metadata?.errorCode,
        });
      }
    } catch (err: any) {
      console.error('[Dispatcher] Job execution error:', err);
      // Automatically triggers dbStore.refundCredits for the 15 reserved credits
      dbStore.updateJobStatus(job.id, 'failed', {
        progressPercent: 0,
        errorMessage: err.message || 'An unexpected inference failure occurred.',
      });
    }
  }, 300);

  return job;
}

function finishJobSuccess(job: GenerationJob, result: any) {
  dbStore.updateJobStatus(job.id, 'completed', {
    progressPercent: 100,
    progressMessage: result.progressMessage || 'Render completed successfully',
    output: {
      videoUrl: result.videoUrl,
      imageUrl: result.imageUrl,
      audioUrl: result.audioUrl,
      thumbnailUrl: result.thumbnailUrl,
      transcript: result.transcript,
      isDemoSimulated: false,
      metadata: result.metadata,
    },
    actualCredits: 15, // Fixed 15 credits
    providerRequestId: result.providerRequestId,
  });

  // If attached to a project, also register the asset and add to project timeline
  if (result.videoUrl || result.imageUrl || result.audioUrl) {
    const assetType = result.videoUrl ? 'video' : result.imageUrl ? 'image' : 'audio';
    const mediaUrl = result.videoUrl || result.imageUrl || result.audioUrl;

    dbStore.createAsset({
      workspaceId: job.workspaceId,
      ownerId: job.userId,
      projectId: job.projectId,
      name: `${job.input.prompt?.slice(0, 30) || 'AI Asset'} (${assetType})`,
      assetType,
      storageKey: `generated/${job.id}/${assetType}`,
      url: mediaUrl,
      mimeType: assetType === 'video' ? 'video/mp4' : assetType === 'image' ? 'image/png' : 'audio/mpeg',
      fileSize: 2048000,
      metadata: { jobId: job.id, isDemoSimulated: false },
    });

    if (job.projectId) {
      const project = dbStore.getProjectById(job.projectId);
      if (project) {
        const timeline = { ...project.timeline };
        const videoTrack = timeline.tracks.find((t) => t.type === 'video') || timeline.tracks[0];
        if (videoTrack) {
          const currentDuration = timeline.durationSec || 0;
          const newClipDuration = job.input.durationSec || 5;
          timeline.clips.push({
            id: 'clp_' + Math.random().toString(36).substring(2, 9),
            trackId: videoTrack.id,
            type: assetType as any,
            title: job.input.prompt?.slice(0, 24) || 'AI Generated Scene',
            sourceUrl: mediaUrl,
            startTimeSec: currentDuration,
            durationSec: newClipDuration,
            volume: 1,
          });
          timeline.durationSec = currentDuration + newClipDuration;
          dbStore.updateProject(project.id, {
            timeline,
            thumbnailUrl: result.thumbnailUrl || project.thumbnailUrl,
            status: 'completed',
          });
        }
      }
    }
  }
}

export const aiDispatcher = {
  calculateEstimatedCredits,
  dispatchGenerationJob,
};
