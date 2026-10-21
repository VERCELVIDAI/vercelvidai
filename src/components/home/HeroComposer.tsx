'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Sliders,
  Ratio,
  ArrowRight,
  UploadCloud,
  Check,
  Zap,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'Create a premium cinematic product commercial for a luxury skincare brand.',
  'Turn this product photo into a vertical Instagram advertisement.',
  'Create a YouTube explainer with narration, supporting visuals and subtitles.',
  'Hyper-realistic cybernetic runner sprinting through rainy neo-Tokyo streets at night.',
];

const MODELS = [
  { id: 'vidai-cinematic-v1', name: 'Vidai Cinematic HD', cost: 25, badge: 'Fastest' },
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Ultra' },
  { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Realistic Motion' },
  { id: 'fal-flux-pro', name: 'Flux 1.1 Pro (Image)', cost: 5, badge: 'Photoreal' },
];

export function HeroComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [mode, setMode] = useState<'video' | 'image' | 'audio'>('video');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [selectedModel, setSelectedModel] = useState<string>('vidai-cinematic-v1');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [referenceUrl, setReferenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated credit cost
  const currentModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const estimatedCredits =
    mode === 'image'
      ? 5
      : mode === 'audio'
      ? 10
      : Math.round(currentModelObj.cost * (durationSec / 5));

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsSubmitting(true);

    // Save prompt to localStorage so it survives login / signup redirect
    const draftPayload = {
      prompt,
      mode,
      aspectRatio,
      durationSec,
      modelId: selectedModel,
      referenceUrl,
    };
    try {
      localStorage.setItem('vidai_pending_prompt', JSON.stringify(draftPayload));
    } catch (e) {}

    // Check if user is authenticated
    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        // Authenticated: route straight to creation workflow
        router.push(`/create?prompt=${encodeURIComponent(prompt)}&mode=${mode}&aspectRatio=${aspectRatio}&modelId=${selectedModel}`);
      } else {
        // Not authenticated: send to signup with return URL
        router.push(`/signup?returnUrl=${encodeURIComponent('/create')}`);
      }
    } catch (err) {
      router.push(`/signup?returnUrl=${encodeURIComponent('/create')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl glass-panel p-4 sm:p-6 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b border-white/[0.08] pb-3">
        <button
          type="button"
          onClick={() => {
            setMode('video');
            setSelectedModel('vidai-cinematic-v1');
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            mode === 'video'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>AI Video</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('image');
            setSelectedModel('fal-flux-pro');
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            mode === 'image'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>AI Image</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('audio');
            setSelectedModel('eleven-multilingual');
          }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            mode === 'audio'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>AI Voice</span>
        </button>
      </div>

      {/* Multiline Prompt Input Area */}
      <div className="relative">
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'video'
              ? 'Describe your scene, camera angle, motion, lighting, and mood...'
              : mode === 'image'
              ? 'Describe the image visual details, lighting, and composition...'
              : 'Enter script or dialogue to speak with neural voice...'
          }
          className="w-full bg-[#0E1017]/90 text-white placeholder-slate-500 rounded-xl p-4 text-sm sm:text-base border border-white/10 focus:outline-none focus:border-violet-500 transition-colors resize-none"
        />

        {/* Suggestion Chips */}
        <div className="mt-2.5 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-medium">Try:</span>
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-xs text-slate-400 hover:text-violet-300 bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-full transition-all border border-white/5 truncate max-w-[240px] sm:max-w-xs"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Quick Settings Row */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => setAspectRatio('16:9')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                aspectRatio === '16:9' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              16:9 Landscape
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('9:16')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                aspectRatio === '9:16' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              9:16 Shorts / Reel
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio('1:1')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                aspectRatio === '1:1' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              1:1 Square
            </button>
          </div>

          {/* Duration Selector for Video */}
          {mode === 'video' && (
            <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/5 text-slate-300">
              <span>Duration:</span>
              <select
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                aria-label="Video Duration"
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value={5} className="bg-[#12141A]">5 sec</option>
                <option value={10} className="bg-[#12141A]">10 sec</option>
                <option value={15} className="bg-[#12141A]">15 sec</option>
              </select>
            </div>
          )}

          {/* Model Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/5 text-slate-300">
            <span>Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              aria-label="AI Model"
              className="bg-transparent text-violet-400 font-semibold focus:outline-none cursor-pointer"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#12141A] text-white">
                  {m.name} ({m.cost} cr)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button & Cost Estimate */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Est. Cost:</span>
            <span className="font-semibold text-white">{estimatedCredits} credits</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting || !prompt.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 shadow-lg shadow-violet-600/30 disabled:opacity-50 transition-all cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
