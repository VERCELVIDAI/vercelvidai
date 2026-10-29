'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import {
  getTemplateBySlug,
  getRelatedTemplates,
} from '@/lib/templates';
import { TextAnimationPreview } from '@/components/templates/TextAnimationPreview';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Cpu,
  Film,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function TemplateDetailPage({ params }: PageProps) {
  const router = useRouter();
  const tmpl = getTemplateBySlug(params.slug);

  if (!tmpl) {
    notFound();
  }

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || hasError) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleUseTemplate = async () => {
    setIsCloning(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push(`/login?redirect=/templates/${tmpl.slug}`);
        return;
      }

      if (tmpl.type === 'image') {
        router.push(`/ai-image-generator?prompt=${encodeURIComponent(tmpl.prompt)}&aspect=${encodeURIComponent(tmpl.aspect)}`);
        return;
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${tmpl.title} (Project)`,
          mediaType: 'video',
          thumbnailUrl: tmpl.thumbnail,
          timeline: {
            durationSec: tmpl.durationSec,
            aspectRatio: tmpl.aspect,
            resolution: '1080p',
            tracks: [
              { id: 'trk_v1', type: 'video', name: 'Primary Video' },
              { id: 'trk_t1', type: 'text', name: 'Text & Titles' },
              { id: 'trk_a1', type: 'audio', name: 'Soundtrack' },
            ],
            clips: [
              {
                id: `clp_v_${Date.now()}_1`,
                trackId: 'trk_v1',
                type: 'video',
                title: tmpl.title,
                sourceUrl: tmpl.videoPreview || tmpl.thumbnail,
                startTimeSec: 0,
                durationSec: tmpl.durationSec,
                volume: 1,
              },
            ],
          },
        }),
      });

      if (!res.ok) throw new Error('Could not instantiate project');
      const data = await res.json();
      router.push(`/editor/${data.project.id}`);
    } catch (e: any) {
      alert(e.message || 'Error cloning template');
      setIsCloning(false);
    }
  };

  const related = getRelatedTemplates(tmpl.slug, 3);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-white text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#17191D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#5145CD]" />
            <span>Back to Template Marketplace</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (7 cols): Media Preview by Type */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full rounded-2xl bg-white p-3 sm:p-4 border border-[#E5E7EB] shadow-xs overflow-hidden">
              {tmpl.type === 'image' ? (
                /* Static High-Res Image Lightbox */
                <div className="relative w-full rounded-xl overflow-hidden bg-slate-900 shadow-xl flex items-center justify-center p-2">
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.title}
                    className="max-h-[600px] w-auto object-contain rounded-lg"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-xs text-[#5145CD] font-mono border border-[#E5E7EB] flex items-center gap-1 shadow-2xs">
                      <ImageIcon className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span>{tmpl.aspectLabel || tmpl.aspect}</span>
                    </span>
                  </div>
                </div>
              ) : tmpl.type === 'text-animation' ? (
                /* Interactive Deterministic Typography Engine Preview */
                <TextAnimationPreview
                  template={tmpl}
                  onOpenInEditor={() => handleUseTemplate()}
                />
              ) : (
                /* Real Playable Video Preview */
                <div
                  className={`relative w-full rounded-xl overflow-hidden bg-black shadow-xl mx-auto ${
                    tmpl.aspect === '9:16'
                      ? 'aspect-[9/16] max-w-xs'
                      : tmpl.aspect === '1:1'
                      ? 'aspect-square max-w-md'
                      : 'aspect-video'
                  }`}
                >
                  {/* Poster fallback */}
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      videoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
                    }}
                  />

                  {!hasError && tmpl.videoPreview ? (
                    <video
                      ref={videoRef}
                      src={tmpl.videoPreview}
                      playsInline
                      loop
                      autoPlay
                      muted={isMuted}
                      onLoadedData={() => setVideoLoaded(true)}
                      onError={() => setHasError(true)}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                        videoLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center text-white">
                      <AlertCircle className="w-8 h-8 text-indigo-400 mb-2" />
                      <p className="text-sm font-semibold">Video preview ready in studio</p>
                    </div>
                  )}

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white font-mono">
                      {tmpl.aspectLabel || tmpl.aspect}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-white font-mono">
                      {tmpl.duration || '15s'}
                    </span>
                  </div>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="hover:text-indigo-300 transition-colors cursor-pointer"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="hover:text-indigo-300 transition-colors cursor-pointer"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-indigo-300" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Details & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5145CD] font-bold text-xs uppercase tracking-wider mb-3 border border-[#5145CD]/20 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>{tmpl.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#17191D] tracking-tight leading-tight">
                {tmpl.title}
              </h1>

              <p className="mt-4 text-base text-[#667085] leading-relaxed font-normal">
                {tmpl.description}
              </p>
            </div>

            {/* AI Engine Pipeline */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2 shadow-2xs">
              <div className="text-xs font-bold text-[#5145CD] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#5145CD]" />
                <span>Integrated AI Pipeline</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(tmpl.aiModelsUsed || ['Google Gemini (gemini-omni-1.1-flash)']).map((m) => (
                  <span
                    key={m}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white text-[#5145CD] border border-[#E5E7EB] font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline Breakdown (If Scenes Defined) */}
            {tmpl.scenes && tmpl.scenes.length > 0 && (
              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3 shadow-2xs">
                <div className="text-xs font-bold text-[#17191D] uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#5145CD]" />
                  <span>Timeline Structure ({tmpl.duration})</span>
                </div>
                <div className="space-y-2">
                  {tmpl.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#E5E7EB] text-xs flex items-start gap-3"
                    >
                      <span className="font-mono text-[11px] font-bold text-[#5145CD] shrink-0 mt-0.5">
                        {scene.time}
                      </span>
                      <div>
                        <div className="font-semibold text-[#17191D]">{scene.title}</div>
                        <div className="text-[#667085] text-[11px] leading-relaxed mt-0.5">
                          {scene.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Use Template CTA */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleUseTemplate}
                disabled={isCloning}
                className="w-full py-4 px-6 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isCloning ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {tmpl.type === 'image'
                        ? 'Generate in Image Studio (5 cr)'
                        : tmpl.type === 'text-animation'
                        ? 'Use Typography in Video Editor (0 cr)'
                        : 'Use Template — Open in Editor'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[#667085]">
                Copies settings, creative prompts, and presets into your workspace with zero credit risk.
              </p>
            </div>
          </div>
        </div>

        {/* Related Templates Section */}
        <div className="mt-20 pt-10 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#17191D] tracking-tight">
              Related Video Templates
            </h2>
            <Link
              href="/templates"
              className="text-xs font-semibold text-[#5145CD] hover:text-[#4338CA] hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/templates/${r.slug}`}
                className="group rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs hover:shadow-md hover:border-[#5145CD]/40 transition-all flex flex-col justify-between"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white">
                    {r.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-semibold text-[#5145CD] uppercase tracking-wider mb-1 font-mono">
                    {r.category}
                  </div>
                  <h3 className="font-semibold text-[#17191D] text-sm group-hover:text-[#5145CD] transition-colors truncate">
                    {r.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
