'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Camera,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'A neon-lit cybernetic runner sprinting through rainy neo-Tokyo streets, 35mm anamorphic lens, volumetric reflections.',
  'Commercial reveal of a luxury perfume bottle surrounded by cascading crystalline water droplets, ultra slow-motion.',
  'Sweeping drone shot over misty emerald mountain ridges at sunrise, golden volumetric rays cutting through pine canopy.',
  'Close up of an artisan watchmaker assembling intricate golden tourbillon gears with precision tweezers, macro depth of field.',
];

const MODELS = [
  { id: 'gemini-omni-1.1-flash', name: 'Google Gemini Omni 1.1 Flash', cost: 15, badge: 'Active Engine', active: true },
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Coming Soon', active: false },
  { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Coming Soon', active: false },
];

const CAMERA_PRESETS = ['Dolly in', 'Orbit', 'Tracking shot', 'Crane movement', 'Aerial movement', 'Static'];

export function HeroComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [mode, setMode] = useState<'video' | 'image' | 'audio'>('video');
  const [aspectRatio, setAspectRatio] = useState<'21:9' | '16:9' | '9:16' | '1:1'>('21:9');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-omni-1.1-flash');
  const [camera, setCamera] = useState<string>('Dolly in');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated credit cost (15 credits fixed for Gemini video generation)
  const currentModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const estimatedCredits =
    mode === 'image'
      ? 5
      : mode === 'audio'
      ? 10
      : 15;

  // Gemini Prompt Enhancement on Hero
  const handleEnhanceWithGemini = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt,
          aspectRatio,
          cameraMovement: camera,
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsSubmitting(true);

    const draftPayload = {
      prompt,
      mode,
      aspectRatio,
      durationSec,
      modelId: selectedModel,
      camera,
    };

    try {
      localStorage.setItem('fluvia_pending_prompt', JSON.stringify(draftPayload));
      localStorage.setItem('vidai_pending_prompt', JSON.stringify(draftPayload));
    } catch (e) {}

    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        router.push(
          `/create?prompt=${encodeURIComponent(prompt)}&mode=${mode}&aspectRatio=${aspectRatio}&modelId=${selectedModel}&camera=${encodeURIComponent(camera)}`
        );
      } else {
        router.push(`/signup?returnUrl=${encodeURIComponent('/create')}`);
      }
    } catch {
      router.push(`/signup?returnUrl=${encodeURIComponent('/create')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl glass-card p-5 sm:p-7 relative overflow-hidden text-left shadow-2xl border border-emerald-500/20">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-pink-400/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/15 pb-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('video');
              setSelectedModel('fluvia-cinematic-v1');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'video'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
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
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'image'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-pink-50/70'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>AI Image</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('audio');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'audio'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>AI Voice</span>
          </button>
        </div>

        {/* Gemini Enhancement Trigger */}
        <button
          type="button"
          onClick={handleEnhanceWithGemini}
          disabled={isEnhancing}
          className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 min-h-[38px] rounded-xl bg-pink-50/90 border border-pink-200/90 text-pink-700 hover:bg-pink-100 text-xs font-semibold transition-all disabled:opacity-50 shadow-xs cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 text-pink-600 shrink-0 ${isEnhancing ? 'animate-spin' : ''}`} />
          <span className="hidden xs:inline sm:inline">{isEnhancing ? 'Gemini Enhancing...' : 'Enhance with Gemini'}</span>
          <span className="inline xs:hidden sm:hidden">{isEnhancing ? 'Enhancing...' : 'Gemini'}</span>
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
              ? 'Describe the visual composition, texture, and light...'
              : 'Enter script to synthesize with high-definition neural voice...'
          }
          className="w-full bg-white/90 text-[#17211D] placeholder-slate-400 rounded-2xl p-4 text-sm sm:text-base border border-emerald-500/20 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-mono text-[13px] leading-relaxed shadow-inner"
        />

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-semibold">Inspiration:</span>
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-xs text-slate-700 hover:text-emerald-800 bg-white/80 hover:bg-emerald-50/80 px-3 py-1 rounded-full transition-all border border-emerald-500/15 truncate max-w-[220px] sm:max-w-xs shadow-xs"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Quick Settings Row */}
      <div className="mt-5 pt-4 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-emerald-500/20 shadow-xs">
            {[
              { id: '21:9', label: '21:9' },
              { id: '16:9', label: '16:9' },
              { id: '9:16', label: '9:16' },
              { id: '1:1', label: '1:1' },
            ].map((ar) => (
              <button
                key={ar.id}
                type="button"
                onClick={() => setAspectRatio(ar.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === ar.id ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>

          {/* Camera Motion Selector */}
          {mode === 'video' && (
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-slate-700 shadow-xs">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="bg-transparent text-[#17211D] font-semibold text-xs focus:outline-none cursor-pointer"
              >
                {CAMERA_PRESETS.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#17211D]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-slate-700 shadow-xs">
            <span className="text-slate-500 text-xs">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-emerald-700 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {MODELS.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                  disabled={!m.active}
                  className={`bg-white ${m.active ? 'text-[#17211D]' : 'text-slate-400 italic'}`}
                >
                  {m.name} {!m.active ? '(Coming Soon)' : `(${m.cost} cr)`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button & Cost Estimate */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{estimatedCredits} credits</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting || !prompt.trim()}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 min-h-[44px] rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all cursor-pointer text-xs uppercase tracking-wider"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-100" />
            )}
            <span>Generate Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
