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
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick prompt input
  const [quickPrompt, setQuickPrompt] = useState('');
  const [quickMode, setQuickMode] = useState<'video' | 'image' | 'audio'>('video');

  // Modal actions
  const [renameModal, setRenameModal] = useState<{ id: string; title: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

  const fetchDashboardData = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/login');
        return;
      }
      const authData = await authRes.json();
      setData(authData);

      const [projRes, jobsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/jobs'),
      ]);

      if (projRes.ok) {
        const p = await projRes.json();
        setProjects(p.projects || []);
      }
      if (jobsRes.ok) {
        const j = await jobsRes.json();
        setJobs(j.jobs || []);
      }
    } catch (err) {
      console.error(err);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Loading creative workspace...</span>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = data?.subscription?.plan || { name: 'Free Explorer' };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex">
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

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-10">
          {/* Greeting Banner & Available Credits */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[#0E1017] p-6 rounded-2xl border border-violet-500/20 relative overflow-hidden">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
                  Creative Studio
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">{plan.name} Tier</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {user.displayName || 'Creator'}!
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                You have <strong className="text-white">{credits.availableBalance}</strong> credits available. Turn ideas into video moments.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/pricing"
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Buy Credits / Upgrade</span>
              </Link>
            </div>
          </div>

          {/* Large "Create with AI" Quick Composer */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Instant AI Composer</span>
              </span>

              <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5 text-xs">
                <button
                  type="button"
                  onClick={() => setQuickMode('video')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    quickMode === 'video' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setQuickMode('image')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    quickMode === 'image' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => setQuickMode('audio')}
                  className={`px-3 py-1 rounded font-medium transition-all ${
                    quickMode === 'audio' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
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
                    ? 'E.g. Create a vertical Instagram product reveal with neon reflections...'
                    : quickMode === 'image'
                    ? 'E.g. Photorealistic futuristic sneaker floating in water...'
                    : 'E.g. Enter voice narration dialogue...'
                }
                className="flex-1 bg-[#0E1017] text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />

              <button
                type="button"
                onClick={handleQuickCreate}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick-Start Workflow Tiles */}
          <div>
            <h2 className="text-base font-bold text-white mb-4">Quick Workflows</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Text to Video', desc: 'Direct prompt to cinematic cut', icon: Video, color: 'text-violet-400', href: '/create?mode=video' },
                { title: 'Script to Storyboard', desc: 'Paste text or article URL', icon: Sparkles, color: 'text-sky-400', href: '/create?mode=video&preset=script' },
                { title: 'Product Commercial', desc: 'Animate uploaded image shot', icon: ImageIcon, color: 'text-pink-400', href: '/create?mode=video&preset=product' },
                { title: 'Voiceover & Captions', desc: 'Neural voice in 29+ languages', icon: Mic, color: 'text-emerald-400', href: '/create?mode=audio' },
              ].map((wf, idx) => {
                const Icon = wf.icon;
                return (
                  <Link
                    key={idx}
                    href={wf.href}
                    className="p-4 rounded-xl glass-panel border border-white/5 hover:border-violet-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                        <Icon className={`w-5 h-5 ${wf.color}`} />
                      </div>
                      <h3 className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors">
                        {wf.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">{wf.desc}</p>
                    </div>
                    <span className="mt-4 text-[11px] font-semibold text-violet-400 flex items-center gap-1">
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
                <h2 className="text-base font-bold text-white">Recent Projects</h2>
                <span className="text-xs font-mono text-slate-500">({projects.length})</span>
              </div>
              <Link
                href="/create"
                className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-12 text-center rounded-2xl glass-panel border border-white/5">
                <Video className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No projects created yet</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                  Start from a text prompt or select one of our curated templates to generate your first scene.
                </p>
                <Link
                  href="/create"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold"
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
                    className="rounded-2xl glass-panel border border-white/10 overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col justify-between"
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
                          <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-violet-300 border border-violet-500/30 uppercase">
                            {proj.mediaType}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                            proj.status === 'completed' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                          }`}>
                            {proj.status}
                          </span>
                        </div>

                        {/* Favorite button */}
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                            proj.isFavorite ? 'bg-amber-500 text-black' : 'bg-black/60 text-slate-300 hover:text-white'
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
                          <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
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
                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 border-t border-white/5 bg-[#0C0E14] flex items-center justify-between text-xs">
                      <Link
                        href={`/editor/${proj.id}`}
                        className="text-violet-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Studio</span>
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

          {/* Recent AI Generations Ledger / Queue */}
          <div>
            <h2 className="text-base font-bold text-white mb-4">Recent Generation Jobs</h2>
            <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
              {jobs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No jobs submitted yet.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          job.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : job.status === 'failed'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-violet-500/20 text-violet-400 animate-pulse'
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white line-clamp-1 max-w-md">
                            {job.input?.prompt || 'AI Generation Task'}
                          </p>
                          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5">
                            <span>{job.modelId}</span>
                            <span>•</span>
                            <span>{job.actualCredits || job.estimatedCredits} credits</span>
                            <span>•</span>
                            <span className="capitalize">{job.status}</span>
                            {job.output?.isDemoSimulated && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded">Demo Mode</span>
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
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium flex items-center gap-1.5 text-xs"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </a>
                        )}
                        {job.projectId && (
                          <Link
                            href={`/editor/${job.projectId}`}
                            className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs"
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
          <div className="bg-[#12141A] border border-white/15 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Rename Project</h3>
            <input
              type="text"
              value={renameModal.title}
              onChange={(e) => setRenameModal({ ...renameModal, title: e.target.value })}
              className="w-full bg-[#0E1017] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRenameModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRenameConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white"
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
          <div className="bg-[#12141A] border border-white/15 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Delete Project</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete <strong className="text-white">{deleteModal.title}</strong>? You can restore it from trash within 30 days.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
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
