'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Sliders,
  Ratio,
  Clock,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Film,
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  History,
  Layers,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';

const MODELS = [
  { id: 'fluvia-cinematic-v1', name: 'Fluvia Cinematic HD', cost: 25, badge: 'Director', type: 'video' },
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Ultra Motion', type: 'video' },
  { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Realistic Motion', type: 'video' },
  { id: 'gemini-3.1-flash-image', name: 'Gemini 3.1 Flash Image', cost: 5, badge: 'Google AI', type: 'image' },
  { id: 'gemini-3-pro-image', name: 'Gemini 3 Pro Image', cost: 10, badge: 'Ultra Detail', type: 'image' },
  { id: 'fal-flux-pro', name: 'Flux 1.1 Pro Vision', cost: 5, badge: 'Photoreal', type: 'image' },
  { id: 'eleven-multilingual', name: 'ElevenLabs Voice HD', cost: 10, badge: 'Voiceover', type: 'audio' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9 Landscape', icon: '16:9' },
  { id: '9:16', label: '9:16 Portrait', icon: '9:16' },
  { id: '1:1', label: '1:1 Square', icon: '1:1' },
  { id: '4:3', label: '4:3 Classic', icon: '4:3' },
  { id: '21:9', label: '21:9 Cinema', icon: '21:9' },
];

const CAMERA_PRESETS = [
  'Dolly in',
  'Dolly out',
  'Orbit',
  'Tracking shot',
  'Crane movement',
  'Handheld',
  'Static',
];

const SAMPLE_PROMPTS = [
  'Create a premium product advertisement for a modern glass perfume bottle on a clean white studio surface, with elegant emerald-green liquid accents, soft pink translucent glass ribbons, natural studio lighting, realistic reflections, luxury commercial photography, refined composition and crisp details. Square 1:1 composition.',
  'Cybernetic runner in a rain-slicked neon Tokyo alley at midnight, volumetric emerald glow, anamorphic lens reflections.',
  'Dramatic drone descent along an emerald coastal cliff highway during golden hour, waves crashing on sea stacks.',
  'Macro commercial close-up of a luxury mechanical chronograph wristwatch on black obsidian, studio rim lighting.',
];

function CreateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial params
  const initialMode = (searchParams.get('mode') as any) || 'video';
  const initialPrompt = searchParams.get('prompt') || '';
  const initialModel = searchParams.get('modelId') || 'fluvia-cinematic-v1';
  const initialRatio = searchParams.get('aspectRatio') || '16:9';

  const [authData, setAuthData] = useState<any>(null);
  const [mode, setMode] = useState<'video' | 'image' | 'audio' | 'reels'>('video');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState(initialModel);
  const [aspectRatio, setAspectRatio] = useState(initialRatio);
  const [durationSec, setDurationSec] = useState<number>(5);
  const [cameraMotion, setCameraMotion] = useState('Dolly in');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [referenceFileName, setReferenceFileName] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');

  // Active Job State
  const [activeJob, setActiveJob] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // History & Drawer State
  const [historyJobs, setHistoryJobs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Check saved draft from localStorage if empty
  useEffect(() => {
    if (!prompt) {
      try {
        const saved = localStorage.getItem('fluvia_pending_prompt') || localStorage.getItem('vidai_pending_prompt');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.prompt) setPrompt(parsed.prompt);
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
          if (parsed.modelId) setModelId(parsed.modelId);
          if (parsed.durationSec) setDurationSec(parsed.durationSec);
          if (parsed.referenceUrl) setReferenceUrl(parsed.referenceUrl);
          localStorage.removeItem('fluvia_pending_prompt');
          localStorage.removeItem('vidai_pending_prompt');
        }
      } catch (e) {}
    }

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d || !d.authenticated) router.push('/login?returnUrl=/create');
        else setAuthData(d);
      });

    // Load recent generation history
    fetch('/api/jobs')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d?.jobs) setHistoryJobs(d.jobs.slice(0, 12));
      })
      .catch(() => {});
  }, []);

  // Poll active job while status is queued or processing
  useEffect(() => {
    if (!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${activeJob.id}`);
        if (res.ok) {
          const d = await res.json();
          setActiveJob(d.job);

          // Update user credits balance and history when job finishes
          if (d.job.status === 'completed' || d.job.status === 'failed') {
            fetch('/api/auth/me')
              .then((r) => r.json())
              .then((fresh) => {
                if (fresh) setAuthData(fresh);
              });

            fetch('/api/jobs')
              .then((r) => (r.ok ? r.json() : null))
              .then((resJobs) => {
                if (resJobs?.jobs) setHistoryJobs(resJobs.jobs.slice(0, 12));
              });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeJob]);

  // Mode Selection handler
  const handleModeSelect = (newMode: 'video' | 'image' | 'audio' | 'reels') => {
    setMode(newMode);
    if (newMode === 'image') {
      setModelId('gemini-3.1-flash-image');
      if (aspectRatio === '21:9') setAspectRatio('1:1');
    } else if (newMode === 'video') {
      setModelId('fluvia-cinematic-v1');
    } else if (newMode === 'reels') {
      setModelId('fluvia-cinematic-v1');
      setAspectRatio('9:16');
    } else if (newMode === 'audio') {
      setModelId('eleven-multilingual');
    }
  };

  const selectedModelObj = MODELS.find((m) => m.id === modelId) || MODELS[0];
  const estimatedCost =
    mode === 'image'
      ? selectedModelObj.cost
      : mode === 'audio'
      ? 10
      : Math.round(selectedModelObj.cost * (durationSec / 5));

  // Reference Image Upload Handler
  const handleFileSelect = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    setErrorMsg(null);
    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setReferenceUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Enhance with Gemini
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt: prompt.trim(),
          aspectRatio,
          cameraMovement: cameraMotion,
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

  // Start Generation
  const handleStartGeneration = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a creative prompt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          prompt: prompt.trim(),
          modelId,
          aspectRatio,
          durationSec,
          negativePrompt,
          referenceImageUrl: referenceUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch generation job.');
      }

      setActiveJob(data.job);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Output File
  const handleDownload = () => {
    const url = activeJob?.output?.videoUrl || activeJob?.output?.imageUrl;
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `fluvia_render_${activeJob.id}.${activeJob?.output?.videoUrl ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Prompt
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeJob?.input?.prompt || prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const credits = authData?.credits || { availableBalance: 0 };

  return (
    <div className="min-h-screen flex flex-col bg-[#080D0B] text-[#F1F5F3] selection:bg-emerald-500/30 selection:text-white">
      {/* 1. COMPACT TOP WORKSPACE BAR */}
      <header className="h-16 px-4 sm:px-6 border-b border-[#293831] bg-[#0E1512]/90 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Logo size="md" darkVariant={true} />

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>/</span>
            <span className="text-emerald-400 font-bold">Studio Canvas</span>
            <span>•</span>
            <span className="text-slate-300 capitalize">{mode} Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Credit Wallet Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1A231F] border border-[#293831] text-xs">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-extrabold text-emerald-400 font-mono">{credits.availableBalance}</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Credits</span>
            <Link
              href="/pricing"
              className="ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[10px] transition-colors"
            >
              Top Up
            </Link>
          </div>

          {/* History Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHistory
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-[#1A231F] border-[#293831] text-slate-300 hover:text-white hover:bg-[#222E29]'
            }`}
          >
            <History className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">History</span>
            {historyJobs.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] flex items-center justify-center font-mono">
                {historyJobs.length}
              </span>
            )}
          </button>

          {/* User Nav / Dashboard */}
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* 2. MAIN CREATIVE WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 relative">
        {/* LEFT COMPACT TOOLBAR (Mode Switcher) */}
        <aside className="w-full lg:w-20 bg-[#0E1512] border-b lg:border-b-0 lg:border-r border-[#293831] p-2 lg:py-6 flex lg:flex-col items-center justify-around lg:justify-start gap-2 shrink-0 z-20">
          <button
            type="button"
            onClick={() => handleModeSelect('video')}
            className={`p-2.5 lg:w-14 lg:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'video'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Text-to-Video Engine"
          >
            <Video className="w-5 h-5" />
            <span className="text-[10px] font-bold">Video</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSelect('image')}
            className={`p-2.5 lg:w-14 lg:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'image'
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40 shadow-lg shadow-pink-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Gemini & Flux Image Studio"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Image</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSelect('reels')}
            className={`p-2.5 lg:w-14 lg:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'reels'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-lg shadow-teal-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="AI Vertical Reels"
          >
            <Film className="w-5 h-5" />
            <span className="text-[10px] font-bold">Reels</span>
          </button>

          <button
            type="button"
            onClick={() => handleModeSelect('audio')}
            className={`p-2.5 lg:w-14 lg:h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mode === 'audio'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="ElevenLabs Neural Voice"
          >
            <Mic className="w-5 h-5" />
            <span className="text-[10px] font-bold">Voice</span>
          </button>
        </aside>

        {/* CENTER & RIGHT: Studio Canvas (Prompt + Viewport) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          {/* LEFT COLUMN: Prompt & Generation Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
                {errorMsg.toLowerCase().includes('insufficient') && (
                  <Link
                    href="/pricing"
                    className="px-2.5 py-1 bg-emerald-500 text-white font-bold rounded-lg text-[11px] shrink-0"
                  >
                    Top Up
                  </Link>
                )}
              </div>
            )}

            {/* Prompt Composer Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#121A16] border border-[#293831] shadow-2xl relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#293831]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-white text-sm">Creative Prompt</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !prompt.trim()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    <span>{isEnhancing ? 'Enhancing...' : 'Enhance with Gemini'}</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-500">{prompt.length} chars</span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene in detail: subject, lighting, mood, camera trajectory, optics, color grading..."
                className="w-full p-4 rounded-2xl bg-[#1A231F] border border-[#293831] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 text-sm sm:text-base text-white placeholder:text-slate-500 outline-none resize-none leading-relaxed shadow-inner"
              />

              {/* Sample Prompts Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SAMPLE_PROMPTS.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(sp)}
                    className="text-[11px] text-slate-400 hover:text-emerald-300 bg-[#1A231F] hover:bg-[#222E29] border border-[#293831] rounded-lg px-2.5 py-1 text-left transition-all truncate max-w-full cursor-pointer"
                    title={sp}
                  >
                    💡 {sp.slice(0, 38)}...
                  </button>
                ))}
              </div>

              {/* Reference Image Container (if added) */}
              {referenceUrl && (
                <div className="p-2.5 rounded-xl bg-[#1A231F] border border-[#293831] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={referenceUrl}
                      alt="Reference"
                      className="w-10 h-10 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-200 block truncate text-xs">{referenceFileName || 'Reference Asset'}</span>
                      <span className="text-[10px] text-emerald-400">Conditioning image attached</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceUrl('');
                      setReferenceFileName('');
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Parameters & Configuration Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#121A16] border border-[#293831] shadow-xl space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AI Foundation Model */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                    AI Foundation Engine
                  </label>
                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-white text-xs font-semibold outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {MODELS.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#121A16] text-white">
                        {m.name} ({m.cost} credits) • {m.badge}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reference Image Upload */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                    Visual Reference
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
                    className="w-full p-2.5 rounded-xl bg-[#1A231F] hover:bg-[#222E29] border border-[#293831] text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{referenceUrl ? 'Replace Image' : 'Upload Image Reference'}</span>
                  </button>
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-[#1A231F] border border-[#293831]">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setAspectRatio(r.id)}
                      className={`py-2 rounded-lg font-bold text-center transition-all cursor-pointer text-xs ${
                        aspectRatio === r.id
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Specific: Duration Slider & Camera Motion */}
              {mode !== 'image' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#293831]">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                        Duration: {durationSec} seconds
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Max 15s</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={15}
                      step={5}
                      value={durationSec}
                      onChange={(e) => setDurationSec(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>5s Standard</span>
                      <span>10s Extended</span>
                      <span>15s Narrative</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1.5">
                      Camera Trajectory
                    </label>
                    <select
                      value={cameraMotion}
                      onChange={(e) => setCameraMotion(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-white text-xs font-semibold outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {CAMERA_PRESETS.map((c) => (
                        <option key={c} value={c} className="bg-[#121A16] text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Negative Prompt Field */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 font-bold mb-1">
                  Negative Prompt (Optional)
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted anatomy, low quality, artifacts, watermark"
                  className="w-full p-2.5 rounded-xl bg-[#1A231F] border border-[#293831] text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between p-4 rounded-3xl bg-[#121A16] border border-[#293831] shadow-xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Estimated Cost:</span>
                <span className="font-extrabold text-white text-sm font-mono">{estimatedCost} Credits</span>
                <span className="text-[11px] text-slate-500">({credits.availableBalance} available)</span>
              </div>

              <button
                type="button"
                onClick={handleStartGeneration}
                disabled={isSubmitting || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Dispatch Generation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Inference Monitor & Media Viewer (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#121A16] border border-[#293831] min-h-[500px] flex flex-col justify-between shadow-2xl relative">
              <div>
                {/* Header of Viewport */}
                <div className="flex items-center justify-between border-b border-[#293831] pb-3 mb-4 text-xs">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-emerald-400" />
                    <span>Cinema Viewport & Inference Monitor</span>
                  </h3>
                  {activeJob?.status && (
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                        activeJob.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : activeJob.status === 'failed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-teal-500/20 text-teal-300 border border-teal-500/30 animate-pulse'
                      }`}
                    >
                      {activeJob.status}
                    </span>
                  )}
                </div>

                {/* Viewport Display */}
                {!activeJob ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-[#1A231F] border border-[#293831] flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs mx-auto">
                      <h4 className="font-extrabold text-white text-base">Inference Ready</h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        Enter your creative prompt and press &ldquo;Dispatch Generation&rdquo; to synthesize media on our GPU cluster.
                      </p>
                    </div>
                  </div>
                ) : activeJob.status === 'queued' || activeJob.status === 'processing' ? (
                  <div className="py-16 text-center space-y-5">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="w-16 h-16 rounded-full border-3 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                      <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto" />
                    </div>

                    <div>
                      <h4 className="font-extrabold text-white text-base">
                        {activeJob.status === 'queued' ? 'Dispatched to Priority Queue' : 'Synthesizing Neural Latent Space'}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                        {activeJob.progressMessage || 'Processing frame latent variables...'}
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto w-full">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{activeJob.progressPercent || 35}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#1A231F] rounded-full overflow-hidden border border-[#293831]">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${activeJob.progressPercent || 35}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25 inline-block font-bold">
                      Atomic Reservation: {activeJob.reservedCredits} credits locked
                    </div>
                  </div>
                ) : activeJob.status === 'completed' ? (
                  <div className="space-y-4">
                    {/* Media Output Box */}
                    <div
                      className={`w-full rounded-2xl overflow-hidden bg-[#080D0B] relative border border-emerald-500/30 group shadow-2xl flex items-center justify-center ${
                        aspectRatio === '1:1'
                          ? 'aspect-square'
                          : aspectRatio === '9:16'
                          ? 'aspect-[9/16] max-h-[420px] mx-auto'
                          : 'aspect-video'
                      }`}
                    >
                      {activeJob.output?.videoUrl ? (
                        <video
                          src={activeJob.output.videoUrl}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : activeJob.output?.imageUrl ? (
                        <img
                          src={activeJob.output.imageUrl}
                          alt="Generated AI Visual"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400">
                          Narration generated and registered to workspace.
                        </div>
                      )}

                      {/* Demo mode indicator if applicable */}
                      {activeJob.output?.isDemoSimulated && (
                        <span className="absolute top-2.5 left-2.5 bg-amber-400/90 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                          Demo Mode
                        </span>
                      )}
                    </div>

                    {/* Output Succeeded Bar */}
                    <div className="p-3.5 rounded-2xl bg-[#1A231F] border border-[#293831] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Generation Succeeded</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          Settled {activeJob.actualCredits} credits • Lossless export
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyPrompt}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                          title="Copy Prompt"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                    <h4 className="font-extrabold text-white text-base">Generation Failed</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      {activeJob.errorMessage || 'An error occurred during GPU inference.'}
                    </p>
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25 inline-block font-bold">
                      Compensating Refund Applied: +{activeJob.reservedCredits} credits returned to wallet
                    </div>
                  </div>
                )}
              </div>

              {/* Viewport Footer info */}
              <div className="pt-3 border-t border-[#293831] text-[11px] text-slate-500 flex justify-between font-mono">
                <span>Fluvia Neural Engine</span>
                <span>Latency: ~1.2s</span>
              </div>
            </div>
          </div>
        </main>

        {/* 3. GENERATION HISTORY SLIDE-OVER DRAWER */}
        {showHistory && (
          <aside className="w-full lg:w-80 bg-[#121A16] border-t lg:border-t-0 lg:border-l border-[#293831] p-4 lg:p-6 flex flex-col justify-between shrink-0 z-30 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#293831] mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-sm">Recent Generations</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {historyJobs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  No previous generations in this workspace yet.
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-1">
                  {historyJobs.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveJob(item)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                        activeJob?.id === item.id
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                          : 'bg-[#1A231F] border-[#293831] text-slate-300 hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#080D0B] overflow-hidden shrink-0 flex items-center justify-center">
                        {item.output?.imageUrl ? (
                          <img src={item.output.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        ) : item.output?.videoUrl ? (
                          <video src={item.output.videoUrl} className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-5 h-5 text-emerald-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                            {item.modelId?.split('-')[0] || 'AI'}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs truncate font-medium text-slate-200 mt-0.5">
                          {item.input?.prompt || 'Generated creative'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#293831]">
              <Link
                href="/dashboard/assets"
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Asset Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default function CreateWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080D0B] text-slate-300 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateWorkspaceContent />
    </Suspense>
  );
}
