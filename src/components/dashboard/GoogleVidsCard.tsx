'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Video,
  Play,
  Layers,
  Zap,
  CheckCircle2,
} from 'lucide-react';

export function GoogleVidsCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-[#11131A] via-[#151822] to-[#11131A] p-6 sm:p-8 shadow-xl transition-all hover:border-white/20 min-w-0">
      {/* Decorative background ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
        {/* Left Column: Copy & Badges */}
        <div className="space-y-4 max-w-xl min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-google-vids-popup'))}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-wider uppercase transition-colors cursor-pointer"
              title="Click to view Cool Templates popup"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>GOOGLE VIDS</span>
            </button>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 text-[11px] font-bold font-mono">
              <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
              15 credits per video
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Turn your ideas into stunning videos
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Create compelling video content with an AI-powered workflow. Describe your vision, customize camera lenses, and render high-resolution 1080p and 4K commercial videos right inside Fluvia Flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Text-to-Video & Image-to-Video</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Google Gemini Omni Flash AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Direct MP4 Download</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/create?source=google-vids"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer group border border-white/10"
            >
              <span>Create Video</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 text-xs sm:text-sm font-semibold transition-all"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Browse 26 Templates</span>
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-google-vids-popup'))}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cool Templates Popup</span>
            </button>
          </div>
        </div>

        {/* Right Column: Custom Video Creation Illustration Artwork */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex items-center justify-center">
          <div className="relative w-full max-w-[280px] lg:max-w-none rounded-2xl p-4 bg-white/90 border border-emerald-500/20 shadow-md">
            {/* Visual Screen Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B1512] to-emerald-950 p-3 flex flex-col justify-between">
              {/* Top controls in mockup */}
              <div className="flex items-center justify-between text-[10px] text-emerald-300/80 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REC • 4K 60FPS
                </span>
                <span>16:9 • 15 CR</span>
              </div>

              {/* Center Play Graphic */}
              <div className="my-auto flex flex-col items-center justify-center text-center py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shadow-lg">
                  <Play className="w-5 h-5 fill-emerald-300 translate-x-0.5" />
                </div>
                <span className="text-[11px] font-bold text-white mt-2">
                  Gemini Video Studio
                </span>
              </div>

              {/* Bottom timeline track */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="w-2/3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>00:00</span>
                  <span className="text-emerald-400 font-bold">15 Credits Fixed</span>
                  <span>00:15</span>
                </div>
              </div>
            </div>

            {/* Sub-label badge below preview */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600 font-medium px-1">
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                In-App Creation Studio
              </span>
              <span className="text-slate-500 font-mono text-[10px]">Zero Latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
