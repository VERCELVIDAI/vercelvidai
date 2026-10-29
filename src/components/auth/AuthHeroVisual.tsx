'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  Zap,
  TrendingUp,
} from 'lucide-react';

export function AuthHeroVisual() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
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
          <span>Gemini Omni 1.1 Flash Engine</span>
        </div>
      </div>

      {/* Hero Showcase Center */}
      <div className="relative z-10 my-auto py-6 text-left max-w-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5145CD]/10 text-[#5145CD] border border-[#5145CD]/20 text-xs font-semibold mb-5">
          <Film className="w-3.5 h-3.5" />
          <span>AI Creative Ad Creation Studio</span>
        </div>

        <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-[#17191D] leading-tight">
          Turn product concepts into high-converting video ads.
        </h2>

        <p className="mt-3 text-base text-[#667085] leading-relaxed">
          Produce cinematic commercial spots, product reels, and viral marketing campaigns with intelligent multi-scene AI rendering.
        </p>

        {/* Cinematic Video Showcase Card */}
        <div className="mt-8 relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-lg group">
          <div className="relative aspect-video w-full bg-[#17191D] overflow-hidden">
            <video
              ref={videoRef}
              src="/media/hero/fluvia-hero-showcase.mp4"
              poster="/media/templates/v-prod-1.jpg"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className="w-full h-full object-cover"
            />

            {/* Video overlay controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-between p-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-medium text-white border border-white/10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Preview
                </span>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-white text-xs">
                <div>
                  <p className="font-semibold text-sm">Luxury Product Showcase</p>
                  <p className="text-[11px] text-white/70">4K Ultra HD • 16:9 Cinema</p>
                </div>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Metrics bar under video */}
          <div className="p-4 bg-white grid grid-cols-3 gap-3 border-t border-[#E5E7EB] text-left">
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
            <span>AI voice-over synchronization</span>
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
