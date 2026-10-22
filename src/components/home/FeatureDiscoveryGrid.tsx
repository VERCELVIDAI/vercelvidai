'use client';

import React from 'react';
import Link from 'next/link';
import {
  Video,
  Image as ImageIcon,
  Film,
  Sparkles,
  Sliders,
  UserCheck,
  ArrowRight,
  Layers,
  Wand2,
} from 'lucide-react';

const FEATURE_CARDS = [
  {
    id: 'feature-video',
    title: 'Text-to-Video Engine',
    description: 'Transform cinematic prompts into 1080p and 4K video clips with realistic temporal physics.',
    badge: 'Fluvia & Runway',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    link: '/create?mode=video',
    icon: Video,
    accent: 'emerald',
  },
  {
    id: 'feature-image',
    title: 'Gemini & Flux Image Studio',
    description: 'Photorealistic commercial renders, concept art, and product ads with official Google Gen AI SDK.',
    badge: 'Gemini Imagen',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    link: '/create?mode=image',
    icon: ImageIcon,
    accent: 'pink',
  },
  {
    id: 'feature-reels',
    title: 'AI Reels & Social Ads',
    description: 'Vertical 9:16 viral video generation optimized for Instagram, TikTok, and YouTube Shorts.',
    badge: '9:16 Vertical',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    link: '/create?mode=reels',
    icon: Film,
    accent: 'emerald',
  },
  {
    id: 'feature-storyboard',
    title: 'Gemini Storyboard Copilot',
    description: 'Automated multi-shot scene sequencing, timing breakdowns, and narration voiceover direction.',
    badge: 'Gemini AI',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    link: '/studios/storyboard',
    icon: Layers,
    accent: 'teal',
  },
  {
    id: 'feature-camera',
    title: 'Cinematic Camera Director',
    description: 'Choreograph camera motion with Dolly in/out, Orbit, Crane, and Anamorphic lens presets.',
    badge: 'Director Mode',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    link: '/studios/cinema',
    icon: Sliders,
    accent: 'emerald',
  },
  {
    id: 'feature-avatars',
    title: 'AI Talking Avatars',
    description: 'Synthesize photorealistic presenter avatars with accurate lip-sync and multilingual voiceover.',
    badge: 'ElevenLabs HD',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    link: '/ai-avatar-generator',
    icon: UserCheck,
    accent: 'pink',
  },
];

export function FeatureDiscoveryGrid() {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-mono font-bold block mb-1">
            Creation Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            High-Performance AI Creative Tools
          </h2>
        </div>
        <Link
          href="/create"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
        >
          <span>Open Creative Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURE_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.link}
              className="group relative rounded-2xl bg-[#121A16] border border-[#293831] hover:border-emerald-500/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Image Preview Thumbnail */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-3 bg-[#080D0B]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121A16] via-transparent to-transparent opacity-80" />

                {/* Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur-md border ${
                      item.accent === 'pink'
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${
                      item.accent === 'pink' ? 'text-pink-400' : 'text-emerald-400'
                    }`}
                  />
                  <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action Link Footer */}
              <div className="pt-3 mt-3 border-t border-[#293831] flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
