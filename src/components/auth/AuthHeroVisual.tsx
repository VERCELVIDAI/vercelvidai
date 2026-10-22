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
      className="hidden lg:flex flex-col justify-between w-full h-full p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-pink-50/30 text-[#17211D] border-r border-emerald-500/20"
    >
      {/* Dynamic Background Glow Lighting */}
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-pink-400/15 rounded-full blur-[120px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 50}px, ${-mousePos.y * 50}px)`,
        }}
      />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo size="lg" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-emerald-500/20 text-xs font-mono text-emerald-800 backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>v3.0 Fluvia Engine</span>
        </div>
      </div>

      {/* Hero Headline & 3D Composition Area */}
      <div className="relative z-10 my-auto py-8 text-left">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold mb-6">
            <Film className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Creative Video Suite</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#17211D] leading-[1.15]">
            Your next great video{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-pink-600 bg-clip-text text-transparent">
              starts here.
            </span>
          </h2>

          <p className="mt-4 text-base xl:text-lg text-slate-600 leading-relaxed">
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
            className="absolute top-0 left-0 w-80 rounded-2xl glass-card p-3 border border-emerald-500/25 shadow-2xl transition-transform duration-500"
            style={{
              transform: `translateZ(40px) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            }}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/20">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-running-through-the-city-at-sunset-41662-large.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-emerald-300 backdrop-blur-md">
                Scene 01 • Dolly In 35mm
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#17211D] font-bold">
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cyberpunk Runner v2</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                1080p 60fps
              </span>
            </div>
          </div>

          {/* Sub Card: Storyboard Inspector */}
          <div
            className="absolute top-12 left-44 w-72 rounded-2xl glass-card p-3 border border-pink-400/30 shadow-xl transition-transform duration-500"
            style={{
              transform: `translateZ(20px) translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
            }}
          >
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-emerald-500/15">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#17211D]">
                <Layers className="w-3.5 h-3.5 text-pink-600" />
                <span>Gemini Storyboard</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">4 Shots Ready</span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
              &quot;Volumetric morning rays slicing through ancient redwoods, slow dolly tracking camera.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Feature Bullet Badges */}
      <div className="relative z-10 flex flex-wrap gap-4 pt-6 border-t border-emerald-500/15 text-xs text-slate-700 font-semibold">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Multi-Model AI Inference</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Google Gemini Scripting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Nonlinear Video Canvas</span>
        </div>
      </div>
    </div>
  );
}
