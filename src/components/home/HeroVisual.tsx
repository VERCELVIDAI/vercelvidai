'use client';

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Wand2, CheckCircle2 } from 'lucide-react';

const HERO_SCENES = [
  {
    id: 'spacewalk',
    title: 'Orbital Spacewalk',
    tag: 'Sci-Fi Commercial',
    duration: '8s',
    video: '/media/showcase/vidai-astronaut-spacewalk.mp4',
    poster: '/media/showcase/vidai-astronaut-spacewalk.jpg',
    headline: 'CINEMATIC ORBITAL SPACEWALK',
    desc: 'Deep orbit astronaut spacewalk with Earth curvature and visor specular reflections.',
    camera: 'Camera: High Orbit Slow Drift',
  },
  {
    id: 'jungle',
    title: 'Amazonia Expedition',
    tag: 'Cinematic Adventure',
    duration: '9s',
    video: '/media/showcase/vidai-jungle-expedition.mp4',
    poster: '/media/showcase/vidai-jungle-expedition.jpg',
    headline: 'INTENSE JUNGLE EXPEDITION',
    desc: 'Explorer parting monstera foliage in humid rainforest with glistening raindrops.',
    camera: 'Camera: Macro Push-In (Volumetric)',
  },
  {
    id: 'skaters',
    title: 'Swan Elegance Gala',
    tag: 'Haute Couture',
    duration: '15s',
    video: '/media/showcase/vidai-haute-couture-skaters.mp4',
    poster: '/media/showcase/vidai-haute-couture-skaters.jpg',
    headline: 'HAUTE COUTURE ICE GALA',
    desc: 'Synchronized figure skaters in crystal-feather gowns on misty arena ice.',
    camera: 'Camera: Smooth Ice Glide Tracking',
  },
  {
    id: 'snow',
    title: 'Apex Powder Descent',
    tag: 'Extreme Sports',
    duration: '15s',
    video: '/media/showcase/vidai-snow-avalanche.mp4',
    poster: '/media/showcase/vidai-snow-avalanche.jpg',
    headline: 'ALPINE POWDER AVALANCHE',
    desc: 'Pro snowboarder carving steep glacier powder with billowing snow plumes.',
    camera: 'Camera: Dynamic High-Speed Chase',
  },
  {
    id: 'superbike',
    title: 'Neo-Tokyo GP Race',
    tag: 'Cyberpunk Automotive',
    duration: '15s',
    video: '/media/showcase/vidai-cyberpunk-superbike.mp4',
    poster: '/media/showcase/vidai-cyberpunk-superbike.jpg',
    headline: 'CYBERPUNK SUPERBIKE GP',
    desc: 'Neon Tokyo midnight rain street race with start-to-finish scene transition.',
    camera: 'Camera: Low-Angle Drift Tracker',
  },
];

export function HeroVisual() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeScene = HERO_SCENES[activeIdx];

  const handleSelectScene = (idx: number) => {
    setActiveIdx(idx);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

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
          <span className="text-[#5145CD] font-semibold hidden sm:inline">• Scene Builder & 4K Neural Canvas</span>
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
        {/* Left Scene Builder / Clip Switcher */}
        <div className="hidden lg:flex flex-col gap-2.5 col-span-1 border-r border-[#E5E7EB] pr-4 text-left">
          <div className="text-xs font-bold uppercase text-[#17191D] tracking-wider flex items-center justify-between mb-1">
            <span>Scene Builder</span>
            <span className="text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-[#5145CD]/20 text-[10px] font-semibold">
              5 Flagship Clips
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1">
            {HERO_SCENES.map((scene, idx) => {
              const isCurrent = idx === activeIdx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#EEF2FF] border border-[#5145CD]/40 shadow-xs'
                      : 'bg-[#F7F8FA] border border-[#E5E7EB] hover:border-[#5145CD]/30 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-[#17191D] font-bold mb-1">
                    <span className={isCurrent ? 'text-[#5145CD]' : 'text-[#17191D]'}>
                      Scene {idx + 1} • {scene.duration}
                    </span>
                    {isCurrent ? (
                      <span className="text-[9px] bg-[#5145CD] text-white px-1.5 py-0.2 rounded font-semibold">
                        Playing
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#667085] font-mono">{scene.tag}</span>
                    )}
                  </div>
                  <p className="text-[#667085] text-[11px] line-clamp-2 leading-relaxed">
                    {scene.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-2.5 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-xs text-[#17191D] font-bold">
              <Wand2 className="w-3.5 h-3.5 text-[#5145CD]" />
              <span className="truncate">{activeScene.camera}</span>
            </div>
          </div>
        </div>

        {/* Central Cinema Player */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 group shadow-inner">
            <video
              ref={videoRef}
              key={activeScene.video}
              className="w-full h-full object-cover"
              src={activeScene.video}
              poster={activeScene.poster}
              playsInline
              loop
              autoPlay
              muted={isMuted}
            />

            {/* In-Video Motion Headline */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 pointer-events-none text-left">
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono text-[#5145CD] font-semibold border border-white/40 shadow-xs">
                FLUVIA FLOW • {activeScene.tag.toUpperCase()} • 1080P
              </span>
              <h3 className="mt-2 text-lg sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
                {activeScene.headline}
              </h3>
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <span className="font-mono text-indigo-300 text-[11px] hidden sm:inline">
                  Timeline: 00:00:{activeScene.duration} / {activeScene.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#5145CD] text-white font-bold">
                  Google Gemini Omni 1.1 Flash
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 font-mono border border-white/20">
                  15 cr
                </span>
              </div>
            </div>
          </div>

          {/* Quick Scene Pill Switcher (Visible on Mobile & Tablet) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:hidden">
            {HERO_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  idx === activeIdx
                    ? 'bg-[#5145CD] text-white shadow-xs'
                    : 'bg-[#F7F8FA] text-[#667085] hover:bg-[#EEF2FF]'
                }`}
              >
                {scene.title}
              </button>
            ))}
          </div>

          {/* Timeline Sequence Strip */}
          <div className="hidden sm:grid grid-cols-5 gap-2 text-left">
            {HERO_SCENES.map((scene, idx) => {
              const isCurrent = idx === activeIdx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`p-2 rounded-xl text-[11px] transition-all text-left cursor-pointer ${
                    isCurrent
                      ? 'bg-[#EEF2FF] border border-[#5145CD]/40'
                      : 'bg-[#F7F8FA] border border-[#E5E7EB] hover:bg-white'
                  }`}
                >
                  <div className={`font-semibold truncate ${isCurrent ? 'text-[#5145CD]' : 'text-[#17191D]'}`}>
                    {scene.title}
                  </div>
                  <div className="text-[#667085] font-mono text-[10px]">{scene.duration} • 15 cr</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
