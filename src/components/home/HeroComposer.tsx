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
  { id: 'fluvia-cinematic-v1', name: 'Fluvia Cinematic HD', cost: 25, badge: 'Director' },
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Ultra' },
  { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Motion' },
  { id: 'fal-flux-pro', name: 'Flux 1.1 Pro Vision', cost: 5, badge: 'Photoreal' },
];

const CAMERA_PRESETS = ['Dolly in', 'Orbit', 'Tracking shot', 'Crane movement', 'Aerial movement', 'Static'];

export function HeroComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [mode, setMode] = useState<'video' | 'image' | 'audio'>('video');
  const [aspectRatio, setAspectRatio] = useState<'21:9' | '16:9' | '9:16' | '1:1'>('21:9');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [selectedModel, setSelectedModel] = useState<string>('fluvia-cinematic-v1');
  const [camera, setCamera] = useState<string>('Dolly in');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated credit cost
  const currentModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const estimatedCredits =
    mode === 'image'
      ? 5
      : mode === 'audio'
      ? 10
      : Math.round(currentModelObj.cost * (durationSec / 5));

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
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#090B12]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl border border-white/[0.12] relative overflow-hidden text-left">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setMode('video');
              setSelectedModel('fluvia-cinematic-v1');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'video'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4 text-cyan-400" />
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
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
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
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
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
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:brightness-125 text-xs font-semibold transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
          <span>{isEnhancing ? 'Gemini Enhancing...' : 'Enhance with Gemini'}</span>
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
          className="w-full bg-[#0E111B]/90 text-white placeholder-zinc-500 rounded-2xl p-4 text-sm sm:text-base border border-white/[0.1] focus:outline-none focus:border-cyan-400 transition-colors resize-none font-mono text-[13px] leading-relaxed"
        />

        {/* Suggestion Chips */}
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-500 font-medium">Inspiration:</span>
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-xs text-zinc-400 hover:text-cyan-300 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1 rounded-full transition-all border border-white/5 truncate max-w-[220px] sm:max-w-xs"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Quick Settings Row */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 bg-[#121422] p-1 rounded-xl border border-white/[0.06]">
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
                  aspectRatio === ar.id ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>

          {/* Camera Motion Selector */}
          {mode === 'video' && (
            <div className="flex items-center gap-1.5 bg-[#121422] px-3 py-1.5 rounded-xl border border-white/[0.06] text-zinc-300">
              <Camera className="w-3.5 h-3.5 text-violet-400" />
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
              >
                {CAMERA_PRESETS.map((c) => (
                  <option key={c} value={c} className="bg-[#121422] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Model Selector */}
          <div className="flex items-center gap-1.5 bg-[#121422] px-3 py-1.5 rounded-xl border border-white/[0.06] text-zinc-300">
            <span className="text-zinc-500 text-xs">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-cyan-400 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#121422] text-white">
                  {m.name} ({m.cost} cr)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button & Cost Estimate */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{estimatedCredits} credits</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting || !prompt.trim()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-violet-600/30 disabled:opacity-50 transition-all cursor-pointer text-xs uppercase tracking-wider"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-300" />
            )}
            <span>Generate Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
