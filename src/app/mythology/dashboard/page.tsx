'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Video,
  Play,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Coins,
  Sparkles,
  Layers,
  Clock,
  Film,
} from 'lucide-react';
import { MythProject } from '@/lib/mythology/types';
import { MythologyPlayerModal } from '@/components/mythology/MythologyPlayerModal';

export default function MythologyVideosDashboardPage() {
  const [projects, setProjects] = useState<MythProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlayer, setActivePlayer] = useState<{
    isOpen: boolean;
    title: string;
    videoUrl: string;
    source?: string;
  }>({
    isOpen: false,
    title: '',
    videoUrl: '',
  });

  useEffect(() => {
    fetch('/api/mythology/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) setProjects(data.projects);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mythology project?')) return;
    try {
      const res = await fetch(`/api/mythology/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const completedVideos = projects.filter((p) => p.status === 'ready');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Epic Videos
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {projects.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Ready for Download
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {completedVideos.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Active Plan
            </span>
            <div className="text-sm font-black text-slate-900 dark:text-white mt-1">
              Mythos Creator
            </div>
          </div>
          <Link
            href="/mythology/pricing"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-amber-500" />
            My Mythology Videos & Drafts
          </h2>

          <Link
            href="/mythology/studio"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Video</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 font-medium text-xs">
            Loading your mythology epics...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 bg-white dark:bg-slate-900">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No mythology videos yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Turn your first sacred story or puranic legend into an AI-narrated vertical video.
            </p>
            <Link
              href="/mythology/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-500/25"
            >
              <span>Launch Studio</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const preview = proj.thumbnailUrl || proj.scenes?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80';
              const isReady = proj.status === 'ready';

              return (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-amber-500/40 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={preview}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm text-white ${
                        isReady ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}>
                        {isReady ? 'Ready' : 'Draft'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">
                        {proj.language === 'hi' ? 'हिंदी' : 'Eng'}
                      </span>
                    </div>

                    {isReady && (
                      <button
                        type="button"
                        onClick={() =>
                          setActivePlayer({
                            isOpen: true,
                            title: proj.title,
                            videoUrl: proj.exportedVideos?.[0]?.videoUrl || preview,
                            source: proj.sourceNote,
                          })
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {proj.storyConcept}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {proj.targetDurationSec}s • {proj.scenes?.length || 0} scenes
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/mythology/studio/${proj.id}`}
                          className="px-2.5 py-1 rounded-lg border text-slate-700 dark:text-slate-300 hover:text-amber-500 font-bold text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(proj.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Playback Modal */}
      <MythologyPlayerModal
        isOpen={activePlayer.isOpen}
        onClose={() => setActivePlayer({ ...activePlayer, isOpen: false })}
        title={activePlayer.title}
        videoUrl={activePlayer.videoUrl}
        source={activePlayer.source}
      />
    </div>
  );
}
