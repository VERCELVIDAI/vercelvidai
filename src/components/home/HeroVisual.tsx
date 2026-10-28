'use client';

import React, { useState } from 'react';
import { Play, Pause, Sparkles, Volume2, VolumeX, Maximize2, Wand2, Film, Layers, Sliders, CheckCircle2 } from 'lucide-react';

export function HeroVisual() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 rounded-3xl p-3 sm:p-5 shadow-2xl border border-white/10 bg-[#0E1015]/95 backdrop-blur-xl relative text-left">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 border-b border-white/8 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
          </div>
          <span className="ml-2 font-mono font-bold text-white">Google Flow Studio Workspace</span>
          <span className="text-indigo-400 font-semibold">• Scene Builder & 4K Neural Canvas</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-indigo-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
            <span>Character Locked</span>
          </span>
          <span className="font-mono text-slate-400 font-medium hidden sm:inline">16:9 • 1080p 60fps • Veo & Gemini</span>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-2 sm:p-4">
        {/* Left Scene Builder / Continuity Inspector */}
        <div className="hidden lg:flex flex-col gap-3 col-span-1 border-r border-white/8 pr-4 text-left">
          <div className="text-xs font-bold uppercase text-slate-200 tracking-wider flex items-center justify-between">
            <span>Scene Builder</span>
            <span className="text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30 text-[10px] font-bold">
              3 Clips Linked
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-[#151822] border border-indigo-500/40 text-xs shadow-2xs">
              <div className="flex justify-between items-center text-white font-bold mb-1">
                <span className="text-indigo-300 font-bold">Scene 1 • 0-5s</span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.5 rounded font-bold">Current</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Titanium hypercar high-speed twilight tracking shot with anamorphic optical flare.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 text-xs hover:border-white/16 transition-colors cursor-pointer shadow-2xs">
              <div className="flex justify-between items-center text-slate-300 font-medium mb-1">
                <span className="font-bold text-white">Scene 2 • 5-10s</span>
                <span className="text-[10px] text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">Continuous</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Dynamic side profile camera glide preserving wheel reflections and body line.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 text-xs hover:border-white/16 transition-colors cursor-pointer shadow-2xs">
              <div className="flex justify-between items-center text-slate-300 font-medium mb-1">
                <span className="font-bold text-white">Scene 3 • 10-15s</span>
                <span className="text-[10px] text-slate-400">Outro</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Slow clockwise crane pull-back with luxury typography lockup and smoke dissipate.
              </p>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-white/8">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Camera: Dolly In (Smooth)</span>
            </div>
          </div>
        </div>

        {/* Central Cinema Player */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group shadow-inner">
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
              <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono text-indigo-300 border border-indigo-400/30">
                GOOGLE FLOW • SEED: #88291 • VEO & GEMINI
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                BRING YOUR STORIES TO LIFE
              </h3>
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex items-center justify-between text-white text-xs">
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
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600/90 font-bold border border-indigo-400/30">
                  Google Gemini Omni 1.1 Flash
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-mono">15 cr</span>
              </div>
            </div>
          </div>

          {/* Timeline Sequence Strip */}
          <div className="grid grid-cols-3 gap-2 text-left">
            <div className="p-2 rounded-xl bg-[#151822] border border-indigo-500/40 text-[11px]">
              <div className="font-bold text-white">Clip 1 • Keyframe In</div>
              <div className="text-slate-400 font-mono text-[10px]">0.0s - 5.0s (15 cr)</div>
            </div>
            <div className="p-2 rounded-xl bg-[#11131A] border border-white/8 text-[11px]">
              <div className="font-bold text-white">Clip 2 • Interpolate</div>
              <div className="text-slate-400 font-mono text-[10px]">5.0s - 10.0s</div>
            </div>
            <div className="p-2 rounded-xl bg-[#11131A] border border-white/8 text-[11px]">
              <div className="font-bold text-white">Clip 3 • Outro & Stinger</div>
              <div className="text-slate-400 font-mono text-[10px]">10.0s - 15.0s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
