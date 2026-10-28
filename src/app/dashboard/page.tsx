'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { GoogleVidsCard } from '@/components/dashboard/GoogleVidsCard';
import { GoogleVidsPromoPopup } from '@/components/dashboard/GoogleVidsPromoPopup';
import {
  ALL_CURATED_TEMPLATES,
  VIDEO_TEMPLATES,
  IMAGE_TEMPLATES,
  TEXT_ANIMATION_TEMPLATES,
  CreativeTemplate,
} from '@/lib/templates';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Plus,
  Play,
  Clock,
  Star,
  Copy,
  Trash2,
  Download,
  Edit2,
  FolderOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Volume2,
  Layers,
  ShieldCheck,
  Check,
  RotateCcw,
  Sliders,
  Globe,
  ChevronRight,
  Info,
  Headphones,
  Maximize2,
  Film,
  Camera,
  Layers3,
  SlidersHorizontal,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Quick Command Deck Mode
  const [quickMode, setQuickMode] = useState<'video' | 'audio' | 'image' | 'vids'>('video');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickAspect, setQuickAspect] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [selectedVoice, setSelectedVoice] = useState('Roger');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioPreviewObj, setAudioPreviewObj] = useState<HTMLAudioElement | null>(null);
  const [copiedVidsPrompt, setCopiedVidsPrompt] = useState(false);

  // Template filter tab
  const [templateTab, setTemplateTab] = useState<'all' | 'video' | 'image' | 'text'>('all');

  // Modal actions
  const [renameModal, setRenameModal] = useState<{ id: string; title: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

  // Active showcase video
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  const FEATURED_SHOWCASE = [
    {
      title: 'AeroGT Hypercar Launch Film',
      category: 'Cinematic Automotive',
      aspect: '16:9',
      videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
      posterUrl: '/media/templates/poster-vid-05-automotive.jpg',
      prompt: 'Cinematic hypercar tracking shot through rain-slicked mountain switchback at dusk, anamorphic lens flares, ultra-realistic 4K reflection physics',
      credits: '15 cr',
    },
    {
      title: "Aura Privée — L'Élixir Noir Luxury Perfume",
      category: 'Product Commercial',
      aspect: '1:1',
      videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
      posterUrl: '/media/templates/poster-vid-01-perfume.jpg',
      prompt: 'Macro luxury perfume glass bottle hovering in deep obsidian void, liquid amber ripples, studio rim lighting, 4K commercial pacing',
      credits: '15 cr',
    },
    {
      title: 'Neon Shibuya Cyberpunk Night Drive',
      category: 'Social Media Reel',
      aspect: '9:16',
      videoUrl: '/media/templates/tmpl-14-instagram-reel.mp4',
      posterUrl: '/media/templates/poster-vid-04-fashion.jpg',
      prompt: 'Dynamic handheld camera through neon-lit rainy Tokyo crossing, reflections on wet asphalt, anamorphic blue flare, high energy 4K reel',
      credits: '15 cr',
    },
  ];

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const authRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (authRes.status === 401) {
        setIsRedirecting(true);
        router.push('/login?returnUrl=/dashboard');
        return;
      }
      if (!authRes.ok) {
        throw new Error('Failed to load profile and workspace data.');
      }
      const authData = await authRes.json();
      setData(authData);

      const [projRes, jobsRes] = await Promise.allSettled([
        fetch('/api/projects', { cache: 'no-store' }),
        fetch('/api/jobs', { cache: 'no-store' }),
      ]);

      if (projRes.status === 'fulfilled' && projRes.value.ok) {
        try {
          const p = await projRes.value.json();
          setProjects(p.projects || []);
        } catch {
          setProjects([]);
        }
      }

      if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
        try {
          const j = await jobsRes.value.json();
          setJobs(j.jobs || []);
        } catch {
          setJobs([]);
        }
      }
    } catch (err: any) {
      console.error('[Dashboard fetch error]:', err);
      setLoadError(err.message || 'Unable to connect to Fluvia Flow workspace.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Lock background scrolling when modal is active
  useEffect(() => {
    const isModalOpen = Boolean(renameModal || deleteModal);
    if (isModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [renameModal, deleteModal]);

  // Voice sample player
  const handleToggleVoiceSample = (sampleUrl: string, voiceName: string) => {
    if (playingVoice === voiceName && audioPreviewObj) {
      audioPreviewObj.pause();
      setPlayingVoice(null);
      return;
    }
    if (audioPreviewObj) {
      audioPreviewObj.pause();
    }
    const audio = new Audio(sampleUrl);
    audio.play().catch(() => {});
    setAudioPreviewObj(audio);
    setPlayingVoice(voiceName);
    audio.onended = () => {
      setPlayingVoice(null);
    };
  };

  // Launch Studio with prompt
  const handleLaunchServiceStudio = () => {
    if (quickMode === 'vids') {
      if (quickPrompt.trim()) {
        navigator.clipboard.writeText(quickPrompt.trim());
      }
      setCopiedVidsPrompt(true);
      setTimeout(() => setCopiedVidsPrompt(false), 3000);
      window.open('https://workspace.google.com/intl/en_in/products/vids/?from=gafb-drive_6806271-def-en_in', '_blank');
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.set('mode', quickMode);
    if (quickPrompt.trim()) {
      queryParams.set('prompt', quickPrompt.trim());
    }
    if (quickAspect) {
      queryParams.set('aspectRatio', quickAspect);
    }
    if (quickMode === 'audio' && selectedVoice) {
      queryParams.set('voice', selectedVoice);
    }

    router.push(`/create?${queryParams.toString()}`);
  };

  const handleToggleFavorite = async (projectId: string, currentFav: boolean) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentFav }),
      });
      fetchDashboardData();
    } catch (e) {}
  };

  const handleDuplicate = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      });
      fetchDashboardData();
    } catch (e) {}
  };

  const handleRenameConfirm = async () => {
    if (!renameModal) return;
    try {
      await fetch(`/api/projects/${renameModal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: renameModal.title }),
      });
      setRenameModal(null);
      fetchDashboardData();
    } catch (e) {}
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    try {
      await fetch(`/api/projects/${deleteModal.id}`, {
        method: 'DELETE',
      });
      setDeleteModal(null);
      fetchDashboardData();
    } catch (e) {}
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-[#090A0D] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-white">Session expired or sign in required</p>
          <span className="text-xs text-slate-400">Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen h-[100dvh] w-full bg-[#090A0D] flex text-slate-200 overflow-hidden">
        <div className="hidden md:block w-20 h-full shrink-0 border-r border-white/8 bg-[#0B0C10] p-3 space-y-4">
          <div className="h-10 w-10 bg-white/10 rounded-xl mx-auto animate-pulse" />
          <div className="space-y-3 pt-6">
            <div className="h-8 w-8 bg-white/5 rounded-xl mx-auto animate-pulse" />
            <div className="h-8 w-8 bg-white/5 rounded-xl mx-auto animate-pulse" />
            <div className="h-8 w-8 bg-white/5 rounded-xl mx-auto animate-pulse" />
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col p-8 space-y-6">
          <div className="h-8 w-64 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-96 w-full bg-white/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const user = data?.user || { displayName: 'Creator', role: 'creator' };
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = data?.subscription?.plan || { name: 'Free Explorer' };

  const voicePresets = [
    { name: 'Roger', gender: 'Male', accent: 'American', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3' },
    { name: 'Sarah', gender: 'Female', accent: 'American', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01d5ee42-5035-422a-9323-952302639e68.mp3' },
    { name: 'Laura', gender: 'Female', accent: 'American', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/673417e1-9544-4904-b962-cfd900ad4365.mp3' },
    { name: 'George', gender: 'Male', accent: 'British', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-ac34-a079f63e6b99.mp3' },
  ];

  const displayedTemplates =
    templateTab === 'all'
      ? ALL_CURATED_TEMPLATES.slice(0, 6)
      : templateTab === 'video'
      ? VIDEO_TEMPLATES.slice(0, 6)
      : templateTab === 'image'
      ? IMAGE_TEMPLATES.slice(0, 6)
      : TEXT_ANIMATION_TEMPLATES.slice(0, 6);

  const activeShowcase = FEATURED_SHOWCASE[showcaseIndex];

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-slate-100 bg-[#090A0D] relative">
      {/* Studio Nav Rail */}
      <Sidebar userRole={user.role} credits={credits} />

      {/* Main Viewport */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#090A0D]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 text-left min-w-0">
          
          {/* ========================================================================= */}
          {/* 1. TOP CREATIVE TELEMETRY DOCK */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0E1015] border border-white/8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Film className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-white tracking-tight">
                    Fluvia Creator Studio
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                    {plan.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Google DeepMind & Gemini Omni Flash inference ready • <strong className="text-white">{credits.availableBalance} credits</strong> in wallet
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/create"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 border border-white/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>Launch Cinema Studio</span>
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>Top Up</span>
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. MASTER CINEMA STAGE & QUICK COMMAND DECK (ASYMMETRICAL 2-COLUMN) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: MASTER CINEMA SCREEN (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0E1015] overflow-hidden shadow-2xl relative group">
              
              {/* Cinema Frame Screen */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <video
                  key={activeShowcase.videoUrl}
                  src={activeShowcase.videoUrl}
                  poster={activeShowcase.posterUrl}
                  controls
                  playsInline
                  loop
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white font-mono border border-white/15">
                    {activeShowcase.category}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    4K UHD • 15 cr
                  </span>
                </div>

                {/* Aspect Pill Overlay */}
                <div className="absolute top-3 right-3 pointer-events-none">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-slate-300 border border-white/15">
                    {activeShowcase.aspect}
                  </span>
                </div>
              </div>

              {/* Showcase Footer Strip */}
              <div className="p-4 sm:p-5 bg-gradient-to-t from-[#0E1015] via-[#0E1015]/90 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/8">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-black text-white truncate">
                    {activeShowcase.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    "{activeShowcase.prompt}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickPrompt(activeShowcase.prompt);
                      setQuickMode('video');
                      router.push(`/create?mode=video&prompt=${encodeURIComponent(activeShowcase.prompt)}`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fork Scene</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {FEATURED_SHOWCASE.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setShowcaseIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                          showcaseIndex === idx
                            ? 'bg-indigo-500 w-5'
                            : 'bg-white/20 hover:bg-white/40'
                        }`}
                        title={`Scene ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: DIRECTOR'S QUICK COMMAND CONSOLE (5 COLS) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-3xl border border-white/10 bg-[#0E1015] shadow-2xl space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      Command Console
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                    {quickMode === 'video' ? '15 Credits' : quickMode === 'audio' ? '2 Credits' : quickMode === 'image' ? '5 Credits' : '0 Credits'}
                  </span>
                </div>

                {/* Mode Switcher Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#090A0D] rounded-xl border border-white/8 text-xs mb-3">
                  <button
                    type="button"
                    onClick={() => setQuickMode('video')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      quickMode === 'video' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMode('audio')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      quickMode === 'audio' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Voice
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMode('image')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      quickMode === 'image' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickMode('vids')}
                    className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      quickMode === 'vids' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Vids (0 cr)
                  </button>
                </div>

                {/* Prompt Textarea */}
                <textarea
                  rows={3}
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder={
                    quickMode === 'video'
                      ? 'Describe your cinematic visual shot... (e.g. Luxury sports sedan driving through misty alpine pass at sunrise)'
                      : quickMode === 'audio'
                      ? 'Enter the narration script for ElevenLabs speech synthesis...'
                      : quickMode === 'image'
                      ? 'Describe the photorealistic subject, lighting, and camera lens...'
                      : 'Draft prompt to copy and handoff into Google Vids workspace...'
                  }
                  className="w-full bg-[#090A0D] text-white p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-indigo-500 placeholder-slate-500 text-xs leading-relaxed resize-none transition-colors"
                />

                {/* Parameters: Voice presets (if audio) or Aspect ratio (if visual) */}
                {quickMode === 'audio' ? (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      ElevenLabs Voice Preview
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {voicePresets.map((v) => (
                        <div
                          key={v.name}
                          onClick={() => setSelectedVoice(v.name)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedVoice === v.name
                              ? 'bg-amber-500/20 border-amber-500 text-white'
                              : 'bg-white/[0.02] border-white/8 hover:border-white/16 text-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold">{v.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleVoiceSample(v.sample, v.name);
                            }}
                            className={`p-1 rounded-full ${
                              playingVoice === v.name ? 'bg-amber-500 text-white' : 'text-amber-400 hover:bg-white/10'
                            }`}
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : quickMode !== 'vids' ? (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Aspect Ratio
                    </span>
                    <div className="flex items-center gap-1 bg-[#090A0D] p-1 rounded-xl border border-white/10 text-xs">
                      {(['16:9', '9:16', '1:1'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setQuickAspect(r)}
                          className={`px-2.5 py-0.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                            quickAspect === r
                              ? 'bg-white/[0.14] text-white shadow-xs border border-white/15'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 mt-2">
                    <p className="font-semibold">0 Fluvia Credits Charged</p>
                    <p className="text-[11px] text-blue-300/80 mt-0.5">
                      Copies prompt to clipboard and opens Google Vids in a new tab.
                    </p>
                  </div>
                )}
              </div>

              {/* Launch CTA */}
              <button
                type="button"
                onClick={handleLaunchServiceStudio}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>
                  {quickMode === 'vids'
                    ? copiedVidsPrompt
                      ? 'Copied & Opening Google Vids...'
                      : 'Launch Google Vids (0 cr)'
                    : 'Open in Creation Studio'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. ACTIVE CREATIVE PROJECTS (FILMSTRIP / VAULT) */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-indigo-400" />
                  <span>Your Projects & Rendered Iterations</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {projects.length} project files saved in your studio workspace
                </p>
              </div>

              <Link
                href="/dashboard/projects"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <span>View Full Library</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-10 rounded-3xl border border-white/8 bg-[#0E1015] text-center space-y-3">
                <Film className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="font-bold text-white text-sm">No Projects in Library</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Launch the Studio to synthesize your first cinematic commercial video.
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Creation</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl border border-white/8 bg-[#0E1015] hover:border-white/20 hover:bg-[#151822] transition-all flex flex-col justify-between space-y-3 group shadow-lg"
                  >
                    <div>
                      {/* Thumbnail with aspect */}
                      <div className="aspect-video w-full rounded-xl bg-black overflow-hidden relative border border-white/8 mb-2">
                        {p.thumbnailUrl || p.mediaUrl ? (
                          <img
                            src={p.thumbnailUrl || p.mediaUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <Film className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white border border-white/10">
                          {p.aspectRatio || '16:9'}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-xs truncate">{p.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(p.id, p.isFavorite)}
                          className="text-slate-400 hover:text-amber-400 cursor-pointer"
                        >
                          <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {new Date(p.updatedAt || p.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/8 text-xs">
                      <Link
                        href={`/editor/${p.id}`}
                        className="text-indigo-400 hover:text-indigo-300 font-bold text-[11px] flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Open Editor</span>
                      </Link>

                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          type="button"
                          onClick={() => setRenameModal({ id: p.id, title: p.title })}
                          title="Rename"
                          className="p-1 hover:text-white rounded cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p.id)}
                          title="Duplicate"
                          className="p-1 hover:text-white rounded cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ id: p.id, title: p.title })}
                          title="Delete"
                          className="p-1 hover:text-rose-400 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 4. CURATED DIRECTOR'S PRESETS (HORIZONTAL FILMSTRIP) */}
          {/* ========================================================================= */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Curated Agency Commercial Presets</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Ready-to-render luxury, automotive, and technology commercials with Gemini Omni Flash
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#0E1015] p-1 rounded-xl border border-white/8 text-xs self-start sm:self-auto">
                {(['all', 'video', 'image', 'text'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTemplateTab(tab)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      templateTab === tab
                        ? 'bg-white/[0.12] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTemplates.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl border border-white/8 bg-[#0E1015] hover:border-white/20 hover:bg-[#151822] transition-all flex flex-col justify-between space-y-3 group shadow-xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                        {t.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">15 Credits</span>
                    </div>

                    <h3 className="font-bold text-white text-xs group-hover:text-indigo-400 transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {t.prompt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/create?template=${t.id}`);
                    }}
                    className="w-full py-1.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/8 hover:border-indigo-500"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Use Template in Studio</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. GOOGLE VIDS WORKSPACE & PROMO POPUP INTEGRATION */}
          {/* ========================================================================= */}
          <div className="pt-2">
            <GoogleVidsCard />
            <GoogleVidsPromoPopup />
          </div>

        </main>
      </div>

      {/* RENAME MODAL */}
      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#0E1015] border border-white/15 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-sm">Rename Project</h3>
            <input
              type="text"
              value={renameModal.title}
              onChange={(e) => setRenameModal({ ...renameModal, title: e.target.value })}
              className="w-full bg-[#090A0D] text-white p-2.5 rounded-xl border border-white/15 text-xs focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRenameModal(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRenameConfirm}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#0E1015] border border-white/15 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-sm">Delete Project</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <strong className="text-white">"{deleteModal.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
