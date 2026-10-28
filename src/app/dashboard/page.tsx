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
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Quick Composer State (Unified across services)
  const [quickMode, setQuickMode] = useState<'video' | 'audio' | 'image' | 'vids'>('video');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Roger');
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [audioPreviewObj, setAudioPreviewObj] = useState<HTMLAudioElement | null>(null);
  const [copiedVidsPrompt, setCopiedVidsPrompt] = useState(false);

  // Template filter tab on dashboard
  const [templateTab, setTemplateTab] = useState<'all' | 'video' | 'image' | 'text'>('all');

  // Modal actions
  const [renameModal, setRenameModal] = useState<{ id: string; title: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

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

  // Lock background scrolling when rename or delete modal is active
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

  // Dispatch composer input to dedicated service studio
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
          <span className="text-xs text-slate-400">Redirecting to Fluvia Flow sign in...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen h-[100dvh] w-full bg-[#090A0D] flex text-slate-200 overflow-hidden">
        {/* Placeholder sidebar */}
        <div className="hidden md:block w-64 h-full shrink-0 border-r border-white/8 bg-[#0B0C10] p-4 space-y-4">
          <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-9 w-full bg-white/5 rounded-xl animate-pulse" />
            <div className="h-9 w-full bg-white/5 rounded-xl animate-pulse" />
            <div className="h-9 w-full bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Placeholder content */}
        <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
          <div className="h-16 border-b border-white/8 bg-[#090A0D] px-6 flex items-center justify-between">
            <div className="h-6 w-32 bg-white/10 rounded-md animate-pulse" />
            <div className="h-8 w-24 bg-indigo-500/20 rounded-full animate-pulse" />
          </div>
          <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div className="h-28 rounded-3xl bg-white/5 border border-white/8 animate-pulse" />
            <div className="h-32 rounded-2xl bg-[#11131A] border border-white/8 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
              <div className="h-48 rounded-2xl bg-[#11131A] border border-white/8 animate-pulse" />
              <div className="h-48 rounded-2xl bg-[#11131A] border border-white/8 animate-pulse" />
              <div className="h-48 rounded-2xl bg-[#11131A] border border-white/8 animate-pulse" />
              <div className="h-48 rounded-2xl bg-[#11131A] border border-white/8 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !data) {
    return (
      <div className="min-h-screen bg-[#090A0D] flex items-center justify-center p-4 text-slate-100">
        <div className="p-8 max-w-md w-full border border-rose-500/30 rounded-3xl shadow-2xl text-center space-y-4 bg-[#11131A]">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Unable to Load Creative Studio</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{loadError}</p>
          <div className="pt-2 flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => fetchDashboardData()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-all"
            >
              Sign In Again
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = data?.subscription?.plan || { name: 'Free Explorer' };

  // Sample voice presets for quick preview on dashboard
  const voicePresets = [
    { name: 'Roger', gender: 'Male', accent: 'American', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3' },
    { name: 'Sarah', gender: 'Female', accent: 'American', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01d5ee42-5035-422a-9323-952302639e68.mp3' },
    { name: 'Laura', gender: 'Female', accent: 'American', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/673417e1-9544-4904-b962-cfd900ad4365.mp3' },
    { name: 'George', gender: 'Male', accent: 'British', sample: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0721-4787-ac34-a079f63e6b99.mp3' },
  ];

  // Filter templates by active tab
  const displayedTemplates =
    templateTab === 'all'
      ? ALL_CURATED_TEMPLATES.slice(0, 6)
      : templateTab === 'video'
      ? VIDEO_TEMPLATES.slice(0, 6)
      : templateTab === 'image'
      ? IMAGE_TEMPLATES.slice(0, 6)
      : TEXT_ANIMATION_TEMPLATES.slice(0, 6);

  // Quick service rate indicator helper
  const getServiceCostPill = (mode: string) => {
    switch (mode) {
      case 'video':
        return { cost: '15 Credits', engine: 'Gemini Omni Flash', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
      case 'audio':
        return { cost: '2 Credits', engine: 'ElevenLabs HD', color: 'text-teal-800 bg-teal-100 border-teal-300' };
      case 'image':
        return { cost: '5 Credits', engine: 'Gemini 3.1 Flash', color: 'text-pink-700 bg-pink-100 border-pink-300' };
      case 'vids':
        return { cost: '0 Credits Charged', engine: 'Google Workspace', color: 'text-blue-800 bg-blue-100 border-blue-300' };
      default:
        return { cost: '15 Credits', engine: 'Gemini Omni Flash', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    }
  };

  const currentRate = getServiceCostPill(quickMode);

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-slate-100 bg-[#090A0D] relative">
      {/* Sidebar Navigation */}
      <Sidebar userRole={user.role} credits={credits} />

      {/* Main Content Viewport */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#090A0D]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10 text-left min-w-0">
          
          {/* 1. SERVICE TELEMETRY & WORKSPACE GREETING BANNER */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#11131A] via-[#151822] to-[#11131A] p-6 sm:p-8 border border-white/8 shadow-xl min-w-0">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                    Google Flow • {plan.name} Tier
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    Google DeepMind & Gemini Engines Online
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Google Flow Creative Studio
                </h1>

                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Welcome to Google Flow, {user.displayName || 'Creator'}! Your AI production workspace is ready with <strong className="text-white font-bold">{credits.availableBalance} credits</strong> available in your wallet.
                </p>

                {/* Service Rates Pill Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-slate-300 shadow-2xs font-semibold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Video: <strong className="text-white font-mono">15 cr</strong></span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-slate-300 shadow-2xs font-semibold flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    <span>Voiceover: <strong className="text-white font-mono">2 cr</strong></span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-slate-300 shadow-2xs font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                    <span>Image: <strong className="text-white font-mono">5 cr</strong></span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-slate-300 shadow-2xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Google Vids: <strong className="text-white font-mono">0 cr (Free)</strong></span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                <Link
                  href="/create"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Open Creation Studio</span>
                </Link>
                <Link
                  href="/pricing"
                  className="px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Top Up Credits</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. CORE FLUVIA SERVICES HUB — 4 CLEAR, DEDICATED SERVICE STATIONS */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <span>Google Flow AI Creative Services</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a specialized engine designed for commercial video, speech synthesis, and photorealistic imagery.
                </p>
              </div>
              <span className="text-xs font-mono text-indigo-400 font-bold hidden sm:inline-block">
                4 Active Production Engines
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 min-w-0">
              
              {/* SERVICE 1: AI VIDEO STUDIO */}
              <div className="p-5 rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 hover:shadow-xl transition-all flex flex-col justify-between group shadow-lg text-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shadow-2xs">
                      <Video className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      15 Credits
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                      AI Video Studio
                    </h3>
                    <p className="text-[11px] font-mono text-indigo-400 font-bold mt-0.5">
                      Google Gemini Omni 1.1 Flash
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Generate cinematic 1080p clips from prompts or bring still images to life with optical motion control.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-medium text-slate-400 pt-1">
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Text-to-Video</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Image-to-Video</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">16:9 / 9:16</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/8 flex items-center justify-between text-xs">
                  <Link
                    href="/create?mode=video"
                    className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Launch Video Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/templates?type=video"
                    className="text-[11px] text-slate-500 hover:text-slate-300 font-medium"
                  >
                    8 Presets
                  </Link>
                </div>
              </div>

              {/* SERVICE 2: AI VOICEOVER STUDIO */}
              <div className="p-5 rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 hover:shadow-xl transition-all flex flex-col justify-between group shadow-lg text-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shadow-2xs">
                      <Mic className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      2 Credits
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                      AI Voiceover Studio
                    </h3>
                    <p className="text-[11px] font-mono text-amber-400 font-bold mt-0.5">
                      ElevenLabs Neural Engine HD
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Synthesize lifelike voiceovers in 29+ languages with human inflection and instant MP3 playback.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-medium text-slate-400 pt-1">
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">40+ Voices</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">29+ Languages</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Instant MP3</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/8 flex items-center justify-between text-xs">
                  <Link
                    href="/create?mode=audio"
                    className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Synthesize Voice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/ai-voice-generator"
                    className="text-[11px] text-slate-500 hover:text-slate-300 font-medium"
                  >
                    Voice Library
                  </Link>
                </div>
              </div>

              {/* SERVICE 3: AI PHOTOREAL IMAGE STUDIO */}
              <div className="p-5 rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 hover:shadow-xl transition-all flex flex-col justify-between group shadow-lg text-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold shadow-2xs">
                      <ImageIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      5 Credits
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-violet-400 transition-colors">
                      AI Image Studio
                    </h3>
                    <p className="text-[11px] font-mono text-violet-400 font-bold mt-0.5">
                      Gemini Flash & Flux 1.1 Pro
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Generate 4K photorealistic product stills, commercial packaging, marketing visuals, and posters.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-medium text-slate-400 pt-1">
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">4K Stills</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Product Staging</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Multi-Ratio</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/8 flex items-center justify-between text-xs">
                  <Link
                    href="/create?mode=image"
                    className="text-violet-400 font-bold hover:text-violet-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Generate Image</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/templates?type=image"
                    className="text-[11px] text-slate-500 hover:text-slate-300 font-medium"
                  >
                    8 Presets
                  </Link>
                </div>
              </div>

              {/* SERVICE 4: GOOGLE VIDS STUDIO WORKSPACE */}
              <div className="p-5 rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 hover:shadow-xl transition-all flex flex-col justify-between group shadow-lg text-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold shadow-2xs">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      0 Credits (Free)
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                      Google Vids Studio
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400 font-bold mt-0.5">
                      Google Workspace Handoff
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Collaborative storyboard creation with Google Drive integration and zero Fluvia credits deducted.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px] font-medium text-slate-400 pt-1">
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">0 Credits</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Team Sync</span>
                    <span className="bg-white/[0.04] px-2 py-0.5 rounded border border-white/8">Drive Export</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-white/8 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-google-vids-popup'))}
                    className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch Google Vids</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-slate-500 font-medium">Free Tool</span>
                </div>
              </div>

            </div>
          </div>

          {/* 3. FEATURED GOOGLE VIDS WORKSPACE HERO */}
          <GoogleVidsCard />

          {/* 4. UNIFIED ALL-IN-ONE INSTANT SERVICE COMPOSER */}
          <div className="p-5 sm:p-6 rounded-3xl border border-white/8 shadow-2xl min-w-0 bg-[#11131A]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Instant Multi-Service Composer</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Draft your creative prompt and dispatch directly to the specialized studio.
                </p>
              </div>

              {/* Service Selection Tabs */}
              <div className="flex flex-wrap gap-1 bg-[#090A0D] p-1 rounded-xl text-xs font-bold border border-white/8">
                <button
                  type="button"
                  onClick={() => setQuickMode('video')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    quickMode === 'video'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video (15 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickMode('audio')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    quickMode === 'audio'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voiceover (2 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickMode('image')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    quickMode === 'image'
                      ? 'bg-violet-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image (5 cr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickMode('vids')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    quickMode === 'vids'
                      ? 'bg-cyan-600 text-white shadow-2xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Google Vids (0 cr)</span>
                </button>
              </div>
            </div>

            {/* Input & Voice Controls */}
            <div className="space-y-3">
              {quickMode === 'audio' && (
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Headphones className="w-3.5 h-3.5 text-amber-400" />
                    <span>Select Voice:</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {voicePresets.map((vp) => (
                      <div
                        key={vp.name}
                        onClick={() => setSelectedVoice(vp.name)}
                        className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 cursor-pointer text-xs transition-all ${
                          selectedVoice === vp.name
                            ? 'bg-amber-600 text-white border-amber-500 shadow-2xs'
                            : 'bg-[#090A0D] text-slate-300 border-white/10 hover:border-amber-400/40'
                        }`}
                      >
                        <span>{vp.name} ({vp.accent})</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleVoiceSample(vp.sample, vp.name);
                          }}
                          className={`p-0.5 rounded hover:bg-white/10 text-amber-400 transition-colors ${
                            playingVoice === vp.name ? 'text-amber-300 animate-pulse' : ''
                          }`}
                          title="Preview voice"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 min-w-0">
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder={
                    quickMode === 'video'
                      ? 'Describe your video scene: lighting, camera motion, visual theme (e.g. Luxury perfume macro bottle with gold reflections)...'
                      : quickMode === 'audio'
                      ? 'Enter narration text or script to synthesize into neural speech (e.g. Welcome to Fluvia Flow creative studio)...'
                      : quickMode === 'image'
                      ? 'Describe your image asset: subject, staging, 4K detail (e.g. Minimalist titanium watch on volcanic rock)...'
                      : 'Enter your video storyboard concept to copy and handoff into Google Vids...'
                  }
                  className="flex-1 min-w-0 bg-[#090A0D] text-slate-100 placeholder-slate-500 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm shadow-inner"
                />

                <button
                  type="button"
                  onClick={handleLaunchServiceStudio}
                  className={`px-6 py-3 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer text-white border border-white/10 ${
                    quickMode === 'video'
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/25'
                      : quickMode === 'audio'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-600/25'
                      : quickMode === 'image'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-600 shadow-violet-600/25'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-cyan-600/25'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {quickMode === 'vids'
                      ? (copiedVidsPrompt ? 'Copied & Opening Vids...' : 'Copy & Open Vids')
                      : `Dispatch to ${quickMode === 'video' ? 'Video Studio' : quickMode === 'audio' ? 'Voice Studio' : 'Image Studio'}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Quick Inspirations:</span>
                {(quickMode === 'video'
                  ? ['Luxury Perfume Ad', 'Veloce Hypercar Launch', 'Hydraluxe Skincare', 'SaaS Platform Tour']
                  : quickMode === 'audio'
                  ? ['Commercial Ad Voiceover', 'Documentary Narrative', 'Product Reveal Script', 'Podcast Intro']
                  : quickMode === 'image'
                  ? ['Horology Hero Shot', 'Monza GT Track Poster', 'Skincare Golden Jar', 'Mechanical Art 3D']
                  : ['Enterprise Product Pitch', 'Onboarding Tutorial', 'Customer Case Study']
                ).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuickPrompt(tag)}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/8 text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. CURATED PRODUCTION TEMPLATES BY SERVICE FORMAT */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>Curated Agency Templates</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Production-ready templates with verified commercial previews. 1-click load into studio.
                </p>
              </div>

              {/* Format Filter Tabs */}
              <div className="flex flex-wrap gap-1 bg-[#090A0D] p-1 rounded-xl border border-white/8 text-xs shadow-2xs font-bold">
                <button
                  type="button"
                  onClick={() => setTemplateTab('all')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    templateTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All (24)
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('video')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    templateTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Video (8)
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('image')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    templateTab === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Image (8)
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('text')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    templateTab === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Text FX (8)
                </button>
                <Link
                  href="/templates"
                  className="px-2.5 py-1 text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold text-[11px]"
                >
                  <span>View All →</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 min-w-0">
              {displayedTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 overflow-hidden group shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Media Preview Box */}
                    <div className="aspect-video relative overflow-hidden bg-black">
                      {(tmpl.videoPreview || tmpl.previewUrl) && (tmpl.type === 'video' || tmpl.type === 'text-animation') ? (
                        <video
                          src={tmpl.videoPreview || tmpl.previewUrl}
                          poster={tmpl.thumbnail}
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                          onMouseLeave={(e) => {
                            const v = e.target as HTMLVideoElement;
                            v.pause();
                            v.currentTime = 0;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <img
                          src={tmpl.thumbnail || tmpl.videoPreview || tmpl.previewUrl}
                          alt={tmpl.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-75" />

                      {/* Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-indigo-300 border border-indigo-400/30 uppercase font-bold">
                          {tmpl.aspect}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 border border-white/10 font-bold uppercase">
                          {tmpl.type}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white font-bold border border-white/15">
                          {tmpl.estimatedCredits} cr
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                        {tmpl.category}
                      </span>
                      <h3 className="font-bold text-white text-sm truncate">{tmpl.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Launch Button */}
                  <div className="p-3 border-t border-white/8 bg-[#0E1015] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      {tmpl.engine || tmpl.aiModelsUsed?.[0] || 'Gemini Omni Flash'}
                    </span>
                    <Link
                      href={`/create?template=${encodeURIComponent(tmpl.id)}`}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-all border border-white/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Use Template</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. RECENT PROJECTS & TIMELINE EDITOR HUB */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-indigo-400" />
                  <span>My Active Projects</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">({projects.length})</span>
              </div>
              <Link
                href="/create"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-10 text-center rounded-2xl border border-white/8 bg-[#11131A] shadow-xl">
                <Video className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No creative projects yet</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                  Launch a video, voiceover, or photoreal image session above to populate your workspace.
                </p>
                <Link
                  href="/create"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md border border-white/10"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create First Video</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-white/8 bg-[#11131A] hover:bg-[#151822] hover:border-white/20 overflow-hidden group shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail / Video Preview */}
                      <div className="aspect-video relative overflow-hidden bg-black">
                        <img
                          src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80" />

                        {/* Top badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-indigo-300 border border-indigo-400/30 uppercase font-bold">
                            {proj.mediaType}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize font-bold ${
                            proj.status === 'completed' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {proj.status}
                          </span>
                        </div>

                        {/* Favorite button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                            proj.isFavorite ? 'bg-amber-500 text-black' : 'bg-black/60 text-white hover:text-amber-300'
                          }`}
                          aria-label={proj.isFavorite ? 'Unfavorite project' : 'Favorite project'}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>

                        {/* Center Hover Play Overlay */}
                        <Link
                          href={`/editor/${proj.id}`}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border border-white/20">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </Link>
                      </div>

                      {/* Content details */}
                      <div className="p-4">
                        <h3 className="font-bold text-white text-sm truncate">{proj.title}</h3>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {proj.description || 'Timeline configured for multi-track editing.'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-indigo-400" />
                          <span>Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 border-t border-white/8 bg-[#0E1015] flex items-center justify-between text-xs">
                      <Link
                        href={`/editor/${proj.id}`}
                        className="text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Timeline Editor</span>
                      </Link>

                      <div className="flex items-center gap-2 text-slate-400">
                        <button
                          type="button"
                          onClick={() => setRenameModal({ id: proj.id, title: proj.title })}
                          className="hover:text-white p-1"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(proj.id)}
                          className="hover:text-white p-1"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ id: proj.id, title: proj.title })}
                          className="hover:text-rose-400 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7. RECENT AI GENERATION JOBS & AUDIT LEDGER */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span>Recent Generation Jobs</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time status of your neural inferences and credit settlements.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {jobs.length} jobs logged
              </span>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[#11131A] overflow-hidden shadow-xl">
              {jobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No generation jobs dispatched yet.
                </div>
              ) : (
                <div className="divide-y divide-white/8">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs min-w-0 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          job.status === 'completed'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : job.status === 'failed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 animate-pulse'
                        }`}>
                          {job.modelId?.includes('eleven') ? (
                            <Mic className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Video className="w-4 h-4 text-indigo-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white line-clamp-1">
                            {job.input?.prompt || job.input?.scriptText || 'AI Generation Task'}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5 font-mono">
                            <span className="font-semibold text-slate-300">{job.modelId}</span>
                            <span>•</span>
                            <span className="text-indigo-300 font-bold">{job.actualCredits || job.estimatedCredits || 15} cr settled</span>
                            <span>•</span>
                            <span className="capitalize font-bold text-indigo-400">{job.status}</span>
                            {job.output?.isDemoSimulated && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 rounded font-bold">Demo Mode</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        {job.output?.videoUrl && (
                          <a
                            href={job.output.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold flex items-center gap-1.5 text-xs border border-white/10 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Preview Video</span>
                          </a>
                        )}
                        {job.output?.audioUrl && (
                          <a
                            href={job.output.audioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold flex items-center gap-1.5 text-xs border border-white/10 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Play MP3</span>
                          </a>
                        )}
                        {job.projectId && (
                          <Link
                            href={`/editor/${job.projectId}`}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md border border-white/10"
                          >
                            Open Editor
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* RENAME MODAL */}
      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-left border border-white/10 bg-[#0E1015] text-slate-100">
            <h3 className="font-bold text-white text-base">Rename Project</h3>
            <input
              type="text"
              value={renameModal.title}
              onChange={(e) => setRenameModal({ ...renameModal, title: e.target.value })}
              className="w-full bg-[#090A0D] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 text-sm shadow-inner"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRenameModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRenameConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md border border-white/10"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-left border border-white/10 bg-[#0E1015] text-slate-100">
            <h3 className="font-bold text-white text-base">Delete Project</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{deleteModal.title}</strong>? You can restore it from trash within 30 days.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Vids Promotional Popup */}
      <GoogleVidsPromoPopup />
    </div>
  );
}
