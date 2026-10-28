'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Image as ImageIcon,
  Download,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Layers,
  Zap,
} from 'lucide-react';

interface GeminiImageStudioProps {
  initialPrompt?: string;
  initialAspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  onImageGenerated?: (imageUrl: string, asset: any) => void;
  className?: string;
}

const SAMPLE_PROMPTS = [
  'Create a premium product advertisement for a modern glass perfume bottle on a clean white studio surface, with elegant emerald-green liquid accents, soft pink translucent glass ribbons, natural studio lighting, realistic reflections, luxury commercial photography, refined composition and crisp details. Square 1:1 composition.',
  'Futuristic architectural atrium with lush green botanical gardens, soft natural morning sunlight filtering through translucent glass panels, hyper-detailed minimalist luxury aesthetic.',
  'Macro shot of a luxury chronograph wristwatch resting on pristine white marble, emerald green bezel highlights, subtle rose-gold reflections, commercial lighting.',
  'Organic skincare cosmetic glass bottle with delicate pink foam and droplets, soft mint leaf accents, bright airy studio background, sharp focus.',
];

const ASPECT_RATIOS: Array<{ id: '1:1' | '16:9' | '9:16' | '4:3'; label: string; desc: string }> = [
  { id: '1:1', label: '1:1 Square', desc: 'Social & Feed (1024×1024)' },
  { id: '16:9', label: '16:9 Landscape', desc: 'Desktop & Cinema (1920×1080)' },
  { id: '9:16', label: '9:16 Portrait', desc: 'Stories & Reels (1080×1920)' },
  { id: '4:3', label: '4:3 Classic', desc: 'Editorial & Tablet (1440×1080)' },
];

