'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Film,
  Video,
  Play,
  Pause,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Palette,
  Mic,
  Music,
  Maximize2,
  ChevronRight,
  Zap,
  Key,
  ShieldCheck,
  RefreshCw,
  Sliders,
  Tv,
  Smartphone,
  Square,
  Lock,
  ArrowRight,
  Tag,
  Info,
  SlidersHorizontal,
  Scissors,
  Volume2,
  Radio,
  Eye,
  Check,
} from 'lucide-react';
import {
  VOX_STYLES,
  VOX_NARRATIVE_ARCS,
  VOX_VOICES,
  VOX_BGM_MOODS,
  SAMPLE_SHOWCASE_PROJECTS,
  VoxBeat,
} from '@/lib/ai/vox-motion-constants';
import { VoxProjectResult } from '@/lib/ai/vox-motion-service';

export function VoxMotionGraphicsStudio() {
  const router = useRouter();

  // Inputs
  const [topic, setTopic] = useState('How the Semiconductor Chip Built Modern Civilization');
  const [mode, setMode] = useState<'broll' | 'croll' | 'aroll'>('broll');
  const [selectedStyleId, setSelectedStyleId] = useState('modern-flat');
  const [selectedArcId, setSelectedArcId] = useState('timeline');
  const [selectedVoiceId, setSelectedVoiceId] = useState('male-vox');
  const [selectedBgmMoodId, setSelectedBgmMoodId] = useState('investigative');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [anchorPhotoUrl, setAnchorPhotoUrl] = useState('');

  // Status & Free Tries
  const [remainingFreeTries, setRemainingFreeTries] = useState<number>(2);
  const [maxFreeTries, setMaxFreeTries] = useState<number>(2);
  const [usedCount, setUsedCount] = useState<number>(0);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [planName, setPlanName] = useState<string>('Free Explorer');
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [generatedProject, setGeneratedProject] = useState<VoxProjectResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [customMuApiKey, setCustomMuApiKey] = useState<string>('');

  // Active Beat Preview
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch initial status and tries
  const fetchStatus = async () => {
    try {
      setIsLoadingStatus(true);
      const res = await fetch('/api/ai/vox-motion/status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRemainingFreeTries(data.remainingFreeTries);
          setMaxFreeTries(data.maxFreeTries);
          setUsedCount(data.usedCount);
          setIsPaid(data.isPaid);
          if (data.planName) setPlanName(data.planName);
        }
      }
    } catch (err) {
      console.error('Failed to load Vox status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    try {
      const savedKey = localStorage.getItem('fluvia_muapi_key');
      if (savedKey) setCustomMuApiKey(savedKey);
    } catch {}
  }, []);

  const handleSaveMuKey = (key: string) => {
    setCustomMuApiKey(key);
    try {
      if (key) {
        localStorage.setItem('fluvia_muapi_key', key);
      } else {
        localStorage.removeItem('fluvia_muapi_key');
      }
    } catch {}
    setShowKeyModal(false);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMsg('Please enter a topic or concept for your explainer video.');
      return;
    }

    if (mode === 'croll' && !anchorPhotoUrl.trim()) {
      setErrorMsg('Please enter a product photo URL for C-Roll product animation.');
      return;
    }

    if (!isPaid && remainingFreeTries <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setGenerationStep('Synthesizing 4-Beat Story Arc & Scissor Cutouts...');

    const timer1 = setTimeout(() => {
      setGenerationStep('Assembling Paper-Collage Visual Layers & Halftone Textures...');
    }, 2800);

    const timer2 = setTimeout(() => {
      setGenerationStep('Rendering 60fps Living Posters & Syncing Audio Waves...');
    }, 5500);

    try {
      const res = await fetch('/api/ai/vox-motion/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          mode,
          styleId: selectedStyleId,
          arcId: selectedArcId,
          voiceId: selectedVoiceId,
          bgmMoodId: selectedBgmMoodId,
          aspectRatio,
          anchorPhotoUrl: anchorPhotoUrl.trim() || undefined,
          customMuApiKey: customMuApiKey.trim() || undefined,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.code === 'FREE_TRIES_EXHAUSTED' || data.error?.includes('FREE_TRIES_EXHAUSTED')) {
          setRemainingFreeTries(0);
          setShowUpgradeModal(true);
        }
        throw new Error(data.error || 'Failed to generate Vox Motion Graphics video.');
      }

      setGeneratedProject(data.project);
      setRemainingFreeTries(data.project.remainingFreeTries);
      setActiveBeatIndex(0);
      setIsPlayingVideo(true);

      // Trigger Celebration Confetti on Success
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.3 },
          colors: ['#8b5cf6', '#d4ff00', '#ff1f66', '#3b82f6'],
        });
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const sampleTopics = [
    'How the Semiconductor Chip Built Modern Civilization',
    'The Untold Story of How Instant Noodles Conquered Earth',
    'Why the Concorde Supersonic Jet Vanished from the Skies',
    'The Invisible Algorithm Deciding Your Next Purchase',
    'How Switzerland Became the Vault of the World',
  ];

  const currentStyle = VOX_STYLES.find((s) => s.id === selectedStyleId) || VOX_STYLES[0];
  const currentArc = VOX_NARRATIVE_ARCS.find((a) => a.id === selectedArcId) || VOX_NARRATIVE_ARCS[0];
  const currentVoice = VOX_VOICES.find((v) => v.id === selectedVoiceId) || VOX_VOICES[0];
  const currentBgm = VOX_BGM_MOODS.find((m) => m.id === selectedBgmMoodId) || VOX_BGM_MOODS[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#17191D]">
      {/* ========================================================================= */}
      {/* HERO BANNER & STATUS COUNTER */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white border-2 border-violet-500/40 shadow-xl overflow-hidden">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-pink-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl text-left">
            {/* Top Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-400/50 text-violet-300 text-[11px] font-black uppercase tracking-wider shadow-xs">
                <Scissors className="w-3.5 h-3.5 text-violet-400" />
                <span>Vox Motion Graphics Studio</span>
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                Paper-Collage Living Posters
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/40 font-bold">
                7 Authentic Styles • B-roll & C-roll
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Vox Explainer Motion Graphics Studio
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Turn any topic, news item, or product photo into viral paper-collage explainer videos with layered torn
              scissor cutouts, washi tape corners, halftone dots, and living poster motion.
            </p>
          </div>

          {/* Right Status Pill & CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* Remaining Free Tries Counter Card */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                  Generation Allowance
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {isPaid ? (
                    <span className="text-sm font-extrabold text-[#d4ff00] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>{planName} (Unlimited)</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-black ${
                          remainingFreeTries > 0 ? 'text-[#d4ff00]' : 'text-rose-400'
                        }`}
                      >
                        {remainingFreeTries} / {maxFreeTries}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">Free Tries Left</span>
                    </div>
                  )}
                </div>
              </div>

              {!isPaid && (
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Upgrade</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* BYOK or Advanced Settings Button */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/15 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-violet-400" />
              <span>{customMuApiKey ? 'MuAPI Key Connected' : 'Optional MuAPI Key'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-STEP PRODUCTION PIPELINE RIBBON */}
      {/* ========================================================================= */}
      <div className="p-2.5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { step: '1', title: 'Story Arc Beat Map', desc: currentArc.name, icon: Layers },
            { step: '2', title: 'Scissor Cutouts', desc: currentStyle.name, icon: Scissors },
            { step: '3', title: 'Voice & BGM Pace', desc: `${currentVoice.name} • ${currentBgm.bpm}`, icon: Radio },
            { step: '4', title: 'Living Motion Render', desc: `${aspectRatio} • 60fps`, icon: Film },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center gap-2.5 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-[#667085] block uppercase tracking-wider">
                    Step {item.step}
                  </span>
                  <p className="text-xs font-bold text-[#17191D] truncate">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN STUDIO WORKSPACE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        {/* LEFT COLUMN: Controls & Narrative Blueprint (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mode Selector (3 modalities) */}
          <div className="p-1.5 bg-[#F1F3F5] rounded-2xl flex items-center gap-1 border border-[#E5E7EB]">
            {[
              { id: 'broll', label: 'Topic B-Roll Explainer', desc: 'Narrative Story Arc & Collage' },
              { id: 'croll', label: 'Product C-Roll Anchor', desc: 'Sticker Cutout Product Animation' },
              { id: 'aroll', label: 'Presenter A-Roll Restyle', desc: 'Talking Head Paper Collage' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  mode === tab.id
                    ? 'bg-white text-violet-900 shadow-sm border border-violet-200'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-normal opacity-75 hidden sm:inline">{tab.desc}</span>
              </button>
            ))}
          </div>

          {/* Topic or Concept Input */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>What is your Vox explainer topic?</span>
              </label>
              <span className="text-[11px] text-[#667085]">AI drafts 4-beat narrative map</span>
            </div>

            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How the Semiconductor Chip Built Modern Civilization..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-[#17191D] placeholder:text-slate-400 outline-none transition-all resize-none bg-white"
            />

            {/* Quick Inspiration Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#667085]">Inspiration Topics:</span>
              <div className="flex flex-wrap gap-1.5">
                {sampleTopics.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(s)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F7F8FA] hover:bg-violet-50 hover:text-violet-900 border border-[#E5E7EB] text-[#475467] font-medium transition-colors text-left cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode C-roll photo input */}
            {mode === 'croll' && (
              <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
                <label className="text-xs font-bold text-[#17191D] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-violet-600" />
                  <span>Product Photo URL (Anchor cutout)</span>
                </label>
                <input
                  type="url"
                  value={anchorPhotoUrl}
                  onChange={(e) => setAnchorPhotoUrl(e.target.value)}
                  placeholder="https://example.com/product-isolated.png"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E7EB] text-xs font-medium focus:border-violet-600 outline-none bg-white text-[#17191D]"
                />
                <p className="text-[11px] text-[#667085]">
                  We isolate your product into an adhesive sticker cutout layered into the motion background.
                </p>
              </div>
            )}
          </div>

          {/* Style Selector (7 Vox Styles) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-violet-600" />
                <span>Paper-Collage Visual Style (7 Curated)</span>
              </label>
              <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
                {currentStyle.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VOX_STYLES.map((style) => {
                const isSelected = selectedStyleId === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-violet-600 bg-violet-50/70 shadow-sm ring-2 ring-violet-500/20'
                        : 'border-[#E5E7EB] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      {/* Swatch gradient preview */}
                      <div
                        className={`h-10 w-full rounded-lg bg-gradient-to-r ${style.previewGradient} border border-black/10 mb-2 flex items-center justify-center font-mono text-[10px] text-black font-black tracking-widest`}
                      >
                        VOX COLLAGE
                      </div>
                      <h4 className="text-xs font-extrabold text-[#17191D]">{style.name}</h4>
                      <p className="text-[10px] text-[#667085] line-clamp-2 mt-0.5 leading-snug">
                        {style.description}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 text-[#475467]">
                        {style.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narrative Arc & Pacing */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-600" />
                <span>Narrative Arc & Story Beat Pattern</span>
              </label>
              <span className="text-[11px] font-semibold text-[#667085]">4 Structured Beats</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VOX_NARRATIVE_ARCS.map((arc) => {
                const isSelected = selectedArcId === arc.id;
                return (
                  <button
                    key={arc.id}
                    type="button"
                    onClick={() => setSelectedArcId(arc.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-violet-600 bg-violet-50/70 shadow-sm ring-2 ring-violet-500/20'
                        : 'border-[#E5E7EB] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-extrabold text-[#17191D]">{arc.name}</h4>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />}
                    </div>
                    <p className="text-[10px] text-[#667085] leading-snug mb-2">{arc.description}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {arc.beatsPattern.map((b, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#F1F3F5] text-[#475467] font-semibold"
                        >
                          {i + 1}. {b}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio & Format Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Aspect Ratio */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-violet-600" />
                <span>Aspect Ratio</span>
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: '16:9', label: '16:9', icon: Tv, sub: 'YouTube' },
                  { id: '9:16', label: '9:16', icon: Smartphone, sub: 'Shorts' },
                  { id: '1:1', label: '1:1', icon: Square, sub: 'Square' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatio(item.id as any)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                      aspectRatio === item.id
                        ? 'bg-violet-600 text-white font-bold shadow-xs'
                        : 'bg-[#F7F8FA] hover:bg-slate-100 text-[#475467] font-medium'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-xs">{item.label}</span>
                    <span className="text-[9px] opacity-75">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Narrator with Live Soundwave Indicator */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-violet-600" />
                  <span>Voice Narrator</span>
                </label>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-violet-600 animate-sound-wave" />
                  <span className="w-0.5 h-2 bg-violet-600 animate-sound-wave" style={{ animationDelay: '0.2s' }} />
                  <span className="w-0.5 h-3 bg-violet-600 animate-sound-wave" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#17191D] bg-[#F7F8FA] focus:border-violet-600 outline-none"
              >
                {VOX_VOICES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.mood})
                  </option>
                ))}
              </select>
            </div>

            {/* BGM Mood */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-violet-600" />
                  <span>BGM Track Mood</span>
                </label>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-emerald-600 animate-sound-wave" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 h-3 bg-emerald-600 animate-sound-wave" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 h-1.5 bg-emerald-600 animate-sound-wave" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              <select
                value={selectedBgmMoodId}
                onChange={(e) => setSelectedBgmMoodId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#17191D] bg-[#F7F8FA] focus:border-violet-600 outline-none"
              >
                {VOX_BGM_MOODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.bpm})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="space-y-3 pt-2">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                {errorMsg.includes('FREE_TRIES_EXHAUSTED') && (
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold shrink-0 hover:bg-rose-700 cursor-pointer"
                  >
                    Upgrade Now
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white shadow-violet-500/25 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{generationStep || 'Generating Vox Motion Graphics...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    Generate Vox Motion Graphics (
                    {isPaid ? 'Unlimited Plan' : `${remainingFreeTries} Free Try Left`})
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#667085] px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>2 Free Tries Included • No Credit Card Required</span>
              </span>
              <span>1080p Broadcast • Scissor-Cut Texture Engine</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Living-Poster Player & Story Beat Map (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Video Screen */}
          <div className="bg-[#0B0F17] rounded-3xl p-5 border-2 border-violet-500/30 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {generatedProject ? 'Generated Explainer Motion' : 'Sample Broadcast Living Poster'}
                </h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-violet-300 border border-white/10 font-bold">
                {generatedProject ? `${generatedProject.aspectRatio} • ${generatedProject.styleName}` : '16:9 • Vox Modern Flat'}
              </span>
            </div>

            {/* Video Player Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-white/10 group">
              <video
                key={generatedProject ? generatedProject.finalVideoUrl : 'sample_video'}
                src={generatedProject ? generatedProject.finalVideoUrl : SAMPLE_SHOWCASE_PROJECTS[0].videoUrl}
                poster={
                  generatedProject
                    ? generatedProject.thumbnailUrl
                    : SAMPLE_SHOWCASE_PROJECTS[0].thumbnailUrl
                }
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d1fe17]" />
                <span>VOX PAPER COLLAGE</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <a
                  href={generatedProject ? generatedProject.finalVideoUrl : SAMPLE_SHOWCASE_PROJECTS[0].videoUrl}
                  download="vox_motion_graphics.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-violet-400" />
                  <span>Download MP4</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Share"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Duration: {generatedProject ? `${generatedProject.totalDurationSec.toFixed(1)}s` : '20.0s'}
              </span>
            </div>
          </div>

          {/* Structured Story Beat Map (Keyframes) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-600" />
                <span>Story Beat Map & Script Keyframes</span>
              </h3>
              <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                4 Keyframe Beats
              </span>
            </div>

            {/* Beat Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#F1F3F5] rounded-xl">
              {(generatedProject?.beats || [
                { beatNumber: 1, label: 'The Hook', headline: 'ORIGINS' },
                { beatNumber: 2, label: 'Turning Point', headline: 'THE SHIFT' },
                { beatNumber: 3, label: 'Breakthrough', headline: 'DISCOVERY' },
                { beatNumber: 4, label: 'Modern Impact', headline: 'THE LEGACY' },
              ]).map((beat: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveBeatIndex(idx)}
                  className={`py-1.5 text-center rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeBeatIndex === idx
                      ? 'bg-white text-violet-900 shadow-2xs border border-violet-200'
                      : 'text-[#667085] hover:text-[#17191D]'
                  }`}
                >
                  Beat {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Beat Details Card */}
            {(() => {
              const activeBeat =
                generatedProject?.beats[activeBeatIndex] || {
                  beatNumber: activeBeatIndex + 1,
                  label: currentArc.beatsPattern[activeBeatIndex] || `Beat ${activeBeatIndex + 1}`,
                  headline: 'THE SILICON BREAKTHROUGH',
                  script:
                    'To understand how modern computing conquered the world, we have to look back to the moment pure sand was transformed into silicon logic.',
                  visualDescription:
                    'Hand-cut paper schematic illustration with vintage newspaper clippings and torn edges.',
                  accentDetails: 'washi tape corners, newsprint scrap, halftone dots',
                  posterUrl: SAMPLE_SHOWCASE_PROJECTS[activeBeatIndex % SAMPLE_SHOWCASE_PROJECTS.length].thumbnailUrl,
                };

              return (
                <div className="p-4 rounded-xl border border-violet-200 bg-violet-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-violet-700 px-2 py-0.5 rounded bg-violet-100 border border-violet-300">
                      Beat {activeBeat.beatNumber} • {activeBeat.label}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {activeBeat.headline}
                    </span>
                  </div>

                  {/* Collage Keyframe Poster Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-black/10 bg-slate-100 shadow-inner">
                    <img
                      src={activeBeat.posterUrl || SAMPLE_SHOWCASE_PROJECTS[0].thumbnailUrl}
                      alt={activeBeat.headline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/20 text-white text-[11px] font-medium leading-snug">
                      "{activeBeat.script}"
                    </div>
                  </div>

                  <div className="text-[11px] text-[#475467] space-y-1">
                    <p>
                      <strong className="text-[#17191D]">Collage Elements:</strong>{' '}
                      {activeBeat.accentDetails}
                    </p>
                    <p className="text-[10px] text-[#667085] italic">
                      {activeBeat.visualDescription}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UPGRADE MODAL (STRICT 2 FREE TRIES ENFORCEMENT) */}
      {/* ========================================================================= */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-2 border-violet-500 shadow-2xl relative space-y-6 text-left">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#17191D] tracking-tight">
                You've used your 2 Free Vox Motion Graphics generations!
              </h3>
              <p className="text-xs sm:text-sm text-[#475467] leading-relaxed">
                Upgrade to a Pro, Max, or Teams plan to unlock unlimited living posters, Full HD 1080p / 4K resolution,
                all 7 paper-collage styles, and commercial rights.
              </p>
            </div>

            {/* Plan comparison mini-table */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Free Trial
                </span>
                <div className="text-lg font-black text-slate-900">$0</div>
                <ul className="text-[11px] text-[#475467] space-y-1">
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>2 Free Tries (Exhausted)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Standard resolution</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl border-2 border-violet-500 bg-violet-50/50 space-y-2 relative">
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-violet-600 text-white text-[9px] font-black uppercase">
                  Recommended
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-900">
                  Pro Plan
                </span>
                <div className="text-lg font-black text-violet-950">
                  $23 <span className="text-xs font-normal text-slate-500">/mo</span>
                </div>
                <ul className="text-[11px] text-[#475467] space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>50 Vox Motion Gens / mo</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full HD 1080p Broadcast</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>All 7 Paper-Collage Styles</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/checkout?type=subscription&id=plan_creator&interval=year"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm text-center shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Pro ($23/mo - 21% OFF)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#17191D] font-bold text-xs text-center transition-all cursor-pointer"
              >
                View All Plans
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BYOK / MUAPI KEY MODAL */}
      {/* ========================================================================= */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-slate-300 shadow-2xl relative space-y-4 text-left">
            <button
              type="button"
              onClick={() => setShowKeyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-2">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#17191D]">Configure MuAPI / BYOK Key</h3>
              <p className="text-xs text-[#475467] leading-relaxed">
                Connect your custom MuAPI key from <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">muapi.ai</code> to route directly through your personal generation quota.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17191D]">MuAPI Secret Key</label>
              <input
                type="password"
                value={customMuApiKey}
                onChange={(e) => setCustomMuApiKey(e.target.value)}
                placeholder="mu_live_..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#E5E7EB] focus:border-violet-600 outline-none text-xs font-mono text-[#17191D] bg-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSaveMuKey(customMuApiKey)}
                className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Save Key
              </button>
              {customMuApiKey && (
                <button
                  type="button"
                  onClick={() => handleSaveMuKey('')}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
