'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { FirstCampaignModal } from '@/components/promotions/FirstCampaignModal';
import { LiveCrazyBackground } from '@/components/home/LiveCrazyBackground';
import {
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Mic,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Layers,
  ShieldCheck,
  Zap,
  Tag,
  Film,
  Sliders,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdPreset {
  id: string;
  slug: string;
  title: string;
  category: string;
  aspect: '9:16' | '16:9';
  duration: string;
  credits: number;
  badge: string;
  videoUrl: string;
  poster: string;
  prompt: string;
  tags?: string[];
}

const HERO_SLIDES = [
  {
    id: 'slide_01',
    slug: 'empire-cash-viral-ugc-hook',
    title: 'Empire Drop — Viral Cash UGC Hook',
    category: 'Viral UGC Hook',
    aspect: '9:16' as const,
    duration: '15s',
    videoUrl: '/media/templates/tmpl-ugc-wealth-hook.mp4',
    poster: '/media/templates/poster-vid-ugc-wealth.jpg',
    prompt: 'High-energy viral social media hook of young creator in modern penthouse cascading thick brick stacks of hundred-dollar bills, dynamic handheld camera motion, luxury lifestyle aesthetic, natural bedroom window light, photorealistic 4k.',
  },
  {
    id: 'slide_02',
    slug: 'matchday-celebration-football-star',
    title: 'Matchday Celebration — Football Star Reel',
    category: 'Sports & Social Reels',
    aspect: '9:16' as const,
    duration: '6s',
    videoUrl: '/media/templates/tmpl-sports-celebrity-reel.mp4',
    poster: '/media/templates/poster-vid-sports-celebrity.jpg',
    prompt: 'Cinematic celebration reel of football legend in red and green #7 national kit dancing with charismatic motion at gala banquet, studio softbox ambient fill light, sharp depth of field, 4k 60fps.',
  },
  {
    id: 'slide_03',
    slug: 'costa-privee-mediterranean-resort',
    title: 'Costa Privée — Mediterranean Luxury Resort',
    category: 'Luxury Travel & Hospitality',
    aspect: '9:16' as const,
    duration: '11s',
    videoUrl: '/media/templates/tmpl-mediterranean-resort.mp4',
    poster: '/media/templates/poster-vid-mediterranean-resort.jpg',
    prompt: 'Cinematic luxury travel commercial featuring distinguished silver-haired gentleman in crisp white linen shirt relaxing at seaside Mediterranean beach club terrace, warm sunlight, gentle bokeh, luxury vacation vibe, 4k ultra-hd.',
  },
  {
    id: 'slide_04',
    slug: 'veloce-apex-cyber-hyperkart',
    title: 'Veloce Apex — Cyber Hyperkart Reveal',
    category: 'Cinematic Automotive',
    aspect: '9:16' as const,
    duration: '16s',
    videoUrl: '/media/templates/tmpl-cyber-hyperkart.mp4',
    poster: '/media/templates/poster-vid-cyber-hyperkart.jpg',
    prompt: 'Dramatic low-angle commercial reveal of futuristic custom twin-seat electric racing hyperkart in industrial concrete hangar, glossy black aero bodywork, wide track tires, atmospheric volumetric lighting, photorealistic automotive cinematography.',
  },
  {
    id: 'slide_05',
    slug: 'aura-privee-luxury-perfume-commercial',
    title: 'Aura Privée — Luxury Perfume Film',
    category: 'Product Commercial',
    aspect: '16:9' as const,
    duration: '15s',
    videoUrl: '/media/hero/fluvia-hero-showcase.mp4',
    poster: '/media/templates/poster-vid-01-perfume.jpg',
    prompt: 'Ultra-luxury midnight perfume bottle floating over liquid gold ripples, dramatic rim lighting, 4k cinematic commercial.',
  },
];

const VERTICAL_PRESETS: AdPreset[] = [
  {
    id: 'vid_09',
    slug: 'empire-cash-viral-ugc-hook',
    title: 'Empire Drop — Viral Cash UGC Hook',
    category: 'AI Influencer & UGC Hook',
    aspect: '9:16',
    duration: '15s',
    credits: 15,
    badge: 'Viral Hook',
    videoUrl: '/media/templates/tmpl-ugc-wealth-hook.mp4',
    poster: '/media/templates/poster-vid-ugc-wealth.jpg',
    prompt: 'High-energy viral social media hook of young creator in modern penthouse cascading thick brick stacks of hundred-dollar bills, dynamic handheld camera motion, luxury lifestyle aesthetic, natural bedroom window light, photorealistic 4k.',
    tags: ['#ViralHook', '#UGCCreator', '#TikTokAd'],
  },
  {
    id: 'vid_10',
    slug: 'matchday-celebration-football-star',
    title: 'Matchday Celebration — Football Star Reel',
    category: 'Sports & Social Reels',
    aspect: '9:16',
    duration: '6s',
    credits: 15,
    badge: 'Trending',
    videoUrl: '/media/templates/tmpl-sports-celebrity-reel.mp4',
    poster: '/media/templates/poster-vid-sports-celebrity.jpg',
    prompt: 'Cinematic celebration reel of football legend in red and green #7 national kit dancing with charismatic motion at gala banquet, studio softbox ambient fill light, sharp depth of field, 4k 60fps.',
    tags: ['#FootballStar', '#CelebrationReel', '#CR7Vibe'],
  },
  {
    id: 'vid_11',
    slug: 'costa-privee-mediterranean-resort',
    title: 'Costa Privée — Mediterranean Resort',
    category: 'Luxury Travel & Hospitality',
    aspect: '9:16',
    duration: '11s',
    credits: 15,
    badge: 'Featured',
    videoUrl: '/media/templates/tmpl-mediterranean-resort.mp4',
    poster: '/media/templates/poster-vid-mediterranean-resort.jpg',
    prompt: 'Cinematic luxury travel commercial featuring distinguished silver-haired gentleman in crisp white linen shirt relaxing at seaside Mediterranean beach club terrace, warm sunlight, gentle bokeh, luxury vacation vibe, 4k ultra-hd.',
    tags: ['#LuxuryTravel', '#ResortCommercial', '#QuietLuxury'],
  },
  {
    id: 'vid_12',
    slug: 'veloce-apex-cyber-hyperkart',
    title: 'Veloce Apex — Cyber Hyperkart',
    category: 'Automotive & Cinematic Ad',
    aspect: '9:16',
    duration: '16s',
    credits: 15,
    badge: 'Hot Reveal',
    videoUrl: '/media/templates/tmpl-cyber-hyperkart.mp4',
    poster: '/media/templates/poster-vid-cyber-hyperkart.jpg',
    prompt: 'Dramatic low-angle commercial reveal of futuristic custom twin-seat electric racing hyperkart in industrial concrete hangar, glossy black aero bodywork, wide track tires, atmospheric volumetric lighting, photorealistic automotive cinematography.',
    tags: ['#Hyperkart', '#ElectricRacing', '#AutomotiveCommercial'],
  },
];

const FEATURED_AD_TEMPLATES = [
  {
    id: 'tmpl_01',
    slug: 'cinematic-product-commercial',
    title: 'Aura Privée — Luxury Perfume Film',
    category: 'Product Commercial',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    poster: '/media/templates/poster-vid-01-perfume.jpg',
    prompt: 'Ultra-luxury midnight perfume bottle floating over liquid gold ripples, dramatic rim lighting, 4k cinematic commercial.',
  },
  {
    id: 'tmpl_02',
    slug: 'automotive-cinematic-film',
    title: 'AeroGT Hypercar Launch Campaign',
    category: 'Cinematic Automotive',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
    poster: '/media/templates/poster-vid-03-automotive.jpg',
    prompt: 'Sleek aerodynamic concept hypercar drifting through twilight mountain pass, laser grid reflections, photorealistic 8k.',
  },
  {
    id: 'tmpl_03',
    slug: 'skincare-product-reel',
    title: 'HydraLuxe Bio-Cellular Serum',
    category: 'Skincare & Beauty',
    aspect: '9:16',
    duration: '15s',
    credits: 15,
    videoUrl: '/media/templates/tmpl-03-skincare-reel.mp4',
    poster: '/media/templates/poster-vid-02-skincare.jpg',
    prompt: 'Macro slow-motion droplet of golden hydration serum falling onto frosted glass podium, luxury cosmetic aesthetic.',
  },
  {
    id: 'tmpl_04',
    slug: 'technology-product-launch',
    title: 'Apex Titanium Pro Smartphone',
    category: 'Technology & Hardware',
    aspect: '16:9',
    duration: '15s',
    credits: 15,
    videoUrl: '/media/templates/tmpl-09-tech-product.mp4',
    poster: '/media/templates/poster-vid-04-smartphone.jpg',
    prompt: 'Futuristic titanium smartphone rotating seamlessly in zero-gravity space, micro lens reflections, clean studio lighting.',
  },
];

function VerticalPresetCard({ preset }: { preset: AdPreset }) {
  const cardVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardVideoRef.current) {
      cardVideoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardVideoRef.current) {
      cardVideoRef.current.pause();
      cardVideoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="business-card overflow-hidden flex flex-col justify-between group rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 100% CLEAN VIDEO CONTAINER — NO TEXT, NO BADGES OVERLAYED ON THE VIDEO */}
      <div className="relative aspect-[9/16] w-full bg-[#17191D] overflow-hidden">
        <img
          src={preset.poster}
          alt={preset.title}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={cardVideoRef}
          src={preset.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      </div>

      {/* METADATA CLEANLY UNDERNEATH VIDEO (ZERO TEXT ON THE VIDEO) */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white border-t border-[#F1F3F5]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] truncate">
              {preset.category}
            </span>
            <span className="text-[10px] font-mono text-[#667085] bg-[#F1F3F5] px-1.5 py-0.5 rounded shrink-0">
              {preset.duration} • 9:16
            </span>
          </div>
          <h4 className="text-sm font-bold text-[#17191D] line-clamp-1">{preset.title}</h4>
          <p className="text-[11px] text-[#667085] line-clamp-2 mt-1 leading-relaxed">
            {preset.prompt}
          </p>
        </div>

        <div className="space-y-2 pt-1 border-t border-[#F1F3F5]">
          <Link
            href={`/create?prompt=${encodeURIComponent(preset.prompt)}&aspect=9:16&mode=video`}
            className="w-full py-2 px-3 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use This Preset</span>
          </Link>
          <Link
            href={`/templates/${preset.slug}`}
            className="w-full py-1 text-center text-[11px] font-medium text-[#667085] hover:text-[#5145CD] transition-colors block"
          >
            Explore Storyboard →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isSlidePlaying, setIsSlidePlaying] = useState(true);
  const [isSlideMuted, setIsSlideMuted] = useState(true);
  const slideVideoRef = useRef<HTMLVideoElement | null>(null);
  const [galleryTab, setGalleryTab] = useState<'vertical' | 'widescreen'>('vertical');

  const activeSlide = HERO_SLIDES[activeSlideIndex] || HERO_SLIDES[0];

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    setIsSlidePlaying(true);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    setIsSlidePlaying(true);
  };

  const toggleSlidePlay = () => {
    if (!slideVideoRef.current) return;
    if (slideVideoRef.current.paused) {
      slideVideoRef.current.play().catch(() => {});
      setIsSlidePlaying(true);
    } else {
      slideVideoRef.current.pause();
      setIsSlidePlaying(false);
    }
  };

  const toggleSlideMute = () => {
    if (!slideVideoRef.current) return;
    slideVideoRef.current.muted = !isSlideMuted;
    setIsSlideMuted(!isSlideMuted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#17191D] selection:bg-[#EEF2FF] selection:text-[#5145CD] overflow-x-hidden max-w-full">
      <Header />
      <FirstCampaignModal />

      <main className="flex-1 w-full overflow-x-hidden">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: BUSINESS AI AD CREATION STUDIO */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FA] to-[#FFFFFF] border-b border-[#E5E7EB] w-full">
          {/* Crazy Live Interactive Neural Canvas & Aurora Background */}
          <LiveCrazyBackground />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-5 mb-10">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-semibold text-[#5145CD] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Next-Generation AI Ad Creation Studio</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#17191D] leading-[1.15] break-words">
                Create high-converting AI video ads{' '}
                <span className="text-[#5145CD]">in minutes.</span>
              </h1>

              {/* Concise Supporting Copy */}
              <p className="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto leading-relaxed">
                Empower your marketing team to produce studio-grade product commercials, performance video ads, and localized voiceovers from simple product inputs with next-generation commercial AI models.
              </p>

              {/* Strong Primary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-sm transition-all text-sm group"
                >
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#17191D] bg-[#FFFFFF] hover:bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs transition-colors text-sm"
                >
                  <Film className="w-4 h-4 text-[#5145CD]" />
                  <span>Browse Ad Templates</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>No credit card required to explore</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>1080p HD Video Exports</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Commercial rights included</span>
                </span>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* HERO 5-VIDEO SLIDE SHOWCASE (ZERO TEXT ON VIDEO, SLIDE FORMAT) */}
            {/* ========================================================================= */}
            <div className="relative rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-xl p-3 sm:p-5 max-w-5xl mx-auto mt-6 sm:mt-8">
              {/* Top Navigation & Status Bar */}
              <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                  <span className="font-bold text-xs sm:text-sm text-[#17191D]">
                    Commercial Ad Presets
                  </span>
                  <span className="text-[11px] font-mono text-[#5145CD] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#C7D2FE] font-semibold hidden sm:inline-flex">
                    5 Curated Studio Presets
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#667085] bg-[#F7F8FA] px-2.5 py-1 rounded-lg border border-[#E5E7EB]">
                    0{activeSlideIndex + 1} / 0{HERO_SLIDES.length}
                  </span>

                  <div className="inline-flex items-center rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] p-0.5">
                    <button
                      type="button"
                      onClick={handlePrevSlide}
                      className="p-1 sm:p-1.5 rounded-md hover:bg-white text-[#17191D] hover:text-[#5145CD] transition-colors cursor-pointer"
                      title="Previous video slide"
                      aria-label="Previous video slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="p-1 sm:p-1.5 rounded-md hover:bg-white text-[#17191D] hover:text-[#5145CD] transition-colors cursor-pointer"
                      title="Next video slide"
                      aria-label="Next video slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SLIDE VIDEO STAGE — 100% CLEAN VIDEO, ZERO TEXT OVERLAY */}
              <div className="relative aspect-[16/10] sm:aspect-video w-full rounded-xl overflow-hidden bg-[#0D0E12] flex items-center justify-center group shadow-inner">
                {/* Ambient Blurred Backdrop for 9:16 vertical videos */}
                {activeSlide.aspect === '9:16' && (
                  <img
                    src={activeSlide.poster}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-125 pointer-events-none transition-all duration-700"
                  />
                )}

                {/* Main Video Player */}
                <video
                  ref={slideVideoRef}
                  key={activeSlide.id}
                  src={activeSlide.videoUrl}
                  poster={activeSlide.poster}
                  preload="auto"
                  autoPlay
                  loop
                  muted={isSlideMuted}
                  playsInline
                  className={`relative z-10 h-full w-auto max-h-[520px] object-contain shadow-2xl transition-all duration-500 ${
                    activeSlide.aspect === '9:16'
                      ? 'aspect-[9/16] rounded-lg'
                      : 'w-full aspect-video object-cover'
                  }`}
                />

                {/* Left Slide Arrow (Clean Hover Action) */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg border border-white/20"
                  aria-label="Previous video slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right Slide Arrow (Clean Hover Action) */}
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-lg border border-white/20"
                  aria-label="Next video slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Overlaid Functional Controls Only (ZERO TEXT OVERLAY) */}
                <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
                  {/* Play & Mute Functional Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleSlidePlay}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer border border-white/20"
                      aria-label={isSlidePlaying ? 'Pause video' : 'Play video'}
                    >
                      {isSlidePlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={toggleSlideMute}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer border border-white/20"
                      aria-label={isSlideMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isSlideMuted ? (
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>

                  {/* 5 Slide Pagination Dots */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                    {HERO_SLIDES.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setActiveSlideIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeSlideIndex === dotIdx
                            ? 'w-6 bg-white'
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 5-THUMBNAIL STRIP: CLICKABLE SELECTOR TO SLIDE TO ANY OF THE 5 VIDEOS */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mt-4">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = activeSlideIndex === idx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`group p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-[#EEF2FF] border-[#5145CD] ring-2 ring-[#5145CD] shadow-sm'
                          : 'bg-[#FFFFFF] border-[#E5E7EB] hover:border-[#C7D2FE] hover:bg-[#F7F8FA]'
                      }`}
                    >
                      <div className="relative w-9 h-12 rounded-md overflow-hidden bg-black shrink-0">
                        <img src={slide.poster} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-black/80 text-white">
                          {slide.duration}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#5145CD]' : 'text-[#667085]'}`}>
                            0{idx + 1}
                          </span>
                          <span className="text-[9px] font-mono text-[#667085]">
                            {slide.aspect}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#17191D] truncate group-hover:text-[#5145CD] transition-colors">
                          {slide.title.split('—')[0].trim()}
                        </p>
                        <p className="text-[10px] text-[#667085] truncate">
                          {slide.category}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC STUDIO PROMPT BAR FOR ACTIVE SLIDE (PLACED CLEANLY BELOW VIDEO) */}
              <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-bold text-[#17191D]">
                        {activeSlide.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF]">
                        {activeSlide.category}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E5E7EB] text-[#17191D]">
                        {activeSlide.aspect} • {activeSlide.duration}
                      </span>
                    </div>
                    <p className="text-[#667085] text-xs line-clamp-2 leading-relaxed">
                      &ldquo;{activeSlide.prompt}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link
                    href={`/create?prompt=${encodeURIComponent(activeSlide.prompt)}&aspect=${activeSlide.aspect}&mode=video`}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Use This Preset</span>
                  </Link>
                  <Link
                    href={`/templates/${activeSlide.slug}`}
                    className="hidden sm:inline-flex px-3 py-2.5 rounded-lg border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#17191D] font-medium text-xs transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. 4-STEP CAMPAIGN WORKFLOW (HOW FLUVIA FLOW WORKS) */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Simple & Scalable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
                From product concept to live ad in 4 steps.
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                Say goodbye to weeks of video production logistics. Generate full-funnel creative assets with complete brand control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Add Product</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Upload high-res product photos, import your product URL, or specify key selling points and brand guidelines.
                </p>
              </div>

              {/* Step 2 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Create Campaign</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Select your audience, campaign goal, aspect ratio (16:9 widescreen, 9:16 vertical reels, 1:1 square), and tone.
                </p>
              </div>

              {/* Step 3 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Generate Creatives</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Next-generation video engines render cinematic shots while studio-grade multilingual voiceovers are synthesized seamlessly.
                </p>
              </div>

              {/* Step 4 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Export & Scale</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Export 1080p broadcast-ready MP4s, localized variations, or hand off directly to your team's Google Workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TEMPLATE SHOWCASE GALLERY (CURATED REAL AD TEMPLATES & PRESETS) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                  Curated Commercial Presets
                </span>
                <h2 className="text-3xl font-extrabold text-[#17191D] tracking-tight">
                  High-converting ad presets for every vertical.
                </h2>
                <p className="text-sm text-[#667085]">
                  Start from proven commercial storyboards engineered for high retention, viral hooks, and product elevation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex p-1 rounded-xl bg-[#E5E7EB]/70 border border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setGalleryTab('vertical')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      galleryTab === 'vertical'
                        ? 'bg-white text-[#5145CD] shadow-xs'
                        : 'text-[#667085] hover:text-[#17191D]'
                    }`}
                  >
                    <span>⚡ 9:16 Viral Reels</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2FF] text-[#5145CD]">4</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryTab('widescreen')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      galleryTab === 'widescreen'
                        ? 'bg-white text-[#5145CD] shadow-xs'
                        : 'text-[#667085] hover:text-[#17191D]'
                    }`}
                  >
                    <span>🎬 16:9 Widescreen</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#EEF2FF] text-[#5145CD]">4</span>
                  </button>
                </div>

                <Link
                  href="/templates"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#5145CD] hover:text-[#4338CA] transition-colors"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {galleryTab === 'vertical' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {VERTICAL_PRESETS.map((tmpl) => (
                  <VerticalPresetCard key={tmpl.id} preset={tmpl} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FEATURED_AD_TEMPLATES.map((tmpl) => (
                  <div key={tmpl.id} className="business-card overflow-hidden flex flex-col justify-between group">
                    <div className="relative aspect-video bg-[#17191D] overflow-hidden">
                      <img
                        src={tmpl.poster}
                        alt={tmpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFFFF]/90 text-[#17191D] backdrop-blur-sm shadow-xs">
                          {tmpl.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5145CD] text-white">
                          {tmpl.credits} credits
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#17191D] line-clamp-1">{tmpl.title}</h4>
                        <p className="text-[11px] text-[#667085] line-clamp-2 mt-1 leading-relaxed">
                          {tmpl.prompt}
                        </p>
                      </div>

                      <Link
                        href={`/create?prompt=${encodeURIComponent(tmpl.prompt)}&mode=video`}
                        className="w-full py-2 px-3 rounded-lg bg-[#F7F8FA] hover:bg-[#EEF2FF] text-[#17191D] hover:text-[#5145CD] border border-[#E5E7EB] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TRANSPARENT PRICING & CREDIT STORE PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Clear & Predictable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
                Simple plans. No hidden fees.
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                Fixed credit pricing across all tools: 15 credits per video ad, 5 credits per product photo, 2 credits per voiceover clip.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plan 1: Starter */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17191D]">Fluvia Basic</h3>
                    <p className="text-xs text-[#667085] mt-1">For creators testing video ad concepts</p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹999 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1080p HD Video Exports</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Ultra HD Commercial Video Engine</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Standard Rate Limit</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_starter"
                  className="w-full py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] font-semibold text-xs text-center transition-colors block"
                >
                  Choose Basic
                </Link>
              </div>

              {/* Plan 2: Pro */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between border-[#C7D2FE] bg-[#F7F8FA] relative shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#5145CD] text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17191D]">Fluvia Pro</h3>
                    <p className="text-xs text-[#667085] mt-1">For scaling brands and marketing teams</p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹2,499 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1,500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Priority generation queue</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> ElevenLabs Neural Voice HD</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Multi-variant aspect ratios</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_creator"
                  className="w-full py-2.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs text-center transition-colors shadow-xs block"
                >
                  Choose Pro
                </Link>
              </div>

              {/* Plan 3: Max */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#17191D]">Fluvia Max</h3>
                      <p className="text-xs text-[#667085] mt-1">For performance marketing power users</p>
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹4,999 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <div className="p-2 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-[11px] text-[#5145CD] font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Eligible for ₹570 OFF with code FIRST20</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 3,500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Highest concurrency speed</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Brand kit & custom typography</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Dedicated account manager</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_max&coupon=FIRST20"
                  className="w-full py-2.5 rounded-lg border border-[#5145CD] text-[#5145CD] hover:bg-[#EEF2FF] font-semibold text-xs text-center transition-colors block"
                >
                  Apply FIRST20 & Upgrade
                </Link>
              </div>
            </div>

            {/* Credit Top-Up Pack Banner */}
            <div className="mt-8 p-5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD]">Need more credits?</span>
                <h4 className="text-sm font-bold text-[#17191D]">Scale Pack: 5,000 Credits</h4>
                <p className="text-xs text-[#667085]">Pre-tax ₹6,500 + 18% GST (₹1,170) = ₹7,670 Total. Never expires.</p>
              </div>
              <Link
                href="/checkout?pack=pack_5000"
                className="px-5 py-2.5 rounded-lg bg-[#17191D] hover:bg-[#000000] text-white font-semibold text-xs text-center transition-colors shrink-0"
              >
                Buy 5,000 Credits (₹6,500)
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17191D]">
                Frequently asked questions
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Everything you need to know about billing, generation credits, and commercial rights.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How does generation credit pricing work?',
                  a: 'Every video ad generated costs exactly 15 credits. High-resolution product images cost 5 credits, and studio voiceovers cost 2 credits. If an AI generation job ever encounters a provider error, credits are automatically refunded to your wallet atomically.',
                },
                {
                  q: 'How do I use the FIRST20 coupon code?',
                  a: 'New creators receive the FIRST20 welcome code after completing registration. This coupon provides an instant ₹570 discount exclusively on the FLUVIA MAX subscription plan and is verified server-side at checkout.',
                },
                {
                  q: 'Do I own the commercial rights to generated ads?',
                  a: 'Yes. All video creatives, product images, and voiceover audio generated on Fluvia Flow come with full commercial rights for use across digital advertising platforms, television, and social media.',
                },
                {
                  q: 'Are taxes and GST included in invoices?',
                  a: 'All invoices and receipts strictly follow Indian tax regulations with full 18% GST itemization (CGST + SGST or IGST). Official vector PDF tax invoices are generated automatically after every successful transaction.',
                },
              ].map((item, idx) => (
                <div key={idx} className="business-card p-5 space-y-2">
                  <h4 className="text-sm font-bold text-[#17191D]">{item.q}</h4>
                  <p className="text-xs text-[#667085] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CALL TO ACTION SECTION */}
        {/* ========================================================================= */}
        <section className="py-16 bg-[#FFFFFF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
              Ready to elevate your ad creative production?
            </h2>
            <p className="text-sm text-[#667085] max-w-xl mx-auto">
              Join marketing teams generating high-ROI video commercials with Fluvia Flow's AI studio.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-sm transition-all text-sm"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
