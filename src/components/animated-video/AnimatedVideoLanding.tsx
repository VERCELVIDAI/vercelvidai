'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Film,
  Download,
  ChevronDown,
  Layers,
  Wand2,
  Volume2,
  FileCode2,
  X,
  ExternalLink,
} from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { AnimatedVideoStudio } from './AnimatedVideoStudio';
import { ANIMATION_STYLES } from '@/lib/animated-video/styles';
import { AnimationStyle, AnimationStyleId } from '@/lib/animated-video/types';

interface AnimatedVideoLandingProps {
  initialStyle?: AnimationStyleId;
}

export function AnimatedVideoLanding({ initialStyle = 'mythology' }: AnimatedVideoLandingProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<AnimationStyleId>(initialStyle);
  const [detailModalStyle, setDetailModalStyle] = useState<AnimationStyle | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  // Template video preview modal for Mythology style
  const [activeVideoModal, setActiveVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    videoUrl: string;
    source?: string;
  }>({
    isOpen: false,
    title: '',
    videoUrl: '',
  });

  const handleUseStyle = (styleId: AnimationStyleId) => {
    setSelectedStyleId(styleId);
    if (detailModalStyle) {
      setDetailModalStyle(null);
    }
    // Smooth scroll to studio
    if (studioRef.current) {
      studioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyPrompt = (style: AnimationStyle) => {
    navigator.clipboard.writeText(style.samplePrompt);
    setCopiedPromptId(style.id);
    setTimeout(() => setCopiedPromptId(null), 2200);
  };

  const FAQS = [
    {
      q: 'Is it really free?',
      a: 'Yes! The in-browser script generator, JSON editor, and canvas export are completely free without any watermark. If you want ultra-fast cloud rendering for 4K video exports, you can use our regular studio credits.',
    },
    {
      q: 'Which AI model is used for the script?',
      a: 'Powered by Gemini 2.5 Flash for hyper-fast scene-by-scene script structuring, camera movement prompts, and word-by-word timing in Hindi, English, and Hinglish.',
    },
    {
      q: 'Can I make Hindi videos?',
      a: 'Yes! We have full native support for Hindi (Devanagari script), Hinglish, and English with dedicated Indian voice accents (Rishi, Ananya, Rohan) and Devanagari typography.',
    },
    {
      q: 'Where do I get my API key for the script?',
      a: 'You do not need any API key for basic generation or sample JSON playback. If you have your own Google Gemini API key, you can optionally supply it to bypass server quotas.',
    },
    {
      q: 'Will my song/video get a copyright strike?',
      a: 'No! All generated visual prompts, custom JSON structures, and synthesized narration are generated uniquely for your project. You own 100% commercial rights to the exported videos.',
    },
    {
      q: 'What characters and themes can I shoot?',
      a: 'Everything from Vedic deities (Shiva, Rama, Krishna, Hanuman) and Puranic epics to tech explainers, comic superheroes, educational blackboards, retro pixel gamers, and animated song lyrics.',
    },
  ];

  const MYTHOLOGY_TEMPLATES = [
    {
      title: 'Mahadev Shiva Tandava & Kailash Stuti',
      source: 'Shiva Purana, Rudra Samhita',
      poster: '/media/mythology/mythos-template-1.jpg',
      video: '/media/mythology/mythos-template-1.mp4',
      badge: 'Viral #1',
    },
    {
      title: 'Maryada Purushottam Shri Ram & Ayodhya Dham',
      source: 'Valmiki Ramayana, Balakanda',
      poster: '/media/mythology/mythos-template-2.jpg',
      video: '/media/mythology/mythos-template-2.mp4',
      badge: 'Trending',
    },
    {
      title: 'Krishna Unveils the Cosmic Vishwaroop',
      source: 'Srimad Bhagavad Gita, Ch. 11',
      poster: '/media/mythology/mythos-template-3.jpg',
      video: '/media/mythology/mythos-template-3.mp4',
      badge: 'Most Shared',
    },
    {
      title: 'Sankat Mochan Veer Hanuman & Sanjeevani',
      source: 'Valmiki Ramayana, Yuddha Kanda',
      poster: '/media/mythology/mythos-template-4.jpg',
      video: '/media/mythology/mythos-template-4.mp4',
      badge: 'Staff Pick',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A11] text-slate-100 font-sans selection:bg-[#FFB800] selection:text-black">
      <Header />

      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[#231F3D] bg-[#0E0D1B] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#FFB800] font-bold tracking-wide uppercase text-[11px]">
              AI Animated Video Maker
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Turn any story or idea into ready-to-publish vertical videos
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <a href="#styles" className="hover:text-white transition-colors">
              7 Styles
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How it works
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <button
              type="button"
              onClick={() => {
                studioRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#FFB800] hover:bg-[#FFA500] text-black font-bold px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-10 px-4 text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-amber-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Turn any idea into an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFA500] to-[#FF8400]">
              animated video
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Pick a style, generate a script and voice in Hindi or English, and assemble into an animated MP4 for Reels, Shorts, or YouTube. Everything is driven from an open JSON workflow.
          </p>

          {/* Feature Badges line matching screenshot */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-300">
            <span className="px-2.5 py-1 rounded-full bg-[#18162E] border border-[#2B274F] text-[#FFB800]">
              100% Free
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#18162E] border border-[#2B274F]">
              In-Browser
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#18162E] border border-[#2B274F]">
              No Watermark
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#18162E] border border-[#2B274F] text-amber-300">
              7 Curated Styles
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#18162E] border border-[#2B274F]">
              Hindi + English
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#18162E] border border-[#2B274F] text-emerald-300">
              Download MP4 Video
            </span>
          </div>
        </div>
      </section>

      {/* Main Interactive Studio Box (Matching screenshot section 1 & 2) */}
      <section ref={studioRef} id="studio" className="pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedVideoStudio
            initialStyleId={selectedStyleId}
            onStyleChange={(newStyleId) => setSelectedStyleId(newStyleId)}
          />
        </div>
      </section>

      {/* Style Gallery: "All styles, with examples" */}
      <section id="styles" className="py-16 px-4 sm:px-6 border-t border-[#1C1A32] bg-[#0B0C15]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFB800]">
              <Sparkles className="w-4 h-4" />
              <span>Explore Visual Universes</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              All styles, with examples
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Each style is trained with specific prompt framing, camera pans, and color harmony. Select any style to load its curated template into the Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ANIMATION_STYLES.map((style) => {
              const isSelected = style.id === selectedStyleId;
              const isMythology = style.id === 'mythology';

              return (
                <div
                  key={style.id}
                  className={`group rounded-2xl border transition-all flex flex-col justify-between overflow-hidden bg-[#121124] ${
                    isSelected
                      ? 'border-[#FFB800] ring-1 ring-[#FFB800]/50 shadow-xl shadow-amber-500/10'
                      : 'border-[#231F3D] hover:border-slate-600'
                  }`}
                >
                  {/* Visual Header / Preview Area */}
                  <div className="relative aspect-[9/13] w-full overflow-hidden bg-[#0A0A14] flex flex-col items-center justify-center p-4">
                    {/* Visual Card Content based on Style */}
                    {isMythology ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden group/thumb">
                        <img
                          src="/media/mythology/mythos-template-1.jpg"
                          alt="Mythology"
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        <div className="absolute bottom-3 left-3 right-3 text-center">
                          <span className="text-[11px] font-bold text-amber-300 block">
                            श्रीमद्भगवद्गीता व रामायण
                          </span>
                          <span className="text-[9px] text-slate-300">
                            4 Playable Video Templates
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideoModal({
                              isOpen: true,
                              title: MYTHOLOGY_TEMPLATES[0].title,
                              videoUrl: MYTHOLOGY_TEMPLATES[0].video,
                              source: MYTHOLOGY_TEMPLATES[0].source,
                            })
                          }
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#FFB800] text-black flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </button>
                      </div>
                    ) : style.id === 'flat-vector' ? (
                      <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#1D4ED8] to-[#1E3A8A] flex flex-col items-center justify-center p-4 text-center shadow-inner relative overflow-hidden">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-white/20">
                          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg">
                            <span className="text-xl font-bold">📍</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-white tracking-wide">
                          Why is the road red?
                        </span>
                        <span className="text-[10px] text-blue-200 mt-1 font-mono">
                          Tech & Travel Explainer
                        </span>
                      </div>
                    ) : style.id === 'comic-art' ? (
                      <div className="w-full h-full rounded-xl bg-[#F59E0B] flex flex-col items-center justify-center p-4 text-center shadow-inner relative overflow-hidden border-2 border-black">
                        <div className="bg-white border-2 border-black px-3 py-1 rounded-full transform -rotate-3 shadow-[2px_2px_0px_#000] mb-2">
                          <span className="text-xs font-black text-black">DID YOU KNOW?!</span>
                        </div>
                        <div className="w-14 h-14 bg-red-600 rounded-full border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] text-white text-2xl">
                          📞
                        </div>
                        <span className="text-[11px] font-black text-black mt-2 bg-yellow-300 px-2 py-0.5 border border-black uppercase tracking-wider">
                          Pop Art Comic
                        </span>
                      </div>
                    ) : style.id === 'chalkboard' ? (
                      <div className="w-full h-full rounded-xl bg-[#1C2C22] flex flex-col items-center justify-center p-4 text-center shadow-inner border border-emerald-900/40 relative">
                        <div className="w-16 h-16 border-2 border-dashed border-emerald-400/50 rounded-lg flex items-center justify-center mb-2">
                          <span className="text-xs text-emerald-300 font-mono">CPU</span>
                        </div>
                        <span className="text-xs font-bold text-white">
                          CPU कैसे काम करता है?
                        </span>
                        <span className="text-[10px] text-emerald-400/80 font-mono mt-1">
                          Educational Explainer
                        </span>
                      </div>
                    ) : style.id === 'glow-sketch' ? (
                      <div className="w-full h-full rounded-xl bg-black flex flex-col items-center justify-center p-4 text-center border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative">
                        <div className="w-12 h-12 rounded-full border border-amber-400 flex items-center justify-center mb-2 shadow-[0_0_15px_#f59e0b]">
                          <Sparkles className="w-5 h-5 text-amber-300" />
                        </div>
                        <span className="text-xs font-bold text-amber-300 tracking-wide">
                          Focus is not doing more
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          Minimalist Line Art
                        </span>
                      </div>
                    ) : style.id === 'pixel-art' ? (
                      <div className="w-full h-full rounded-xl bg-[#090D1E] flex flex-col items-center justify-center p-4 text-center border border-indigo-500/30 font-mono">
                        <div className="w-14 h-10 bg-indigo-700 rounded border border-indigo-400 flex items-center justify-center mb-2 text-white text-sm font-bold shadow-[2px_2px_0_#000]">
                          🎮
                        </div>
                        <span className="text-xs font-bold text-indigo-300">
                          LIFE IS A GAME
                        </span>
                        <span className="text-[10px] text-emerald-400 mt-1">
                          16-Bit Arcade Retro
                        </span>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-b from-[#7F1D1D] to-[#450A0A] flex flex-col items-center justify-center p-4 text-center border border-rose-900">
                        <span className="text-lg font-black text-white leading-tight">
                          सपने
                        </span>
                        <span className="text-xl font-black text-rose-300 leading-tight">
                          यह हैं
                        </span>
                        <span className="text-2xl font-black text-[#FFB800] leading-tight">
                          मेरे
                        </span>
                        <span className="text-[10px] text-rose-200 mt-2 font-mono">
                          Kinetic Lyrics Tower
                        </span>
                      </div>
                    )}

                    {/* Style Badge pill in card */}
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white px-2 py-0.5 rounded border border-white/10">
                      {style.name}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-white">{style.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {style.id}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {style.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {style.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] bg-[#1B1933] border border-[#2B274F] text-slate-300 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Prompt preview snippet */}
                      <div className="bg-[#0D0C18] border border-[#1E1C38] rounded p-2 text-[10px] font-mono text-slate-300 line-clamp-2">
                        {style.samplePrompt}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1.5 pt-3 border-t border-[#1F1C36]">
                      <button
                        type="button"
                        onClick={() => handleUseStyle(style.id)}
                        className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#FFB800] text-black shadow-md shadow-amber-500/20'
                            : 'bg-[#1C1A35] hover:bg-[#252247] text-white border border-[#2C2852]'
                        }`}
                      >
                        <span>{isSelected ? 'Currently in Studio' : 'Use this style'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(style)}
                          className="flex-1 py-1 rounded bg-[#100F21] hover:bg-[#181630] border border-[#211E3E] text-[10px] font-medium text-slate-300 flex items-center justify-center gap-1 transition-colors"
                        >
                          {copiedPromptId === style.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy prompt</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDetailModalStyle(style)}
                          className="flex-1 py-1 rounded bg-[#100F21] hover:bg-[#181630] border border-[#211E3E] text-[10px] font-medium text-slate-300 flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>Full details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated Mythology Viral Template Strip */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#18152B] to-[#121124] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Mythology Showcase
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  4 Real Puranic Video Reels Ready to Import
                </h3>
                <p className="text-xs text-slate-400">
                  Click any template to watch full vertical playback or load its exact script scenes into Studio.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleUseStyle('mythology')}
                className="bg-[#FFB800] hover:bg-[#FFA500] text-black font-bold px-4 py-2 rounded-lg text-xs self-start sm:self-auto transition-colors flex items-center gap-1.5"
              >
                <span>Open Mythology in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {MYTHOLOGY_TEMPLATES.map((tmpl, idx) => (
                <div
                  key={tmpl.title}
                  onClick={() =>
                    setActiveVideoModal({
                      isOpen: true,
                      title: tmpl.title,
                      videoUrl: tmpl.video,
                      source: tmpl.source,
                    })
                  }
                  className="group relative rounded-xl overflow-hidden aspect-[9/14] bg-slate-900 cursor-pointer border border-[#2D2852] hover:border-amber-400 transition-all hover:scale-[1.02]"
                >
                  <img
                    src={tmpl.poster}
                    alt={tmpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute top-2 left-2 bg-[#FFB800] text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                    {tmpl.badge}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2.5 inset-x-2.5 text-white">
                    <h4 className="text-[11px] font-bold line-clamp-1">{tmpl.title}</h4>
                    <span className="text-[9px] text-amber-300 block">{tmpl.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* "How it works" 4-step workflow matching screenshot */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 border-t border-[#1C1A32]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How it works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Go from raw story idea to vertical video in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-[#231F3D] bg-[#121124] p-5 space-y-3 relative overflow-hidden">
              <span className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center shadow">
                1
              </span>
              <h3 className="text-sm font-bold text-white">Pick a style</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from 7 distinct styles, all tuned for vertical video (Shorts, Reels, TikTok) with calibrated color palettes.
              </p>
            </div>

            <div className="rounded-2xl border border-[#231F3D] bg-[#121124] p-5 space-y-3 relative overflow-hidden">
              <span className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center shadow">
                2
              </span>
              <h3 className="text-sm font-bold text-white">Generate AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Give an idea or choose a story. Gemini 2.5 builds a structured multi-scene JSON with word-by-word timestamps and camera descriptions.
              </p>
            </div>

            <div className="rounded-2xl border border-[#231F3D] bg-[#121124] p-5 space-y-3 relative overflow-hidden">
              <span className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center shadow">
                3
              </span>
              <h3 className="text-sm font-bold text-white">Add a voice</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select from realistic natural voices (Hindi & English) or upload your own audio. Timing automatically syncs to every spoken word.
              </p>
            </div>

            <div className="rounded-2xl border border-[#231F3D] bg-[#121124] p-5 space-y-3 relative overflow-hidden">
              <span className="w-7 h-7 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center shadow">
                4
              </span>
              <h3 className="text-sm font-bold text-white">Download MP4</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Preview your 9:16 vertical video right in browser, inspect captions, and export directly as an MP4 ready to upload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Questions (FAQ) Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 border-t border-[#1C1A32] bg-[#0A0A14]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Questions</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything you need to know about the AI Animated Video Maker.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAQS.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={item.q}
                  className="rounded-xl border border-[#231F3D] bg-[#121124] p-4 space-y-2 hover:border-slate-600 transition-colors"
                >
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-[#FFB800]">Q.</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed pl-5">
                    {item.a}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Style Details Modal */}
      {detailModalStyle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl border border-[#2E2A54] bg-[#121124] text-white p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setDetailModalStyle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB800]">
                Style Specifications
              </span>
              <h3 className="text-xl font-black">{detailModalStyle.name}</h3>
              <p className="text-xs text-slate-400">{detailModalStyle.description}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Prompt Engineering Formula
                </label>
                <div className="p-3 bg-[#0A0A14] border border-[#231F3D] rounded-lg font-mono text-[11px] text-amber-200/90 leading-relaxed">
                  {detailModalStyle.samplePrompt}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Negative Prompt Guardrails
                </label>
                <div className="p-2.5 bg-[#0A0A14] border border-[#231F3D] rounded-lg font-mono text-[10px] text-rose-300/80 leading-relaxed">
                  {detailModalStyle.negativePrompt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 bg-[#17152E] rounded-lg border border-[#28244E]">
                  <span className="text-[10px] text-slate-400 block">Ideal Narration Voice</span>
                  <span className="text-xs font-bold text-white capitalize">
                    Rishi / Ananya (Hindi & English)
                  </span>
                </div>
                <div className="p-2.5 bg-[#17152E] rounded-lg border border-[#28244E]">
                  <span className="text-[10px] text-slate-400 block">Recommended Aspect</span>
                  <span className="text-xs font-bold text-white">
                    {detailModalStyle.recommendedAspect} (Vertical Reels/Shorts)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleUseStyle(detailModalStyle.id)}
                className="flex-1 py-2.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <span>Load in Video Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCopyPrompt(detailModalStyle)}
                className="px-4 py-2.5 rounded-xl bg-[#1D1B36] hover:bg-[#28244E] text-slate-200 border border-[#2B274F] text-xs font-medium transition-colors"
              >
                {copiedPromptId === detailModalStyle.id ? 'Copied!' : 'Copy prompt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mythology Video Player Modal */}
      {activeVideoModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl border border-amber-500/30 bg-[#0B0B14] p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {activeVideoModal.title}
                </h4>
                {activeVideoModal.source && (
                  <span className="text-[10px] text-amber-400">{activeVideoModal.source}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoModal({ isOpen: false, title: '', videoUrl: '' })}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black border border-[#221F3D]">
              <video
                src={activeVideoModal.videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveVideoModal({ isOpen: false, title: '', videoUrl: '' });
                handleUseStyle('mythology');
              }}
              className="w-full py-2 bg-[#FFB800] hover:bg-[#FFA500] text-black font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <span>Load Mythology Style in Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
