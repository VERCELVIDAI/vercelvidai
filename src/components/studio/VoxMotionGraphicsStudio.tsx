'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Copy,
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
          colors: ['#a855f7', '#d1fe17', '#ff1f66', '#3b82f6'],
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white relative">
      {/* Ambient Moving Aurora Lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] animate-pulse-glass" />
        <div
          className="absolute top-1/3 -right-28 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[160px] animate-pulse-glass"
          style={{ animationDelay: '2.5s' }}
        />
        <div
          className="absolute bottom-1/4 -left-28 w-[500px] h-[500px] bg-[#d4ff00]/5 rounded-full blur-[160px] animate-pulse-glass"
          style={{ animationDelay: '5s' }}
        />
      </div>

      {/* ========================================================================= */}
      {/* HERO BANNER & STATUS COUNTER */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl p-6 sm:p-8 bg-[#0E121B]/95 text-white border-2 border-violet-500/40 shadow-[0_0_40px_rgba(139,92,246,0.18)] backdrop-blur-xl overflow-hidden"
      >
        {/* Subtle Cyber Latent Accent */}
        <div className="absolute top-4 right-6 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-[10px] font-mono font-black uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.25)] pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span>VOX ENGINE • 60FPS LATENT SYNTHESIS</span>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl text-left">
            {/* Top Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-400/50 text-violet-300 text-[11px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                <Scissors className="w-3.5 h-3.5 text-violet-400" />
                <span>Vox Motion Graphics Studio</span>
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                Paper-Collage Living Posters
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/40 font-bold">
                7 Styles • B-roll & C-roll
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Vox Explainer Motion Graphics Suite
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Turn any topic, news item, or product photo into viral paper-collage explainer videos with layered torn
              scissor cutouts, washi tape corners, halftone dots, and living poster motion.
            </p>
          </div>

          {/* Right Status Pill & CTA */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            {/* Remaining Free Tries Counter Card */}
            <div className="p-4 rounded-2xl bg-[#141A26] border border-slate-700/80 backdrop-blur-md flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
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
                  className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center gap-1 shrink-0 cursor-pointer"
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
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-violet-400" />
              <span>{customMuApiKey ? 'MuAPI Key Connected' : 'Optional MuAPI Key'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 4-STEP PRODUCTION PIPELINE RIBBON */}
      {/* ========================================================================= */}
      <div className="p-3 rounded-2xl bg-[#0E121B]/80 border border-slate-800 backdrop-blur-md">
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
                className="p-2.5 rounded-xl bg-[#141A26]/60 border border-slate-800/80 flex items-center gap-2.5 text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                    Step {item.step}
                  </span>
                  <p className="text-xs font-bold text-white truncate">{item.title}</p>
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
          <div className="p-1.5 bg-[#101522] rounded-2xl flex items-center gap-1 border border-slate-800">
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
                    ? 'bg-[#1C2538] text-white shadow-sm border border-violet-500/50 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-normal opacity-75 hidden sm:inline">{tab.desc}</span>
              </button>
            ))}
          </div>

          {/* Topic or Concept Input */}
          <div className="bg-[#0E121B]/95 p-6 rounded-2xl border-2 border-slate-800 hover:border-slate-700 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>What is your Vox explainer topic?</span>
              </label>
              <span className="text-[11px] text-slate-400">AI drafts 4-beat narrative map</span>
            </div>

            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How the Semiconductor Chip Built Modern Civilization..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-sm font-medium text-white placeholder:text-slate-500 bg-[#141A26] outline-none transition-all resize-none"
            />

            {/* Quick Inspiration Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Inspiration Topics:</span>
              <div className="flex flex-wrap gap-1.5">
                {sampleTopics.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTopic(s)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#141A26] hover:bg-violet-950/60 hover:text-violet-300 border border-slate-800 text-slate-300 font-medium transition-colors text-left cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode C-roll photo input */}
            {mode === 'croll' && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-violet-400" />
                  <span>Product Photo URL (Anchor cutout)</span>
                </label>
                <input
                  type="url"
                  value={anchorPhotoUrl}
                  onChange={(e) => setAnchorPhotoUrl(e.target.value)}
                  placeholder="https://example.com/product-isolated.png"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-medium text-white bg-[#141A26] focus:border-violet-500 outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  We isolate your product into an adhesive sticker cutout layered into the motion background.
                </p>
              </div>
            )}
          </div>

          {/* Style Selector (7 Vox Styles) */}
          <div className="bg-[#0E121B]/95 p-6 rounded-2xl border-2 border-slate-800 hover:border-slate-700 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-violet-400" />
                <span>Paper-Collage Visual Style (7 Curated)</span>
              </label>
              <span className="text-xs font-bold text-violet-300 bg-violet-950/80 px-2 py-0.5 rounded-md border border-violet-500/40">
                {currentStyle.badge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VOX_STYLES.map((style) => {
                const isSelected = selectedStyleId === style.id;
                return (
                  <motion.button
                    key={style.id}
                    type="button"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-violet-500 bg-violet-950/40 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-1 ring-violet-500/40'
                        : 'border-slate-800 hover:border-slate-700 bg-[#141A26]/70'
                    }`}
                  >
                    <div>
                      {/* Swatch gradient preview */}
                      <div
                        className={`h-10 w-full rounded-lg bg-gradient-to-r ${style.previewGradient} border border-white/10 mb-2 flex items-center justify-center font-mono text-[10px] text-black font-black tracking-widest shadow-xs`}
                      >
                        VOX COLLAGE
                      </div>
                      <h4 className="text-xs font-extrabold text-white">{style.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {style.description}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 text-slate-300 border border-white/5">
                        {style.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-violet-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Narrative Arc & Pacing */}
          <div className="bg-[#0E121B]/95 p-6 rounded-2xl border-2 border-slate-800 hover:border-slate-700 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Narrative Arc & Story Beat Pattern</span>
              </label>
              <span className="text-[11px] font-semibold text-slate-400">4 Structured Beats</span>
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
                        ? 'border-violet-500 bg-violet-950/40 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-1 ring-violet-500/40'
                        : 'border-slate-800 hover:border-slate-700 bg-[#141A26]/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-extrabold text-white">{arc.name}</h4>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug mb-2">{arc.description}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {arc.beatsPattern.map((b, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300 font-semibold border border-white/5"
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
            <div className="bg-[#0E121B]/95 p-4 rounded-2xl border-2 border-slate-800 shadow-xl space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-violet-400" />
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
                        ? 'bg-violet-600 text-white font-black shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                        : 'bg-[#141A26] hover:bg-slate-800 text-slate-400 font-medium'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-xs">{item.label}</span>
                    <span className="text-[9px] opacity-75">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Narrator with Live Audio Wave Animation */}
            <div className="bg-[#0E121B]/95 p-4 rounded-2xl border-2 border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-violet-400" />
                  <span>Voice Narrator</span>
                </label>
                {/* Live soundwave animation */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-violet-400 animate-sound-wave" />
                  <span className="w-0.5 h-2 bg-violet-400 animate-sound-wave" style={{ animationDelay: '0.2s' }} />
                  <span className="w-0.5 h-3 bg-violet-400 animate-sound-wave" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
              <select
                value={selectedVoiceId}
                onChange={(e) => setSelectedVoiceId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-white bg-[#141A26] focus:border-violet-500 outline-none"
              >
                {VOX_VOICES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#0E121B] text-white">
                    {v.name} ({v.mood})
                  </option>
                ))}
              </select>
            </div>

            {/* BGM Mood */}
            <div className="bg-[#0E121B]/95 p-4 rounded-2xl border-2 border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-violet-400" />
                  <span>BGM Track Mood</span>
                </label>
                {/* Live soundwave animation */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-[#d4ff00] animate-sound-wave" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 h-3 bg-[#d4ff00] animate-sound-wave" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 h-1.5 bg-[#d4ff00] animate-sound-wave" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              <select
                value={selectedBgmMoodId}
                onChange={(e) => setSelectedBgmMoodId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-white bg-[#141A26] focus:border-violet-500 outline-none"
              >
                {VOX_BGM_MOODS.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0E121B] text-white">
                    {m.name} ({m.bpm})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="space-y-3 pt-2">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                {errorMsg.includes('FREE_TRIES_EXHAUSTED') && (
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-black shrink-0 hover:bg-rose-500 cursor-pointer shadow-xs"
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
              className={`relative overflow-hidden group w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer ${
                isGenerating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white shadow-violet-500/35 hover:scale-[1.01]'
              }`}
            >
              {/* Shimmer sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-violet-300" />
                  <span>{generationStep || 'Generating Vox Motion Graphics...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-[#d4ff00]" />
                  <span>
                    Generate Vox Motion Graphics (
                    {isPaid ? 'Unlimited Plan' : `${remainingFreeTries} Free Try Left`})
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>2 Free Tries Included • No Credit Card Required</span>
              </span>
              <span>1080p Broadcast • Scissor-Cut Texture Engine</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Living-Poster Player & Story Beat Map (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Broadcast Monitor Frame */}
          <div className="bg-[#0E121B]/95 rounded-3xl p-5 border-2 border-violet-500/40 shadow-[0_0_45px_rgba(139,92,246,0.22)] backdrop-blur-xl text-white space-y-4">
            {/* Monitor Header HUD */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-black text-rose-400 uppercase tracking-wider">REC</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">00:00:20:00</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-slate-300 text-[10px]">
                  PRORES 422
                </span>
                <span className="px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-400/40 text-violet-300 font-bold text-[10px]">
                  1080p 60FPS
                </span>
              </div>
            </div>

            {/* Video Player Display with broadcast casing */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-slate-800 group shadow-2xl">
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
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
                <span>VOX PAPER COLLAGE</span>
              </div>

              {/* Crosshair accents on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute top-4 left-4 text-white/30 text-xs font-mono">+</div>
                <div className="absolute top-4 right-4 text-white/30 text-xs font-mono">+</div>
                <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono">+</div>
                <div className="absolute bottom-4 right-4 text-white/30 text-xs font-mono">+</div>
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
          <div className="bg-[#0E121B]/95 p-6 rounded-2xl border-2 border-slate-800 hover:border-slate-700 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-400" />
                <span>Story Beat Map & Script Keyframes</span>
              </h3>
              <span className="text-[11px] font-bold text-violet-300 bg-violet-950/80 border border-violet-500/40 px-2 py-0.5 rounded-md">
                4 Keyframe Beats
              </span>
            </div>

            {/* Beat Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#141A26] rounded-xl border border-slate-800">
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
                      ? 'bg-violet-600 text-white shadow-xs font-black'
                      : 'text-slate-400 hover:text-white'
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
                <div className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-violet-300 px-2 py-0.5 rounded bg-violet-950/80 border border-violet-400/40">
                      Beat {activeBeat.beatNumber} • {activeBeat.label}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {activeBeat.headline}
                    </span>
                  </div>

                  {/* Collage Keyframe Poster Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
                    <img
                      src={activeBeat.posterUrl || SAMPLE_SHOWCASE_PROJECTS[0].thumbnailUrl}
                      alt={activeBeat.headline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-md p-2 rounded-lg border border-white/20 text-white text-[11px] font-medium leading-snug">
                      "{activeBeat.script}"
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p>
                      <strong className="text-white">Collage Elements:</strong>{' '}
                      {activeBeat.accentDetails}
                    </p>
                    <p className="text-[10px] text-slate-400 italic">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0E121B] rounded-3xl max-w-xl w-full p-6 sm:p-8 border-2 border-violet-500 shadow-[0_0_60px_rgba(139,92,246,0.35)] relative space-y-6 text-left"
          >
            <button
              type="button"
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-violet-950/80 border border-violet-500/50 text-violet-300 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                You've used your 2 Free Vox Motion Graphics generations!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Upgrade to a Pro, Max, or Teams plan to unlock unlimited living posters, Full HD 1080p / 4K resolution,
                all 7 paper-collage styles, and commercial rights.
              </p>
            </div>

            {/* Plan comparison mini-table */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl border-2 border-slate-800 bg-[#141A26] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Free Trial
                </span>
                <div className="text-lg font-black text-white">$0</div>
                <ul className="text-[11px] text-slate-300 space-y-1">
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

              <div className="p-4 rounded-2xl border-2 border-violet-500/50 bg-[#121826] space-y-2 relative shadow-[0_0_25px_rgba(139,92,246,0.25)]">
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#ff1f66] text-white text-[9px] font-black uppercase shadow-xs">
                  Recommended
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  Pro Plan (20% OFF)
                </span>
                <div className="text-lg font-black text-white">
                  $24 <span className="text-xs font-normal text-slate-400">/mo (₹1,999)</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                    <span>50 Vox Motion Gens / mo</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                    <span>Full HD 1080p Broadcast</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                    <span>All 7 Paper-Collage Styles</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/checkout?type=subscription&id=plan_creator&interval=year"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-black text-xs sm:text-sm text-center shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-violet-400/30"
              >
                <span>Upgrade to Pro ($24/mo • 20% OFF)</span>
                <ArrowRight className="w-4 h-4 text-[#d4ff00]" />
              </Link>
              <Link
                href="/pricing"
                className="py-3.5 px-4 rounded-2xl bg-[#141A26] hover:bg-[#1C2538] text-white font-bold text-xs text-center transition-all cursor-pointer border border-slate-700"
              >
                View All Plans
              </Link>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BYOK / MUAPI KEY MODAL */}
      {/* ========================================================================= */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0E121B] rounded-3xl max-w-md w-full p-6 border-2 border-slate-700 shadow-2xl relative space-y-4 text-left"
          >
            <button
              type="button"
              onClick={() => setShowKeyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-500/50 text-violet-300 flex items-center justify-center mb-2">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Configure MuAPI / BYOK Key</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your custom MuAPI key from <code className="bg-slate-800 px-1 py-0.5 rounded text-[11px] text-violet-300">muapi.ai</code> to route directly through your personal generation quota.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white">MuAPI Secret Key</label>
              <input
                type="password"
                value={customMuApiKey}
                onChange={(e) => setCustomMuApiKey(e.target.value)}
                placeholder="mu_live_..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-800 focus:border-violet-500 outline-none text-xs font-mono text-white bg-[#141A26]"
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
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                >
                  Clear Key
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
