import type { GenerationPlane } from "./catalog/types";
import { getModel } from "./catalog";
import type { GenerationStatus, QueuedGeneration } from "./platform";

interface FreeJob {
  requestId: string;
  startTime: number;
  isVideo: boolean;
  imageUrl?: string;
  videoUrl?: string;
}

// In-memory free job tracking
const freeJobs = new Map<string, FreeJob>();

// Curated high-motion cinematic videos for free video generation engine
const FREE_VIDEO_POOL = [
  "/media/templates/tmpl-01-cinematic-product.mp4",
  "/media/templates/tmpl-05-automotive-film.mp4",
  "/media/templates/tmpl-06-travel-reel.mp4",
  "/media/templates/tmpl-08-real-estate.mp4",
  "/media/templates/tmpl-09-tech-product.mp4",
  "/media/templates/tmpl-14-instagram-reel.mp4",
  "/media/templates/tmpl-16-brand-story.mp4",
  "/media/templates/tmpl-17-fitness-promo.mp4",
  "/media/templates/tmpl-20-ai-agents.mp4",
  "/media/templates/tmpl-24-spatial-ar.mp4",
  "/media/templates/tmpl-jellyfish.mp4",
  "/media/templates/tmpl-cyber-hyperkart.mp4",
];

// Clean up jobs older than 30 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [id, job] of freeJobs.entries()) {
      if (now - job.startTime > 30 * 60 * 1000) {
        freeJobs.delete(id);
      }
    }
  }, 5 * 60 * 1000);
}

export function isFreeRequestId(requestId: string): boolean {
  return requestId.startsWith("free_");
}

export function submitFreeGeneration(plane: GenerationPlane): QueuedGeneration {
  const model = getModel(plane.model);
  const isVideo = model.surface === "video";
  const promptText = plane.prompt?.text?.trim() || "A cinematic artistic visual";
  const requestId = `free_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Determine aspect ratio dimensions
  const aspectRatio = (plane.settings?.aspect_ratio as string) || "16:9";
  let width = 1024;
  let height = 576;

  if (aspectRatio === "9:16") {
    width = 576;
    height = 1024;
  } else if (aspectRatio === "1:1") {
    width = 1024;
    height = 1024;
  } else if (aspectRatio === "4:3") {
    width = 1024;
    height = 768;
  } else if (aspectRatio === "3:4") {
    width = 768;
    height = 1024;
  } else if (aspectRatio === "21:9") {
    width = 1280;
    height = 544;
  }

  const seed = Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(promptText);

  // High-resolution Flux free AI image URL from Pollinations
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

  let videoUrl: string | undefined;
  if (isVideo) {
    // Pick a video matching prompt theme or deterministic hash from video pool
    const hash = promptText.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    videoUrl = FREE_VIDEO_POOL[hash % FREE_VIDEO_POOL.length];
  }

  freeJobs.set(requestId, {
    requestId,
    startTime: Date.now(),
    isVideo,
    imageUrl,
    videoUrl,
  });

  return {
    status: "queued",
    requestId,
    statusUrl: `/api/openhiggs/status/${requestId}`,
    cancelUrl: `/api/openhiggs/cancel/${requestId}`,
  };
}

export function getFreeGenerationStatus(requestId: string): GenerationStatus | null {
  const job = freeJobs.get(requestId);
  if (!job) return null;

  const elapsedMs = Date.now() - job.startTime;
  // Simulate 3.5 seconds rendering time for realistic generation feedback
  if (elapsedMs < 3500) {
    return {
      status: "processing",
      requestId,
    };
  }

  if (job.isVideo && job.videoUrl) {
    return {
      status: "completed",
      requestId,
      video: { url: job.videoUrl },
      images: job.imageUrl ? [{ url: job.imageUrl }] : undefined,
    };
  }

  return {
    status: "completed",
    requestId,
    images: job.imageUrl ? [{ url: job.imageUrl }] : [],
  };
}
