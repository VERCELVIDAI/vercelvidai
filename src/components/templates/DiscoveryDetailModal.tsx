'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check,
  UserPlus,
  UserCheck,
  Film,
  ExternalLink,
  Image as ImageIcon,
  Type,
  Wand2,
} from 'lucide-react';
import { CreativeTemplate } from '@/lib/templates';
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
  onToggleFollow,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl text-[#17191D] flex flex-col lg:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white/80 hover:bg-white text-[#667085] hover:text-[#17191D] border border-[#E5E7EB] shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Media Preview Section (Dynamic by Template Type) */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center min-h-[320px] lg:min-h-[560px] overflow-hidden">
          {isVideo && !template.videoPreview ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <img
                src={template.thumbnail}
                alt={template.title}
                className="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 text-[#5145CD] text-xs font-semibold shadow-md">
                <Film className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Creative Preview • Render via Gemini Omni Flash (15 cr)</span>
              </div>
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white">
                  {template.aspect} • {template.duration || '15s'}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#5145CD]">
                  Google Gemini (gemini-omni-1.1-flash)
                </span>
              </div>
            </div>
          ) : isVideo ? (
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
                    className="w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-white/40 flex items-center justify-center text-[#17191D] transition-colors cursor-pointer shadow-xs"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-white/40 flex items-center justify-center text-[#17191D] transition-colors cursor-pointer shadow-xs"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-[#5145CD]" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white">
                    {template.aspect} • {template.duration || '15s'}
                  </span>
                </div>
              </div>
            </>
          ) : isImage ? (
            <>
              {/* Static High-Res AI Image Lightbox Preview */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />

                {/* Static Image Label Bar */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-30 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#5145CD] border border-white/40 flex items-center gap-1.5 shadow-xs">
                      <ImageIcon className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span>AI Image Preview (Static)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white">
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
                onOpenInEditor={() => {
                  handleOpenInEditor();
                }}
                className="w-full max-w-2xl border-0 shadow-none bg-transparent"
              />
            </div>
          )}
        </div>

        {/* Right: Info, Prompt, & Generation Actions */}
        <div className="w-full lg:w-[420px] p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white border-t lg:border-t-0 lg:border-l border-[#E5E7EB]">
          <div className="space-y-6">
            {/* Header: Title, Category & Format Badge */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border text-[#5145CD] bg-[#EEF2FF] border-[#5145CD]/20">
                  {template.category}
                </span>
                {template.badge && (
                  <span className="text-[10px] font-semibold text-[#17191D] bg-[#F7F8FA] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                    {template.badge}
                  </span>
                )}
                <span className="text-[10px] font-mono text-[#667085] bg-[#F7F8FA] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                  {isImage ? '🎨 AI Image' : isText ? '✨ Text Animation' : '🎬 AI Video'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17191D] tracking-tight">
                {template.title}
              </h2>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Creator Card */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <img
                  src={template.creatorAvatar}
                  alt={template.creatorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#5145CD]/30"
                />
                <div>
                  <h4 className="text-sm font-semibold text-[#17191D]">{template.creatorName}</h4>
                  <p className="text-[11px] text-[#667085]">Verified Fluvia Creator</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleFollow(template.creatorId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isFollowing
                    ? 'bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/30'
                    : 'bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Generation Prompt Box */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#5145CD] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Production Prompt & Settings</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-[11px] text-[#667085] hover:text-[#17191D] flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3 h-3 text-[#5145CD]" />
                      <span className="text-[#5145CD]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-[#17191D] leading-relaxed bg-white p-3 rounded-lg border border-[#E5E7EB] select-all">
                {template.prompt || template.description}
              </p>
            </div>

            {/* Tech Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#667085] block">Aspect Ratio</span>
                <strong className="text-[#17191D] font-mono">{template.aspectLabel || template.aspect}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#667085] block">Generation Cost</span>
                <strong className="font-mono text-[#5145CD]">
                  {isVideo ? '15 Credits' : isImage ? '5 Credits' : '0 Credits (Free)'}
                </strong>
              </div>
              <div className="col-span-2 p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[10px] text-[#667085]">Active AI Engine</span>
                <span className="text-xs font-semibold text-[#5145CD] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD] animate-pulse" />
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
          <div className="pt-4 border-t border-[#E5E7EB] space-y-2">
            {isVideo ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onUseInComposer(template);
                    onClose();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Use in AI Video Studio (15 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVidsHandoff(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Create in Google Vids Workspace (0 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenInEditor}
                  disabled={isCreatingProject}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F7F8FA] text-[#17191D] font-medium text-xs flex items-center justify-center gap-2 border border-[#E5E7EB] transition-colors cursor-pointer shadow-2xs"
                >
                  <Film className="w-3.5 h-3.5 text-[#5145CD]" />
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
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Wand2 className="w-4 h-4 text-white" />
                  <span>Generate with Gemini Imagen (5 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    router.push(`/create?mode=image-to-video&prompt=${encodeURIComponent(template.prompt)}&ref=${encodeURIComponent(template.thumbnail)}`);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F7F8FA] text-[#17191D] font-medium text-xs flex items-center justify-center gap-2 border border-[#E5E7EB] transition-colors cursor-pointer shadow-2xs"
                >
                  <Film className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Animate Image to Video in Studio (15 cr)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleOpenInEditor}
                  disabled={isCreatingProject}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F7F8FA] text-[#17191D] font-medium text-xs flex items-center justify-center gap-2 border border-[#E5E7EB] transition-colors cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Render Video with AI Background (15 cr)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Google Vids Handoff Modal */}
      {showVidsHandoff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-2xl space-y-4 text-[#17191D]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-[#5145CD]/20 flex items-center justify-center text-[#5145CD] font-bold text-sm">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-[#17191D] text-base">Google Vids Studio</h3>
                  <p className="text-[11px] text-[#5145CD] font-mono">Google Workspace App (vids.new)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVidsHandoff(false)}
                className="text-[#667085] hover:text-[#17191D] p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2 text-xs">
              <p className="text-[#17191D] leading-relaxed">
                <strong>Google Vids</strong> is an interactive AI video workspace application within Google Workspace.
                Storyboards, voiceover, and scenes are composed directly in your Google account.
              </p>
              <div className="p-2.5 rounded-lg bg-white border border-[#5145CD]/20 text-[11px] text-[#17191D]">
                💡 <strong>0 Credits Deducted:</strong> Because video generation occurs externally inside your Google Workspace, Fluvia Flow does not charge any credits for this handoff.
              </div>
            </div>

            {/* Featured Cool Templates Quick Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#667085] font-semibold flex items-center justify-between">
                <span>Featured Video Templates:</span>
                <span className="text-[10px] text-[#5145CD] font-mono">0 cr handoff</span>
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
                          ? 'bg-[#EEF2FF] text-[#5145CD] border-[#5145CD] shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-[#667085] hover:text-[#17191D] border-[#E5E7EB]'
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
              <label className="text-[11px] text-[#667085] font-semibold">Template Prompt:</label>
              <div className="relative p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#17191D] font-mono select-all">
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
                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] font-semibold text-xs flex items-center justify-center gap-2 border border-[#E5E7EB] transition-colors cursor-pointer shadow-2xs"
              >
                {copiedVidsPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-[#5145CD]" />
                    <span className="text-[#5145CD]">Prompt Copied!</span>
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
                className="flex-1 py-3 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
