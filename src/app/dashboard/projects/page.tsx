'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  FolderKanban,
  Search,
  Star,
  Plus,
  Play,
  Copy,
  Trash2,
  FolderOpen,
} from 'lucide-react';

export default function ProjectsLibraryPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const [authRes, projRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/projects'),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (projRes.ok) {
        const p = await projRes.json();
        setProjects(p.projects || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleFavorite = async (projectId: string, currentFav: boolean) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentFav }),
      });
      fetchProjects();
    } catch (e) {}
  };

  const handleDuplicate = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate' }),
      });
      fetchProjects();
    } catch (e) {}
  };

  const handleDelete = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      fetchProjects();
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading project vault...</span>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  const filtered = projects
    .filter((p) => (filterType === 'all' ? true : p.mediaType === filterType || p.status === filterType))
    .filter((p) => (onlyFavorites ? p.isFavorite : true))
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#070A0F] text-white relative selection:bg-[#d4ff00] selection:text-black">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#070A0F] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-left">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
            <div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-violet-400" />
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Project Vault & Timeline Media</h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Organize, preview, duplicate, and remix your commercial video compositions and rendered assets.
              </p>
            </div>

            <Link
              href="/create"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.35)] shrink-0 transition-all cursor-pointer self-start sm:self-auto border border-violet-400/30"
            >
              <Plus className="w-4 h-4 text-[#d4ff00]" />
              <span>Create New Project</span>
            </Link>
          </div>

          {/* Search, Filter Tabs & Metrics Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#0E121B]/95 border-2 border-slate-800 p-3.5 rounded-2xl shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141A26] text-white pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-800 focus:outline-none focus:border-violet-500 placeholder:text-slate-500 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                    : 'bg-[#141A26] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Favorites</span>
              </button>

              {['all', 'video', 'completed', 'draft'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    filterType === f
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-[#141A26] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Project Media Grid */}
          {filtered.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-3 shadow-2xl">
              <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-black text-white text-base">No Matching Projects Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Adjust your search query or start a new creative project.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                <Plus className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Create Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 overflow-hidden group hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Media Thumbnail */}
                    <div className="aspect-video relative overflow-hidden bg-black">
                      <img
                        src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 backdrop-blur-md text-slate-400 hover:text-amber-400 cursor-pointer border border-white/10 shadow-xs"
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white font-bold border border-white/15">
                          {proj.aspectRatio || '16:9'}
                        </span>
                        <span className="text-slate-300 drop-shadow-sm font-medium">
                          {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-white text-sm truncate group-hover:text-violet-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Status: <span className="text-violet-400 font-bold capitalize">{proj.status || 'Active'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/create?projectId=${proj.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-violet-500/40 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current text-[#d4ff00]" />
                      <span>Timeline Editor</span>
                    </Link>

                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(proj.id)}
                        title="Duplicate project"
                        className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj.id)}
                        title="Delete project"
                        className="p-1.5 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
