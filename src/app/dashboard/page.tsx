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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#17191D]">Session expired</p>
          <span className="text-xs text-[#667085]">Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-screen h-[100dvh] w-full bg-white flex text-[#17191D] overflow-hidden">
        <div className="hidden md:block w-60 h-full shrink-0 border-r border-[#E5E7EB] bg-[#F7F8FA] p-4 space-y-4">
          <div className="h-8 w-32 bg-[#E5E7EB] rounded-lg animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-8 w-full bg-[#E5E7EB] rounded-lg animate-pulse" />
            <div className="h-8 w-full bg-[#E5E7EB] rounded-lg animate-pulse" />
            <div className="h-8 w-full bg-[#E5E7EB] rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col p-8 space-y-6">
          <div className="h-8 w-64 bg-[#F7F8FA] rounded-lg animate-pulse" />
          <div className="h-72 w-full bg-[#F7F8FA] rounded-2xl animate-pulse" />
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
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-[#17191D] bg-white relative">
      {/* FIRST20 Modal for Eligible New Users */}
      <FirstCampaignModal />

      {/* Studio Nav Rail */}
      <Sidebar userRole={user.role} credits={credits} />

      {/* Main Viewport */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-white">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 text-left min-w-0">
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#17191D] tracking-tight">
                Welcome back, {user.displayName}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Gemini Omni 1.1 Flash Engine is ready. You currently have{' '}
                <strong className="text-[#17191D]">{credits.availableBalance.toLocaleString()} credits</strong> available.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Top Up (5,000 Credits)</span>
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Ad</span>
              </Link>
            </div>
          </div>

          {/* Quick Start Creation Deck */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#667085] mb-3">
              What would you like to create today?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: AI Video Ad */}
              <Link
                href="/create?mode=video"
                className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5145CD]/10 text-[#5145CD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#17191D]">AI Video Ad</h3>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
                    15 cr / video
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#667085] leading-relaxed">
                  Turn product URLs or descriptions into multi-scene cinematic commercial spots with Gemini Omni.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#5145CD]">
                  <span>Launch Video Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 2: AI Product Photography */}
              <Link
                href="/create?mode=image"
                className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5145CD]/10 text-[#5145CD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#17191D]">Product Photography</h3>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
                    5 cr / image
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#667085] leading-relaxed">
                  Generate 4K studio-lit product imagery, advertising banners, and social catalog shots.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#5145CD]">
                  <span>Launch Image Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 3: AI Voiceover */}
              <Link
                href="/create?mode=audio"
                className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-[#5145CD]/10 text-[#5145CD] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#17191D]">AI Voice-Over</h3>
                  <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
                    2 cr / voice
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-[#667085] leading-relaxed">
                  Generate studio-quality voice-overs in 29+ languages with emotional pacing and ElevenLabs.
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#5145CD]">
                  <span>Launch Voice Studio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Prompt Command Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLaunchQuickCreate()}
                  placeholder="Describe your product ad (e.g. Cinematic luxury watch commercial with water droplets and dramatic rim lighting)..."
                  className="w-full bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 placeholder:text-[#667085]/60"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quickAspect}
                  onChange={(e: any) => setQuickAspect(e.target.value)}
                  className="bg-white rounded-xl px-3 py-2.5 text-xs font-semibold text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] cursor-pointer"
                >
                  <option value="16:9">16:9 Cinema</option>
                  <option value="9:16">9:16 Reel / Story</option>
                  <option value="1:1">1:1 Square Post</option>
                </select>

                <button
                  type="button"
                  onClick={handleLaunchQuickCreate}
                  className="px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Generation Jobs / Telemetry Feed */}
          {jobs.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#17191D] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#5145CD]" />
                  <span>Recent Generation Tasks</span>
                </h3>
                <span className="text-xs text-[#667085]">{jobs.length} total tasks</span>
              </div>

              <div className="space-y-2">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {job.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-[#17191D] capitalize">{job.type || 'Generation'}</p>
                        <p className="text-[11px] text-[#667085] truncate max-w-md">
                          {job.prompt || job.inputParams?.prompt || 'Asset generation request'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize font-semibold ${
                        job.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
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
                <h2 className="text-base font-bold text-[#17191D]">Recent Projects</h2>
                <p className="text-xs text-[#667085]">Continue editing or export your campaign assets</p>
              </div>
              <Link
                href="/dashboard/projects"
                className="text-xs font-semibold text-[#5145CD] hover:underline flex items-center gap-1"
              >
                <span>View all projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#667085]">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-[#17191D]">No projects created yet</h3>
                <p className="text-xs text-[#667085] max-w-sm mx-auto">
                  Start your first creative campaign or pick a curated template from the library below.
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-all"
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
                    className="rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-[#F7F8FA] flex items-center justify-center overflow-hidden">
                      {proj.thumbnailUrl ? (
                        <img src={proj.thumbnailUrl} alt={proj.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-[#667085] font-mono flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-[#5145CD]" />
                          <span>Creative Timeline</span>
                        </div>
                      )}
                      <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs font-semibold">
                        {proj.aspectRatio || '16:9'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-[#17191D] truncate">{proj.title}</h4>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                          className="text-[#667085] hover:text-amber-500 transition-colors"
                        >
                          <Star className={`w-3.5 h-3.5 ${proj.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#667085] pt-2 border-t border-[#E5E7EB]">
                        <span>{new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(proj.id)}
                            title="Duplicate"
                            className="hover:text-[#17191D]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ id: proj.id, title: proj.title })}
                            title="Delete"
                            className="hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/create?projectId=${proj.id}`}
                            className="text-[#5145CD] font-semibold hover:underline"
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
                <h2 className="text-base font-bold text-[#17191D]">Curated Ad Templates</h2>
                <p className="text-xs text-[#667085]">Production-ready storyboards with proven marketing hooks</p>
              </div>

              {/* Category Filter Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setTemplateTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    templateTab === 'all'
                      ? 'bg-white text-[#17191D] shadow-2xs'
                      : 'text-[#667085] hover:text-[#17191D]'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('video')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    templateTab === 'video'
                      ? 'bg-white text-[#17191D] shadow-2xs'
                      : 'text-[#667085] hover:text-[#17191D]'
                  }`}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateTab('image')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    templateTab === 'image'
                      ? 'bg-white text-[#17191D] shadow-2xs'
                      : 'text-[#667085] hover:text-[#17191D]'
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
                  className="rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-sm transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-[#17191D] overflow-hidden">
                    <img
                      src={tmpl.thumbnail}
                      alt={tmpl.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-xs font-semibold">
                        {tmpl.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-sm text-[#17191D] truncate">{tmpl.title}</h4>
                    <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#667085] font-semibold">
                        {tmpl.estimatedCredits} credits
                      </span>
                      <Link
                        href={`/templates/${tmpl.id}`}
                        className="text-xs font-semibold text-[#5145CD] hover:underline flex items-center gap-1"
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setDeleteModal(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-[#E5E7EB] space-y-4">
            <h3 className="font-bold text-base text-[#17191D]">Delete Project?</h3>
            <p className="text-xs text-[#667085]">
              Are you sure you want to delete &ldquo;{deleteModal.title}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#667085] hover:bg-[#F7F8FA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
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
