'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Film,
  UploadCloud,
  X,
  Sliders,
  ArrowRight,
  Zap,
  Check,
  AlertCircle,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

const GENERATION_MODELS = {
  video: [
    { id: 'fluvia-cinematic-v1', name: 'Fluvia Cinematic HD', cost: 25, badge: 'Director' },
    { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Ultra Motion' },
    { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Realistic Motion' },
  ],
  image: [
    { id: 'gemini-3.1-flash-image', name: 'Gemini 3.1 Flash Image', cost: 5, badge: 'Google AI' },
    { id: 'gemini-3-pro-image', name: 'Gemini 3 Pro Image', cost: 10, badge: 'Ultra Detail' },
    { id: 'fal-flux-pro', name: 'Flux 1.1 Pro Vision', cost: 5, badge: 'Photoreal' },
  ],
  reels: [
    { id: 'fluvia-cinematic-v1', name: 'Fluvia Cinema Reels', cost: 25, badge: '9:16 Vertical' },
    { id: 'runway-gen3', name: 'Runway Gen-3 Vertical', cost: 50, badge: 'Ultra' },
  ],
  audio: [
    { id: 'eleven-multilingual', name: 'ElevenLabs Voice HD', cost: 10, badge: 'Multilingual' },
  ],
};

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9 Landscape', icon: '16:9' },
  { id: '9:16', label: '9:16 Portrait', icon: '9:16' },
  { id: '1:1', label: '1:1 Square', icon: '1:1' },
  { id: '4:3', label: '4:3 Classic', icon: '4:3' },
  { id: '21:9', label: '21:9 Cinema', icon: '21:9' },
];

const CURATED_PROMPTS = [
  'Cinematic slow motion reveal of a modern glass perfume bottle on a white reflective pedestal, with emerald liquid swirls and soft pink translucent glass ribbons, 35mm anamorphic.',
  'A neon-lit cybernetic athlete sprinting through rain-slicked Tokyo alleys at midnight, hyper-realistic reflections, volumetric green streetlamps.',
  'Sweeping drone camera descending over misty Scandinavian pine fjord at golden hour, realistic water surface caustics.',
  'Macro commercial close-up of a luxury titanium chronograph watch with exposed mechanical tourbillon gears, studio rim lighting.',
];

export function CinematicPromptComposer() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'video' | 'image' | 'reels' | 'audio'>('video');
  const [prompt, setPrompt] = useState(CURATED_PROMPTS[0]);
  const [selectedModel, setSelectedModel] = useState<string>('fluvia-cinematic-v1');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Mode Change
  const handleModeChange = (newMode: 'video' | 'image' | 'reels' | 'audio') => {
    setMode(newMode);
    const availableModels = GENERATION_MODELS[newMode] || GENERATION_MODELS.video;
    setSelectedModel(availableModels[0].id);

    if (newMode === 'reels') {
      setAspectRatio('9:16');
    } else if (newMode === 'image' && aspectRatio === '21:9') {
      setAspectRatio('1:1');
    }
  };

  // Calculate Credit Cost
  const currentModelList = GENERATION_MODELS[mode] || GENERATION_MODELS.video;
  const currentModelObj = currentModelList.find((m) => m.id === selectedModel) || currentModelList[0];
  const calculatedCredits =
    mode === 'image'
      ? currentModelObj.cost
      : mode === 'audio'
      ? 10
      : Math.round(currentModelObj.cost * (durationSec / 5));

  // Reference Image Upload Handler
  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit.');
      return;
    }

    setErrorMessage(null);
    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setReferenceImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Gemini Prompt Enhancement
  const handleEnhanceWithGemini = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt: prompt.trim(),
          aspectRatio,
          stylePreference: mode === 'video' ? 'Cinematic 35mm Director Grade' : 'Photorealistic Luxury Commercial',
        }),
      });

      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err: any) {
      console.warn('Gemini enhancement unavailable:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle Primary Generate Action
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please describe the image or video you want to create.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const draftPayload = {
      prompt: prompt.trim(),
      mode,
      aspectRatio,
      durationSec,
      modelId: selectedModel,
      referenceUrl: referenceImage,
    };

    try {
      localStorage.setItem('fluvia_pending_prompt', JSON.stringify(draftPayload));
      localStorage.setItem('vidai_pending_prompt', JSON.stringify(draftPayload));
    } catch (e) {}

    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData?.authenticated) {
          // If logged in, navigate straight to creation studio with all parameters preserved
          router.push(
            `/create?prompt=${encodeURIComponent(prompt.trim())}&mode=${mode}&aspectRatio=${aspectRatio}&modelId=${selectedModel}&durationSec=${durationSec}`
          );
          return;
        }
      }

      // Guest flow: redirect to login with returnUrl
      router.push(`/login?returnUrl=/create`);
    } catch (err) {
      router.push(`/create?prompt=${encodeURIComponent(prompt.trim())}&mode=${mode}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-left relative z-20">
      {/* Container with Dark Elevated Surface and Emerald/Pink Edge Glow */}
      <div className="cinematic-composer rounded-3xl p-4 sm:p-6 border border-[#293831] shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Subtle interior ambient light accents */}
        <div className="absolute top-0 right-0 w-80 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-30 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#080D0B]/80 border border-[#293831] mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleModeChange('video')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'video'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Generation</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('image')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'image'
                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Generation</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('reels')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'reels'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>AI Reels</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('audio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'audio'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice & Audio</span>
          </button>
        </div>

        {/* 2. Main Multiline Prompt Field */}
        <div className="relative mb-3">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image or video you want to create in vivid detail (lighting, motion, optics, subject)..."
            className="w-full p-4 rounded-2xl cinematic-input text-sm sm:text-base leading-relaxed placeholder:text-slate-500 outline-none resize-none shadow-inner"
          />

          {/* Quick Actions Row below prompt */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEnhanceWithGemini}
                disabled={isEnhancing || !prompt.trim()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 font-semibold transition-all disabled:opacity-40 cursor-pointer text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>{isEnhancing ? 'Enhancing with Gemini...' : 'Enhance Prompt'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextPrompt = CURATED_PROMPTS[(CURATED_PROMPTS.indexOf(prompt) + 1) % CURATED_PROMPTS.length] || CURATED_PROMPTS[0];
                  setPrompt(nextPrompt);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors text-[11px] cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Example</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              {prompt.length} chars
            </span>
          </div>
        </div>

        {/* 3. Reference Image Pill (if uploaded) */}
        {referenceImage && (
          <div className="mb-3 p-2 rounded-xl bg-[#1A231F] border border-[#293831] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={referenceImage}
                alt="Reference preview"
                className="w-9 h-9 rounded-lg object-cover border border-emerald-500/30 shrink-0"
              />
              <div className="truncate">
                <span className="font-bold text-slate-200 block truncate text-xs">{referenceFileName || 'Reference Image'}</span>
                <span className="text-[10px] text-emerald-400 font-medium">Visual Conditioning Loaded</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setReferenceImage(null);
                setReferenceFileName(null);
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4. Controls Bar: Reference Upload, Model, Aspect Ratio, Duration */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#293831] mb-4 text-xs">
          {/* Reference Upload Trigger */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
              Reference Asset
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-2.5 rounded-xl bg-[#1A231F] hover:bg-[#222E29] border border-[#293831] text-slate-300 flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer text-xs"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">{referenceImage ? 'Change Image' : 'Upload Image'}</span>
            </button>
          </div>

          {/* AI Model Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
              AI Engine
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-slate-200 text-xs font-semibold outline-none focus:border-emerald-500 cursor-pointer"
            >
              {currentModelList.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#121A16] text-white">
                  {m.name} ({m.cost} cr)
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-slate-200 text-xs font-semibold outline-none focus:border-emerald-500 cursor-pointer"
            >
              {ASPECT_RATIOS.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#121A16] text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector (for Video) */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
              {mode === 'image' ? 'Resolution' : 'Clip Length'}
            </label>
            {mode === 'image' ? (
              <div className="w-full py-2 px-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-slate-300 text-xs font-semibold flex items-center justify-between">
                <span>HD Ultra 1024+</span>
                <span className="text-[10px] text-emerald-400 font-mono">Lossless</span>
              </div>
            ) : (
              <select
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="w-full py-2 px-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-slate-200 text-xs font-semibold outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={5} className="bg-[#121A16] text-white">5 seconds (Fast)</option>
                <option value={10} className="bg-[#121A16] text-white">10 seconds (Extended)</option>
                <option value={15} className="bg-[#121A16] text-white">15 seconds (Narrative)</option>
              </select>
            )}
          </div>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 5. Primary Action Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Credit Estimation Badge */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A231F] border border-[#293831]">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Estimated Cost:</span>
              <span className="font-extrabold text-emerald-400 font-mono text-sm">{calculatedCredits} Credits</span>
            </div>
          </div>

          {/* Prominent Generate CTA */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSubmitting || !prompt.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching Inference...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate {mode === 'image' ? 'Image' : 'Video'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
