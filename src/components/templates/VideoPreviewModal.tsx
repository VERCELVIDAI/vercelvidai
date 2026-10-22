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
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!template) return;
    setIsPlaying(true);
    setIsMuted(true);
    setCurrentTime(0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [template]);

  if (!template) return null;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
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
    setDuration(video.duration);
    video.play().catch(() => {});
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto glass-modal border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col text-[#17211D]">
        {/* Modal Header */}
        <div className="sticky top-0 z-30 p-3 sm:p-5 border-b border-emerald-500/10 bg-white/95 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-500/20">
              {template.category}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {template.aspectLabel} • {template.duration}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close template preview"
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl glass-button text-slate-600 hover:text-[#17211D] flex items-center justify-center transition-colors"
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
                className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-black/10 ${
                  template.aspect === '9:16'
                    ? 'aspect-[9/16] max-w-xs'
                    : template.aspect === '1:1'
                    ? 'aspect-square max-w-md'
                    : 'aspect-video'
                }`}
              >
                <video
                  ref={videoRef}
                  src={template.videoPreview}
                  playsInline
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Video Controls Bar Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
                  {/* Progress / Seek Bar */}
                  <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="h-1.5 w-full bg-white/20 hover:h-2 rounded-full cursor-pointer relative transition-all"
                  >
                    <div
                      className="h-full bg-emerald-500 rounded-full"
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
                        className="p-1 hover:text-emerald-400 transition-colors"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>

                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-1 hover:text-emerald-400 transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="font-mono text-[11px] text-slate-300">
                        {formatTime(currentTime)} / {formatTime(duration || template.durationSec)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleFullscreen}
                        className="p-1 hover:text-emerald-400 transition-colors"
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
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] leading-tight">
                  {template.title}
                </h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {template.description}
                </p>

                {/* AI Models Used */}
                <div className="mt-5 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-500/15 space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Engine Pipeline</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {template.aiModelsUsed.map((m) => (
                      <span
                        key={m}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white text-emerald-800 border border-emerald-500/20 font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scene Timeline Structure */}
                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#17211D] flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-teal-600" />
                    <span>Timeline Scene Breakdown</span>
                  </div>
                  <div className="space-y-2">
                    {template.scenes.map((scene, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/70 border border-emerald-500/10 flex items-start gap-3 text-xs shadow-sm"
                      >
                        <span className="font-mono text-[11px] font-bold text-emerald-700 shrink-0 mt-0.5">
                          {scene.time}
                        </span>
                        <div>
                          <div className="font-semibold text-[#17211D]">{scene.title}</div>
                          <div className="text-slate-600 text-[11px] leading-relaxed">
                            {scene.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-4 border-t border-emerald-500/10">
                <button
                  type="button"
                  onClick={handleCloneClick}
                  disabled={isCloning}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
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
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  Creates an independent editable project in your workspace.
                </p>
              </div>
            </div>
          </div>

          {/* Related Templates Carousel / Grid */}
          <div className="pt-8 border-t border-emerald-500/10">
            <h3 className="font-bold text-[#17211D] text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>More Templates in this Style</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <div
                  key={r.id}
                  onClick={() => onSelectRelated(r)}
                  className="group cursor-pointer rounded-2xl p-2.5 glass-card border-emerald-500/15 hover:border-emerald-500/40 transition-all flex items-center gap-3 shadow-sm"
                >
                  <img
                    src={r.thumbnail}
                    alt={r.title}
                    className="w-16 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-[#17211D] truncate group-hover:text-emerald-700 transition-colors">
                      {r.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
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
