'use client';

import React, { useState } from 'react';
import { Play, Pause, Sparkles, Volume2, VolumeX, Maximize2, Wand2, Film, Layers, Sliders } from 'lucide-react';

export function HeroVisual() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 rounded-2xl glass-panel p-2 sm:p-4 shadow-2xl border border-white/10 relative">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.08] text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-slate-300">Fluvia Flow Cinema Studio v3.0</span>
          <span className="text-cyan-400 font-semibold">• 4K Neural Canvas</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-500/20">
            Render Ready
          </span>
          <span className="font-mono text-slate-400">00:00:15:00 / 1080p 60fps</span>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-2 sm:p-4">
        {/* Left Scene Tree / Prompt Inspector */}
        <div className="hidden lg:flex flex-col gap-3 col-span-1 border-r border-white/[0.06] pr-4">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span>Storyboard Scenes</span>
            <span className="text-violet-400">3 Clips</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-violet-600/10 border border-violet-500/30 text-xs">
              <div className="flex justify-between items-center text-slate-300 font-medium mb-1">
                <span className="text-violet-300 font-semibold">Scene 1 • 0-5s</span>
                <span className="text-[10px] bg-violet-500/20 px-1.5 py-0.5 rounded">Active</span>
              </div>
              <p className="text-slate-400 line-clamp-2">High-speed urban night sprint with violet rain reflections.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs hover:bg-white/[0.05] transition-colors cursor-pointer">
              <div className="flex justify-between items-center text-slate-300 font-medium mb-1">
                <span>Scene 2 • 5-10s</span>
                <span className="text-[10px] text-slate-500">Video</span>
              </div>
              <p className="text-slate-400 line-clamp-2">Dynamic side profile camera glide along skyline.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs hover:bg-white/[0.05] transition-colors cursor-pointer">
              <div className="flex justify-between items-center text-slate-300 font-medium mb-1">
                <span>Scene 3 • 10-15s</span>
                <span className="text-[10px] text-slate-500">CTA</span>
              </div>
              <p className="text-slate-400 line-clamp-2">Logo lockup reveal with 3D particles & audio stinger.</p>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Wand2 className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Auto-Colorgrade: Vivid Neo</span>
            </div>
          </div>
        </div>

        {/* Central Cinema Player */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 group shadow-inner">
            <video
              className="w-full h-full object-cover"
              src="https://assets.mixkit.co/videos/preview/mixkit-running-through-the-city-at-sunset-41662-large.mp4"
              playsInline
              loop
              autoPlay
              muted={isMuted}
            />

            {/* In-Video Motion Text Overlay Preview */}
            <div className="absolute top-6 left-6 pointer-events-none">
              <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-xs font-mono text-violet-400 border border-violet-400/30">
                AI GENERATED • SEED: #88291
              </span>
              <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-lg">
                STEP INTO THE FUTURE
              </h3>
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={isMuted ? 'Unmute preview video' : 'Mute preview video'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-slate-300">00:04 / 00:15</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 text-[11px] font-medium border border-violet-500/30">
                  Fluvia Neural Engine HD
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Glimpse */}
          <div className="bg-[#0B0C10] p-3 rounded-xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-violet-400" />
                <span>Multi-Track Timeline</span>
              </div>
              <span>0s ---------- 5s ---------- 10s ---------- 15s</span>
            </div>

            {/* Video Track */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-12 text-slate-400 font-mono">VIDEO</span>
              <div className="flex-1 grid grid-cols-3 gap-1.5 h-7">
                <div className="bg-gradient-to-r from-violet-700 to-indigo-700 rounded text-[10px] text-white flex items-center px-2 font-medium truncate border border-violet-400/30">
                  Clip 1: Sprint (0-5s)
                </div>
                <div className="bg-gradient-to-r from-indigo-700 to-sky-700 rounded text-[10px] text-white flex items-center px-2 font-medium truncate border border-sky-400/30">
                  Clip 2: Glide (5-10s)
                </div>
                <div className="bg-gradient-to-r from-sky-700 to-emerald-700 rounded text-[10px] text-white flex items-center px-2 font-medium truncate border border-emerald-400/30">
                  Clip 3: Reveal (10-15s)
                </div>
              </div>
            </div>

            {/* Audio Track */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-12 text-slate-400 font-mono">AUDIO</span>
              <div className="flex-1 h-5 bg-emerald-950/60 rounded border border-emerald-500/20 flex items-center px-2 text-[10px] text-emerald-300 font-medium truncate">
                Synthwave Cyber Bass 128BPM (Licensed Royalty Free)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
