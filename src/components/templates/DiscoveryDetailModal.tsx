'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  Copy,
  Check,
  UserPlus,
  UserCheck,
  Film,
  Zap,
  ArrowRight,
  Ratio,
  Clock,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { VideoTemplate } from '@/lib/templates';

interface DiscoveryDetailModalProps {
  template: VideoTemplate | null;
  onClose: () => void;
  onUseInComposer: (template: VideoTemplate) => void;
  onToggleLike: (templateId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  isLiked?: boolean;
  isFollowing?: boolean;
}

export function DiscoveryDetailModal({
  template,
  onClose,
  onUseInComposer,
  onToggleLike,
  onToggleFollow,
  isLiked = false,
  isFollowing = false,
}: DiscoveryDetailModalProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    // Reset play state when template changes
    setIsPlaying(true);
    setCopiedPrompt(false);
  }, [template]);

  if (!template) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleCopyPrompt = () => {
    if (!template.prompt) return;
    navigator.clipboard.writeText(template.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleOpenInEditor = async () => {
    setIsCreatingProject(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push(`/login?redirect=/templates/${template.slug}`);
        return;
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${template.title} (Remix)`,
          mediaType: 'video',
          thumbnailUrl: template.thumbnail,
          timeline: {
            durationSec: template.durationSec,
            aspectRatio: template.aspect,
            resolution: '1080p',
            tracks: [
              { id: 'trk_v1', type: 'video', name: 'Primary Video' },
              { id: 'trk_t1', type: 'text', name: 'Subtitles & Titles' },
              { id: 'trk_a1', type: 'audio', name: 'Soundtrack & Voice' },
            ],
            clips: [
              {
                id: `clp_v_${Date.now()}_1`,
                trackId: 'trk_v1',
                type: 'video',
                title: template.title,
                sourceUrl: template.videoPreview,
                startTimeSec: 0,
                durationSec: template.durationSec,
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
      alert(e.message || 'Failed to open in editor');
      setIsCreatingProject(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#101513] border border-white/15 shadow-2xl text-white flex flex-col lg:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Video Player Section */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] lg:min-h-[560px] overflow-hidden">
          <video
            ref={videoRef}
            src={template.videoPreview}
            poster={template.thumbnail}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full max-h-[70vh] lg:max-h-[85vh] object-contain"
          />

          {/* Player Controls Bar */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/80 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 hover:text-white hover:bg-black/80 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/15">
                {template.aspect} • {template.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Info, Prompt, & Remix Actions */}
        <div className="w-full lg:w-[420px] p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#131916] border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="space-y-6">
            {/* Header: Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  {template.category}
                </span>
                {template.badge && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {template.badge}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {template.title}
              </h2>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Creator Card */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={template.creatorAvatar}
                  alt={template.creatorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{template.creatorName}</h4>
                  <p className="text-[11px] text-white/50">Verified AI Creator</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleFollow(template.creatorId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isFollowing
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Prompt Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Generation Prompt</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-white/85 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 select-all">
                {template.prompt || template.description}
              </p>
            </div>

            {/* Tech Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-white/50 block">Aspect Ratio</span>
                <strong className="text-white font-mono">{template.aspectLabel || template.aspect}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-white/50 block">Estimated Cost</span>
                <strong className="text-emerald-400 font-mono">25 Credits</strong>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onUseInComposer(template);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use in AI Prompt Composer</span>
            </button>

            <button
              type="button"
              onClick={handleOpenInEditor}
              disabled={isCreatingProject}
              className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
            >
              <Film className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isCreatingProject ? 'Creating project...' : 'Open Multi-Track Studio Timeline'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
