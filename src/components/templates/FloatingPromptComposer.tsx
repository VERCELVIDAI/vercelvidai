'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  X,
  Loader2,
  Ratio,
  Zap,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  Play,
  Pause,
  ChevronDown,
} from 'lucide-react';
import { CreativeTemplate, VideoTemplate } from '@/lib/templates';

interface FloatingPromptComposerProps {
  initialPrompt?: string;
  selectedTemplate?: CreativeTemplate | null;
  onClearTemplate?: () => void;
  userCredits?: number;
  onGenerationComplete?: (job: any) => void;
}

export function FloatingPromptComposer({
  initialPrompt = '',
  selectedTemplate,
  onClearTemplate,
  userCredits = 100,
  onGenerationComplete,
}: FloatingPromptComposerProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeJob, setActiveJob] = useState<any>(null);
  const [completedVideo, setCompletedVideo] = useState<{ url: string; jobId: string } | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachedReference, setAttachedReference] = useState<string | null>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showGoogleVidsModal, setShowGoogleVidsModal] = useState(false);
  const [copiedVidsPrompt, setCopiedVidsPrompt] = useState(false);
  const [vidsPromptOverride, setVidsPromptOverride] = useState<string | null>(null);
  const [availableCredits, setAvailableCredits] = useState<number>(userCredits);

  const GOOGLE_VIDS_STARTER_TEMPLATES = [
    { id: 'auto', label: 'Hypercar Ad', emoji: '🏎️', prompt: 'Hyper-realistic commercial launch film of an aerodynamic concept hypercar in a wind tunnel, laser grid reflections, smoke trails over carbon fiber bodywork, glowing carbon-ceramic brakes, anamorphic lens flares, ultra-smooth tracking shot, photorealistic 8k 60fps.' },
    { id: 'watch', label: 'Luxury Watch', emoji: '⌚', prompt: 'Ultra-luxury watch commercial, seamless macro camera sweep across a brushed titanium bezel and obsidian skeleton dial. Floating chronograph hands, sapphire crystal reflection, dramatic volumetric rim lighting, micro mechanical gear movement, photorealistic 8k render.' },
    { id: 'cyber', label: 'Cyberpunk Drive', emoji: '⚡', prompt: 'Cinematic first-person perspective night drive through rain-slicked neon Shibuya streets. Hyper-reflective puddles, towering holographic billboards, purple-teal neon trails, ultra-smooth motion blur, cinematic color grade, 4k 60fps.' },
    { id: 'saas', label: 'AI Agent Swarm', emoji: '🤖', prompt: 'Futuristic corporate visual of multi-agent autonomous AI swarm executing coordinated data operations. Glowing holographic network nodes pulsing with emerald-teal light, data pipelines morphing into animated bar charts, executive control dashboard floating in dark glass workspace, photorealistic UI 8k.' },
    { id: 'beauty', label: 'Hydration Serum', emoji: '🧴', prompt: 'High-end skincare beauty commercial, macro slow-motion droplet of golden hydration serum falling onto a frosted glass podium. Floating water molecules, iridescent botanical refraction, soft natural sunlight, luxury cosmetic aesthetic, 4k 60fps.' },
    { id: 'food', label: 'Torched Wagyu', emoji: '🥩', prompt: 'Gourmet culinary commercial, macro close-up of an A5 Japanese Wagyu steak being torched with an intense blue-orange blowtorch flame. Sizzling rendered marbling, rising aromatic smoke, sea salt crystals catching ambient warm candlelight, golden-brown crust sear, 4k 60fps.' },
  ];

  const getActiveVidsPrompt = () => {
    return vidsPromptOverride || prompt.trim() || selectedTemplate?.prompt || 'Create a cinematic product commercial with dynamic lighting';
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Sync credits from prop
  useEffect(() => {
    setAvailableCredits(userCredits);
  }, [userCredits]);

  // When a template is clicked or updated from outside, populate prompt and aspect ratio
  useEffect(() => {
    if (selectedTemplate) {
      setPrompt(selectedTemplate.prompt || selectedTemplate.description);
      const aspect =
        selectedTemplate.aspect === '9:16' || selectedTemplate.aspect === '1:1' || selectedTemplate.aspect === '4:5'
          ? selectedTemplate.aspect
          : '16:9';
      setAspectRatio(aspect);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [selectedTemplate]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  // Clean up polling interval
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Poll job status until completed or failed
  const pollJobStatus = (jobId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) return;
        const data = await res.json();
        const job = data?.job;
        if (!job) return;

        setActiveJob(job);

        if (job.status === 'completed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setIsGenerating(false);
          const vidUrl = job.output?.videoUrl;
          if (vidUrl) {
            setCompletedVideo({ url: vidUrl, jobId: job.id });
          }
          if (onGenerationComplete) onGenerationComplete(job);
          // Refresh credit balance
          fetch('/api/credits')
            .then((r) => (r.ok ? r.json() : null))
            .then((bal) => {
              if (bal?.availableBalance !== undefined) setAvailableCredits(bal.availableBalance);
            })
            .catch(() => {});
        } else if (job.status === 'failed') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setIsGenerating(false);
          setErrorMessage(job.errorMessage || 'Gemini video generation failed. 15 credits refunded.');
          // Refresh credit balance (refund restored)
          fetch('/api/credits')
            .then((r) => (r.ok ? r.json() : null))
            .then((bal) => {
              if (bal?.availableBalance !== undefined) setAvailableCredits(bal.availableBalance);
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error('Job polling error:', err);
      }
    }, 1500);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setErrorMessage('');
    setCompletedVideo(null);
    setIsGenerating(true);

    try {
      // Check auth status first
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push(`/login?redirect=/templates&prompt=${encodeURIComponent(prompt)}`);
        return;
      }

      // Optimistically deduct 15 credits in UI
      setAvailableCredits((prev) => Math.max(0, prev - 15));

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: 'gemini-omni-1.1-flash',
          prompt: prompt.trim(),
          aspectRatio,
          durationSec: 5,
          resolution: '720p',
          referenceImageUrl: attachedReference || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Revert balance on immediate rejection
        fetch('/api/credits')
          .then((r) => (r.ok ? r.json() : null))
          .then((bal) => {
            if (bal?.availableBalance !== undefined) setAvailableCredits(bal.availableBalance);
          })
          .catch(() => {});

        if (res.status === 402) {
          throw new Error(data.error || 'Insufficient credits. Video generation requires 15 credits.');
        }
        throw new Error(data.error || 'Generation failed. Please try again.');
      }

      setActiveJob(data.job);
      pollJobStatus(data.job.id);
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Generation failed.');
      setIsGenerating(false);
    }
  };

  const handleCopyVidsPrompt = () => {
    navigator.clipboard.writeText(getActiveVidsPrompt());
    setCopiedVidsPrompt(true);
    setTimeout(() => setCopiedVidsPrompt(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <>
      {/* Toast Notification for Error / Quota Notice */}
      {errorMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[94%] p-4 rounded-2xl bg-black/95 border border-rose-500/60 backdrop-blur-2xl text-rose-200 text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold text-white text-sm">Generation Notice</p>
              <p className="text-[11px] leading-relaxed text-rose-300">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-white/60 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Generated Video Player Modal */}
      {completedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#211522] border border-[#39233B] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#39233B] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#F05BCE]" />
                <h3 className="font-bold text-[#F5EAF4] text-sm sm:text-base">Video Generated Successfully</h3>
              </div>
              <button
                type="button"
                onClick={() => setCompletedVideo(null)}
                className="text-[#A99AAA] hover:text-[#F5EAF4] p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-[#39233B]">
              <video
                src={completedVideo.url}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#A99AAA]">
              <span className="font-mono text-[#F05BCE]">Engine: Google Gemini (gemini-omni-1.1-flash)</span>
              <span className="font-mono text-[#A99AAA]">Charged: 15 Credits</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={completedVideo.url}
                download={`fluvia_gemini_${completedVideo.jobId}.mp4`}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F05BCE] to-[#d641b6] hover:from-[#ff6ee0] hover:to-[#e64ec6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F05BCE]/25 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4</span>
              </a>
              <button
                type="button"
                onClick={() => setCompletedVideo(null)}
                className="px-5 py-3 rounded-xl bg-[#100A12] hover:bg-white/5 text-[#F5EAF4] font-semibold text-xs border border-[#39233B] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Vids Studio Handoff Modal */}
      {showGoogleVidsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#211522] border border-[#39233B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#39233B] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F05BCE]/15 border border-[#F05BCE]/30 flex items-center justify-center text-[#F05BCE] font-bold text-sm">
                  G
                </div>
                <div>
                  <h3 className="font-bold text-[#F5EAF4] text-base">Google Vids Studio</h3>
                  <p className="text-[11px] text-[#F05BCE] font-mono">Google Workspace App (vids.new)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleVidsModal(false)}
                className="text-[#A99AAA] hover:text-[#F5EAF4] p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#100A12] border border-[#39233B] space-y-2 text-xs">
              <p className="text-[#F5EAF4]/90 leading-relaxed">
                <strong>Google Vids</strong> is an interactive AI video workspace application within Google Workspace.
                Storyboards, voiceover, and scenes are composed directly in your Google account.
              </p>
              <div className="p-2.5 rounded-xl bg-[#211522] border border-[#F05BCE]/25 text-[11px] text-[#F5EAF4]/90">
                💡 <strong>0 Credits Deducted:</strong> Because video generation occurs externally inside your Google Workspace, Fluvia Flow does not charge any credits for this handoff.
              </div>
            </div>

            {/* Cool Templates Selector for Google Vids */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#A99AAA] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>Cool Starter Templates for Google Vids:</span>
                </span>
                <span className="text-[10px] text-[#F05BCE] font-mono">1-Click Apply</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {GOOGLE_VIDS_STARTER_TEMPLATES.map((tmpl) => {
                  const isSelected = vidsPromptOverride === tmpl.prompt;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setVidsPromptOverride(tmpl.prompt)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F05BCE]/20 text-[#F5EAF4] border-[#F05BCE] shadow-xs'
                          : 'bg-[#100A12] hover:bg-white/5 text-[#A99AAA] hover:text-[#F5EAF4] border-[#39233B]'
                      }`}
                    >
                      <span>{tmpl.emoji}</span>
                      <span className="truncate">{tmpl.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#A99AAA] font-semibold">Your Prompt for Google Vids:</label>
              <div className="relative p-3 rounded-xl bg-[#100A12] border border-[#39233B] text-xs text-[#F5EAF4] font-mono select-all">
                {getActiveVidsPrompt()}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyVidsPrompt}
                className="py-3 px-4 rounded-xl bg-[#100A12] hover:bg-white/5 text-[#F5EAF4] font-semibold text-xs flex items-center justify-center gap-2 border border-[#39233B] transition-colors"
              >
                {copiedVidsPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-[#F05BCE]" />
                    <span className="text-[#F05BCE]">Prompt Copied!</span>
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
                onClick={() => setShowGoogleVidsModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F05BCE] to-[#d641b6] hover:from-[#ff6ee0] hover:to-[#e64ec6] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F05BCE]/25 transition-all"
              >
                <span>Open Google Vids</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Panel */}
      <div className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl">
        <div className="relative rounded-2xl sm:rounded-full bg-[#100A12]/95 backdrop-blur-2xl border border-[#39233B] shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 sm:p-2.5 transition-all ring-1 ring-[#F05BCE]/20 hover:border-[#F05BCE]/40">
          {/* Active Template & Model Chip */}
          <div className="flex items-center justify-between px-3 py-1 mb-1.5 rounded-lg bg-[#211522] border border-[#39233B] text-[11px] text-[#F5EAF4] animate-in fade-in duration-200">
            <div className="flex items-center gap-2 truncate">
              <span className="flex items-center gap-1 font-bold text-[#F05BCE]">
                <Sparkles className="w-3 h-3 text-[#F05BCE] shrink-0" />
                <span>Google Gemini (gemini-omni-1.1-flash)</span>
              </span>
              {selectedTemplate && (
                <>
                  <span className="text-[#A99AAA]/40">•</span>
                  <span className="truncate text-[#F5EAF4]">Template: {selectedTemplate.title}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowGoogleVidsModal(true)}
                className="text-[10px] text-[#F05BCE] hover:text-white font-semibold underline px-1 transition-colors"
                title="Open Google Vids handoff"
              >
                Google Vids Option
              </button>
              {selectedTemplate && (
                <button
                  type="button"
                  onClick={onClearTemplate}
                  className="text-[#A99AAA] hover:text-[#F05BCE] p-0.5 ml-1 transition-colors"
                  title="Detach template"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-end sm:items-center gap-2">
            {/* Left: Plus Reference Upload Button */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowAttachMenu((prev) => !prev)}
                title="Attach reference image or subject"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  attachedReference || showAttachMenu
                    ? 'bg-[#F05BCE] text-white shadow-md shadow-[#F05BCE]/30'
                    : 'bg-[#211522] hover:bg-white/10 text-[#A99AAA] hover:text-[#F5EAF4] border border-[#39233B]'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Reference Attachment Dropdown */}
              {showAttachMenu && (
                <div className="absolute bottom-12 left-0 w-56 p-2 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl backdrop-blur-2xl text-xs text-[#F5EAF4] space-y-1 z-50">
                  <div className="text-[10px] uppercase font-bold text-[#A99AAA] px-2 py-1">
                    Add Media Reference
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedReference('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-[#F5EAF4]"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#F05BCE]" />
                    <span>Product / Image Reference</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedReference('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800');
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors text-[#F5EAF4]"
                  >
                    <Video className="w-3.5 h-3.5 text-[#F05BCE]" />
                    <span>Subject / Character Anchor</span>
                  </button>
                  {attachedReference && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedReference(null);
                        setShowAttachMenu(false);
                      }}
                      className="w-full text-rose-400 text-[11px] px-2.5 py-1 text-left hover:underline"
                    >
                      Clear attachment
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Middle: Aspect Selector */}
            <div className="hidden sm:flex items-center bg-[#211522] border border-[#39233B] rounded-full px-2 py-1 shrink-0">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="bg-transparent text-[11px] font-mono text-[#F5EAF4] focus:outline-none cursor-pointer"
              >
                <option value="16:9" className="bg-[#211522] text-[#F5EAF4]">16:9 Landscape</option>
                <option value="9:16" className="bg-[#211522] text-[#F5EAF4]">9:16 Vertical</option>
                <option value="1:1" className="bg-[#211522] text-[#F5EAF4]">1:1 Square</option>
                <option value="4:5" className="bg-[#211522] text-[#F5EAF4]">4:5 Social</option>
              </select>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative shrink-0 hidden md:block">
              <button
                type="button"
                onClick={() => setShowModelPicker((prev) => !prev)}
                className="flex items-center gap-1.5 bg-[#211522] border border-[#39233B] rounded-full px-2.5 py-1 text-[11px] font-medium text-[#F5EAF4] hover:border-[#F05BCE]/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05BCE] animate-pulse" />
                <span>Gemini Omni Flash</span>
                <ChevronDown className="w-3 h-3 text-[#A99AAA]" />
              </button>

              {showModelPicker && (
                <div className="absolute bottom-11 left-0 w-64 p-2 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl backdrop-blur-2xl text-xs space-y-1 z-50">
                  <div className="text-[10px] uppercase font-bold text-[#A99AAA] px-2 py-1">
                    AI Generation Engine
                  </div>
                  <div className="p-2 rounded-xl bg-[#100A12] border border-[#F05BCE]/40 text-[#F5EAF4] flex items-center justify-between">
                    <div>
                      <p className="font-bold">Google Gemini Omni 1.1 Flash</p>
                      <p className="text-[10px] text-[#F05BCE]">Active Model • 15 credits / video</p>
                    </div>
                    <Check className="w-4 h-4 text-[#F05BCE]" />
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[#A99AAA]/50 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium">Runway Gen-3 Alpha</p>
                      <p className="text-[10px]">High-speed cinematic video</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-[#A99AAA]">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[#A99AAA]/50 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium">Luma Dream Machine Ray</p>
                      <p className="text-[10px]">Realistic camera movement</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-[#A99AAA]">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[#A99AAA]/50 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium">OpenAI Sora Engine</p>
                      <p className="text-[10px]">Advanced video generation</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-[#A99AAA]">
                      Coming Soon
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Text Input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your commercial scene, product ad, or campaign video..."
                className="w-full bg-transparent text-[#F5EAF4] text-xs sm:text-sm placeholder:text-[#A99AAA]/60 focus:outline-none resize-none px-2 py-1.5 max-h-28 overflow-y-auto"
              />
            </div>

            {/* Right: Credits Badge (15 cr) & Generate Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                title={`Cost: exactly 15 credits per video (Available: ${availableCredits})`}
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono font-medium text-[#F05BCE] bg-[#100A12] border border-[#39233B] px-2.5 py-1.5 rounded-full"
              >
                <Zap className="w-3 h-3 text-[#F05BCE]" />
                <span>15 cr</span>
              </span>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#F05BCE] to-[#d641b6] hover:from-[#ff6ee0] hover:to-[#e64ec6] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-[#F05BCE]/25 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
