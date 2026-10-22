'use client';

import React, { useState } from 'react';
import { Play, Pause, Sparkles, Volume2, VolumeX, Maximize2, Wand2, Film, Layers, Sliders } from 'lucide-react';

export function HeroVisual() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 rounded-2xl glass-card p-2 sm:p-4 shadow-2xl border border-emerald-500/20 relative">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-500/15 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono font-bold text-[#17211D]">Fluvia Flow Cinema Studio v3.0</span>
          <span className="text-emerald-700 font-semibold">• 4K Neural Canvas</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-300">
            Render Ready
          </span>
          <span className="font-mono text-slate-500 font-medium">00:00:15:00 / 1080p 60fps</span>
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-2 sm:p-4">
        {/* Left Scene Tree / Prompt Inspector */}
        <div className="hidden lg:flex flex-col gap-3 col-span-1 border-r border-emerald-500/15 pr-4 text-left">
          <div className="text-xs font-bold uppercase text-[#17211D] tracking-wider flex items-center justify-between">
            <span>Storyboard Scenes</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">3 Clips</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-400 text-xs shadow-xs">
              <div className="flex justify-between items-center text-[#17211D] font-bold mb-1">
                <span className="text-emerald-800 font-bold">Scene 1 • 0-5s</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-semibold">Active</span>
              </div>
              <p className="text-slate-600 line-clamp-2">High-speed urban night sprint with emerald rain reflections.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 border border-emerald-500/15 text-xs hover:bg-emerald-50/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center text-[#17211D] font-medium mb-1">
                <span>Scene 2 • 5-10s</span>
                <span className="text-[10px] text-slate-500">Video</span>
              </div>
              <p className="text-slate-600 line-clamp-2">Dynamic side profile camera glide along skyline.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 border border-emerald-500/15 text-xs hover:bg-emerald-50/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center text-[#17211D] font-medium mb-1">
                <span>Scene 3 • 10-15s</span>
                <span className="text-[10px] text-slate-500">CTA</span>
              </div>
              <p className="text-slate-600 line-clamp-2">Logo lockup reveal with 3D particles & audio stinger.</p>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-emerald-500/15">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <Wand2 className="w-3.5 h-3.5 text-pink-500" />
              <span>AI Auto-Colorgrade: Emerald Vivid</span>
            </div>
          </div>
        </div>

        {/* Central Cinema Player */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/20 group shadow-inner">
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
            <div className="absolute top-6 left-6 pointer-events-none text-left">
              <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-xs font-mono text-emerald-400 border border-emerald-400/30">
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
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label={isMuted ? 'Unmute preview video' : 'Mute preview video'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-slate-200">00:04 / 00:15</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-emerald-600/80 text-white text-[11px] font-bold border border-emerald-400/40 shadow-xs">
                  Fluvia Neural Engine HD
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Glimpse */}
          <div className="bg-white/85 p-3 rounded-xl border border-emerald-500/20 space-y-2 shadow-xs text-left">
            <div className="flex justify-between items-center text-[11px] text-slate-600 font-mono">
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-bold text-[#17211D]">Multi-Track Timeline</span>
              </div>
              <span className="text-slate-500">0s ---------- 5s ---------- 10s ---------- 15s</span>
            </div>

            {/* Video Track */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-12 text-slate-600 font-mono font-bold">VIDEO</span>
              <div className="flex-1 grid grid-cols-3 gap-1.5 h-7">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded text-[10px] text-white flex items-center px-2 font-bold truncate shadow-xs">
                  Clip 1: Sprint (0-5s)
                </div>
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded text-[10px] text-white flex items-center px-2 font-bold truncate shadow-xs">
                  Clip 2: Glide (5-10s)
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded text-[10px] text-white flex items-center px-2 font-bold truncate shadow-xs">
                  Clip 3: Reveal (10-15s)
                </div>
              </div>
            </div>

            {/* Audio Track */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] w-12 text-slate-600 font-mono font-bold">AUDIO</span>
              <div className="flex-1 h-5 bg-emerald-100 rounded border border-emerald-300 flex items-center px-2 text-[10px] text-emerald-900 font-semibold truncate">
                Synthwave Cyber Bass 128BPM (Licensed Royalty Free)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
