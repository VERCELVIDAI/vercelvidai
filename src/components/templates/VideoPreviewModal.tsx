'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoTemplate, getRelatedTemplates } from '@/lib/templates';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowRight,
  Sparkles,
  Cpu,
  Film,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface VideoPreviewModalProps {
  template: VideoTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: VideoTemplate) => void;
  onSelectRelated: (template: VideoTemplate) => void;
}

export function VideoPreviewModal({
  template,
  onClose,
  onUseTemplate,
  onSelectRelated,
}: VideoPreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCloning, setIsCloning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Background scroll lock
  useEffect(() => {
    if (!template) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
    };
  }, [template]);

  // Keyboard navigation & controls
  useEffect(() => {
    if (!template) return;
    setIsPlaying(true);
    setIsMuted(true);
    setCurrentTime(0);
    setHasError(false);
    setIsLoading(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [template]);

  if (!template) return null;

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

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (!duration && video.duration) {
      setDuration(video.duration);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsLoading(false);
    setDuration(video.duration);
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;

    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const related = getRelatedTemplates(template.slug, 3);

  const handleCloneClick = async () => {
    setIsCloning(true);
    await onUseTemplate(template);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#211522] border border-[#39233B] rounded-3xl shadow-2xl flex flex-col text-[#F5EAF4]"
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-30 px-5 py-4 border-b border-[#39233B] bg-[#211522]/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#F05BCE]/15 text-[#F05BCE] text-xs font-bold border border-[#F05BCE]/30">
              {template.category}
            </span>
            <span className="text-xs font-mono text-[#A99AAA]">
              {template.aspectLabel} • {template.duration}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close template preview (Esc)"
            className="p-2 min-h-[40px] min-w-[40px] rounded-xl bg-[#100A12] hover:bg-[#2A1B2C] text-[#A99AAA] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#39233B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Video Player */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div
                className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-[#39233B] ${
                  template.aspect === '9:16'
                    ? 'aspect-[9/16] max-w-xs'
                    : template.aspect === '1:1'
                    ? 'aspect-square max-w-md'
                    : 'aspect-video'
                }`}
              >
                {/* Fallback Poster image */}
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    !isLoading && !hasError ? 'opacity-0' : 'opacity-100'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
                  }}
                />

                {/* Video Playback Stream */}
                {!hasError ? (
                  <video
                    ref={videoRef}
                    src={template.videoPreview}
                    playsInline
                    loop
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onError={() => {
                      setHasError(true);
                      setIsLoading(false);
                    }}
                    onClick={togglePlay}
                    className={`absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                      isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#100A12]/90 flex flex-col items-center justify-center p-6 text-center text-[#F5EAF4]">
                    <AlertCircle className="w-8 h-8 text-[#F05BCE] mb-2" />
                    <p className="text-sm font-semibold">Video preview stream unavailable</p>
                    <p className="text-xs text-[#A99AAA] mt-1 max-w-xs">
                      The template asset is loading. You can still open this template directly into the studio editor.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setHasError(false);
                        setIsLoading(true);
                        if (videoRef.current) {
                          videoRef.current.load();
                        }
                      }}
                      className="mt-4 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Playback</span>
                    </button>
                  </div>
                )}

                {/* Loading Spinner */}
                {isLoading && !hasError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                    <div className="w-8 h-8 border-3 border-[#F05BCE]/30 border-t-[#F05BCE] rounded-full animate-spin" />
                  </div>
                )}

                {/* Video Controls Bar Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 pointer-events-auto">
                  {/* Progress / Seek Bar */}
                  <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="h-1.5 w-full bg-white/20 hover:h-2 rounded-full cursor-pointer relative transition-all"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#F05BCE] to-[#C026D3] rounded-full"
                      style={{
                        width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="p-1 hover:text-[#F05BCE] transition-colors"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-1 hover:text-[#F05BCE] transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-[#F05BCE]" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="font-mono text-[11px] text-[#A99AAA]">
                        {formatTime(currentTime)} / {formatTime(duration || template.durationSec || 15)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleFullscreen}
                        className="p-1 hover:text-[#F05BCE] transition-colors"
                        aria-label="Fullscreen"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Metadata, Scenes & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5EAF4] leading-tight">
                  {template.title}
                </h2>
                <p className="mt-3 text-sm text-[#A99AAA] leading-relaxed font-normal">
                  {template.description}
                </p>

                {/* AI Models Used */}
                <div className="mt-5 p-3.5 rounded-2xl bg-[#100A12] border border-[#39233B] space-y-2">
                  <div className="text-[11px] font-bold text-[#F05BCE] uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#F05BCE]" />
                    <span>AI Engine Pipeline</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {template.aiModelsUsed.map((m) => (
                      <span
                        key={m}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#2A1B2C] text-pink-200 border border-[#39233B] font-semibold shadow-2xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scene Timeline Structure */}
                {template.scenes && template.scenes.length > 0 && (
                  <div className="mt-6 space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#F5EAF4] flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-[#F05BCE]" />
                      <span>Timeline Scene Breakdown</span>
                    </div>
                    <div className="space-y-2">
                      {template.scenes.map((scene, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[#100A12] border border-[#39233B] flex items-start gap-3 text-xs shadow-2xs"
                        >
                          <span className="font-mono text-[11px] font-bold text-[#F05BCE] shrink-0 mt-0.5">
                            {scene.time}
                          </span>
                          <div>
                            <div className="font-semibold text-[#F5EAF4]">{scene.title}</div>
                            <div className="text-[#A99AAA] text-[11px] leading-relaxed mt-0.5">
                              {scene.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <div className="pt-4 border-t border-[#39233B]">
                <button
                  type="button"
                  onClick={handleCloneClick}
                  disabled={isCloning}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold text-sm shadow-xl shadow-[rgba(240,91,206,0.25)] flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer border border-white/10"
                >
                  {isCloning ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Open in Multi-Track Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="mt-2 text-center text-[11px] text-[#A99AAA] font-medium">
                  Creates an independent editable project in your workspace without deducting credits.
                </p>
              </div>
            </div>
          </div>

          {/* Related Templates Grid */}
          <div className="pt-6 border-t border-[#39233B]">
            <h3 className="font-bold text-[#F5EAF4] text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F05BCE]" />
              <span>More Templates in this Style</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectRelated(r)}
                  className="group cursor-pointer rounded-2xl p-2.5 bg-[#100A12] hover:bg-[#2A1B2C] border border-[#39233B] hover:border-[#F05BCE]/40 transition-all flex items-center gap-3 shadow-xs"
                >
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    className="w-16 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#F5EAF4] truncate group-hover:text-[#F05BCE] transition-colors">
                      {r.title}
                    </div>
                    <div className="text-[10px] text-[#A99AAA] font-mono">
                      {r.aspectLabel} • {r.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
