'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  Sparkles,
  ArrowRight,
  Filter,
  Sliders,
  Film,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface InspirationItem {
  id: string;
  title: string;
  category: 'Recommended' | 'Trending' | 'Commercials' | 'Cinematic' | 'Social' | 'Animation';
  aspect: string;
  videoUrl: string;
  posterUrl: string;
  prompt: string;
  modelBadge: string;
  durationSec: number;
}

const GALLERY_ITEMS: InspirationItem[] = [
  {
    id: 'insp-1',
    title: 'Aura Lumina — Luxury Glass Perfume Reveal',
    category: 'Commercials',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    prompt: 'Commercial reveal of a modern glass perfume bottle on a clean white surface with emerald liquid swirls and soft pink translucent ribbons, 35mm anamorphic.',
    modelBadge: 'Gemini & Runway',
    durationSec: 5,
  },
  {
    id: 'insp-2',
    title: 'Cyberpunk Runner — Rain Neon Reflections',
    category: 'Cinematic',
    aspect: '21:9',
    videoUrl: '/media/login/login-hero-preview.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=80',
    prompt: 'Cybernetic athlete sprinting through wet neo-Tokyo streets at night, volumetric green neon reflections, 35mm anamorphic lens.',
    modelBadge: 'Fluvia Cinematic HD',
    durationSec: 10,
  },
  {
    id: 'insp-3',
    title: 'Urban Streetwear Lookbook — Tokyo Glide',
    category: 'Social',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-04-fashion-campaign.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    prompt: 'Editorial street style fashion model walking through Shibuya crossing, golden hour sunset, 9:16 vertical cinematography.',
    modelBadge: 'Flux & Runway',
    durationSec: 5,
  },
  {
    id: 'insp-4',
    title: 'Pacific Coastline Golden Hour Drone Descent',
    category: 'Recommended',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-06-travel-reel.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    prompt: 'Sweeping drone shot over coastal cliff highway at golden hour, waves crashing on emerald shoreline, volumetric sunset rays.',
    modelBadge: 'Luma Ray',
    durationSec: 5,
  },
  {
    id: 'insp-5',
    title: 'Gourmet Sizzle Macro Burger Commercial',
    category: 'Commercials',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-07-food-commercial.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    prompt: 'Ultra slow-motion commercial macro of gourmet burger being assembled, melting cheese, fresh lettuce, 1000fps cinematic lighting.',
    modelBadge: 'Runway Gen-3',
    durationSec: 5,
  },
  {
    id: 'insp-6',
    title: 'Urban Skater Sunset Golden Anamorphic',
    category: 'Trending',
    aspect: '9:16',
    videoUrl: '/media/templates/tmpl-14-instagram-reel.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    prompt: 'Low-angle tracking shot of a skateboarder doing kickflips at Venice beach skatepark during golden hour, handheld motion blur.',
    modelBadge: 'Fluvia Cinematic HD',
    durationSec: 5,
  },
  {
    id: 'insp-7',
    title: 'Titanium Audio Precision Headphone Ad',
    category: 'Commercials',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-01-cinematic-product.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    prompt: 'Exploded mechanical view of premium wireless headphones, floating brushed aluminum parts, acoustic diaphragm sound waves.',
    modelBadge: 'Gemini & Fluvia',
    durationSec: 10,
  },
  {
    id: 'insp-8',
    title: 'Futuristic Architectural Glass Pavilion',
    category: 'Cinematic',
    aspect: '16:9',
    videoUrl: '/media/templates/tmpl-08-real-estate.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    prompt: 'Dolly in through minimalist glass and marble villa with lush indoor botanical atrium, natural morning sunlight reflections.',
    modelBadge: 'Luma Ray',
    durationSec: 5,
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All Creations' },
  { id: 'Recommended', label: 'Recommended' },
  { id: 'Trending', label: 'Trending' },
  { id: 'Commercials', label: 'Product Ads' },
  { id: 'Cinematic', label: 'Cinematic' },
  { id: 'Social', label: 'Social & Reels' },
];

export function CinematicInspirationGallery() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const filteredItems =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleUseTemplate = (item: InspirationItem) => {
    // Preserve template prompt and parameters in query
    const targetUrl = `/create?prompt=${encodeURIComponent(item.prompt)}&aspectRatio=${item.aspect === '9:16' ? '9:16' : item.aspect === '21:9' ? '21:9' : '16:9'}&mode=video`;
    router.push(targetUrl);
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">
            Community & AI Presets
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Creations & Templates
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Hover or tap to play real video previews. Click &ldquo;Use Template&rdquo; to transfer camera motion, lighting, and prompts directly into your workspace.
          </p>
        </div>

        <Link
          href="/templates"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors uppercase tracking-wider shrink-0"
        >
          <span>All 24 Templates</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-[#121A16] hover:bg-[#1A231F] text-slate-300 border border-[#293831]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredItems.map((item) => {
          const isPlaying = playingVideoId === item.id;
          return (
            <div
              key={item.id}
              className="group rounded-2xl bg-[#121A16] border border-[#293831] hover:border-emerald-500/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10"
              onMouseEnter={() => setPlayingVideoId(item.id)}
              onMouseLeave={() => setPlayingVideoId(null)}
            >
              {/* Playable Video Card Viewport */}
              <div
                className={`relative w-full bg-[#080D0B] overflow-hidden ${
                  item.aspect === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
                }`}
              >
                <video
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  muted
                  loop
                  playsInline
                  autoPlay={isPlaying}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-transparent to-transparent opacity-80 pointer-events-none" />

                {/* Aspect Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {item.aspect}
                  </span>
                </div>

                {/* Model Badge */}
                <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/90 text-white shadow-xs">
                    {item.modelBadge}
                  </span>
                </div>

                {/* Play/Pause overlay indicator */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80">
                    {isPlaying ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 ml-0.5" />}
                  </span>
                </div>
              </div>

              {/* Card Meta & Use Template Button */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-white text-xs sm:text-sm mt-0.5 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-[#293831] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(item)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500 hover:to-teal-600 border border-emerald-500/30 hover:border-emerald-500 text-emerald-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Use Template</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
