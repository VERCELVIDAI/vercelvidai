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
    <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs transition-all hover:border-[#5145CD]/40 min-w-0">
      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
        {/* Left Column: Copy & Badges */}
        <div className="space-y-4 max-w-xl min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-google-vids-popup'))}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#5145CD]/20 text-[#5145CD] text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              title="Click to view Cool Templates popup"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>GOOGLE VIDS</span>
            </button>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#667085] text-[11px] font-semibold font-mono">
              <Zap className="w-3 h-3 text-[#5145CD]" />
              15 credits per video
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#17191D] tracking-tight">
              Turn your ideas into stunning videos
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed font-normal">
              Create compelling video content with an AI-powered workflow. Describe your vision, customize camera lenses, and render high-resolution 1080p and 4K commercial videos right inside Fluvia Flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#667085] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />
              <span className="text-[#17191D]">Text-to-Video & Image-to-Video</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />
              <span className="text-[#17191D]">Google Gemini Omni Flash AI</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />
              <span className="text-[#17191D]">Direct MP4 Download</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/create?source=google-vids"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer group"
            >
              <span>Create Video</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Layers className="w-4 h-4 text-[#5145CD]" />
              <span>Browse 26 Templates</span>
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('open-google-vids-popup'))}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Featured Templates</span>
            </button>
          </div>
        </div>

        {/* Right Column: Custom Video Creation Illustration Artwork */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex items-center justify-center">
          <div className="relative w-full max-w-[280px] lg:max-w-none rounded-2xl p-4 bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs">
            {/* Visual Screen Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-white border border-[#E5E7EB] p-3 flex flex-col justify-between shadow-2xs">
              {/* Top controls in mockup */}
              <div className="flex items-center justify-between text-[10px] text-[#5145CD] font-mono">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD] animate-ping" />
                  REC • 4K 60FPS
                </span>
                <span className="text-[#667085]">16:9 • 15 CR</span>
              </div>

              {/* Center Play Graphic */}
              <div className="my-auto flex flex-col items-center justify-center text-center py-2">
                <div className="w-10 h-10 rounded-full bg-[#EEF2FF] border border-[#5145CD]/30 flex items-center justify-center text-[#5145CD] shadow-xs">
                  <Play className="w-5 h-5 fill-[#5145CD] translate-x-0.5" />
                </div>
                <span className="text-[11px] font-bold text-[#17191D] mt-2">
                  Gemini Video Studio
                </span>
              </div>

              {/* Bottom timeline track */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden flex">
                  <div className="w-2/3 bg-[#5145CD] rounded-full" />
                </div>
                <div className="flex justify-between text-[9px] text-[#667085] font-mono">
                  <span>00:00</span>
                  <span className="text-[#5145CD] font-semibold">15 Credits Fixed</span>
                  <span>00:15</span>
                </div>
              </div>
            </div>

            {/* Sub-label badge below preview */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-[#667085] font-medium px-1">
              <span className="flex items-center gap-1 text-[#5145CD] font-semibold">
                <Video className="w-3.5 h-3.5 text-[#5145CD]" />
                In-App Creation Studio
              </span>
              <span className="text-[#667085] font-mono text-[10px]">Zero Latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