export function GeminiImageStudio({
  initialPrompt = '',
  initialAspectRatio = '1:1',
  onImageGenerated,
  className = '',
}: GeminiImageStudioProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>(initialAspectRatio);
  const [model, setModel] = useState<'gemini-3.1-flash-image' | 'gemini-3-pro-image'>('gemini-3.1-flash-image');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedAsset, setGeneratedAsset] = useState<any>(null);
  const [errorInfo, setErrorInfo] = useState<{
    message: string;
    code?: string;
    details?: string;
  } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [userCredits, setUserCredits] = useState<number | null>(null);

  // Fetch initial credit balance
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.credits?.availableBalance !== undefined) {
          setUserCredits(d.credits.availableBalance);
        }
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorInfo({ message: 'Please enter a creative prompt to generate an image.' });
      return;
    }

    setIsGenerating(true);
    setErrorInfo(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-image',
          prompt: prompt.trim(),
          aspectRatio,
          negativePrompt: negativePrompt.trim() || undefined,
          model,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorInfo({
          message: data.error || 'Gemini image generation could not be completed.',
          code: data.errorCode || (res.status === 429 ? 'QUOTA_EXHAUSTED' : 'PROVIDER_ERROR'),
          details: data.rawDetails,
        });
        return;
      }

      setGeneratedImage(data.imageUrl);
      setGeneratedAsset(data.asset);
      setSuccessMsg('High-fidelity image rendered and saved to your asset library.');

      if (data.availableBalance !== undefined) {
        setUserCredits(data.availableBalance);
      }

      if (onImageGenerated) {
        onImageGenerated(data.imageUrl, data.asset);
      }
    } catch (err: any) {
      setErrorInfo({
        message: err.message || 'An unexpected network error occurred.',
        code: 'NETWORK_ERROR',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancingPrompt(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt: prompt.trim(),
          aspectRatio,
          stylePreference: 'Cinematic Hyperrealistic Product Render',
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error('Enhance failed:', e);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `fluvia_gemini_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full text-left text-[#F5EAF4] ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameters & Prompt (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#211522] rounded-2xl p-6 border border-[#39233B] shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#39233B] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F05BCE] to-[#C026D3] flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#F5EAF4] text-base sm:text-lg flex items-center gap-2">
                    <span>Gemini Image Synthesis</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#F05BCE]/15 text-[10px] font-bold text-[#F05BCE] border border-[#F05BCE]/30">
                      Official SDK
                    </span>
                  </h3>
                  <p className="text-xs text-[#A99AAA]">
                    Direct neural rendering with Google Gemini Imagen models
                  </p>
                </div>
              </div>

              {userCredits !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs font-bold text-[#F05BCE]">
                  <Zap className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>{userCredits} Credits</span>
                </div>
              )}
            </div>

            {/* Prompt Input Container */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#F5EAF4] uppercase tracking-wider text-[11px]">
                  Creative Prompt
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancingPrompt || !prompt.trim()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F05BCE] hover:brightness-125 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#F05BCE]" />
                    <span>{isEnhancingPrompt ? 'Enhancing...' : 'Enhance with Gemini'}</span>
                  </button>
                  <span className={`text-[11px] font-mono ${prompt.length > 1800 ? 'text-[#F05BCE] font-bold' : 'text-[#A99AAA]'}`}>
                    {prompt.length} / 2000
                  </span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  value={prompt}
                  maxLength={2000}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your scene in detail: subject, lighting, mood, materials, camera perspective..."
                  className="w-full p-3.5 rounded-xl bg-[#100A12] border border-[#39233B] focus:border-[#F05BCE] focus:ring-2 focus:ring-[#F05BCE]/20 text-[#F5EAF4] text-xs sm:text-sm placeholder:text-[#A99AAA]/50 transition-all outline-none resize-none leading-relaxed shadow-xs"
                />

                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt('')}
                    className="absolute right-2.5 bottom-2.5 text-[11px] text-[#A99AAA] hover:text-[#F05BCE] px-1.5 py-0.5 rounded cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sample Prompts Pills */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A99AAA] block mb-1.5 font-mono">
                  Try a curated prompt:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="text-[11px] text-[#A99AAA] hover:text-[#F5EAF4] bg-white/[0.04] hover:bg-white/[0.08] border border-[#39233B] rounded-lg px-2.5 py-1 text-left transition-all truncate max-w-full cursor-pointer"
                      title={p}
                    >
                      💡 {p.slice(0, 42)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2 mb-5">
              <label className="block font-bold text-[#F5EAF4] uppercase tracking-wider text-[11px]">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ASPECT_RATIOS.map((item) => {
                  const isSelected = aspectRatio === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspectRatio(item.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#F05BCE] bg-[#F05BCE]/15 shadow-xs ring-1 ring-[#F05BCE]/30'
                          : 'border-[#39233B] bg-[#100A12] hover:border-white/20 text-[#A99AAA]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#F5EAF4]' : 'text-[#A99AAA]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#F05BCE]" />}
                      </div>
                      <span className="text-[10px] text-[#A99AAA] block leading-tight">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model & Negative Prompt Accordion */}
            <div className="space-y-4 pt-2 border-t border-[#39233B]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#F5EAF4] uppercase mb-1">
                    Gemini Model
                  </label>
                  <select
                    value={model}
                    onChange={(e: any) => setModel(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#100A12] border border-[#39233B] text-xs text-[#F5EAF4] font-medium outline-none focus:border-[#F05BCE] cursor-pointer"
                  >
                    <option value="gemini-3.1-flash-image">Gemini 3.1 Flash Image (5 Credits)</option>
                    <option value="gemini-3-pro-image">Gemini 3 Pro Image (10 Credits)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#F5EAF4] uppercase mb-1">
                    Negative Prompt (Optional)
                  </label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blurry, distorted, low quality, artifacts"
                    className="w-full p-2 rounded-lg bg-[#100A12] border border-[#39233B] text-xs text-[#F5EAF4] placeholder:text-[#A99AAA]/50 outline-none focus:border-[#F05BCE]"
                  />
                </div>
              </div>
            </div>

            {/* Error Message with Quota guidance */}
            {errorInfo && (
              <div className="mt-5 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs space-y-2 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-rose-100">Generation Error</span>
                      {errorInfo.code && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-[10px] font-mono font-bold text-rose-300">
                          {errorInfo.code}
                        </span>
                      )}
                    </div>
                    <p className="text-rose-300 leading-relaxed text-[11px] sm:text-xs">
                      {errorInfo.message}
                    </p>
                  </div>
                </div>

                {errorInfo.code === 'QUOTA_EXHAUSTED' && (
                  <div className="pl-6 pt-1 flex flex-wrap items-center gap-2 text-[11px]">
                    <a
                      href="https://ai.google.dev/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-rose-300 underline hover:text-white"
                    >
                      <span>Enable Google AI Studio Pay-As-You-Go</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-rose-400">• Your credits were not deducted.</span>
                  </div>
                )}
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="mt-5 p-3.5 rounded-xl bg-[#F05BCE]/10 border border-[#F05BCE]/30 text-[#F5EAF4] text-xs flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F05BCE] shrink-0" />
                  <span className="font-medium">{successMsg}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="font-bold text-[#F05BCE] underline hover:text-white text-[11px] shrink-0"
                >
                  View Assets
                </Link>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-[#39233B] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#A99AAA]">
                <Zap className="w-4 h-4 text-[#F05BCE]" />
                <span className="font-bold text-[#F5EAF4]">Cost:</span>
                <span>{model === 'gemini-3-pro-image' ? '10' : '5'} Credits</span>
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#F05BCE]/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Viewport (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#211522] rounded-2xl p-5 border border-[#39233B] shadow-xl flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#39233B] mb-4">
                <h4 className="font-bold text-[#F5EAF4] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#F05BCE]" />
                  <span>Preview & Export</span>
                </h4>
                {generatedImage && (
                  <span className="px-2 py-0.5 rounded bg-[#F05BCE]/20 text-[10px] font-bold text-[#F05BCE]">
                    Ready
                  </span>
                )}
              </div>

              {/* Viewport Box */}
              <div
                className={`w-full rounded-xl border border-[#39233B] bg-[#100A12] flex items-center justify-center overflow-hidden relative transition-all ${
                  aspectRatio === '1:1'
                    ? 'aspect-square'
                    : aspectRatio === '16:9'
                    ? 'aspect-video'
                    : aspectRatio === '9:16'
                    ? 'aspect-[9/16]'
                    : 'aspect-[4/3]'
                }`}
              >
                {isGenerating ? (
                  <div className="p-6 text-center space-y-3">
                    <div className="relative w-12 h-12 mx-auto">
                      <div className="w-12 h-12 rounded-full border-3 border-[#F05BCE]/30 border-t-[#F05BCE] animate-spin" />
                      <Sparkles className="w-5 h-5 text-[#F05BCE] absolute inset-0 m-auto" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F5EAF4]">Gemini Neural Synthesis</p>
                      <p className="text-[11px] text-[#A99AAA] mt-1">Generating high-fidelity visual asset...</p>
                    </div>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={generatedImage}
                      alt={prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-[#F5EAF4] text-xs line-clamp-2 leading-relaxed">
                        {prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-[#39233B] flex items-center justify-center mx-auto text-[#F05BCE] shadow-xs">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div className="max-w-[240px] mx-auto">
                      <p className="text-xs font-bold text-[#F5EAF4]">No Image Rendered Yet</p>
                      <p className="text-[11px] text-[#A99AAA] mt-1">
                        Enter your prompt or choose a curated sample, then click Generate Image.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            {generatedImage && (
              <div className="mt-4 pt-3 border-t border-[#39233B] flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#F05BCE]/25 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-[#39233B] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>

                <button
                  type="button"
                  onClick={copyPrompt}
                  className="p-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#A99AAA] text-xs cursor-pointer border border-[#39233B]"
                  title="Copy Prompt"
                >
                  {copied ? <Check className="w-4 h-4 text-[#F05BCE]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
