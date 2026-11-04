'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { FirstCampaignModal } from '@/components/promotions/FirstCampaignModal';
import {
  ALL_CURATED_TEMPLATES,
  VIDEO_TEMPLATES,
  IMAGE_TEMPLATES,
} from '@/lib/templates';
import {
  Sparkles,
  Film,
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
  FolderOpen,
  ArrowRight,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sliders,
  Tag,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Quick Command Deck
  const [quickMode, setQuickMode] = useState<'video' | 'image' | 'audio'>('video');
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickAspect, setQuickAspect] = useState<'16:9' | '9:16' | '1:1'>('16:9');

  // Active template category tab
  const [templateTab, setTemplateTab] = useState<'all' | 'video' | 'image'>('all');

  // Modal actions for projects
  const [renameModal, setRenameModal] = useState<{ id: string; title: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const authRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (authRes.status === 401) {
        setIsRedirecting(true);
        router.push('/login?returnUrl=/dashboard');
        return;
      }
      const authData = await authRes.json();
      setData(authData);

      // Fetch projects
      try {
        const projRes = await fetch('/api/projects');
        if (projRes.ok) {
          const pData = await projRes.json();
          setProjects(pData.projects || []);
        }
      } catch (e) {}

      // Fetch recent jobs
      try {
        const jobsRes = await fetch('/api/jobs');
        if (jobsRes.ok) {
          const jData = await jobsRes.json();
          setJobs(jData.jobs || []);
        }
      } catch (e) {}
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLaunchQuickCreate = () => {
    const params = new URLSearchParams();
    params.set('mode', quickMode);
    if (quickPrompt.trim()) params.set('prompt', quickPrompt.trim());
    if (quickAspect) params.set('aspectRatio', quickAspect);
    router.push(`/create?${params.toString()}`);
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
      <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-white">Session expired</p>
          <span className="text-xs text-slate-400">Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen md:h-screen md:h-[100dvh] w-full bg-[#070A0F] flex flex-col md:flex-row text-white overflow-x-hidden md:overflow-hidden">
        <div className="hidden md:block w-64 h-full shrink-0 border-r border-slate-800/90 bg-[#0B0E17] p-4 space-y-4">
          <div className="h-8 w-32 bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-8 w-full bg-slate-800/50 rounded-xl animate-pulse" />
            <div className="h-8 w-full bg-slate-800/50 rounded-xl animate-pulse" />
            <div className="h-8 w-full bg-slate-800/50 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col p-4 sm:p-8 space-y-6 bg-[#070A0F]">
          <div className="h-8 w-64 bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="h-48 w-full bg-[#0E121B] border border-slate-800/80 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-36 bg-[#0E121B] border border-slate-800/80 rounded-2xl animate-pulse" />
            <div className="h-36 bg-[#0E121B] border border-slate-800/80 rounded-2xl animate-pulse" />
            <div className="h-36 bg-[#0E121B] border border-slate-800/80 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const user = data?.user || { displayName: 'Creator', role: 'creator' };
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = data?.subscription?.plan || { name: 'Free Explorer' };

  const displayedTemplates =
    templateTab === 'all'
      ? ALL_CURATED_TEMPLATES.slice(0, 6)
      : templateTab === 'video'
      ? VIDEO_TEMPLATES.slice(0, 6)
      : IMAGE_TEMPLATES.slice(0, 6);

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden text-white bg-[#070A0F] relative selection:bg-[#d4ff00] selection:text-black">
      {/* FIRST20 Modal for Eligible New Users */}
      <FirstCampaignModal />

      {/* Studio Nav Rail */}
      <Sidebar userRole={user.role} credits={credits} />

      {/* Main Viewport */}
      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#070A0F] pb-24 md:pb-8">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 text-left min-w-0">
          {/* Welcome Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800/90 text-white shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="text-[10px] font-mono uppercase font-black tracking-widest text-violet-400">
                  CREATIVE SUITE READY
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user.displayName}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Gemini Omni 1.1 Flash Engine is active. You currently have{' '}
                <strong className="text-[#d4ff00] font-black">{credits.availableBalance.toLocaleString()} credits</strong> available.
              </p>
            </div>

            <div className="flex flex-wrap xs:flex-nowrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="flex-1 sm:flex-initial text-center justify-center px-4 py-2.5 rounded-xl bg-[#141A26] hover:bg-[#1C2538] text-white border border-slate-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Top Up (5,000 CR)</span>
              </Link>
              <Link
                href="/create"
                className="flex-1 sm:flex-initial text-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all flex items-center gap-1.5 border border-violet-400/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>+ Create Ad</span>
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FLAGSHIP OPENHIGGS STUDIO HERO & QUICK-GENERATOR */}
          {/* ========================================================================= */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-[#0B0F17] text-white border-2 border-[#d1fe17]/40 shadow-[0_10px_35px_rgba(209,254,23,0.12)] overflow-hidden">
            {/* Background Glow Accents */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#d1fe17]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#5145CD]/20 blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                {/* Status Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#152212] border border-[#d1fe17]/50 text-[#d1fe17] text-[11px] font-black uppercase tracking-wider shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#d1fe17] animate-ping" />
                    <span>OpenHiggs Studio</span>
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                    38 Foundation Models Live
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#FF2D78]/20 text-[#FF66B2] border border-[#FF2D78]/30 font-bold">
                    Seedance 2.5 • Kling 3.0 • Wan 3 • Flux 3
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Direct Foundation Model Generation Engine
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Generate broadcast-grade cinematic videos, 4K camera trajectories, and photorealistic imagery with all 38 OpenHiggs foundation models. Run via cloud credits or bring your own API key.
                </p>

                {/* Quick Model Launchers */}
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400">Popular Engines:</span>
                  {[
                    { name: 'Seedance 2.5', tag: 'Director 4K', color: 'border-[#d1fe17]/40 text-[#d1fe17] bg-[#121c10]' },
                    { name: 'Kling 3.0 Pro', tag: 'Motion Pro', color: 'border-pink-500/40 text-pink-300 bg-pink-950/30' },
                    { name: 'Soul Cinema', tag: 'Fluid Physics', color: 'border-blue-500/40 text-blue-300 bg-blue-950/30' },
                    { name: 'Wan 3 Prime', tag: 'HDR Cinema', color: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/30' },
                    { name: 'Flux 3', tag: 'Typography', color: 'border-purple-500/40 text-purple-300 bg-purple-950/30' },
                  ].map((m, idx) => (
                    <Link
                      key={idx}
                      href="/openhiggs"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all hover:scale-105 ${m.color}`}
                    >
                      <span>{m.name}</span>
                      <span className="text-[9px] opacity-75 font-mono">({m.tag})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 sm:w-auto">
                <Link
                  href="/openhiggs"
                  className="px-6 py-3 rounded-xl bg-[#d1fe17] hover:bg-[#ddfe50] text-[#0f1505] font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(209,254,23,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0f1505]" />
                  <span>Launch OpenHiggs Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/pricing"
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>View OpenHiggs Plans (3 Plans • 20% OFF)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Start Creation Deck */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              What would you like to create today?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
              {/* Card 1: OpenHiggs Studio */}
              <Link
                href="/openhiggs"
                className="p-5 rounded-3xl bg-[#0E150F]/95 text-white border-2 border-[#d4ff00]/40 hover:border-[#d4ff00] hover:shadow-[0_0_35px_rgba(212,255,0,0.25)] transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#d4ff00]/20 border border-[#d4ff00]/40 text-[#d4ff00] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(212,255,0,0.3)]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white">OpenHiggs Studio</h3>
                    <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-full bg-[#121c10] text-[#d4ff00] border border-[#d4ff00]/40 shadow-xs">
                      38 Models
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    Seedance 2.5, Kling 3.0, Soul Cinema, Wan 3, and Flux 3 in one unified studio.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-black text-[#d4ff00]">
                  <span>Open Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 2: Free Image Studio (Cloudflare Workers AI) */}
              <Link
                href="/ai-image-generator"
                className="p-5 rounded-3xl bg-[#160E06]/95 text-white border-2 border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white">Free Image Studio</h3>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-xs">
                      100k Free
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    Cloudflare Workers AI: Stable Diffusion XL & Flux 1 Schnell at 0 credit cost.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-black text-amber-400">
                  <span>Generate Free</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 3: Vox AI Motion Graphics Studio */}
              <Link
                href="/studios/motion-graphics"
                className="p-5 rounded-3xl bg-[#160B24]/95 text-white border-2 border-violet-500/40 hover:border-violet-400 hover:shadow-[0_0_35px_rgba(139,92,246,0.3)] transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                    <Film className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white">Vox Motion Studio</h3>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/50 shadow-xs">
                      2 Free Tries
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    Paper-collage explainer video generator with living posters, 7 themes, and script beat map.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-black text-violet-400">
                  <span>Create Living Poster</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 4: AI Video Ad */}
              <Link
                href="/create?mode=video"
                className="p-5 rounded-3xl bg-[#0B1024]/95 text-white border-2 border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_35px_rgba(37,99,235,0.3)] transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white">AI Video Ad</h3>
                    <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40">
                      15 cr
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                    Turn product URLs or descriptions into multi-scene cinematic commercial spots with Gemini Omni.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-black text-blue-400">
                  <span>Launch Video Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 5: AI Product Photography */}
              <Link
                href="/create?mode=image"
                className="p-5 rounded-3xl bg-[#0E121B]/95 text-white border-2 border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white">Product Photography</h3>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                      5 cr
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Generate 4K studio-lit product imagery, advertising banners, and social catalog shots.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-300">
                  <span>Launch Image Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 6: AI Voiceover */}
              <Link
                href="/create?mode=audio"
                className="p-5 rounded-3xl bg-[#0E121B]/95 text-white border-2 border-slate-800 hover:border-slate-700 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-slate-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-white">AI Voice-Over</h3>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                      2 cr
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Generate studio-quality voice-overs in 29+ languages with emotional pacing and ElevenLabs.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-300">
                  <span>Launch Voice Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Prompt Command Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLaunchQuickCreate()}
                  placeholder="Describe your product ad (e.g. Cinematic luxury watch commercial with water droplets and dramatic rim lighting)..."
                  className="w-full bg-[#141A26] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white border border-slate-800 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quickAspect}
                  onChange={(e: any) => setQuickAspect(e.target.value)}
                  className="bg-[#141A26] rounded-xl px-3 py-2.5 text-xs font-semibold text-white border border-slate-800 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="16:9" className="bg-[#0E121B] text-white">16:9 Cinema</option>
                  <option value="9:16" className="bg-[#0E121B] text-white">9:16 Reel / Story</option>
                  <option value="1:1" className="bg-[#0E121B] text-white">1:1 Square Post</option>
                </select>

                <button
                  type="button"
                  onClick={handleLaunchQuickCreate}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-1.5 cursor-pointer shrink-0 border border-violet-400/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Generation Jobs / Telemetry Feed */}
          {jobs.length > 0 && (
            <div className="p-6 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span>Recent Generation Tasks</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">{jobs.length} total tasks</span>
              </div>

              <div className="space-y-2">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-2xl bg-[#141A26] border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {job.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                      <div>
                        <p className="font-bold text-white capitalize">{job.type || 'Generation'}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-md">
                          {job.prompt || job.inputParams?.prompt || 'Asset generation request'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full capitalize font-bold ${
                        job.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-white">Recent Projects</h2>
                <p className="text-xs text-slate-400">Continue editing or export your campaign assets</p>
              </div>
              <Link
                href="/dashboard/projects"
                className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
              >
                <span>View all projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#141A26] border border-slate-700 flex items-center justify-center mx-auto text-violet-400">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base text-white">No projects created yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start your first creative campaign or pick a curated template from the library below.
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 hover:border-slate-700 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                      {proj.thumbnailUrl ? (
                        <img src={proj.thumbnailUrl} alt={proj.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-violet-400" />
                          <span>Creative Timeline</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white backdrop-blur-xs font-bold border border-white/10">
                        {proj.aspectRatio || '16:9'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-white truncate">{proj.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                          className="text-slate-500 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-3.5 h-3.5 ${proj.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                        <span>{new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(proj.id)}
                            title="Duplicate"
                            className="hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ id: proj.id, title: proj.title })}
                            title="Delete"
                            className="hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/create?projectId=${proj.id}`}
                            className="text-violet-400 font-bold hover:underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Curated Ad Templates Shelf */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-black text-white">Curated Ad Templates</h2>
                <p className="text-xs text-slate-400">Production-ready storyboards with proven marketing hooks</p>
              </div>

              {/* Category Filter Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-[#141A26] border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTemplateTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    templateTab === 'all'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    templateTab === 'video'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('image')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    templateTab === 'image'
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Image
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 hover:border-slate-700 hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={tmpl.thumbnail}
                      alt={tmpl.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs font-bold">
                        {tmpl.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-white truncate">{tmpl.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400 font-bold">
                        {tmpl.estimatedCredits} credits
                      </span>
                      <Link
                        href={`/templates/${tmpl.id}`}
                        className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModal(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0E121B] p-6 shadow-2xl border-2 border-slate-800 space-y-4 text-white">
            <h3 className="font-black text-base text-white">Delete Project?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 shadow-sm"
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
