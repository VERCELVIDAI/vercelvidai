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
  Plus,
  Play,
  Film,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'A cinematic 4K aerial tracking shot of AeroGT titanium hypercar gliding through mist-covered alpine switchbacks at twilight, anamorphic lens flare.',
  'Precision macro commercial of luxury obsidian glass perfume flacon, controlled volumetric rim lighting, amber essence caustics in slow-motion.',
  'High-speed neon cyberpunk night drive through rain-slicked Shibuya avenue, 35mm optical reflections dancing across chrome surfaces.',
  'Dynamic torched Wagyu A5 steak sizzling with rosemary smoke, macro shallow depth of field, slow clockwise camera dolly.',
];

const CAMERA_PRESETS = [
  'Dolly in',
  'Orbit 360',
  'Tracking shot',
  'Crane movement',
  'Aerial drone glide',
  'Static tripod',
];

export function HeroComposer() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPTS[0]);
  const [mode, setMode] = useState<'video' | 'frames' | 'image' | 'audio' | 'tools'>('video');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '21:9'>('16:9');
  const [camera, setCamera] = useState<string>('Dolly in');
  const [hasIngredient, setHasIngredient] = useState<boolean>(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Credit calculation
  const estimatedCost =
    mode === 'audio' ? 2 : mode === 'image' ? 5 : mode === 'tools' ? 0 : 15;

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
      mode: mode === 'audio' ? 'audio' : mode === 'image' ? 'image' : 'video',
      aspectRatio,
      camera,
      modelId: 'gemini-omni-1.1-flash',
    };

    try {
      localStorage.setItem('fluvia_pending_prompt', JSON.stringify(draftPayload));
      localStorage.setItem('vidai_pending_prompt', JSON.stringify(draftPayload));
    } catch (e) {}

    try {
      const authRes = await fetch('/api/auth/me');
      const targetMode = mode === 'audio' ? 'audio' : mode === 'image' ? 'image' : 'video';
      if (authRes.ok) {
        router.push(
          `/create?prompt=${encodeURIComponent(prompt)}&mode=${targetMode}&aspectRatio=${aspectRatio}&camera=${encodeURIComponent(
            camera
          )}&modelId=gemini-omni-1.1-flash`
        );
      } else {
        router.push(
          `/signup?returnUrl=${encodeURIComponent(
            `/create?prompt=${encodeURIComponent(prompt)}&mode=${targetMode}`
          )}`
        );
      }
    } catch {
      router.push(`/create?prompt=${encodeURIComponent(prompt)}&mode=video`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl p-4 sm:p-6 relative overflow-hidden text-left shadow-2xl border border-white/10 bg-[#0E1015]/95 backdrop-blur-xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Kling-Inspired Top Header Bar: Studio Console + Mode Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b border-white/8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'video'
                ? 'bg-white/[0.12] text-white border border-white/20 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-indigo-400" />
            <span>Text to Video</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">15 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('frames')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'frames'
                ? 'bg-white/[0.12] text-white border border-white/20 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Frames to Video</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">15 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'image'
                ? 'bg-white/[0.12] text-white border border-white/20 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
            <span>AI Image</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-violet-500/20 text-violet-300 font-mono border border-violet-500/30">5 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('audio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'audio'
                ? 'bg-white/[0.12] text-white border border-white/20 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span>Voiceover HD</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">2 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'tools'
                ? 'bg-white/[0.12] text-white border border-white/20 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Custom Tools</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 font-bold">Free</span>
          </button>
        </div>

        {/* Gemini Enhancement Trigger */}
        <button
          type="button"
          onClick={handleEnhanceWithGemini}
          disabled={isEnhancing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-bold transition-all disabled:opacity-50 shadow-2xs shrink-0 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 text-indigo-400 ${isEnhancing ? 'animate-spin' : ''}`} />
          <span>{isEnhancing ? 'Gemini Enhancing...' : 'Gemini AI Enhance'}</span>
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
              ? 'Describe your cinematic scene, camera movement, optical lighting, and physical dynamics...'
              : mode === 'frames'
              ? 'Describe the start-to-end motion transition, character movement, and camera trajectory...'
              : mode === 'image'
              ? 'Describe the visual composition, subject details, depth of field, and editorial style...'
              : mode === 'audio'
              ? 'Enter script to synthesize with ElevenLabs high-definition neural voice (George, Roger, Sarah)...'
              : 'Describe the custom creative mini-tool you want Google Flow Agent to generate...'
          }
          className="w-full bg-[#090A0D] text-slate-100 placeholder-slate-500 rounded-2xl p-4 text-xs sm:text-sm border border-white/10 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none font-mono leading-relaxed shadow-inner"
        />

        {/* Inspiration Chips */}
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-semibold">Studio Presets:</span>
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1 rounded-full transition-all border border-white/8 truncate max-w-[240px] sm:max-w-xs shadow-2xs"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Kling-Inspired Parameters & Controls Row */}
      <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/8">
            {(['16:9', '9:16', '1:1', '21:9'] as const).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => setAspectRatio(ar)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === ar ? 'bg-white/[0.14] text-white shadow-2xs border border-white/15' : 'text-slate-400 hover:text-white'
                }`}
              >
                {ar}
              </button>
            ))}
          </div>

          {/* Camera Motion Selector */}
          {(mode === 'video' || mode === 'frames') && (
            <div className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/8 text-slate-300">
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                {CAMERA_PRESETS.map((c) => (
                  <option key={c} value={c} className="bg-[#11131A] text-slate-200">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Ingredients Reference Frame Button */}
          {(mode === 'video' || mode === 'frames') && (
            <button
              type="button"
              onClick={() => setHasIngredient(!hasIngredient)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                hasIngredient
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                  : 'bg-white/[0.04] text-slate-300 border-white/8 hover:bg-white/[0.08]'
              }`}
            >
              <Plus className="w-3 h-3 text-indigo-400" />
              <span>{hasIngredient ? '✓ Start Frame Locked' : '+ Add Keyframe'}</span>
            </button>
          )}

          {/* Engine indicator */}
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
            Engine: {mode === 'audio' ? 'ElevenLabs HD' : 'Gemini Omni 1.1 Flash'}
          </span>
        </div>

        {/* Generate Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer disabled:opacity-50 border border-white/10"
        >
          {isSubmitting ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Opening Studio...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Generate ({estimatedCost} Credits)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
