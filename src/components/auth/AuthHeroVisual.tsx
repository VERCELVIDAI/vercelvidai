'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  Sparkles,
  Video,
  Layers,
  Wand2,
  Film,
  Music,
  Play,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export function AuthHeroVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hidden lg:flex flex-col justify-between w-full h-full p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-[#090A0F] via-[#0E1019] to-[#141829] text-white border-r border-black/5 dark:border-white/[0.08]"
    >
      {/* Dynamic Background Glow Lighting */}
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sky-500/15 rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 50}px, ${-mousePos.y * 50}px)`,
        }}
      />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo size="lg" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-violet-300 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>v2.4 Studio Engine</span>
        </div>
      </div>

      {/* Hero Headline & 3D Composition Area */}
      <div className="relative z-10 my-auto py-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-semibold mb-6">
            <Film className="w-3.5 h-3.5" />
            <span>AI Creative Video Suite</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Your next great video{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              starts here.
            </span>
          </h2>

          <p className="mt-4 text-base xl:text-lg text-slate-300 leading-relaxed">
            Transform text prompts, raw scripts, and storyboard concepts into cinematic videos, high-converting product ads, and viral short-form content.
          </p>
        </div>

        {/* 3D Floating Interactive Media Stack */}
        <div
          className="mt-10 relative h-72 w-full max-w-lg perspective-1200 transition-transform duration-300 ease-out"
          style={{
            transform: `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`,
          }}
        >
          {/* Main Card: Video Composition Preview */}
          <div
            className="absolute top-0 left-0 w-80 rounded-2xl glass-panel p-3 border border-white/15 shadow-2xl transition-transform duration-500"
            style={{
              transform: `translateZ(40px) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            }}
          >
            <div className="aspect-video rounded-xl overflow-hidden relative bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
                alt="Cinematic Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>4K Ultra</span>
              </div>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Luxury Sportwear Ad</div>
                  <div className="text-[10px] text-slate-300">Runway Gen-3 Alpha • 60fps</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-violet-600/90 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Voice & Audio Track */}
          <div
            className="absolute -top-4 right-2 w-56 rounded-xl glass-panel p-3 border border-violet-500/30 shadow-xl transition-transform duration-500"
            style={{
              transform: `translateZ(60px) translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <Music className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-white">AI Voice Clone</span>
            </div>
            {/* Audio Waveform Graphic */}
            <div className="h-6 flex items-center gap-1">
              {[40, 75, 100, 60, 90, 45, 80, 100, 65, 30, 85, 50, 95, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-violet-500 to-sky-400 rounded-full"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Floating Card 3: Multi-Track Timeline Chip */}
          <div
            className="absolute bottom-2 right-6 w-64 rounded-xl glass-panel p-3 border border-sky-500/30 shadow-xl transition-transform duration-500"
            style={{
              transform: `translateZ(80px) translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
            }}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-white mb-2">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Multi-Track Timeline</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Synced</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded bg-violet-600/60 w-5/6" />
              <div className="h-2 rounded bg-sky-600/60 w-full" />
              <div className="h-2 rounded bg-amber-600/60 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Badges Footer */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>All Top AI Video Models</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>300+ Curated Templates</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>No Credit Card for Free Trial</span>
        </div>
      </div>
    </div>
  );
}
