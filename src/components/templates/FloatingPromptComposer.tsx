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
  Mic,
  Video,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
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
  const [successJob, setSuccessJob] = useState<any>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachedReference, setAttachedReference] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // When a template is clicked or updated from outside, populate prompt and aspect ratio
  useEffect(() => {
    if (selectedTemplate) {
      setPrompt(selectedTemplate.prompt || selectedTemplate.description);
      const aspect = selectedTemplate.aspect === '9:16' || selectedTemplate.aspect === '1:1' || selectedTemplate.aspect === '4:5'
        ? selectedTemplate.aspect
        : '16:9';
      setAspectRatio(aspect);
      // Auto-focus and pulse textarea
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

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setErrorMessage('');
    setSuccessJob(null);
    setIsGenerating(true);

    try {
      // Check auth status first
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        // Redirect to login preserving intent
        router.push(`/login?redirect=/templates&prompt=${encodeURIComponent(prompt)}`);
        return;
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: 'fluvia-cinematic-v1',
          prompt: prompt.trim(),
          aspectRatio,
          durationSec: 5,
          resolution: '1080p',
          referenceImageUrl: attachedReference || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402) {
          throw new Error(
            data.error || 'Insufficient credits. Please upgrade or top up credits in billing.'
          );
        }
        throw new Error(data.error || 'Generation failed. Please try again.');
      }

      setSuccessJob(data.job);
      if (onGenerationComplete) {
        onGenerationComplete(data.job);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <>
      {/* Toast Notification for Success / Error */}
      {errorMessage && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/50 backdrop-blur-xl text-rose-200 text-xs flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-rose-300 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {successJob && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-xl text-emerald-200 text-xs flex items-center justify-between shadow-2xl animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">Generation Dispatched!</p>
              <p className="text-[11px] text-emerald-300">
                Job #{successJob.id.slice(0, 10)} is processing in studio.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="text-xs font-bold underline text-white hover:text-emerald-300 ml-3"
          >
            View in Studio →
          </button>
        </div>
      )}

      {/* Floating Pill Panel */}
      <div className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl">
        <div className="relative rounded-2xl sm:rounded-full bg-[#0D1210]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-2 sm:p-2.5 transition-all ring-1 ring-emerald-500/20 hover:border-emerald-500/40">
          {/* Active Template Chip (if bound) */}
          {selectedTemplate && (
            <div className="flex items-center justify-between px-3 py-1 mb-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-300 animate-in fade-in duration-200">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">Active Template: {selectedTemplate.title}</span>
              </span>
              <button
                type="button"
                onClick={onClearTemplate}
                className="text-emerald-400 hover:text-white p-0.5 ml-2"
                title="Detach template"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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
                    Add Reference
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
                    <span>Image / Product Reference</span>
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

            {/* Prompt Text Input */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the scene, or upload an image, video, subject, or voice as a reference..."
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none resize-none px-2 py-1.5 max-h-28 overflow-y-auto"
              />
            </div>

            {/* Right: Credits Badge & Generate Button */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/25 px-2.5 py-1.5 rounded-full">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>25 cr</span>
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
