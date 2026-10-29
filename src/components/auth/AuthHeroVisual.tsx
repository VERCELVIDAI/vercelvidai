'use client';

import React, { useState, useRef } from 'react';
import { Logo } from '@/components/brand/Logo';
import {
  Sparkles,
  Film,
  Play,
  Pause,
  CheckCircle2,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';

export function AuthHeroVisual() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div className="hidden lg:flex flex-col justify-between w-full h-full p-10 xl:p-14 relative overflow-hidden bg-[#F7F8FA] text-[#17191D] border-r border-[#E5E7EB]">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#E5E7EB 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo size="lg" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#5145CD] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
          <span>Commercial Video Platform</span>
        </div>
      </div>

      {/* Hero Showcase Center */}
      <div className="relative z-10 my-auto py-6 text-left max-w-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5145CD]/10 text-[#5145CD] border border-[#5145CD]/20 text-xs font-semibold mb-5">
          <Film className="w-3.5 h-3.5" />
          <span>Commercial Video Creatives</span>
        </div>

        <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-[#17191D] leading-tight">
          Turn product concepts into high-converting video ads.
        </h2>

        <p className="mt-3 text-base text-[#667085] leading-relaxed">
          Produce commercial spots, product reels, and viral marketing campaigns with intelligent multi-scene video rendering.
        </p>

        {/* Cinematic Video Showcase Card */}
        <div className="mt-8 relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-lg">
          {/* 100% PURE CLEAN VIDEO VIEWPORT — ABSOLUTELY ZERO OVERLAYS */}
          <div className="relative aspect-[16/10] w-full bg-[#0D0E12] overflow-hidden flex items-center justify-center">
            {/* Ambient Blurred Backdrop */}
            <img
              src="/media/templates/poster-vid-cyber-hyperkart.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-125 pointer-events-none"
            />

            {/* Pure Video Element */}
            <video
              ref={videoRef}
              src="/media/templates/tmpl-cyber-hyperkart.mp4"
              poster="/media/templates/poster-vid-cyber-hyperkart.jpg"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="relative z-10 h-full w-auto aspect-[9/16] object-cover shadow-2xl rounded-lg"
            />
          </div>

          {/* Controls & Metadata Cleanly Placed UNDER the Video */}
          <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-xs text-[#17191D] truncate">
                  Veloce Apex — Cyber Hyperkart Reveal
                </p>
                <p className="text-[11px] text-[#667085]">
                  Automotive Commercial Reel • 9:16
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                title={isPlaying ? 'Pause video' : 'Play video'}
                className="p-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white text-[#17191D] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                title={isMuted ? 'Unmute video' : 'Mute video'}
                className="p-1.5 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] hover:bg-white text-[#17191D] transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Metrics bar under video */}
          <div className="p-4 bg-[#F7F8FA] grid grid-cols-3 gap-3 border-t border-[#E5E7EB] text-left">
            <div>
              <p className="text-[11px] text-[#667085] font-medium">Render Speed</p>
              <p className="text-sm font-bold text-[#17191D]">~60 seconds</p>
            </div>
            <div>
              <p className="text-[11px] text-[#667085] font-medium">Resolution</p>
              <p className="text-sm font-bold text-[#17191D]">1080p / 4K</p>
            </div>
            <div>
              <p className="text-[11px] text-[#667085] font-medium">Commercial Rights</p>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#667085]">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />
            <span>Multi-scene video timelines</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />
            <span>Voice-over synchronization</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />
            <span>No video editing experience needed</span>
          </div>
        </div>
      </div>

      {/* Bottom Trust Stamp */}
      <div className="relative z-10 pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#667085]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#5145CD]" />
          <span>Enterprise-grade security & encrypted assets</span>
        </div>
        <span className="font-semibold text-[#17191D]">Trusted by 10,000+ creators</span>
      </div>
    </div>
  );
}
