import { dbStore } from '../db/store';
import { aiProviderRegistry } from './registry';
import { GenerationInputPayload } from './types';
import { GenerationJob } from '../types';

export function calculateEstimatedCredits(modelId: string, durationSec: number = 5): number {
  const model = dbStore.getModelById(modelId);
  const baseCost = model?.creditPricing?.costCredits ?? 25;
  if (model?.mediaType === 'video' && durationSec > 5) {
    // Pro-rate longer video generations
    return Math.round(baseCost * (durationSec / 5));
  }
  return baseCost;
}

export async function dispatchGenerationJob(params: {
  userId: string;
  workspaceId: string;
  projectId?: string;
  modelId: string;
  input: GenerationInputPayload;
}): Promise<GenerationJob> {
  const model = dbStore.getModelById(params.modelId);
  if (!model) {
    throw new Error(`AI Model '${params.modelId}' not found in registry.`);
  }

  const provider = aiProviderRegistry.get(model.providerId);
  if (!provider) {
    throw new Error(`Provider '${model.providerId}' adapter not registered.`);
  }

  // Pre-flight validation
  const validation = provider.validateInput(params.input);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid generation parameters.');
  }

  // Calculate required credits
  const duration = params.input.durationSec || 5;
  const estimatedCredits = calculateEstimatedCredits(params.modelId, duration);

  // Check user balance and create job (this atomically reserves the credits in store)
  const job = dbStore.createGenerationJob({
    userId: params.userId,
    workspaceId: params.workspaceId,
    projectId: params.projectId,
    providerId: model.providerId,
    modelId: params.modelId,
    input: params.input,
    estimatedCredits,
  });

  // Background execution without blocking caller
  setTimeout(async () => {
    try {
      dbStore.updateJobStatus(job.id, 'processing', {
        progressPercent: 30,
        progressMessage: 'Synthesizing neural latent space & conditioning prompt...',
      });

      // Provider call
      const result = await provider.startGeneration(params.input, job.id);

      if (result.status === 'processing') {
        // If async polling is needed
        dbStore.updateJobStatus(job.id, 'processing', {
          progressPercent: 65,
          progressMessage: 'Refining motion vectors and temporal coherency...',
          providerRequestId: result.providerRequestId,
        });

        // Polling simulation / check
        setTimeout(async () => {
          try {
            const finalStatus = await provider.checkStatus(result.providerRequestId || '', job.id);
            if (finalStatus.status === 'completed') {
              finishJobSuccess(job, finalStatus);
            } else if (finalStatus.status === 'failed') {
              dbStore.updateJobStatus(job.id, 'failed', {
                progressPercent: 0,
                errorMessage: finalStatus.error || 'Provider generation failed.',
              });
            }
          } catch (err: any) {
            dbStore.updateJobStatus(job.id, 'failed', {
              progressPercent: 0,
              errorMessage: err.message || 'Worker polling failed',
            });
          }
        }, 3000);
      } else if (result.status === 'completed') {
        finishJobSuccess(job, result);
      } else {
        dbStore.updateJobStatus(job.id, 'failed', {
          progressPercent: 0,
          errorMessage: result.error || 'Generation failed.',
        });
      }
    } catch (err: any) {
      console.error('Job execution error:', err);
      dbStore.updateJobStatus(job.id, 'failed', {
        progressPercent: 0,
        errorMessage: err.message || 'An unexpected worker failure occurred.',
      });
    }
  }, 1200);

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
      isDemoSimulated: result.isDemoSimulated,
      metadata: result.metadata,
    },
    actualCredits: job.estimatedCredits,
    providerRequestId: result.providerRequestId,
  });

  // If attached to a project, also register the asset and add to project timeline
  if (result.videoUrl || result.imageUrl || result.audioUrl) {
    const assetType = result.videoUrl ? 'video' : result.imageUrl ? 'image' : 'audio';
    const mediaUrl = result.videoUrl || result.imageUrl || result.audioUrl;

    const newAsset = dbStore.createAsset({
      workspaceId: job.workspaceId,
      ownerId: job.userId,
      projectId: job.projectId,
      name: `${job.input.prompt?.slice(0, 30) || 'AI Asset'} (${assetType})`,
      assetType,
      storageKey: `generated/${job.id}/${assetType}`,
      url: mediaUrl,
      mimeType: assetType === 'video' ? 'video/mp4' : assetType === 'image' ? 'image/png' : 'audio/mpeg',
      fileSize: 2048000,
      metadata: { jobId: job.id, isDemoSimulated: result.isDemoSimulated },
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
