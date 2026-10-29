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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
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
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#F7F8FA]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#5145CD]" />
                <h1 className="text-xl font-bold text-[#17191D]">Project Vault & Timeline Media</h1>
              </div>
              <p className="mt-1 text-sm text-[#667085]">
                Organize, preview, duplicate, and remix your commercial video compositions and rendered assets.
              </p>
            </div>

            <Link
              href="/create"
              className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </Link>
          </div>

          {/* Search, Filter Tabs & Metrics Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white border border-[#E5E7EB] p-3 rounded-2xl shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F8FA] text-[#17191D] pl-10 pr-4 py-2 rounded-xl text-xs border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] placeholder:text-[#667085]/60 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/30 font-semibold'
                    : 'bg-[#F7F8FA] text-[#667085] hover:text-[#17191D] border border-[#E5E7EB]'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>Favorites</span>
              </button>

              {['all', 'video', 'completed', 'draft'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                    filterType === f
                      ? 'bg-[#5145CD] text-white shadow-xs'
                      : 'bg-[#F7F8FA] text-[#667085] hover:text-[#17191D] border border-[#E5E7EB]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Project Media Grid */}
          {filtered.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
              <FolderKanban className="w-12 h-12 text-[#667085]/40 mx-auto" />
              <h3 className="font-bold text-[#17191D] text-base">No Matching Projects Found</h3>
              <p className="text-xs text-[#667085] max-w-sm mx-auto">
                Adjust your search query or start a new creation in the AI Studio.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Launch Studio</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden group hover:border-[#5145CD]/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Media Thumbnail */}
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img
                        src={proj.thumbnailUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(proj.id, proj.isFavorite)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-[#667085] hover:text-amber-500 cursor-pointer border border-[#E5E7EB] shadow-xs"
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-md text-[#17191D] font-medium border border-[#E5E7EB]">
                          {proj.aspectRatio || '16:9'}
                        </span>
                        <span className="text-white drop-shadow-sm font-medium">
                          {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-1">
                      <h3 className="font-semibold text-[#17191D] text-sm truncate group-hover:text-[#5145CD] transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-[#667085]">
                        Status: <span className="text-[#5145CD] font-medium capitalize">{proj.status || 'Active'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                    <Link
                      href={`/editor/${proj.id}`}
                      className="px-3 py-1.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Timeline Editor</span>
                    </Link>

                    <div className="flex items-center gap-1 text-[#667085]">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(proj.id)}
                        title="Duplicate project"
                        className="p-1.5 hover:text-[#17191D] rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj.id)}
                        title="Delete project"
                        className="p-1.5 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
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
