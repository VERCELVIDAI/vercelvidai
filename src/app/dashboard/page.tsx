'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Plus,
  Play,
  Clock,
  MoreVertical,
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
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Quick prompt input
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickMode, setQuickMode] = useState<'video' | 'image' | 'audio'>('video');

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

  const handleQuickCreate = () => {
    if (!quickPrompt.trim()) {
      router.push(`/create?mode=${quickMode}`);
      return;
    }
    router.push(`/create?mode=${quickMode}&prompt=${encodeURIComponent(quickPrompt)}`);
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
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FDF4]/50 to-[#FFF1F7]/40 text-[#17211D] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-9 h-9 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#17211D]">Session expired or sign in required</p>
          <span className="text-xs text-slate-500">Redirecting to Fluvia Flow sign in...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex text-[#17211D]">
        {/* Placeholder sidebar */}
        <div className="hidden md:block w-64 border-r border-emerald-500/15 bg-white/70 p-4 space-y-4">
          <div className="h-8 w-32 bg-emerald-100/60 rounded-lg animate-pulse" />
          <div className="space-y-2 pt-6">
            <div className="h-4 w-24 bg-slate-200/70 rounded animate-pulse" />
            <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-9 w-full bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Placeholder content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-16 border-b border-emerald-500/15 bg-white/60 px-6 flex items-center justify-between">
            <div className="h-6 w-32 bg-slate-200/70 rounded-md animate-pulse" />
            <div className="h-8 w-24 bg-emerald-100/60 rounded-full animate-pulse" />
          </div>
          <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
            <div className="h-28 rounded-3xl bg-emerald-50/50 border border-emerald-500/20 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white border border-emerald-500/15 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-64 rounded-2xl bg-white border border-emerald-500/15 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white border border-emerald-500/15 animate-pulse" />
              <div className="h-64 rounded-2xl bg-white border border-emerald-500/15 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FDF4]/50 to-[#FFF1F7]/40 flex items-center justify-center p-4 text-[#17211D]">
        <div className="p-8 max-w-md w-full glass-card border border-rose-300 rounded-3xl shadow-xl text-center space-y-4 bg-white/95">
          <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#17211D]">Unable to Load Creative Studio</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {loadError}
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => fetchDashboardData()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/login"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
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

  return (
    <div className="min-h-screen flex transition-colors duration-200 text-[#17211D]">
      {/* Sidebar */}
      <Sidebar userRole={user.role} credits={credits} />

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10 text-left">
          {/* Greeting Banner & Available Credits */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-pink-50/40 p-5 sm:p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Creative Studio
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-600 font-medium">{plan.name} Tier</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D]">
                Welcome back, {user.displayName || 'Creator'}!
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                You have <strong className="text-emerald-800 font-bold">{credits.availableBalance}</strong> credits available. Turn ideas into video moments.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/pricing"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-100" />
                <span>Buy Credits / Upgrade</span>
              </Link>
            </div>
          </div>

          {/* Large "Create with AI" Quick Composer */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Instant AI Composer</span>
              </span>

              <div className="flex gap-1 bg-white/80 p-1 rounded-lg border border-emerald-500/15 text-xs shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuickMode('video')}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    quickMode === 'video' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-[#17211D]'
                  }`}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setQuickMode('image')}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    quickMode === 'image' ? 'bg-pink-500 text-white shadow-2xs' : 'text-slate-600 hover:text-[#17211D]'
                  }`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setQuickMode('audio')}
                  className={`px-3 py-1 rounded font-bold transition-all ${
                    quickMode === 'audio' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:text-[#17211D]'
                  }`}
                >
                  Voice
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder={
                  quickMode === 'video'
                    ? 'E.g. Create a vertical Instagram product reveal with emerald reflections...'
                    : quickMode === 'image'
                    ? 'E.g. Photorealistic futuristic sneaker floating in crystalline water...'
                    : 'E.g. Enter voice narration dialogue...'
                }
                className="flex-1 glass-input text-[#17211D] px-4 py-3 rounded-xl border border-emerald-500/20 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm shadow-xs"
              />

              <button
                type="button"
                onClick={handleQuickCreate}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick-Start Workflow Tiles */}
          <div>
            <h2 className="text-base font-bold text-[#17211D] mb-4">Quick Workflows</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Text to Video', desc: 'Direct prompt to cinematic cut', icon: Video, color: 'text-emerald-700', bg: 'bg-emerald-100', href: '/create?mode=video' },
                { title: 'Script to Storyboard', desc: 'Paste text or article URL', icon: Sparkles, color: 'text-teal-700', bg: 'bg-teal-100', href: '/create?mode=video&preset=script' },
                { title: 'Product Commercial', desc: 'Animate uploaded image shot', icon: ImageIcon, color: 'text-pink-600', bg: 'bg-pink-100', href: '/create?mode=video&preset=product' },
                { title: 'Voiceover & Captions', desc: 'Neural voice in 29+ languages', icon: Mic, color: 'text-emerald-800', bg: 'bg-emerald-100', href: '/create?mode=audio' },
              ].map((wf, idx) => {
                const Icon = wf.icon;
                return (
                  <Link
                    key={idx}
                    href={wf.href}
                    className="p-4 rounded-xl glass-card border border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-md transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg ${wf.bg} flex items-center justify-center mb-3`}>
                        <Icon className={`w-5 h-5 ${wf.color}`} />
                      </div>
                      <h3 className="font-bold text-[#17211D] text-sm group-hover:text-emerald-700 transition-colors">
                        {wf.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600">{wf.desc}</p>
                    </div>
                    <span className="mt-4 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <span>Launch</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#17211D]">Recent Projects</h2>
                <span className="text-xs font-mono text-slate-500">({projects.length})</span>
              </div>
              <Link
                href="/create"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-12 text-center rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
                <Video className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-[#17211D] text-base">No projects created yet</h3>
                <p className="mt-1 text-xs text-slate-600 max-w-sm mx-auto">
                  Start from a text prompt or select one of our curated templates to generate your first scene.
                </p>
                <Link
                  href="/create"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm"
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
                    className="rounded-2xl glass-card border border-emerald-500/20 overflow-hidden group hover:border-emerald-500/40 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail / Video Preview */}
                      <div className="aspect-video relative overflow-hidden bg-slate-900">
                        <img
                          src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                        {/* Top badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-emerald-300 border border-emerald-400/30 uppercase font-bold">
                            {proj.mediaType}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize font-bold ${
                            proj.status === 'completed' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
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
                          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </Link>
                      </div>

                      {/* Content details */}
                      <div className="p-4">
                        <h3 className="font-bold text-[#17211D] text-sm truncate">{proj.title}</h3>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                          {proj.description || 'Timeline configured for multi-track editing.'}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          <span>Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 border-t border-emerald-500/15 bg-white/60 flex items-center justify-between text-xs">
                      <Link
                        href={`/editor/${proj.id}`}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Studio</span>
                      </Link>

                      <div className="flex items-center gap-2 text-slate-500">
                        <button
                          type="button"
                          onClick={() => setRenameModal({ id: proj.id, title: proj.title })}
                          className="hover:text-emerald-700 p-1"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(proj.id)}
                          className="hover:text-emerald-700 p-1"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteModal({ id: proj.id, title: proj.title })}
                          className="hover:text-rose-600 p-1"
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

          {/* Recent AI Generations Ledger / Queue */}
          <div>
            <h2 className="text-base font-bold text-[#17211D] mb-4">Recent Generation Jobs</h2>
            <div className="rounded-2xl glass-card border border-emerald-500/20 overflow-hidden shadow-sm">
              {jobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No jobs submitted yet.</div>
              ) : (
                <div className="divide-y divide-emerald-500/10">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          job.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.status === 'failed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800 animate-pulse'
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[#17211D] line-clamp-1 max-w-md">
                            {job.input?.prompt || 'AI Generation Task'}
                          </p>
                          <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                            <span className="font-mono font-medium">{job.modelId}</span>
                            <span>•</span>
                            <span>{job.actualCredits || job.estimatedCredits} credits</span>
                            <span>•</span>
                            <span className="capitalize font-bold text-emerald-800">{job.status}</span>
                            {job.output?.isDemoSimulated && (
                              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1 rounded font-bold">Demo Mode</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {job.output?.videoUrl && (
                          <a
                            href={job.output.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5 text-xs border border-emerald-200"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </a>
                        )}
                        {job.projectId && (
                          <Link
                            href={`/editor/${job.projectId}`}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-modal rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-left border border-emerald-500/30">
            <h3 className="font-bold text-[#17211D] text-base">Rename Project</h3>
            <input
              type="text"
              value={renameModal.title}
              onChange={(e) => setRenameModal({ ...renameModal, title: e.target.value })}
              className="w-full glass-input text-[#17211D] px-3 py-2 rounded-xl border border-emerald-500/20 focus:outline-none focus:border-emerald-500 text-sm shadow-xs"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRenameModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRenameConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-modal rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-left border border-emerald-500/30">
            <h3 className="font-bold text-[#17211D] text-base">Delete Project</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-[#17211D]">{deleteModal.title}</strong>? You can restore it from trash within 30 days.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
