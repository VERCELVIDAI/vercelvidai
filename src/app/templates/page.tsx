'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { VideoPreviewModal } from '@/components/templates/VideoPreviewModal';
import {
  TEMPLATES_DATA,
  TEMPLATE_CATEGORIES,
  VideoTemplate,
  TemplateCategory,
} from '@/lib/templates';
import {
  Search,
  Sparkles,
  Ratio,
  SlidersHorizontal,
  Flame,
  Film,
  X,
  Play,
  ArrowRight,
} from 'lucide-react';

function TemplateExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state support
  const initialCategory = (searchParams.get('category') as TemplateCategory) || 'All Templates';
  const initialAspect = searchParams.get('aspect') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedAspect, setSelectedAspect] = useState<string>(initialAspect);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'trending' | 'duration' | 'name'>('trending');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<VideoTemplate | null>(null);
  const [isCloning, setIsCloning] = useState<string | null>(null);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluvia_favorite_templates') || localStorage.getItem('vidai_favorite_templates');
      if (saved) setFavorites(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId];
      try {
        localStorage.setItem('fluvia_favorite_templates', JSON.stringify(updated));
        localStorage.setItem('vidai_favorite_templates', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Filter and Sort templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter((tmpl) => {
      // Category filter
      if (selectedCategory === 'Trending') {
        if (tmpl.badge !== 'Trending' && tmpl.badge !== 'Hot') return false;
      } else if (selectedCategory !== 'All Templates' && tmpl.category !== selectedCategory) {
        return false;
      }

      // Aspect ratio filter
      if (selectedAspect !== 'all' && tmpl.aspect !== selectedAspect) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tmpl.title.toLowerCase().includes(q);
        const matchesDesc = tmpl.description.toLowerCase().includes(q);
        const matchesCategory = tmpl.category.toLowerCase().includes(q);
        const matchesTags = tmpl.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'duration') return a.durationSec - b.durationSec;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      // 'trending'
      const aWeight = a.badge === 'Trending' ? 2 : a.badge === 'Hot' ? 1 : 0;
      const bWeight = b.badge === 'Trending' ? 2 : b.badge === 'Hot' ? 1 : 0;
      return bWeight - aWeight;
    });
  }, [selectedCategory, selectedAspect, searchQuery, sortBy]);

  // Working "Use Template" Flow
  const handleUseTemplate = async (template: VideoTemplate) => {
    setIsCloning(template.id);
    try {
      // 1. Check authentication status
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        // Unauthenticated: preserve intent in returnUrl
        router.push(
          `/login?returnUrl=${encodeURIComponent(`/templates/${template.slug}`)}&useTemplate=true`
        );
        return;
      }

      // 2. Instantiate independent new project from template
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${template.title} (Project)`,
          mediaType: 'video',
          thumbnailUrl: template.thumbnail,
          timeline: {
            durationSec: template.durationSec,
            aspectRatio: template.aspect,
            resolution: '1080p',
            tracks: [
              { id: 'trk_v1', type: 'video', name: 'Video Scenes' },
              { id: 'trk_t1', type: 'text', name: 'Subtitles & Captions' },
              { id: 'trk_a1', type: 'audio', name: 'Soundtrack & Voice' },
            ],
            clips: [
              {
                id: `clp_v_${Date.now()}_1`,
                trackId: 'trk_v1',
                type: 'video',
                title: template.scenes[0]?.title || 'Opening Hook',
                sourceUrl: template.videoPreview,
                startTimeSec: 0,
                durationSec: template.durationSec,
                volume: 1,
              },
            ],
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create project from template');
      }

      const data = await res.json();
      // 3. Open project directly in the multi-track editor
      router.push(`/editor/${data.project.id}`);
    } catch (err: any) {
      alert(`Error initializing template: ${err.message}`);
      setIsCloning(null);
    }
  };

  return (
    <>
      {/* SEARCH & FILTER CONTROLS */}
      <div className="space-y-6 mb-10">
        {/* Search Bar + Aspect Toggle + Sorter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by category, style, keyword (e.g. Perfume, UGC, Fashion)..."
              className="w-full bg-white text-[#17211D] pl-10 pr-9 py-2.5 rounded-xl border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm shadow-xs transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Aspect Ratio Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 shrink-0">
              <Ratio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aspect:</span>
            </span>
            {[
              { label: 'All', value: 'all' },
              { label: '16:9 Landscape', value: '16:9' },
              { label: '9:16 Vertical', value: '9:16' },
              { label: '1:1 Square', value: '1:1' },
            ].map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setSelectedAspect(a.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                  selectedAspect === a.value
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-700 hover:text-[#17211D] border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-50/30'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white text-[#17211D] text-xs px-3 py-1.5 rounded-lg border border-emerald-500/20 focus:outline-none focus:border-emerald-500 font-medium shadow-xs cursor-pointer"
            >
              <option value="trending">Trending & ROI</option>
              <option value="duration">Shortest First</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (All 18 Categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const count =
              cat === 'All Templates'
                ? TEMPLATES_DATA.length
                : cat === 'Trending'
                ? TEMPLATES_DATA.filter((t) => t.badge === 'Trending' || t.badge === 'Hot').length
                : TEMPLATES_DATA.filter((t) => t.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white/80 text-slate-700 hover:text-[#17211D] border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-50/40'
                }`}
              >
                {cat === 'Trending' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TEMPLATE GRID */}
      {filteredTemplates.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-emerald-500/20 p-8 shadow-sm">
          <Film className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#17211D]">
            No matching templates found
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, selecting &quot;All Templates&quot;, or resetting the aspect ratio filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Templates');
              setSelectedAspect('all');
              setSearchQuery('');
            }}
            className="mt-6 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={(t) => setPreviewTemplate(t)}
              onUseTemplate={(t) => handleUseTemplate(t)}
              isFavorited={favorites.includes(template.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* EXPANDED VIDEO PREVIEW MODAL */}
      <VideoPreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={(t) => handleUseTemplate(t)}
        onSelectRelated={(r) => setPreviewTemplate(r)}
      />
    </>
  );
}

export default function TemplatesPage() {
  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F0FDF4]/40"
      style={{
        color: '#17211D',
      }}
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* HERO HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/25 text-xs font-semibold text-emerald-800 mb-6 backdrop-blur-md shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Curated Creative Library</span>
            <span className="text-emerald-300">•</span>
            <span>18 Production-Ready Video Presets</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#17211D] tracking-tight leading-[1.14]">
            Start with a template.{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-pink-600 bg-clip-text text-transparent">
              Finish with something extraordinary.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Explore 18 cinematic video templates for commercials, product reels, fashion campaigns, and social stories.
          </p>
        </div>

        <Suspense fallback={<div className="py-20 text-center font-mono text-xs text-slate-400">Loading interactive template catalog...</div>}>
          <TemplateExplorer />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
