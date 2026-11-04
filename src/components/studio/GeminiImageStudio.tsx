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
  Settings2,
  Server,
  Key,
  ShieldCheck,
  CheckCheck,
  Flame,
  Cpu,
} from 'lucide-react';
import { CLOUDFLARE_MODELS, CloudflareModelInfo } from '@/lib/ai/cloudflare-constants';

interface GeminiImageStudioProps {
  initialPrompt?: string;
  initialAspectRatio?: '1:1' | '16:9' | '9:16' | '4:3';
  onImageGenerated?: (imageUrl: string, asset: any) => void;
  className?: string;
}

const SAMPLE_PROMPTS = [
  'A cute futuristic robot preparing gourmet breakfast in a neon-lit cyberpunk kitchen, cinematic lighting, sharp 8k textures.',
  'Create a premium product advertisement for a modern glass perfume bottle on a clean white studio surface, with elegant emerald-green liquid accents, natural studio lighting, luxury commercial photography.',
  'Futuristic architectural atrium with lush green botanical gardens, soft natural morning sunlight filtering through translucent glass panels, minimalist luxury aesthetic.',
  'Macro shot of a luxury chronograph wristwatch resting on pristine white marble, emerald green bezel highlights, subtle rose-gold reflections.',
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
  // Provider toggle: 'cloudflare' (Free 100k/day) or 'gemini' (Google Imagen)
  const [provider, setProvider] = useState<'cloudflare' | 'gemini'>('cloudflare');

  const [prompt, setPrompt] = useState(initialPrompt);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>(initialAspectRatio);

  // Model selection
  const [cloudflareModel, setCloudflareModel] = useState<string>('@cf/stabilityai/stable-diffusion-xl-base-1.0');
  const [geminiModel, setGeminiModel] = useState<'gemini-3.1-flash-image' | 'gemini-3-pro-image'>('gemini-3.1-flash-image');

  // Cloudflare Worker settings (from saurav-z/free-image-generation-api)
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [workerUrl, setWorkerUrl] = useState('');
  const [workerApiKey, setWorkerApiKey] = useState('');
  const [isTestingWorker, setIsTestingWorker] = useState(false);
  const [workerTestStatus, setWorkerTestStatus] = useState<{ ok: boolean; message: string } | null>(null);

  // Load custom worker settings from localStorage if saved
  useEffect(() => {
    try {
      const savedUrl = localStorage.getItem('cf_worker_url');
      const savedKey = localStorage.getItem('cf_worker_api_key');
      if (savedUrl) setWorkerUrl(savedUrl);
      if (savedKey) setWorkerApiKey(savedKey);
    } catch {}
  }, []);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedAsset, setGeneratedAsset] = useState<any>(null);
  const [activeProviderUsed, setActiveProviderUsed] = useState<string | null>(null);
  const [activeModelUsed, setActiveModelUsed] = useState<string | null>(null);
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

  const handleSaveWorkerConfig = () => {
    try {
      localStorage.setItem('cf_worker_url', workerUrl.trim());
      localStorage.setItem('cf_worker_api_key', workerApiKey.trim());
      setWorkerTestStatus({
        ok: true,
        message: 'Settings saved! Image generation will now route through your Cloudflare Worker.',
      });
      setTimeout(() => setIsWorkerModalOpen(false), 1200);
    } catch {}
  };

  const handleTestWorker = async () => {
    if (!workerUrl.trim()) {
      setWorkerTestStatus({ ok: false, message: 'Please enter a Cloudflare Worker URL first.' });
      return;
    }
    setIsTestingWorker(true);
    setWorkerTestStatus(null);
    try {
      const cleanUrl = workerUrl.trim().endsWith('/') ? workerUrl.trim().slice(0, -1) : workerUrl.trim();
      const res = await fetch('/api/ai/free-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'A test red apple on white marble, sharp focus',
          workerUrl: cleanUrl,
          apiKey: workerApiKey.trim(),
          aspectRatio: '1:1',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWorkerTestStatus({
          ok: true,
          message: `Worker Connected! Tested successfully (${data.latencyMs}ms latency).`,
        });
      } else {
        setWorkerTestStatus({
          ok: false,
          message: data.error || 'Worker test failed. Please check your URL and API Key.',
        });
      }
    } catch (err: any) {
      setWorkerTestStatus({
        ok: false,
        message: `Connection error: ${err.message}`,
      });
    } finally {
      setIsTestingWorker(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorInfo({ message: 'Please enter a creative prompt to generate an image.' });
      return;
    }

    setIsGenerating(true);
    setErrorInfo(null);
    setSuccessMsg(null);

    try {
      if (provider === 'cloudflare') {
        // Route through Cloudflare Workers AI API (from saurav-z/free-image-generation-api)
        const res = await fetch('/api/ai/free-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            model: cloudflareModel,
            aspectRatio,
            workerUrl: workerUrl.trim() || undefined,
            apiKey: workerApiKey.trim() || undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success || !data.imageUrl) {
          setErrorInfo({
            message: data.error || 'Cloudflare image generation could not be completed.',
            code: 'PROVIDER_ERROR',
          });
          return;
        }

        setGeneratedImage(data.imageUrl);
        setGeneratedAsset(data.asset);
        setActiveProviderUsed('Cloudflare Workers AI (100k Calls/Day)');
        setActiveModelUsed(data.modelUsed);
        setSuccessMsg(
          data.provider === 'cloudflare-worker'
            ? 'Rendered via your custom Cloudflare Worker (0 Credits Used).'
            : 'Rendered via Free Cloud AI Engine (0 Credits Used).'
        );

        if (onImageGenerated) {
          onImageGenerated(data.imageUrl, data.asset);
        }
      } else {
        // Route through Gemini Imagen
        const res = await fetch('/api/ai/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate-image',
            prompt: prompt.trim(),
            aspectRatio,
            negativePrompt: negativePrompt.trim() || undefined,
            model: geminiModel,
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
        setActiveProviderUsed('Google Gemini AI');
        setActiveModelUsed(geminiModel);
        setSuccessMsg('High-fidelity image rendered with Google Gemini and saved to your asset library.');

        if (data.availableBalance !== undefined) {
          setUserCredits(data.availableBalance);
        }

        if (onImageGenerated) {
          onImageGenerated(data.imageUrl, data.asset);
        }
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
        }),
      });
      const data = await res.json();
      if (data.success && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch {}
    setIsEnhancingPrompt(false);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `fluvia_generated_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full text-left text-[#17191D] ${className}`}>
      {/* Cloudflare Worker Setup Modal */}
      {isWorkerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setIsWorkerModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Cloudflare Worker API Setup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Based on <code className="font-mono text-amber-700 bg-amber-50 px-1 rounded">free-image-generation-api</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWorkerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>100,000 Free Calls Per Day</span>
                </p>
                Deploy your own Cloudflare Worker in 2 minutes using the code in this repo or enter your deployed Worker URL below.
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Worker URL (Optional)
                </label>
                <input
                  type="url"
                  value={workerUrl}
                  onChange={(e) => setWorkerUrl(e.target.value)}
                  placeholder="https://free-image-generation-api.your-subdomain.workers.dev"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Leave empty to use our built-in free Cloudflare AI engine automatically.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Worker API Key (Optional)
                </label>
                <input
                  type="password"
                  value={workerApiKey}
                  onChange={(e) => setWorkerApiKey(e.target.value)}
                  placeholder="your-secret-api-key"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
                />
              </div>

              {workerTestStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    workerTestStatus.ok
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-50 text-rose-900 border border-rose-300'
                  }`}
                >
                  {workerTestStatus.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{workerTestStatus.message}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isTestingWorker}
                  onClick={handleTestWorker}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isTestingWorker ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveWorkerConfig}
                  className="flex-1 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black transition-all shadow-md shadow-amber-500/20 cursor-pointer text-center"
                >
                  Save & Apply
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Repository instructions:</span>
                <a
                  href="https://github.com/saurav-z/free-image-generation-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>github.com/saurav-z/free-image-generation-api</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Parameters & Prompt (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-xs">
            {/* Header + Provider Segmented Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E5E7EB] mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors ${
                    provider === 'cloudflare'
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 shadow-amber-500/20'
                      : 'bg-gradient-to-tr from-[#5145CD] to-[#7C3AED] shadow-indigo-500/20'
                  }`}
                >
                  {provider === 'cloudflare' ? (
                    <Zap className="w-5 h-5 text-white" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#17191D] text-base sm:text-lg flex items-center gap-2">
                    <span>
                      {provider === 'cloudflare'
                        ? 'Cloudflare Workers AI'
                        : 'Gemini Image Synthesis'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                        provider === 'cloudflare'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-[#EEF2FF] text-[#5145CD] border-[#E0E7FF]'
                      }`}
                    >
                      {provider === 'cloudflare' ? '100k/Day Free' : 'Official SDK'}
                    </span>
                  </h3>
                  <p className="text-xs text-[#667085]">
                    {provider === 'cloudflare'
                      ? 'Free AI Image Generation via Cloudflare Workers AI (saurav-z)'
                      : 'Direct neural rendering with Google Gemini Imagen models'}
                  </p>
                </div>
              </div>

              {/* Provider Selector Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setProvider('cloudflare')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    provider === 'cloudflare'
                      ? 'bg-white text-amber-950 font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Cloudflare Free</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('gemini')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    provider === 'gemini'
                      ? 'bg-white text-[#5145CD] font-black shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Google Gemini</span>
                </button>
              </div>
            </div>

            {/* Prompt Input Container */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-[#17191D] uppercase tracking-wider text-[11px]">
                  Creative Prompt
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancingPrompt || !prompt.trim()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5145CD] hover:text-[#4338CA] transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#5145CD]" />
                    <span>{isEnhancingPrompt ? 'Enhancing...' : 'Enhance with Gemini'}</span>
                  </button>
                  <span
                    className={`text-[11px] font-mono ${
                      prompt.length > 1800 ? 'text-[#5145CD] font-bold' : 'text-[#667085]'
                    }`}
                  >
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
                  className="w-full p-3.5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] focus:border-[#5145CD] focus:bg-white focus:ring-2 focus:ring-[#5145CD]/20 text-[#17191D] text-xs sm:text-sm placeholder:text-[#667085]/60 transition-all outline-none resize-none leading-relaxed shadow-2xs"
                />

                {prompt && (
                  <button
                    type="button"
                    onClick={() => setPrompt('')}
                    className="absolute right-3 bottom-3 text-[11px] text-[#667085] hover:text-[#17191D] px-2 py-0.5 rounded cursor-pointer bg-white/80 border border-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sample Prompts Pills */}
              <div className="pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-1.5 font-mono">
                  Try a curated prompt:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="text-[11px] text-[#667085] hover:text-[#17191D] bg-[#F7F8FA] hover:bg-[#F1F3F5] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-left transition-all truncate max-w-full cursor-pointer"
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
              <label className="block font-bold text-[#17191D] uppercase tracking-wider text-[11px]">
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
                          ? 'border-[#5145CD] bg-[#EEF2FF] shadow-xs ring-1 ring-[#5145CD]/20'
                          : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] text-[#667085]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-[#5145CD]' : 'text-[#667085]'}`}>
                          {item.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#5145CD]" />}
                      </div>
                      <span className="text-[10px] text-[#667085] block leading-tight">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model & Settings Selection */}
            <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
              {provider === 'cloudflare' ? (
                /* Cloudflare Workers AI Model Grid (saurav-z/free-image-generation-api) */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#17191D] uppercase flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-amber-500" />
                      <span>Select Cloudflare Model (Free 100k Calls/Day)</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setIsWorkerModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200"
                    >
                      <Settings2 className="w-3 h-3 text-amber-600" />
                      <span>{workerUrl ? 'Custom Worker: Connected' : 'Connect Worker URL'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CLOUDFLARE_MODELS.map((m) => {
                      const isSelected = cloudflareModel === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setCloudflareModel(m.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/60 shadow-xs ring-1 ring-amber-400/30'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {m.name}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                              {m.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Gemini Model & Negative Prompt */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#17191D] uppercase mb-1">
                      Gemini Model
                    </label>
                    <select
                      value={geminiModel}
                      onChange={(e: any) => setGeminiModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#17191D] font-medium outline-none focus:border-[#5145CD] cursor-pointer"
                    >
                      <option value="gemini-3.1-flash-image">Gemini 3.1 Flash Image (5 Credits)</option>
                      <option value="gemini-3-pro-image">Gemini 3 Pro Image (10 Credits)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#17191D] uppercase mb-1">
                      Negative Prompt (Optional)
                    </label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      placeholder="blurry, distorted, low quality, artifacts"
                      className="w-full p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#17191D] placeholder:text-[#667085]/60 outline-none focus:border-[#5145CD]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Error Message with Quota guidance */}
            {errorInfo && (
              <div className="mt-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-rose-900">Generation Error</span>
                      {errorInfo.code && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 text-[10px] font-mono font-bold text-rose-700">
                          {errorInfo.code}
                        </span>
                      )}
                    </div>
                    <p className="text-rose-700 leading-relaxed text-[11px] sm:text-xs">
                      {errorInfo.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success message */}
            {successMsg && (
              <div className="mt-5 p-3.5 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] text-[#17191D] text-xs flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5145CD] shrink-0" />
                  <span className="font-medium">{successMsg}</span>
                </div>
                <Link
                  href="/dashboard"
                  className="font-bold text-[#5145CD] underline hover:text-[#4338CA] text-[11px] shrink-0"
                >
                  View Assets
                </Link>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#667085]">
                {provider === 'cloudflare' ? (
                  <div className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>0 Credits (100% Free • 100k Calls/Day)</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#5145CD]" />
                    <span className="font-bold text-[#17191D]">Cost:</span>
                    <span>{geminiModel === 'gemini-3-pro-image' ? '10' : '5'} Credits</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`px-6 py-3 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-50 cursor-pointer ${
                  provider === 'cloudflare'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                    : 'bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-indigo-500/25'
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Rendering Image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Free Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Viewport (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] mb-4">
                <h4 className="font-bold text-[#17191D] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#5145CD]" />
                  <span>Preview & Export</span>
                </h4>
                {generatedImage && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    <span>{activeProviderUsed || 'Ready'}</span>
                  </span>
                )}
              </div>

              {/* Viewport Box */}
              <div
                className={`w-full rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] flex items-center justify-center overflow-hidden relative transition-all shadow-inner ${
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
                      <div className="w-12 h-12 rounded-full border-3 border-amber-100 border-t-amber-500 animate-spin" />
                      <Sparkles className="w-5 h-5 text-amber-500 absolute inset-0 m-auto" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#17191D]">
                        {provider === 'cloudflare' ? 'Cloudflare Workers AI' : 'Gemini Neural Synthesis'}
                      </p>
                      <p className="text-[11px] text-[#667085] mt-1">Generating high-fidelity visual asset...</p>
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
                      <p className="text-white text-xs line-clamp-2 leading-relaxed">
                        {prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center mx-auto text-[#5145CD] shadow-2xs">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div className="max-w-[240px] mx-auto">
                      <p className="text-xs font-bold text-[#17191D]">No Image Rendered Yet</p>
                      <p className="text-[11px] text-[#667085] mt-1">
                        Enter your prompt or choose a curated sample, then click Generate Free Image.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            {generatedImage && (
              <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F1F3F5] border border-[#E5E7EB] text-[#17191D] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>

                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="p-2.5 rounded-xl bg-white hover:bg-[#F1F3F5] text-[#667085] hover:text-[#17191D] text-xs cursor-pointer border border-[#E5E7EB]"
                    title="Copy Prompt"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#5145CD]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <Link
                  href={`/create?mode=video&ref=${encodeURIComponent(generatedImage)}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Animate This Image to Video →</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
