'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  X,
  Loader2,
  Zap,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  ChevronDown,
} from 'lucide-react';
import { CreativeTemplate } from '@/lib/templates';

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
  const [_activeJob, setActiveJob] = useState<any>(null);
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
          setErrorMessage(job.errorMessage || 'Video generation failed. 15 credits refunded.');
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
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[94%] p-4 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold text-[#17191D] text-sm">Generation Notice</p>
              <p className="text-[11px] leading-relaxed text-rose-600">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-[#667085] hover:text-[#17191D] p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Generated Video Player Modal */}
      {completedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-white border border-[#E5E7EB] p-5 shadow-2xl space-y-4 text-[#17191D]">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-[#17191D] text-sm sm:text-base">Video Generated Successfully</h3>
              </div>
              <button
                type="button"
                onClick={() => setCompletedVideo(null)}
                className="text-[#667085] hover:text-[#17191D] p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-[#E5E7EB]">
              <video
                src={completedVideo.url}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#667085]">
              <span className="font-mono text-[#5145CD] font-medium">Engine: Ultra HD Commercial Video (1080p)</span>
              <span className="font-mono text-[#10B981] font-semibold">Render Ready</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={completedVideo.url}
                download={`fluvia_video_${completedVideo.jobId}.mp4`}
                className="flex-1 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4</span>
              </a>
              <button
                type="button"
                onClick={() => setCompletedVideo(null)}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] font-semibold text-xs border border-[#E5E7EB] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Vids Studio Handoff Modal */}
      {showGoogleVidsModal && (
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
                onClick={() => setShowGoogleVidsModal(false)}
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

            {/* Cool Templates Selector for Google Vids */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-[#667085] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Curated Starter Templates for Google Vids:</span>
                </span>
                <span className="text-[10px] text-[#5145CD] font-mono">1-Click Apply</span>
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
                          ? 'bg-[#EEF2FF] text-[#5145CD] border-[#5145CD] shadow-2xs'
                          : 'bg-white hover:bg-slate-50 text-[#667085] hover:text-[#17191D] border-[#E5E7EB]'
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
              <label className="text-[11px] text-[#667085] font-semibold">Your Prompt for Google Vids:</label>
              <div className="relative p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#17191D] font-mono select-all">
                {getActiveVidsPrompt()}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyVidsPrompt}
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
                onClick={() => setShowGoogleVidsModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
        <div className="relative rounded-2xl sm:rounded-full bg-white/95 backdrop-blur-2xl border border-[#E5E7EB] shadow-[0_12px_40px_rgba(16,24,40,0.12)] p-2 sm:p-2.5 transition-all ring-1 ring-[#5145CD]/10 hover:border-[#5145CD]/40">
          {/* Active Template & Model Chip */}
          <div className="flex items-center justify-between px-3 py-1 mb-1.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-[11px] text-[#17191D] animate-in fade-in duration-200">
            <div className="flex items-center gap-2 truncate">
              <span className="flex items-center gap-1 font-bold text-[#5145CD]">
                <Sparkles className="w-3 h-3 text-[#5145CD] shrink-0" />
                <span>Commercial Video Engine</span>
              </span>
              {selectedTemplate && (
                <>
                  <span className="text-[#667085]/40">•</span>
                  <span className="truncate text-[#17191D] font-medium">Template: {selectedTemplate.title}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowGoogleVidsModal(true)}
                className="text-[10px] text-[#5145CD] hover:text-[#4338CA] font-semibold underline px-1 transition-colors cursor-pointer"
                title="Open Google Vids handoff"
              >
                Google Vids Option
              </button>
              {selectedTemplate && (
                <button
                  type="button"
                  onClick={onClearTemplate}
                  className="text-[#667085] hover:text-[#5145CD] p-0.5 ml-1 transition-colors cursor-pointer"
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
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  attachedReference || showAttachMenu
                    ? 'bg-[#5145CD] text-white shadow-xs'
                    : 'bg-[#F7F8FA] hover:bg-slate-100 text-[#667085] hover:text-[#17191D] border border-[#E5E7EB]'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Reference Attachment Dropdown */}
              {showAttachMenu && (
                <div className="absolute bottom-12 left-0 w-56 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl backdrop-blur-2xl text-xs text-[#17191D] space-y-1 z-50">
                  <div className="text-[10px] uppercase font-bold text-[#667085] px-2 py-1">
                    Add Media Reference
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedReference('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left transition-colors text-[#17191D] cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Product / Image Reference</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedReference('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800');
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-left transition-colors text-[#17191D] cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Subject / Character Anchor</span>
                  </button>
                  {attachedReference && (
                    <button
                      type="button"
                      onClick={() => {
                        setAttachedReference(null);
                        setShowAttachMenu(false);
                      }}
                      className="w-full text-rose-600 text-[11px] px-2.5 py-1 text-left hover:underline cursor-pointer"
                    >
                      Clear attachment
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Middle: Aspect Selector */}
            <div className="hidden sm:flex items-center bg-[#F7F8FA] border border-[#E5E7EB] rounded-full px-2 py-1 shrink-0">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="bg-transparent text-[11px] font-mono text-[#17191D] focus:outline-none cursor-pointer"
              >
                <option value="16:9" className="bg-white text-[#17191D]">16:9 Landscape</option>
                <option value="9:16" className="bg-white text-[#17191D]">9:16 Vertical</option>
                <option value="1:1" className="bg-white text-[#17191D]">1:1 Square</option>
                <option value="4:5" className="bg-white text-[#17191D]">4:5 Social</option>
              </select>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative shrink-0 hidden md:block">
              <button
                type="button"
                onClick={() => setShowModelPicker((prev) => !prev)}
                className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-full px-2.5 py-1 text-[11px] font-medium text-[#17191D] hover:border-[#5145CD]/40 transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD] animate-pulse" />
                <span>Ultra HD Commercial Video</span>
                <ChevronDown className="w-3 h-3 text-[#667085]" />
              </button>

              {showModelPicker && (
                <div className="absolute bottom-11 left-0 w-64 p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl backdrop-blur-2xl text-xs space-y-1 z-50">
                  <div className="text-[10px] uppercase font-bold text-[#667085] px-2 py-1">
                    AI Generation Engine
                  </div>
                  <div className="p-2 rounded-xl bg-[#EEF2FF] border border-[#5145CD]/30 text-[#17191D] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#17191D]">Commercial Video Engine (Ultra HD)</p>
                      <p className="text-[10px] text-[#5145CD]">Active Commercial Model</p>
                    </div>
                    <Check className="w-4 h-4 text-[#5145CD]" />
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[#667085]/60 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium text-[#667085]">Runway Gen-3 Alpha</p>
                      <p className="text-[10px]">High-speed cinematic video</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-slate-200 px-1.5 py-0.5 rounded text-[#667085]">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[#667085]/60 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium text-[#667085]">Luma Dream Machine Ray</p>
                      <p className="text-[10px]">Realistic camera movement</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-slate-200 px-1.5 py-0.5 rounded text-[#667085]">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[#667085]/60 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium text-[#667085]">OpenAI Sora Engine</p>
                      <p className="text-[10px]">Advanced video generation</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-slate-200 px-1.5 py-0.5 rounded text-[#667085]">
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
                className="w-full bg-transparent text-[#17191D] text-xs sm:text-sm placeholder:text-[#667085]/60 focus:outline-none resize-none px-2 py-1.5 max-h-28 overflow-y-auto"
              />
            </div>

            {/* Right: Generate Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-2 rounded-full bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
