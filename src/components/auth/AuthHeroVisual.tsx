'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  Sparkles,
  Video,
  Layers,
  Wand2,
  Film,
  Play,
  Pause,
  CheckCircle2,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { LOGIN_FLOATING_THUMBNAILS } from '@/lib/mediaManifest';

export function AuthHeroVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
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
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hidden lg:flex flex-col justify-between w-full h-full p-10 xl:p-14 relative overflow-hidden bg-gradient-to-br from-white via-[#F0FDF4]/70 to-[#FFF1F7]/60 text-[#17211D] border-r border-emerald-500/20"
    >
      {/* Dynamic Background Glow Lighting */}
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-pink-400/20 rounded-full blur-[130px] pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${-mousePos.x * 50}px, ${-mousePos.y * 50}px)`,
        }}
      />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Logo size="lg" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-emerald-500/20 text-xs font-mono text-emerald-800 backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>v3.0 Gemini Engine</span>
        </div>
      </div>

      {/* Hero Headline & Interactive Composition Area */}
      <div className="relative z-10 my-auto py-6 text-left">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/60 text-xs font-bold mb-5 shadow-xs">
            <Film className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI Creative Video Studio</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-[#17211D] leading-[1.12]">
            Bring your imagination{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-pink-600 bg-clip-text text-transparent">
              to life.
            </span>
          </h2>

          <p className="mt-4 text-base xl:text-lg text-slate-600 leading-relaxed font-normal">
            Create cinematic videos, stunning visuals and scroll-stopping campaigns with AI.
          </p>
        </div>

        {/* 3D Floating Interactive Media Stack */}
        <div
          className="mt-8 relative h-80 w-full max-w-lg perspective-1200 transition-transform duration-300 ease-out"
          style={{
            transform: `rotateY(${mousePos.x * 10}deg) rotateX(${-mousePos.y * 10}deg)`,
          }}
        >
          {/* Main Card: Playable Video Composition Preview */}
          <div
            className="absolute top-0 left-0 w-[340px] xl:w-[360px] rounded-2xl glass-card p-3 border border-emerald-500/30 shadow-2xl transition-transform duration-500"
            style={{
              transform: `translateZ(40px) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            }}
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/20 group">
              {/* Fallback Poster Image */}
              <img
                src="/media/login/thumb-cyberpunk.jpg"
                alt="Fluvia Flow Video Preview"
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
                }`}
              />

              {/* Verified Local Playable Video Stream */}
              {!videoError && (
                <video
                  ref={videoRef}
                  src="/media/login/login-hero-preview.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  onError={() => setVideoError(true)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    videoLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {/* Floating Controls Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-2.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-emerald-300 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Scene 01 • Dolly In 35mm</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                    className="p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    className="p-1.5 rounded-md bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-3 h-3 text-amber-300" /> : <Volume2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#17211D] font-bold">
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cyberpunk Runner v2</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md border border-emerald-300/50">
                1080p 60fps
              </span>
            </div>
          </div>

          {/* Sub Card: Floating Storyboard Inspector */}
          <div
            className="absolute top-10 left-52 w-64 rounded-2xl glass-card p-3 border border-pink-400/35 shadow-xl transition-transform duration-500 backdrop-blur-md"
            style={{
              transform: `translateZ(20px) translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
            }}
          >
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-pink-500/15">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#17211D]">
                <Layers className="w-3.5 h-3.5 text-pink-600" />
                <span>Gemini Storyboard</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                4 Shots Synced
              </span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
              &quot;Volumetric morning rays slicing through ancient redwoods, slow dolly tracking camera.&quot;
            </p>
          </div>

          {/* Floating Thumbnail Strips */}
          <div
            className="absolute -bottom-2 left-6 flex items-center gap-2 p-1.5 rounded-xl bg-white/90 border border-emerald-500/20 shadow-lg backdrop-blur-md"
            style={{
              transform: `translateZ(30px) translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
            }}
          >
            {LOGIN_FLOATING_THUMBNAILS.map((thumb) => (
              <div
                key={thumb.id}
                className="relative group/thumb w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/20 shadow-xs"
              >
                <img
                  src={thumb.src}
                  alt={thumb.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
              </div>
            ))}
            <div className="px-2 text-[10px] font-bold text-emerald-800">
              +18 Presets
            </div>
          </div>
        </div>
      </div>

      {/* Feature Badges Footer */}
      <div className="relative z-10 flex flex-wrap gap-4 pt-5 border-t border-emerald-500/15 text-xs text-slate-700 font-semibold">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Multi-Track Timeline Editor</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Gemini AI Storyboards</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-pink-600" />
          <span>Enterprise Render Cloud</span>
        </div>
      </div>
    </div>
  );
}
