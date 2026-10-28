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
    <div className="w-full max-w-4xl mx-auto rounded-3xl glass-card p-4 sm:p-6 relative overflow-hidden text-left shadow-2xl border border-emerald-500/25 bg-white/95">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Google Flow Top Header Bar: Studio Console + Mode Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b border-emerald-500/15">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'video'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Text to Video</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">15 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('frames')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'frames'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Frames to Video</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">15 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'image'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>AI Image</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">5 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('audio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'audio'
                ? 'bg-teal-800 text-white shadow-md shadow-teal-800/25'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voiceover HD</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">2 cr</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              mode === 'tools'
                ? 'bg-[#17211D] text-white shadow-md'
                : 'text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/70'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>Custom Tools</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">Free</span>
          </button>
        </div>

        {/* Gemini Enhancement Trigger */}
        <button
          type="button"
          onClick={handleEnhanceWithGemini}
          disabled={isEnhancing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-all disabled:opacity-50 shadow-2xs shrink-0 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-600 ${isEnhancing ? 'animate-spin' : ''}`} />
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
          className="w-full bg-white text-[#17211D] placeholder-slate-400 rounded-2xl p-4 text-xs sm:text-sm border border-emerald-500/25 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none font-mono leading-relaxed shadow-inner"
        />

        {/* Inspiration Chips */}
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 font-semibold">Flow Presets:</span>
          {EXAMPLE_PROMPTS.slice(0, 3).map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-xs text-slate-700 hover:text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/80 px-3 py-1 rounded-full transition-all border border-emerald-500/15 truncate max-w-[240px] sm:max-w-xs shadow-2xs"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Google Flow Parameters & Controls Row */}
      <div className="mt-5 pt-4 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Aspect Ratio Selector */}
          <div className="flex items-center gap-1 bg-emerald-50/60 p-1 rounded-xl border border-emerald-500/20">
            {(['16:9', '9:16', '1:1', '21:9'] as const).map((ar) => (
              <button
                key={ar}
                type="button"
                onClick={() => setAspectRatio(ar)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  aspectRatio === ar ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                {ar}
              </button>
            ))}
          </div>

          {/* Camera Motion Selector */}
          {(mode === 'video' || mode === 'frames') && (
            <div className="flex items-center gap-1.5 bg-emerald-50/60 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-slate-700">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <select
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className="bg-transparent text-[#17211D] font-bold text-xs focus:outline-none cursor-pointer"
              >
                {CAMERA_PRESETS.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#17211D]">
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
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-bold'
                  : 'bg-white text-slate-600 border-emerald-500/20 hover:bg-emerald-50'
              }`}
            >
              <Plus className="w-3 h-3 text-emerald-600" />
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
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
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
