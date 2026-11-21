'use client';

import React, { useState, useEffect } from 'react';
import {
  Subtitles,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Type,
  Shield,
  Layers,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { MythScene, MythAudioTrack } from '@/lib/mythology/types';

interface Step6TimelineProps {
  scenes: MythScene[];
  audioTrack?: MythAudioTrack;
  onNext: () => void;
  onPrev: () => void;
}

export function Step6Timeline({
  scenes,
  audioTrack,
  onNext,
  onPrev,
}: Step6TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [captionStyle, setCaptionStyle] = useState<'karaoke_gold' | 'boxed_amber' | 'clean_white'>('karaoke_gold');
  const [captionPosition, setCaptionPosition] = useState<'bottom' | 'center' | 'safe_zone'>('safe_zone');
  const [showWatermark, setShowWatermark] = useState(true);

  const totalDuration = audioTrack?.durationSec || scenes.reduce((a, b) => a + (b.estimatedDurationSec || 5), 0);

  // Playback timer simulation for live caption test
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPlayTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Determine active scene based on time
  const sceneDuration = totalDuration / Math.max(1, scenes.length);
  const activeSceneIndex = Math.min(
    scenes.length - 1,
    Math.floor(currentPlayTime / sceneDuration)
  );
  const activeScene = scenes[activeSceneIndex] || scenes[0];

  // Active word in karaoke caption
  const activeWordObj = audioTrack?.timestamps?.find(
    (t) => currentPlayTime >= t.startSec && currentPlayTime <= t.endSec
  );
  const activeWord = activeWordObj?.word || '';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Subtitles className="w-3.5 h-3.5" />
            Step 6: Timeline & Devanagari Captions
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Word-by-word synced caption styling
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Styled with Noto Sans Devanagari typography to guarantee Sanskrit/Hindi matras never break awkwardly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 9:16 Vertical Video Live Canvas */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-slate-900 flex flex-col justify-between">
            {/* Background Visual with Parallax Zoom */}
            {activeScene?.imageUrl ? (
              <img
                src={activeScene.imageUrl}
                alt="Live Scene Preview"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                  isPlaying ? 'scale-105' : 'scale-100'
                }`}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black flex items-center justify-center text-slate-500 text-xs">
                Scene Visual Preview
              </div>
            )}

            {/* Subtle Gradient Shadow for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Top Channel / Fluvia Watermark */}
            <div className="relative z-10 p-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-black/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                ॐ MYTHOS
              </span>

              {showWatermark && (
                <span className="text-[9px] font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Fluvia Flow Free
                </span>
              )}
            </div>

            {/* Center / Safe Zone Word-by-Word Caption Box */}
            <div
              className={`relative z-10 px-4 text-center ${
                captionPosition === 'center'
                  ? 'my-auto'
                  : captionPosition === 'safe_zone'
                  ? 'mb-16'
                  : 'mb-6'
              }`}
            >
              <div
                className={`inline-block px-3.5 py-2 rounded-xl backdrop-blur-md font-extrabold max-w-full ${
                  captionStyle === 'karaoke_gold'
                    ? 'bg-black/75 text-white border border-amber-500/50'
                    : captionStyle === 'boxed_amber'
                    ? 'bg-amber-500 text-slate-950 shadow-lg'
                    : 'bg-black/50 text-white'
                }`}
              >
                {/* Scene Active Caption with Highlight */}
                <p className="text-sm sm:text-base leading-snug tracking-wide font-sans">
                  {activeScene?.onScreenText || activeScene?.narration?.slice(0, 30)}
                </p>
                {activeWord && (
                  <span className="block mt-1 text-xs font-black text-amber-300 animate-pulse">
                    ★ {activeWord} ★
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Playback Scrubber Bar */}
            <div className="relative z-10 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all"
                  style={{ width: `${(currentPlayTime / totalDuration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/80 mt-1 font-mono">
                <span>{currentPlayTime.toFixed(1)}s</span>
                <span>Scene {activeSceneIndex + 1}/{scenes.length}</span>
                <span>{totalDuration.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Player Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="mt-3 px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Preview' : 'Play Live Preview'}</span>
          </button>
        </div>

        {/* Right: Caption Styling Controls */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-500" />
              Caption Theme & Typography
            </h3>

            {/* Theme Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'karaoke_gold', name: 'Sacred Gold Karaoke', desc: 'Glowing saffron active word' },
                { id: 'boxed_amber', name: 'Vibrant Saffron Box', desc: 'High-contrast viral yellow' },
                { id: 'clean_white', name: 'Minimal Cinematic', desc: 'Translucent clean white' },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setCaptionStyle(style.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    captionStyle === style.id
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {style.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {style.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Position Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Vertical Caption Position (Avoid TikTok/Reels UI overlap)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'safe_zone', name: 'Safe Zone (Above UI)' },
                  { id: 'center', name: 'Center Screen' },
                  { id: 'bottom', name: 'Bottom Edge' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setCaptionPosition(pos.id as any)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      captionPosition === pos.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    {pos.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Fluvia Flow Watermark Badge
                </span>
                <span className="text-[11px] text-slate-500">
                  Automatically removed on Mythos Creator and Pro subscription plans.
                </span>
              </div>
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stepper Navigation Actions */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Final Export</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
