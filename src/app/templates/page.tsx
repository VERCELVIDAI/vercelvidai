'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Sparkles,
  Flame,
  Users,
  Trophy,
  Upload,
  X,
  Ratio,
  SlidersHorizontal,
  Film,
  Zap,
  ArrowRight,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Lock,
  Image as ImageIcon,
  Type,
  Layers,
  Wand2,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { DiscoveryCard } from '@/components/templates/DiscoveryCard';
import { FloatingPromptComposer } from '@/components/templates/FloatingPromptComposer';
import { DiscoveryDetailModal } from '@/components/templates/DiscoveryDetailModal';
import { PublishTemplateModal } from '@/components/templates/PublishTemplateModal';
import { EventsView } from '@/components/templates/EventsView';
import {
  ALL_CURATED_TEMPLATES,
  TEMPLATES_DATA,
  TEMPLATE_CATEGORIES,
  CreativeTemplate,
  VideoTemplate,
} from '@/lib/templates';

const DISCOVERY_CATEGORIES = [
  'All Categories',
  'Product Commercials & Product Showcase Ads',
  'E-commerce Product Ads',
  'Cinematic Automotive & Vehicle Ads',
  'Brand Promotion & Advertising Films',
  'Social Media Reels & Viral Short Videos',
  'AI Influencer & UGC-Style Ads',
  'Fashion, Beauty & Lifestyle Campaigns',
  'Food, Beverage & Restaurant Commercials',
  'Technology & SaaS Product Explainers',
  'Real Estate & Architecture Videos',
  'Cinematic Logo Reveals & Brand Intros',
  'Professional Storytelling & Promotional Videos',
];

interface FormatTab {
  id: 'all' | 'video' | 'image' | 'text-animation';
  label: string;
  icon: any;
  badge?: string;
}

const FORMAT_TABS: FormatTab[] = [
  { id: 'all', label: 'All Formats', icon: Layers },
  { id: 'video', label: 'AI Video', icon: Film, badge: '15 cr' },
  { id: 'image', label: 'AI Image', icon: ImageIcon, badge: '5 cr' },
  { id: 'text-animation', label: 'Text Animation', icon: Type, badge: 'Free' },
];

function DiscoveryFeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Feed Tab state: 'recommended' | 'following' | 'events'
  const initialTab = (searchParams.get('tab') as 'recommended' | 'following' | 'events') || 'recommended';
  const [activeTab, setActiveTab] = useState<'recommended' | 'following' | 'events'>(initialTab);

  // Creative Format state: 'all' | 'video' | 'image' | 'text-animation'
  const initialType = (searchParams.get('type') as 'all' | 'video' | 'image' | 'text-animation') || 'all';
  const [selectedType, setSelectedType] = useState<'all' | 'video' | 'image' | 'text-animation'>(initialType);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedAspect, setSelectedAspect] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  // Data state
  const [templates, setTemplates] = useState<CreativeTemplate[]>(ALL_CURATED_TEMPLATES);
  const [formatCounts, setFormatCounts] = useState({
    all: 53,
    video: 26,
    image: 15,
    textAnimation: 12,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedCreators, setSuggestedCreators] = useState<any[]>([]);

  // User state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userFollows, setUserFollows] = useState<Set<string>>(new Set());

  // Interactive UI state
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<CreativeTemplate | null>(null);
  const [composerTemplate, setComposerTemplate] = useState<CreativeTemplate | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load current user profile & wallet credits
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch templates from API
  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('tab', activeTab);
      if (selectedType !== 'all') params.set('type', selectedType);
      if (selectedCategory !== 'All Categories' && selectedCategory !== 'All') {
        params.set('category', selectedCategory);
      }
      if (selectedAspect !== 'all') params.set('aspect', selectedAspect);
      if (debouncedQuery) params.set('search', debouncedQuery);

      const res = await fetch(`/api/templates?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.templates) {
          setTemplates(data.templates);
        }
        if (data.userLikes) {
          setUserLikes(new Set(data.userLikes));
        }
        if (data.userFollows) {
          setUserFollows(new Set(data.userFollows));
        }
        if (data.suggestedCreators) {
          setSuggestedCreators(data.suggestedCreators);
        }
        if (data.counts) {
          setFormatCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedType, selectedCategory, selectedAspect, debouncedQuery]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Pause playback when tab is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setActivePlayingId(null);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle Like Toggle
  const handleToggleLike = async (templateId: string) => {
    if (!currentUser) {
      router.push(`/login?redirect=/templates&likeIntent=${templateId}`);
      return;
    }

    try {
      const res = await fetch('/api/templates/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });

      if (res.ok) {
        const data = await res.json();
        setUserLikes((prev) => {
          const next = new Set(prev);
          if (data.liked) next.add(templateId);
          else next.delete(templateId);
          return next;
        });

        setTemplates((prev) =>
          prev.map((t) =>
            t.id === templateId
              ? { ...t, likesCount: data.likeCount, isLiked: data.liked }
              : t
          )
        );
      }
    } catch (e) {
      console.error('Like error:', e);
    }
  };

  // Handle Creator Follow Toggle
  const handleToggleFollow = async (creatorId: string) => {
    if (!currentUser) {
      router.push(`/login?redirect=/templates&followIntent=${creatorId}`);
      return;
    }

    try {
      const res = await fetch('/api/templates/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId }),
      });

      if (res.ok) {
        const data = await res.json();
        setUserFollows((prev) => {
          const next = new Set(prev);
          if (data.following) next.add(creatorId);
          else next.delete(creatorId);
          return next;
        });

        if (activeTab === 'following' && !data.following) {
          fetchFeed();
        }
      }
    } catch (e) {
      console.error('Follow error:', e);
    }
  };

  // Handle "Use Template" click: Smart Routing based on Template Type
  const handleUseTemplate = (template: CreativeTemplate) => {
    if (template.type === 'image') {
      router.push(`/ai-image-generator?prompt=${encodeURIComponent(template.prompt)}&aspect=${encodeURIComponent(template.aspect)}`);
    } else if (template.type === 'text-animation') {
      setSelectedTemplateForModal(template);
    } else {
      setComposerTemplate(template);
    }
  };

  // Handle joining a challenge from Events tab
  const handleJoinChallenge = (prompt: string, category: string) => {
    setActiveTab('recommended');
    setSelectedType('video');
    setComposerTemplate({
      id: 'challenge_prompt',
      slug: 'challenge-entry',
      title: 'Challenge Entry Spot',
      category,
      aspect: '16:9',
      aspectLabel: '16:9 Landscape',
      durationSec: 15,
      duration: '15s',
      thumbnail: '',
      videoPreview: '',
      description: prompt,
      prompt,
      creatorId: 'usr_event',
      creatorName: '@fluvia_arena',
      creatorAvatar: '',
      likesCount: 0,
      tags: ['#ChallengeEntry'],
      scenes: [],
      aiModelsUsed: ['Google Gemini (gemini-omni-1.1-flash)'],
      estimatedCredits: 15,
      type: 'video',
      generationWorkflow: 'video_gemini',
    });
  };

  const displayedTemplates = useMemo(() => {
    if (activeTab === 'events') return [];
    return templates;
  }, [templates, activeTab]);

  return (
    <div className="min-h-screen bg-[#080B0A] text-white flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ============================================================== */}
      {/* 1. TOP STICKY DISCOVERY HEADER & FORMAT NAVIGATION */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#080B0A]/95 backdrop-blur-2xl border-b border-white/10 transition-all">
        {/* Main Navigation Row */}
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo & Discovery Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="sm" />
              <span className="hidden sm:inline-flex text-[11px] font-bold font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Creative Studio Feed
              </span>
            </Link>
          </div>

          {/* Center: Feed Stream Tabs (Recommended, Following, Events) */}
          <nav className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'recommended'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/60'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'following'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/60'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Following</span>
              {userFollows.size > 0 && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                  {userFollows.size}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950/60'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Events</span>
            </button>
          </nav>

          {/* Search Input Bar (Desktop) */}
          {activeTab !== 'events' && (
            <div className="relative hidden md:block flex-1 max-w-md">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by prompt, style, format, creator..."
                className="w-full bg-white/5 border border-white/10 text-white text-xs pl-10 pr-9 py-2 rounded-full focus:outline-none focus:border-emerald-500/80 focus:bg-white/10 transition-all placeholder:text-white/35 font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Right: Publish CTA + User Avatar */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  router.push('/login?redirect=/templates&action=publish');
                } else {
                  setIsPublishModalOpen(true);
                }
              }}
              className="px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 shadow-sm transition-all hover:border-emerald-500/40 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Publish</span>
            </button>

            {currentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <span className="hidden sm:inline-flex text-[11px] font-mono font-medium text-emerald-400">
                  Dashboard
                </span>
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/50"
                />
              </Link>
            ) : (
              <Link
                href="/login?redirect=/templates"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/60 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Format Selector Bar: Video, Image, Text Animation */}
        {activeTab !== 'events' && (
          <div className="border-t border-white/10 bg-[#060807] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
            {/* Format Pill Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              {FORMAT_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedType === tab.id;
                const count =
                  tab.id === 'all'
                    ? formatCounts.all
                    : tab.id === 'video'
                    ? formatCounts.video
                    : tab.id === 'image'
                    ? formatCounts.image
                    : formatCounts.textAnimation;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedType(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? tab.id === 'image'
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-950/60'
                          : tab.id === 'text-animation'
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-cyan-950/60'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-950/60'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-black/40 text-white/90">
                      {count}
                    </span>
                    {tab.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white/15 text-white/90">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Category Dropdown Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
              >
                {DISCOVERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#121915] text-white">
                    {cat}
                  </option>
                ))}
              </select>

              {/* Aspect Ratio Filter Selector on Right */}
              <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/10">
                <span className="text-xs text-white/50 flex items-center gap-1 font-mono">
                  <Ratio className="w-3 h-3 text-emerald-400" />
                </span>
                {[
                  { label: 'All', value: 'all' },
                  { label: '16:9', value: '16:9' },
                  { label: '9:16', value: '9:16' },
                  { label: '1:1', value: '1:1' },
                  { label: '4:5', value: '4:5' },
                ].map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => setSelectedAspect(a.value)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedAspect === a.value
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN CREATIVE GALLERY CONTENT AREA */}
      {/* ============================================================== */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-32">
        {/* Spotlight Showcase Banner for Curated Collections */}
        {activeTab === 'recommended' && !searchQuery && selectedCategory === 'All Categories' && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-black/60 border border-emerald-500/20 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Curated Commercial Production Suite</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  53 Production-Grade Creative Templates
                </h2>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl">
                  Curated across <strong>AI Video</strong> (Gemini Omni Flash • 15 cr), <strong>AI Image</strong> (Gemini Imagen • 5 cr), and <strong>Deterministic Text Animation</strong> (Free Live Engine).
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <Link
                  href="/create"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all hover:scale-[1.02]"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Open Video Studio</span>
                </Link>
                <Link
                  href="/ai-image-generator"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>AI Image Studio</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab Body */}
        {activeTab === 'events' ? (
          /* EVENTS TAB VIEW */
          <EventsView onJoinChallenge={handleJoinChallenge} />
        ) : activeTab === 'following' && displayedTemplates.length === 0 ? (
          /* FOLLOWING EMPTY STATE WITH SUGGESTED CREATORS */
          <div className="py-16 text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Your Following Feed is Empty</h3>
              <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-md mx-auto">
                Follow top AI creators, commercial directors, and motion designers to see their latest generation templates here.
              </p>
            </div>

            {/* Suggested Top Creators Grid */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {suggestedCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-500/40 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{creator.name}</h4>
                      <p className="text-[11px] text-white/50 truncate">{creator.bio}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFollow(creator.id)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shrink-0 shadow-sm"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className="mt-6 text-xs text-emerald-400 hover:underline font-semibold"
            >
              ← Back to Recommended Feed
            </button>
          </div>
        ) : displayedTemplates.length === 0 ? (
          /* EMPTY SEARCH / FILTER RESULTS */
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <Film className="w-12 h-12 text-white/30 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Templates Found</h3>
            <p className="text-xs text-white/60">
              We couldn&apos;t find any templates matching your filter criteria. Try resetting the category, format, or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('all');
                setSelectedCategory('All Categories');
                setSelectedAspect('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-emerald-500 text-black text-xs font-bold shadow-md hover:bg-emerald-400 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* ============================================================== */
          /* 3. DENSE MULTI-COLUMN PINTEREST-STYLE MASONRY GRID */
          /* ============================================================== */
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {displayedTemplates.map((template) => (
              <DiscoveryCard
                key={template.id}
                template={template}
                isActivePlaying={activePlayingId === template.id}
                onHoverStart={(id) => setActivePlayingId(id)}
                onHoverEnd={() => setActivePlayingId(null)}
                onSelect={(tmpl) => setSelectedTemplateForModal(tmpl)}
                onUseTemplate={(tmpl) => handleUseTemplate(tmpl)}
                onToggleLike={handleToggleLike}
                onToggleFollow={handleToggleFollow}
                isLiked={userLikes.has(template.id)}
                isFollowing={userFollows.has(template.creatorId)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 4. FLOATING AI PROMPT COMPOSER AT BOTTOM CENTER */}
      {/* ============================================================== */}
      <FloatingPromptComposer
        selectedTemplate={composerTemplate}
        onClearTemplate={() => setComposerTemplate(null)}
        userCredits={currentUser?.credits || 100}
      />

      {/* ============================================================== */}
      {/* 5. EXPANDED DETAIL VIEW MODAL */}
      {/* ============================================================== */}
      <DiscoveryDetailModal
        template={selectedTemplateForModal}
        onClose={() => setSelectedTemplateForModal(null)}
        onUseInComposer={(tmpl) => handleUseTemplate(tmpl)}
        onToggleLike={handleToggleLike}
        onToggleFollow={handleToggleFollow}
        isLiked={selectedTemplateForModal ? userLikes.has(selectedTemplateForModal.id) : false}
        isFollowing={selectedTemplateForModal ? userFollows.has(selectedTemplateForModal.creatorId) : false}
      />

      {/* ============================================================== */}
      {/* 6. PUBLISH TEMPLATE MODAL */}
      {/* ============================================================== */}
      <PublishTemplateModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublished={(newTmpl) => {
          setTemplates((prev) => [newTmpl, ...prev]);
        }}
      />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080B0A] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DiscoveryFeedContent />
    </Suspense>
  );
}
