'use client';

import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Wand2, CheckCircle2 } from 'lucide-react';

export function HeroVisual() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 rounded-2xl p-3 sm:p-5 shadow-xl border border-[#E5E7EB] bg-white relative text-left">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-[#E5E7EB] text-xs text-[#667085]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#5145CD]" />
            <div className="w-3 h-3 rounded-full bg-indigo-400" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
          </div>
          <span className="ml-2 font-mono font-bold text-[#17191D]">Fluvia Flow Studio Workspace</span>
          <span className="text-[#5145CD] font-semibold">• Scene Builder & 4K Neural Canvas</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-[#EEF2FF] text-[#5145CD] px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-[#5145CD]/20 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#5145CD]" />
            <span>Character Locked</span>
          </span>
          <span className="font-mono text-[#667085] font-medium hidden sm:inline">16:9 • 1080p 60fps • Gemini AI</span>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-2 sm:p-4">
        {/* Left Scene Builder / Continuity Inspector */}
        <div className="hidden lg:flex flex-col gap-3 col-span-1 border-r border-[#E5E7EB] pr-4 text-left">
          <div className="text-xs font-bold uppercase text-[#17191D] tracking-wider flex items-center justify-between">
            <span>Scene Builder</span>
            <span className="text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-[#5145CD]/20 text-[10px] font-semibold">
              3 Clips Linked
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#EEF2FF] border border-[#5145CD]/30 text-xs shadow-2xs">
              <div className="flex justify-between items-center text-[#17191D] font-bold mb-1">
                <span className="text-[#5145CD] font-bold">Scene 1 • 0-5s</span>
                <span className="text-[10px] bg-[#5145CD] text-white px-1.5 py-0.5 rounded font-semibold">Current</span>
              </div>
              <p className="text-[#667085] text-[11px] leading-relaxed">
                Titanium hypercar high-speed twilight tracking shot with anamorphic optical flare.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs hover:border-[#5145CD]/40 transition-colors cursor-pointer shadow-2xs">
              <div className="flex justify-between items-center text-[#667085] font-medium mb-1">
                <span className="font-bold text-[#17191D]">Scene 2 • 5-10s</span>
                <span className="text-[10px] text-[#5145CD] bg-[#EEF2FF] px-1.5 py-0.5 rounded border border-[#5145CD]/20">Continuous</span>
              </div>
              <p className="text-[#667085] text-[11px] leading-relaxed">
                Dynamic side profile camera glide preserving wheel reflections and body line.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs hover:border-[#5145CD]/40 transition-colors cursor-pointer shadow-2xs">
              <div className="flex justify-between items-center text-[#667085] font-medium mb-1">
                <span className="font-bold text-[#17191D]">Scene 3 • 10-15s</span>
                <span className="text-[10px] text-[#667085]">Outro</span>
              </div>
              <p className="text-[#667085] text-[11px] leading-relaxed">
                Slow clockwise crane pull-back with luxury typography lockup and smoke dissipate.
              </p>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs text-[#17191D] font-bold">
              <Wand2 className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Camera: Dolly In (Smooth)</span>
            </div>
          </div>
        </div>

        {/* Central Cinema Player */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 group shadow-inner">
            <video
              className="w-full h-full object-cover"
              src="/media/login/login-hero-preview.mp4"
              poster="/media/login/thumb-cyberpunk.jpg"
              playsInline
              loop
              autoPlay
              muted={isMuted}
            />

            {/* In-Video Motion Text Overlay Preview */}
            <div className="absolute top-5 left-5 pointer-events-none text-left">
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono text-[#5145CD] font-semibold border border-white/40 shadow-xs">
                FLUVIA FLOW • SEED: #88291 • GEMINI AI
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                BRING YOUR STORIES TO LIFE
              </h3>
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <span className="font-mono text-indigo-300 text-[11px] hidden sm:inline">
                  Timeline: 00:00:15 / 15.0s
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#5145CD] text-white font-bold">
                  Google Gemini Omni 1.1 Flash
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 font-mono border border-white/20">15 cr</span>
              </div>
            </div>
          </div>

          {/* Timeline Sequence Strip */}
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="p-2 rounded-xl bg-[#EEF2FF] border border-[#5145CD]/30 text-[11px]">
              <div className="font-semibold text-[#17191D]">Clip 1 • Keyframe In</div>
              <div className="text-[#667085] font-mono text-[10px]">0.0s - 5.0s (15 cr)</div>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[11px]">
              <div className="font-semibold text-[#17191D]">Clip 2 • Interpolate</div>
              <div className="text-[#667085] font-mono text-[10px]">5.0s - 10.0s</div>
            </div>
            <div className="p-2 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[11px]">
              <div className="font-semibold text-[#17191D]">Clip 3 • Outro & Stinger</div>
              <div className="text-[#667085] font-mono text-[10px]">10.0s - 15.0s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
