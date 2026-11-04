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

const AUTH_VIDEOS = [
  {
    id: 'spacewalk',
    title: 'Orbital Spacewalk — Cinematic Space',
    category: 'Cinematic Sci-Fi • 1080p',
    video: '/media/showcase/vidai-astronaut-spacewalk.mp4',
    poster: '/media/showcase/vidai-astronaut-spacewalk.jpg',
    pill: '🚀 Spacewalk',
  },
  {
    id: 'jungle',
    title: 'Amazonia Expedition — Jungle Adventure',
    category: 'Adventure Film • 1080p',
    video: '/media/showcase/vidai-jungle-expedition.mp4',
    poster: '/media/showcase/vidai-jungle-expedition.jpg',
    pill: '🌿 Amazonia',
  },
  {
    id: 'skaters',
    title: 'Swan Elegance — Haute Couture Ice Gala',
    category: 'Haute Couture • 1080p',
    video: '/media/showcase/vidai-haute-couture-skaters.mp4',
    poster: '/media/showcase/vidai-haute-couture-skaters.jpg',
    pill: '⛸️ Haute Couture',
  },
  {
    id: 'snow',
    title: 'Apex Powder Descent — Avalanche Carve',
    category: 'Action Sports • 720p',
    video: '/media/showcase/vidai-snow-avalanche.mp4',
    poster: '/media/showcase/vidai-snow-avalanche.jpg',
    pill: '🏂 Avalanche',
  },
  {
    id: 'superbike',
    title: 'Neo-Tokyo GP — Cyberpunk Night Drift',
    category: 'Cyberpunk Automotive • 720p',
    video: '/media/showcase/vidai-cyberpunk-superbike.mp4',
    poster: '/media/showcase/vidai-cyberpunk-superbike.jpg',
    pill: '🏍️ Superbike',
  },
];

export function AuthHeroVisual() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeVideo = AUTH_VIDEOS[activeIdx];

  const handleSelectVideo = (idx: number) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

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
          {/* Pure Clean Video Viewport */}
          <div className="relative aspect-[16/10] w-full bg-[#0D0E12] overflow-hidden flex items-center justify-center">
            {/* Ambient Blurred Backdrop */}
            <img
              src={activeVideo.poster}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-125 pointer-events-none"
            />

            {/* Pure Video Element */}
            <video
              ref={videoRef}
              key={activeVideo.video}
              src={activeVideo.video}
              poster={activeVideo.poster}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="relative z-10 w-full h-full object-cover shadow-2xl"
            />
          </div>

          {/* Quick Video Switcher Pills */}
          <div className="p-2.5 bg-[#F7F8FA] border-t border-[#E5E7EB] flex items-center gap-1.5 overflow-x-auto">
            {AUTH_VIDEOS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectVideo(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  idx === activeIdx
                    ? 'bg-[#5145CD] text-white shadow-2xs'
                    : 'bg-white text-[#667085] hover:text-[#17191D] border border-[#E5E7EB]'
                }`}
              >
                {item.pill}
              </button>
            ))}
          </div>

          {/* Controls & Metadata Cleanly Placed UNDER the Video */}
          <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-xs text-[#17191D] truncate">
                  {activeVideo.title}
                </p>
                <p className="text-[11px] text-[#667085]">
                  {activeVideo.category}
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
