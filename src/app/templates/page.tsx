'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Sparkles, Layers, ArrowRight, Play, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Instagram Reels',
  'YouTube Shorts',
  'Product Commercials',
  'Explainer Videos',
  'UGC Ads',
  'YouTube Videos',
];

const TEMPLATES = [
  {
    id: 'tmpl_1',
    slug: 'instagram-reels-ecommerce',
    title: 'Viral Luxury Product Reel',
    category: 'Instagram Reels',
    aspect: '9:16 Vertical',
    duration: '15s',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    desc: 'High-energy sportswear and sneaker commercial with kinetic typography hooks.',
  },
  {
    id: 'tmpl_2',
    slug: 'youtube-shorts-tech',
    title: 'Daily AI & Tech Breakdown',
    category: 'YouTube Shorts',
    aspect: '9:16 Vertical',
    duration: '20s',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    desc: 'Bite-sized viral news template with floating subtitles and laptop coding scenes.',
  },
  {
    id: 'tmpl_3',
    slug: 'cinematic-luxury-perfume',
    title: 'Cinematic Perfume Commercial',
    category: 'Product Commercials',
    aspect: '16:9 Landscape',
    duration: '18s',
    thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
    desc: 'Volumetric glass perfume bottle in botanical forest misty lighting.',
  },
  {
    id: 'tmpl_4',
    slug: 'saas-explainer-flow',
    title: 'SaaS Product Walkthrough',
    category: 'Explainer Videos',
    aspect: '16:9 Landscape',
    duration: '30s',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    desc: 'Modern software product launch teaser with timeline highlights and feature bullets.',
  },
  {
    id: 'tmpl_5',
    slug: 'ugc-testimonial-unboxing',
    title: 'High-Converting UGC Hook',
    category: 'UGC Ads',
    aspect: '9:16 Vertical',
    duration: '25s',
    thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    desc: 'Selfie-style product discovery and honest unboxing testimonial format for TikTok.',
  },
  {
    id: 'tmpl_6',
    slug: 'youtube-longform-opener',
    title: 'Cinematic YouTube Channel Intro',
    category: 'YouTube Videos',
    aspect: '16:9 Landscape',
    duration: '12s',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    desc: 'Heavy bass impact teaser with 3D logo explosion and subscribe button callout.',
  },
];

export default function TemplatesPage() {
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = selectedCat === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-xs font-semibold text-violet-400 mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Curated Creative Library</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Creative Video Templates
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300">
            Pre-assembled multi-track timelines with synchronized audio, transitions, and copy hooks ready for instant AI remake.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((tmpl) => (
            <Link
              key={tmpl.id}
              href={`/templates/${tmpl.slug}`}
              className="rounded-2xl glass-panel border border-white/10 overflow-hidden group hover:border-violet-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                  <img
                    src={tmpl.thumbnail}
                    alt={tmpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-white/10">
                    {tmpl.duration}
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-violet-300 bg-violet-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-violet-500/30">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{tmpl.aspect}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-white text-lg group-hover:text-violet-300 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {tmpl.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-semibold text-violet-400">
                <span>Customize in Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
