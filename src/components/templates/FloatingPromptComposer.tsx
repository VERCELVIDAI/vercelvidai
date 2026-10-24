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
import { VideoTemplate } from '@/lib/templates';

interface FloatingPromptComposerProps {
  initialPrompt?: string;
  selectedTemplate?: VideoTemplate | null;
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
  const [availableCredits, setAvailableCredits] = useState<number>(userCredits);

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
    navigator.clipboard.writeText(prompt.trim() || selectedTemplate?.prompt || 'A cinematic product commercial');
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
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0F1412] border border-emerald-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">Video Generated Successfully</h3>
              </div>
              <button
                type="button"
                onClick={() => setCompletedVideo(null)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black ring-1 ring-white/10">
              <video
                src={completedVideo.url}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-mono text-emerald-400">Engine: Google Gemini (gemini-omni-1.1-flash)</span>
              <span className="font-mono text-white/60">Charged: 15 Credits</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={completedVideo.url}
                download={`fluvia_gemini_${completedVideo.jobId}.mp4`}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download MP4</span>
              </a>
              <button
                type="button"
                onClick={() => setCompletedVideo(null)}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10"
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
                onClick={() => setShowGoogleVidsModal(false)}
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

            <div className="space-y-1.5">
              <label className="text-[11px] text-white/60 font-semibold">Your Prompt for Google Vids:</label>
              <div className="relative p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-white/90 font-mono">
                {prompt.trim() || selectedTemplate?.prompt || 'Create a cinematic product commercial with dynamic lighting'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyVidsPrompt}
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
                onClick={() => setShowGoogleVidsModal(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/60"
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
        <div className="relative rounded-2xl sm:rounded-full bg-[#0D1210]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 sm:p-2.5 transition-all ring-1 ring-emerald-500/20 hover:border-emerald-500/40">
          {/* Active Template & Model Chip */}
          <div className="flex items-center justify-between px-3 py-1 mb-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-300 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 truncate">
              <span className="flex items-center gap-1 font-bold text-emerald-400">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Google Gemini (gemini-omni-1.1-flash)</span>
              </span>
              {selectedTemplate && (
                <>
                  <span className="text-white/30">•</span>
                  <span className="truncate text-white/80">Template: {selectedTemplate.title}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowGoogleVidsModal(true)}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold underline px-1"
                title="Open Google Vids handoff"
              >
                Google Vids Option
              </button>
              {selectedTemplate && (
                <button
                  type="button"
                  onClick={onClearTemplate}
                  className="text-emerald-400 hover:text-white p-0.5 ml-1"
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
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 hover:bg-white/15 text-white/80 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Reference Attachment Dropdown */}
              {showAttachMenu && (
                <div className="absolute bottom-12 left-0 w-56 p-2 rounded-2xl bg-[#141A17] border border-white/15 shadow-2xl backdrop-blur-2xl text-xs text-white/90 space-y-1 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    Add Media Reference
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedReference('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Product / Image Reference</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedReference('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800');
                      setShowAttachMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-teal-400" />
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
            <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-1 shrink-0">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="bg-transparent text-[11px] font-mono text-white/80 focus:outline-none cursor-pointer"
              >
                <option value="16:9" className="bg-[#141A17] text-white">16:9 Landscape</option>
                <option value="9:16" className="bg-[#141A17] text-white">9:16 Vertical</option>
                <option value="1:1" className="bg-[#141A17] text-white">1:1 Square</option>
                <option value="4:5" className="bg-[#141A17] text-white">4:5 Social</option>
              </select>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative shrink-0 hidden md:block">
              <button
                type="button"
                onClick={() => setShowModelPicker((prev) => !prev)}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-[11px] font-medium text-white/80 hover:text-white"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gemini Omni Flash</span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              {showModelPicker && (
                <div className="absolute bottom-11 left-0 w-64 p-2 rounded-2xl bg-[#141A17] border border-white/15 shadow-2xl backdrop-blur-2xl text-xs space-y-1 z-50">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    AI Generation Engine
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
                    <div>
                      <p className="font-bold">Google Gemini Omni 1.1 Flash</p>
                      <p className="text-[10px] text-emerald-400/80">Active Model • 15 credits / video</p>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium">Runway Gen-3 Alpha</p>
                      <p className="text-[10px]">High-speed cinematic video</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-white/60">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium">Luma Dream Machine Ray</p>
                      <p className="text-[10px]">Realistic camera movement</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-white/60">
                      Coming Soon
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 flex items-center justify-between opacity-60 cursor-not-allowed">
                    <div>
                      <p className="font-medium">OpenAI Sora Engine</p>
                      <p className="text-[10px]">Advanced video generation</p>
                    </div>
                    <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.5 rounded text-white/60">
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
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none resize-none px-2 py-1.5 max-h-28 overflow-y-auto"
              />
            </div>

            {/* Right: Credits Badge (15 cr) & Generate Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span
                title={`Cost: exactly 15 credits per video (Available: ${availableCredits})`}
                className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/25 px-2.5 py-1.5 rounded-full"
              >
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>15 cr</span>
              </span>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
