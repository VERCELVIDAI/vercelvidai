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
  Image as ImageIcon,
  Type,
  Download,
  Palette,
  Wand2,
} from 'lucide-react';
import { CreativeTemplate, VideoTemplate } from '@/lib/templates';
import { TextAnimationPreview } from '@/components/templates/TextAnimationPreview';

interface DiscoveryDetailModalProps {
  template: CreativeTemplate | null;
  onClose: () => void;
  onUseInComposer: (template: CreativeTemplate) => void;
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
  const [copiedVidsPrompt, setCopiedVidsPrompt] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showVidsHandoff, setShowVidsHandoff] = useState(false);
  const [activeVidsPrompt, setActiveVidsPrompt] = useState<string | null>(null);

  useEffect(() => {
    // Reset play state when template changes
    setIsPlaying(true);
    setCopiedPrompt(false);
    setActiveVidsPrompt(null);
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

  const isVideo = (template.type || 'video') === 'video';
  const isImage = template.type === 'image';
  const isText = template.type === 'text-animation';

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

        {/* Left: Media Preview Section (Dynamic by Template Type) */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] lg:min-h-[560px] overflow-hidden">
          {isVideo ? (
            <>
              {/* Real Video Player */}
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

              {/* Video Player Controls Bar */}
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
                    {template.aspect} • {template.duration || '15s'}
                  </span>
                </div>
              </div>
            </>
          ) : isImage ? (
            <>
              {/* Static High-Res AI Image Lightbox Preview (NO Fake Play Buttons) */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                />

                {/* Static Image Label Bar */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-pink-950/80 backdrop-blur-md text-pink-300 border border-pink-500/40 flex items-center gap-1.5 shadow-md">
                      <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                      <span>AI Image Preview (Static)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/15">
                      {template.aspectLabel || template.aspect}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Interactive Text Animation Engine Preview */
            <div className="w-full h-full p-4 flex items-center justify-center">
              <TextAnimationPreview
                template={template}
                onOpenInEditor={(cfg) => {
                  handleOpenInEditor();
                }}
                className="w-full max-w-2xl border-0 shadow-none bg-transparent"
              />
            </div>
          )}
        </div>

        {/* Right: Info, Prompt, & Generation Actions */}
        <div className="w-full lg:w-[420px] p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#131916] border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="space-y-6">
            {/* Header: Title, Category & Format Badge */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isImage
                    ? 'text-pink-300 bg-pink-950/70 border-pink-500/40'
                    : isText
                    ? 'text-cyan-300 bg-cyan-950/70 border-cyan-500/40'
                    : 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30'
                }`}>
                  {template.category}
                </span>
                {template.badge && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {template.badge}
                  </span>
                )}
                <span className="text-[10px] font-mono text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {isImage ? '🎨 AI Image' : isText ? '✨ Text Animation' : '🎬 AI Video'}
                </span>
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
                  <p className="text-[11px] text-white/50">Verified Fluvia Creator</p>
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

            {/* Generation Prompt Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Prompt & Settings</span>
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
                <span className="text-[10px] text-white/50 block">Generation Cost</span>
                <strong className={`font-mono ${isText ? 'text-cyan-400' : isImage ? 'text-pink-400' : 'text-emerald-400'}`}>
                  {isVideo ? '15 Credits' : isImage ? '5 Credits' : '0 Credits (Free)'}
                </strong>
              </div>
              <div className="col-span-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                <span className="text-[10px] text-emerald-300/80">Active AI Engine</span>
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isImage
                    ? 'Google Gemini Imagen (gemini-3.1-flash-image)'
                    : isText
                    ? 'Fluvia Deterministic Typography Engine'
                    : 'Google Gemini (gemini-omni-1.1-flash)'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs (Tailored by Template Type) */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            {isVideo ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onUseInComposer(template);
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Use in AI Video Studio (15 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVidsHandoff(true)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span>Create in Google Vids Workspace (0 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenInEditor}
                  disabled={isCreatingProject}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white/90 font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isCreatingProject ? 'Creating project...' : 'Open Multi-Track Studio Timeline'}</span>
                </button>
              </>
            ) : isImage ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/ai-image-generator?prompt=${encodeURIComponent(template.prompt)}&aspect=${encodeURIComponent(template.aspect)}`);
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-950/80 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Generate with Gemini Imagen (5 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    router.push(`/create?mode=image-to-video&prompt=${encodeURIComponent(template.prompt)}&ref=${encodeURIComponent(template.thumbnail)}`);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
                >
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Animate Image to Video in Studio (15 cr)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleOpenInEditor}
                  disabled={isCreatingProject}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/80 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Type className="w-4 h-4" />
                  <span>Use Typography in Video Project (0 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onUseInComposer(template);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Render Video with AI Background (15 cr)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Google Vids Handoff Modal */}
      {showVidsHandoff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0F1412] border border-blue-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-sm">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Google Vids Studio</h3>
                  <p className="text-[11px] text-blue-400 font-mono">Google Workspace App (vids.new)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVidsHandoff(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <p className="text-white/90 leading-relaxed">
                <strong>Google Vids</strong> is an interactive AI video workspace application within Google Workspace.
                Storyboards, voiceover, and scenes are composed directly in your Google account.
              </p>
              <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-[11px] text-blue-200">
                💡 <strong>0 Credits Deducted:</strong> Because video generation occurs externally inside your Google Workspace, Fluvia Flow does not charge any credits for this handoff.
              </div>
            </div>

            {/* Featured Cool Templates Quick Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-white/70 font-semibold flex items-center justify-between">
                <span>Featured Cool Video Templates:</span>
                <span className="text-[10px] text-blue-400 font-mono">0 cr handoff</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { title: 'Current: ' + template.title, prompt: template.prompt || template.description, emoji: '✨' },
                  { title: 'AeroGT Hypercar', prompt: 'Hyper-realistic commercial launch film of an aerodynamic concept hypercar in a wind tunnel, laser grid reflections, smoke trails over carbon fiber bodywork, glowing carbon-ceramic brakes, anamorphic lens flares, ultra-smooth tracking shot, photorealistic 8k 60fps.', emoji: '🏎️' },
                  { title: 'Midnight Chrono', prompt: 'Ultra-luxury watch commercial, seamless macro camera sweep across a brushed titanium bezel and obsidian skeleton dial. Floating chronograph hands, sapphire crystal reflection, dramatic volumetric rim lighting, micro mechanical gear movement, photorealistic 8k render.', emoji: '⌚' },
                  { title: 'Cyberpunk Drive', prompt: 'Cinematic first-person perspective night drive through rain-slicked neon Shibuya streets. Hyper-reflective puddles, towering holographic billboards, purple-teal neon trails, ultra-smooth motion blur, cinematic color grade, 4k 60fps.', emoji: '⚡' },
                  { title: 'AI Agent Swarm', prompt: 'Futuristic corporate visual of multi-agent autonomous AI swarm executing coordinated data operations. Glowing holographic network nodes pulsing with emerald-teal light, data pipelines morphing into animated bar charts, executive control dashboard floating in dark glass workspace, photorealistic UI 8k.', emoji: '🤖' },
                  { title: 'Hydration Serum', prompt: 'High-end skincare beauty commercial, macro slow-motion droplet of golden hydration serum falling onto a frosted glass podium. Floating water molecules, iridescent botanical refraction, soft natural sunlight, luxury cosmetic aesthetic, 4k 60fps.', emoji: '🧴' },
                ].map((tmpl, idx) => {
                  const currentEffective = activeVidsPrompt || template.prompt || template.description;
                  const isSelected = currentEffective === tmpl.prompt;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveVidsPrompt(tmpl.prompt)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/30 text-blue-200 border-blue-400/60 shadow-xs'
                          : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border-white/10'
                      }`}
                    >
                      <span>{tmpl.emoji}</span>
                      <span className="truncate">{tmpl.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-white/60 font-semibold">Template Prompt:</label>
              <div className="relative p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white/90 font-mono select-all">
                {activeVidsPrompt || template.prompt || template.description}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(activeVidsPrompt || template.prompt || template.description);
                  setCopiedVidsPrompt(true);
                  setTimeout(() => setCopiedVidsPrompt(false), 2000);
                }}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10"
              >
                {copiedVidsPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Prompt Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>

              <a
                href="https://workspace.google.com/intl/en_in/products/vids/?from=gafb-drive_6806271-def-en_in"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowVidsHandoff(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/60"
              >
                <span>Launch Google Vids</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
