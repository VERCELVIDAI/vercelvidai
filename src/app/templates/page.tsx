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
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col">
      {/* ============================================================== */}
      {/* 1. TOP STICKY DISCOVERY HEADER & FORMAT NAVIGATION */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E5E7EB] transition-all">
        {/* Main Navigation Row */}
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Brand Logo & Discovery Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo size="sm" />
              <span className="hidden sm:inline-flex text-[11px] font-semibold uppercase tracking-wider text-[#5145CD] bg-[#EEF2FF] border border-[#5145CD]/20 px-2.5 py-0.5 rounded-full">
                Templates Library
              </span>
            </Link>
          </div>

          {/* Center: Feed Stream Tabs (Recommended, Following, Events) */}
          <nav className="flex items-center bg-[#F7F8FA] border border-[#E5E7EB] rounded-full p-1 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'recommended'
                  ? 'bg-[#5145CD] text-white shadow-2xs'
                  : 'text-[#667085] hover:text-[#17191D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'following'
                  ? 'bg-[#5145CD] text-white shadow-2xs'
                  : 'text-[#667085] hover:text-[#17191D]'
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-[#5145CD] text-white shadow-2xs'
                  : 'text-[#667085] hover:text-[#17191D]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Challenges</span>
            </button>
          </nav>

          {/* Search Input Bar (Desktop) */}
          {activeTab !== 'events' && (
            <div className="relative hidden md:block flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by product, style, category..."
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-xs pl-10 pr-9 py-2 rounded-full focus:outline-none focus:border-[#5145CD] focus:bg-white transition-all placeholder:text-[#667085]/60 font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#17191D] p-0.5"
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
              className="px-3 sm:px-4 py-2 rounded-full bg-white hover:bg-[#F7F8FA] text-[#17191D] font-semibold text-xs flex items-center gap-1.5 border border-[#E5E7EB] shadow-2xs transition-all hover:border-[#5145CD]/40 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Publish</span>
            </button>

            {currentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] transition-colors"
              >
                <span className="hidden sm:inline-flex text-[11px] font-mono font-medium text-[#5145CD]">
                  Dashboard
                </span>
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#5145CD]/40"
                />
              </Link>
            ) : (
              <Link
                href="/login?redirect=/templates"
                className="px-4 py-2 rounded-full bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs shadow-2xs transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Format Selector Bar: Video, Image, Text Animation */}
        {activeTab !== 'events' && (
          <div className="border-t border-[#E5E7EB] bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
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
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#5145CD] text-white shadow-2xs'
                        : 'bg-white text-[#667085] hover:text-[#17191D] hover:bg-slate-50 border border-[#E5E7EB]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 text-[#17191D]">
                      {count}
                    </span>
                    {tab.badge && (
                      <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-[#EEF2FF] text-[#5145CD]">
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
                className="bg-white border border-[#E5E7EB] text-[#17191D] text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#5145CD] font-medium cursor-pointer shadow-2xs"
              >
                {DISCOVERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Aspect Ratio Filter Selector on Right */}
              <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-[#E5E7EB]">
                <span className="text-xs text-[#667085] flex items-center gap-1 font-mono">
                  <Ratio className="w-3 h-3 text-[#5145CD]" />
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
                        ? 'bg-[#EEF2FF] text-[#5145CD] font-semibold border border-[#5145CD]/30'
                        : 'text-[#667085] hover:text-[#17191D]'
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
          <div className="mb-8 p-6 sm:p-7 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] relative overflow-hidden shadow-2xs">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-[#5145CD] text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#5145CD]" />
                  <span>Curated Commercial Production Suite</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#17191D] tracking-tight">
                  Production-Ready Ad Storyboards
                </h2>
                <p className="text-xs sm:text-sm text-[#667085] max-w-2xl">
                  Curated across <strong>AI Video</strong> (Gemini Omni 1.1 Flash • 15 cr), <strong>AI Image</strong> (Gemini 3.1 Flash Image • 5 cr), and <strong>Kinetic Typography</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <Link
                  href="/create?mode=video"
                  className="px-4 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Open Video Studio</span>
                </Link>
                <Link
                  href="/create?mode=image"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] font-semibold text-xs flex items-center gap-1.5 border border-[#E5E7EB] transition-colors shadow-2xs"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#5145CD]" />
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
            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#5145CD]/20 flex items-center justify-center text-[#5145CD] mx-auto">
              <Users className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#17191D]">Your Following Feed is Empty</h3>
              <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-md mx-auto">
                Follow top AI creators, commercial directors, and motion designers to see their latest generation templates here.
              </p>
            </div>

            {/* Suggested Top Creators Grid */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {suggestedCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="p-4 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between gap-3 hover:border-[#D1D5DB] transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#5145CD]/30 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#17191D] truncate">{creator.name}</h4>
                      <p className="text-[11px] text-[#667085] truncate">{creator.bio}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFollow(creator.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs shrink-0 shadow-2xs"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('recommended')}
              className="mt-6 text-xs text-[#5145CD] hover:underline font-semibold"
            >
              ← Back to Recommended Feed
            </button>
          </div>
        ) : displayedTemplates.length === 0 ? (
          /* EMPTY SEARCH / FILTER RESULTS */
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <Film className="w-12 h-12 text-[#667085]/40 mx-auto" />
            <h3 className="text-lg font-bold text-[#17191D]">No Templates Found</h3>
            <p className="text-xs text-[#667085]">
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
              className="px-4 py-2 rounded-full bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors"
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
        <div className="min-h-screen bg-white flex items-center justify-center text-[#17191D]">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DiscoveryFeedContent />
    </Suspense>
  );
}
