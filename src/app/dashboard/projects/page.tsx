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
  Copy,
  Trash2,
  FolderOpen,
  Film,
  Sparkles,
  ArrowRight,
  Filter,
  SlidersHorizontal,
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
      <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
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
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-[#100A12] text-[#F5EAF4] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#100A12]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#211522] border border-[#39233B] shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#F05BCE]" />
                <h1 className="text-xl font-black text-[#F5EAF4]">Project Vault & Timeline Media</h1>
              </div>
              <p className="mt-1 text-xs text-[#A99AAA]">
                Organize, preview, duplicate, and remix your commercial video compositions and rendered assets.
              </p>
            </div>

            <Link
              href="/create"
              className="px-4 py-2.5 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-[rgba(240,91,206,0.25)] shrink-0 transition-all cursor-pointer border border-white/10 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </Link>
          </div>

          {/* Search, Filter Tabs & Metrics Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#211522] border border-[#39233B] p-3 rounded-2xl shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#A99AAA] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#100A12] text-[#F5EAF4] pl-10 pr-4 py-2 rounded-xl text-xs border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder:text-[#A99AAA]/50 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'bg-[#F05BCE]/20 text-pink-200 border border-[#F05BCE]/40 font-bold'
                    : 'bg-[#100A12] text-[#A99AAA] hover:text-white border border-[#39233B]'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current text-[#F05BCE]" />
                <span>Favorites</span>
              </button>

              {['all', 'video', 'completed', 'draft'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                    filterType === f
                      ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white shadow-xs'
                      : 'bg-[#100A12] text-[#A99AAA] hover:text-white border border-[#39233B]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Project Media Grid */}
          {filtered.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-[#211522] border border-[#39233B] space-y-3 shadow-xl">
              <FolderKanban className="w-12 h-12 text-[#A99AAA]/40 mx-auto" />
              <h3 className="font-bold text-[#F5EAF4] text-base">No Matching Projects Found</h3>
              <p className="text-xs text-[#A99AAA] max-w-sm mx-auto">
                Adjust your search query or start a new creation in the AI Studio.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white text-xs font-bold shadow"
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
                  className="rounded-3xl bg-[#211522] border border-[#39233B] overflow-hidden group hover:border-[#F05BCE]/40 hover:bg-[#2A1B2C] transition-all flex flex-col justify-between shadow-xl"
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
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#A99AAA] hover:text-[#F05BCE] cursor-pointer border border-white/10"
                      >
                        <Star className={`w-3.5 h-3.5 ${proj.isFavorite ? 'text-[#F05BCE] fill-[#F05BCE]' : ''}`} />
                      </button>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white border border-[#39233B]">
                          {proj.aspectRatio || '16:9'}
                        </span>
                        <span className="text-[#A99AAA]">
                          {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-1">
                      <h3 className="font-bold text-[#F5EAF4] text-sm truncate group-hover:text-[#F05BCE] transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-[11px] text-[#A99AAA] font-mono">
                        Status: <span className="text-pink-200 capitalize">{proj.status || 'Active'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-2 border-t border-[#39233B] flex items-center justify-between gap-2">
                    <Link
                      href={`/editor/${proj.id}`}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F05BCE] to-[#C026D3] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Play className="w-3 h-3" />
                      <span>Timeline Editor</span>
                    </Link>

                    <div className="flex items-center gap-1 text-[#A99AAA]">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(proj.id)}
                        title="Duplicate project"
                        className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(proj.id)}
                        title="Delete project"
                        className="p-1.5 hover:text-rose-400 rounded-lg hover:bg-white/10 cursor-pointer"
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
