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
  Clock,
  Edit2,
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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
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
    <div
      className="min-h-screen flex transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Project Library</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Search, duplicate, favorite, and manage your timeline compositions.
              </p>
            </div>

            <Link
              href="/create"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#12141A] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  onlyFavorites ? 'bg-amber-500 text-black' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Favorites</span>
              </button>

              {['all', 'video', 'completed', 'draft'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    filterType === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-panel border border-white/5">
              <FolderKanban className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-white text-base">No matching projects</h3>
              <p className="mt-1 text-xs text-slate-400">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl glass-panel border border-white/10 overflow-hidden group hover:border-violet-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-slate-900">
                      <img
                        src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                          proj.isFavorite ? 'bg-amber-500 text-black' : 'bg-black/60 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <Link
                        href={`/editor/${proj.id}`}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                      >
                        <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </Link>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-white text-sm truncate">{proj.title}</h3>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-2">{proj.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t border-white/5 bg-[#0C0E14] flex items-center justify-between text-xs">
                    <Link
                      href={`/editor/${proj.id}`}
                      className="text-violet-400 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Open Editor</span>
                    </Link>

                    <div className="flex items-center gap-2 text-slate-400">
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
                        onClick={() => handleDelete(proj.id)}
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
        </main>
      </div>
    </div>
  );
}
