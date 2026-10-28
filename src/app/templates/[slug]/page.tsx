'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { getTemplateBySlug, getRelatedTemplates, CreativeTemplate, VideoTemplate } from '@/lib/templates';
import { TextAnimationPreview } from '@/components/templates/TextAnimationPreview';
import {
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Clock,
  Layers,
  Cpu,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Type,
  Wand2,
} from 'lucide-react';

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoUse = searchParams.get('autoUse') === 'true';

  const [isCloning, setIsCloning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tmpl = getTemplateBySlug(params.slug) || getTemplateBySlug('cinematic-product-commercial')!;

  const handleUseTemplate = async () => {
    setIsCloning(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push(`/login?returnUrl=${encodeURIComponent(`/templates/${tmpl.slug}`)}&useTemplate=true`);
        return;
      }

      // Create independent project from template
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
              { id: 'trk_v1', type: 'video', name: 'Video Scenes' },
              { id: 'trk_t1', type: 'text', name: 'Subtitles & Captions' },
              { id: 'trk_a1', type: 'audio', name: 'Soundtrack & Voice' },
            ],
            clips: [
              {
                id: `clp_v_${Date.now()}_1`,
                trackId: 'trk_v1',
                type: 'video',
                title: tmpl.scenes?.[0]?.title || tmpl.title || 'Creative Scene',
                sourceUrl: tmpl.videoPreview || tmpl.thumbnail,
                startTimeSec: 0,
                durationSec: tmpl.durationSec || 15,
                volume: 1,
              },
            ],
          },
        }),
      });

      if (!res.ok) throw new Error('Could not instantiate template');
      const data = await res.json();
      router.push(`/editor/${data.project.id}`);
    } catch (err: any) {
      alert(`Error cloning template: ${err.message}`);
      setIsCloning(false);
    }
  };

  // If user just logged in with autoUse=true
  useEffect(() => {
    if (autoUse) {
      handleUseTemplate();
    }
  }, [autoUse]);

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

  const related = getRelatedTemplates(tmpl.slug, 3);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200 bg-[#100A12] text-[#F5EAF4]"
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A99AAA] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#F05BCE]" />
            <span>Back to Template Marketplace</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column (7 cols): Media Preview by Type */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full rounded-3xl bg-[#211522] p-3 sm:p-4 border border-[#39233B] shadow-2xl overflow-hidden">
              {tmpl.type === 'image' ? (
                /* Static High-Res Image Lightbox */
                <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center p-2">
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.title}
                    className="max-h-[600px] w-auto object-contain rounded-xl"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#211522]/90 backdrop-blur-md px-2.5 py-1 rounded text-xs text-[#F05BCE] font-mono border border-[#39233B] flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-[#F05BCE]" />
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
                  className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl mx-auto ${
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
                    <div className="absolute inset-0 bg-[#100A12]/90 flex flex-col items-center justify-center p-6 text-center text-[#F5EAF4]">
                      <AlertCircle className="w-8 h-8 text-[#F05BCE] mb-2" />
                      <p className="text-sm font-semibold">Video preview ready in studio</p>
                    </div>
                  )}

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-[#F05BCE] font-mono border border-[#39233B]">
                      {tmpl.aspectLabel || tmpl.aspect}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-[#F5EAF4] font-mono border border-[#39233B]">
                      {tmpl.duration || '15s'}
                    </span>
                  </div>

                  {/* Video Controls Overlay */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="hover:text-[#F05BCE] transition-colors cursor-pointer"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="hover:text-[#F05BCE] transition-colors cursor-pointer"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-[#F05BCE]" /> : <Volume2 className="w-4 h-4" />}
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05BCE]/10 text-pink-300 font-bold text-xs uppercase tracking-wider mb-3 border border-[#F05BCE]/30 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#F05BCE]" />
                <span>{tmpl.category}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5EAF4] tracking-tight leading-tight">
                {tmpl.title}
              </h1>

              <p className="mt-4 text-base text-[#A99AAA] leading-relaxed font-normal">
                {tmpl.description}
              </p>
            </div>

            {/* AI Engine Pipeline */}
            <div className="p-4 rounded-2xl bg-[#211522] border border-[#39233B] space-y-2 shadow-2xs">
              <div className="text-xs font-bold text-[#F05BCE] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#F05BCE]" />
                <span>Integrated AI Pipeline</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(tmpl.aiModelsUsed || ['Google Gemini (gemini-omni-1.1-flash)']).map((m) => (
                  <span
                    key={m}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#100A12] text-pink-200 border border-[#39233B] font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline Breakdown (If Scenes Defined) */}
            {tmpl.scenes && tmpl.scenes.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#211522] border border-[#39233B] space-y-3 shadow-2xs">
                <div className="text-xs font-bold text-[#F5EAF4] uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-[#F05BCE]" />
                  <span>Timeline Structure ({tmpl.duration})</span>
                </div>
                <div className="space-y-2">
                  {tmpl.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#100A12] border border-[#39233B] text-xs flex items-start gap-3"
                    >
                      <span className="font-mono text-[11px] font-bold text-[#F05BCE] shrink-0 mt-0.5">
                        {scene.time}
                      </span>
                      <div>
                        <div className="font-bold text-[#F5EAF4]">{scene.title}</div>
                        <div className="text-[#A99AAA] text-[11px] leading-relaxed mt-0.5">
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
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-[rgba(240,91,206,0.25)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-white/10"
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
              <p className="text-center text-xs text-[#A99AAA]">
                Copies settings, creative prompts, and presets into your workspace with zero credit risk.
              </p>
            </div>
          </div>
        </div>

        {/* Related Templates Section */}
        <div className="mt-20 pt-10 border-t border-[#39233B]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#F5EAF4] tracking-tight">
              Related Video Templates
            </h2>
            <Link
              href="/templates"
              className="text-xs font-bold text-[#F05BCE] hover:brightness-125 hover:underline flex items-center gap-1"
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
                className="group rounded-2xl bg-[#211522] border border-[#39233B] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#F05BCE]/40 transition-all flex flex-col justify-between"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
                    }}
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-[#F5EAF4] border border-[#39233B]">
                    {r.duration}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-[#F05BCE] uppercase tracking-wider mb-1 font-mono">
                    {r.category}
                  </div>
                  <h3 className="font-bold text-[#F5EAF4] text-sm group-hover:text-[#F05BCE] transition-colors truncate">
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
