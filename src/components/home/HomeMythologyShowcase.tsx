"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Sparkles, Play, Pause, Volume2, VolumeX, ArrowRight, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import { DevotionalParticles } from "@/components/mythology/DevotionalParticles";

interface MythosShowcaseItem {
  id: string;
  templateParam: string;
  title: string;
  deity: string;
  tag: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  description: string;
  artStyle: string;
}

const MYTHOS_SHOWCASE_TEMPLATES: MythosShowcaseItem[] = [
  {
    id: "shiva_tandav",
    templateParam: "shiva",
    title: "Mahadev Shiva Tandava",
    deity: "Lord Shiva",
    tag: "#Mahadev #Tandava",
    duration: "78s",
    videoUrl: "/media/mythology/mythos-template-1.mp4",
    posterUrl: "/media/mythology/mythos-template-1.jpg",
    description: "Cosmic Tandava on Mount Kailash with celestial third-eye glow, Ganga flow, and Damru beats.",
    artStyle: "Classical Indian Oil",
  },
  {
    id: "ram_ayodhya",
    templateParam: "ram",
    title: "Shri Ram & Ayodhya Dham",
    deity: "Lord Rama",
    tag: "#ShriRam #Ayodhya",
    duration: "108s",
    videoUrl: "/media/mythology/mythos-template-2.mp4",
    posterUrl: "/media/mythology/mythos-template-2.jpg",
    description: "Maryada Purushottam Shri Ram with divine Kodanda bow in radiant golden Ayodhya sunrise.",
    artStyle: "Tanjore Gold Leaf",
  },
  {
    id: "krishna_gita",
    templateParam: "krishna",
    title: "Shri Krishna Gita Vishwaroop",
    deity: "Lord Krishna",
    tag: "#Krishna #BhagavadGita",
    duration: "179s",
    videoUrl: "/media/mythology/mythos-template-3.mp4",
    posterUrl: "/media/mythology/mythos-template-3.jpg",
    description: "Cosmic universal Vishwaroop Darshan to warrior Arjuna on the battlefield of Kurukshetra.",
    artStyle: "Cinematic Epic 8K",
  },
  {
    id: "hanuman_sanjeevani",
    templateParam: "hanuman",
    title: "Veer Hanuman Sanjeevani",
    deity: "Veer Hanuman",
    tag: "#Bajrangbali #Hanuman",
    duration: "135s",
    videoUrl: "/media/mythology/mythos-template-4.mp4",
    posterUrl: "/media/mythology/mythos-template-4.jpg",
    description: "Mighty Veer Hanuman lifting Dronagiri mountain with soaring heroic devotion and war drums.",
    artStyle: "Anime Epic / Comic",
  },
];

export function HomeMythologyShowcase() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (activeVideoId === id) {
      video.pause();
      setActiveVideoId(null);
    } else {
      // Pause any currently playing video
      if (activeVideoId && videoRefs.current[activeVideoId]) {
        videoRefs.current[activeVideoId]?.pause();
      }
      video.muted = isMuted;
      video.play().catch(() => {});
      setActiveVideoId(id);
    }
  };

  const handleToggleMute = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const video = videoRefs.current[id];
    if (video) {
      video.muted = nextMuted;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFFDF8] via-[#FFF8EC] to-[#FFFFFF] border-b border-amber-200/70 relative overflow-hidden">
      {/* Devotional Ambient Particle Overlay (Floating Diya Embers) */}
      <DevotionalParticles count={18} />

      {/* Radiant Background Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-400/15 via-orange-500/15 to-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/60 text-xs font-black text-amber-900 shadow-sm">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="uppercase tracking-wider">🕉️ Fluvia Mythos • Sacred AI Video Creator</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Turn Sacred Stories into <br />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 bg-clip-text text-transparent">
              Viral Vertical Reels in Minutes
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Experience our 7-step JSON-to-Video AI engine. Turn Puranic epics into high-converting 9:16 vertical videos with authentic Indian art styles, ElevenLabs Hindi narration, and Noto Sans Devanagari karaoke captions.
          </p>

          {/* Pricing Quick Highlights */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900">
              ⚡ 10 Videos Plan: ₹5,100 / mo
            </span>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
              🔥 Special Creator: ₹7,999 / mo (20 Videos)
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900">
              🚀 Studio Scale: 50 Videos Plan
            </span>
          </div>
        </div>

        {/* 4 Interactive Video Template Cards (Actual Uploaded Videos) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MYTHOS_SHOWCASE_TEMPLATES.map((item) => {
            const isPlaying = activeVideoId === item.id;
            return (
              <div
                key={item.id}
                className="group relative rounded-3xl bg-white border-2 border-amber-200/80 hover:border-amber-400 p-3 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* 9:16 Video Container */}
                <div
                  className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-inner"
                  onClick={() => handleTogglePlay(item.id)}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[item.id] = el;
                    }}
                    src={item.videoUrl}
                    poster={item.posterUrl}
                    playsInline
                    loop
                    muted={isMuted}
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-amber-300 border border-amber-400/40 uppercase">
                      {item.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold uppercase">
                      {item.artStyle}
                    </span>
                  </div>

                  {/* Play / Pause Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 shadow-xl ${
                        isPlaying
                          ? "bg-black/60 text-white opacity-0 group-hover:opacity-100 scale-90"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-100 group-hover:scale-110 shadow-[0_0_25px_rgba(245,158,11,0.6)]"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                      )}
                    </div>
                  </div>

                  {/* Audio Mute/Unmute Toggle Button */}
                  {isPlaying && (
                    <button
                      type="button"
                      onClick={(e) => handleToggleMute(e, item.id)}
                      className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white text-xs z-20 backdrop-blur-md border border-white/20 transition-transform active:scale-95"
                      title={isMuted ? "Unmute audio" : "Mute audio"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  )}

                  {/* Subtle Golden Glow Bar at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400" />
                </div>

                {/* Video Info & 1-Click Action */}
                <div className="pt-3 px-1 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800">
                    <span>{item.deity}</span>
                    <span className="font-mono text-[10px] text-slate-400">{item.tag}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href={`/mythology/studio?template=${item.templateParam}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-amber-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Use This Template</span>
                      <ArrowRight className="w-3 h-3 ml-0.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Actions & Guarantees */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 rounded-3xl border border-amber-300/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Ready to create your first mythology video in 60 seconds?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              No complex prompt engineering. Choose a template or story, get structured JSON, and render watermark-free 1080p MP4s.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/mythology/studio"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-95 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Open Mythology Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/pricing"
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 transition-all flex items-center gap-2 shadow-xs"
            >
              <span>View Video Plans (₹5,100+)</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
