'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { FirstCampaignModal } from '@/components/promotions/FirstCampaignModal';
import {
  Sparkles,
  ArrowRight,
  Video,
  Image as ImageIcon,
  Mic,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Layers,
  ShieldCheck,
  Zap,
  Tag,
  Film,
  Sliders,
  ExternalLink,
} from 'lucide-react';

const FEATURED_AD_TEMPLATES = [
  {
    id: 'tmpl_01',
    title: 'Aura Privée — Luxury Perfume Film',
    category: 'Product Commercial',
    aspect: '16:9',
    credits: 15,
    videoUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    poster: '/media/templates/poster-vid-01-perfume.jpg',
    prompt: 'Ultra-luxury midnight perfume bottle floating over liquid gold ripples, dramatic rim lighting, 4k cinematic commercial.',
  },
  {
    id: 'tmpl_02',
    title: 'AeroGT Hypercar Launch Campaign',
    category: 'Cinematic Automotive',
    aspect: '16:9',
    credits: 15,
    videoUrl: '/media/templates/tmpl-05-automotive-film.mp4',
    poster: '/media/templates/poster-vid-03-automotive.jpg',
    prompt: 'Sleek aerodynamic concept hypercar drifting through twilight mountain pass, laser grid reflections, photorealistic 8k.',
  },
  {
    id: 'tmpl_03',
    title: 'HydraLuxe Bio-Cellular Serum',
    category: 'Skincare & Beauty',
    aspect: '9:16',
    credits: 15,
    videoUrl: '/media/templates/tmpl-03-skincare-reel.mp4',
    poster: '/media/templates/poster-vid-02-skincare.jpg',
    prompt: 'Macro slow-motion droplet of golden hydration serum falling onto frosted glass podium, luxury cosmetic aesthetic.',
  },
  {
    id: 'tmpl_04',
    title: 'Apex Titanium Pro Smartphone',
    category: 'Technology & Hardware',
    aspect: '16:9',
    credits: 15,
    videoUrl: '/media/templates/tmpl-09-tech-product.mp4',
    poster: '/media/templates/poster-vid-04-smartphone.jpg',
    prompt: 'Futuristic titanium smartphone rotating seamlessly in zero-gravity space, micro lens reflections, clean studio lighting.',
  },
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#17191D] selection:bg-[#EEF2FF] selection:text-[#5145CD]">
      <Header />
      <FirstCampaignModal />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: BUSINESS AI AD CREATION STUDIO */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FA] to-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-5 mb-10">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-xs font-semibold text-[#5145CD] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Next-Generation AI Ad Creation Studio</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#17191D] leading-[1.12]">
                Create high-converting AI video ads{' '}
                <span className="text-[#5145CD]">in minutes.</span>
              </h1>

              {/* Concise Supporting Copy */}
              <p className="text-base sm:text-lg text-[#667085] max-w-2xl mx-auto leading-relaxed">
                Empower your marketing team to produce studio-grade product commercials, performance video ads, and localized voiceovers from simple product inputs — powered by Google Gemini and ElevenLabs.
              </p>

              {/* Strong Primary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-sm transition-all text-sm group"
                >
                  <span>Start Creating Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#17191D] bg-[#FFFFFF] hover:bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs transition-colors text-sm"
                >
                  <Film className="w-4 h-4 text-[#5145CD]" />
                  <span>Browse Ad Templates</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#667085]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>No credit card required to explore</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>1080p HD Video Exports</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Commercial rights included</span>
                </span>
              </div>
            </div>

            {/* CINEMATIC WIDESCREEN PRODUCT STAGE */}
            <div className="relative rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-xl p-2 sm:p-3 max-w-5xl mx-auto">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#17191D] flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/media/hero/fluvia-hero-showcase.mp4"
                  poster="/media/templates/poster-vid-01-perfume.jpg"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Overlaid Player Controls */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#17191D] flex items-center justify-center shadow-md transition-colors"
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="w-9 h-9 rounded-full bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#17191D] flex items-center justify-center shadow-md transition-colors"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#17191D]/80 backdrop-blur-md text-white border border-white/20">
                      4K 60FPS • Google Gemini Omni 1.1 Flash
                    </span>
                  </div>
                </div>

                {/* Director Framing Watermarks */}
                <div className="absolute top-4 left-4 pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#5145CD] text-white shadow-xs">
                    Live Generation Output (15 cr)
                  </span>
                </div>
              </div>

              {/* Quick Interactive Prompt Bar below the canvas */}
              <div className="mt-3 p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[#667085] font-mono text-xs truncate">
                    "Ultra-luxury midnight perfume bottle floating over liquid gold ripples, dramatic rim lighting, 4k cinematic commercial."
                  </span>
                </div>

                <Link
                  href="/create?prompt=Ultra-luxury%20midnight%20perfume%20bottle%20floating%20over%20liquid%20gold%20ripples%2C%20dramatic%20rim%20lighting%2C%204k%20cinematic%20commercial&mode=video"
                  className="px-3.5 py-2 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <span>Use This Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. 4-STEP CAMPAIGN WORKFLOW (HOW FLUVIA FLOW WORKS) */}
        {/* ========================================================================= */}
        <section id="features" className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Simple & Scalable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
                From product concept to live ad in 4 steps.
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                Say goodbye to weeks of video production logistics. Generate full-funnel creative assets with complete brand control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Add Product</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Upload high-res product photos, import your product URL, or specify key selling points and brand guidelines.
                </p>
              </div>

              {/* Step 2 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Create Campaign</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Select your audience, campaign goal, aspect ratio (16:9 widescreen, 9:16 vertical reels, 1:1 square), and tone.
                </p>
              </div>

              {/* Step 3 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Generate Creatives</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Google Gemini Omni renders cinematic video shots while ElevenLabs synthesizes studio-grade multilingual voiceovers.
                </p>
              </div>

              {/* Step 4 */}
              <div className="business-card p-6 space-y-3 relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="text-base font-bold text-[#17191D]">Export & Scale</h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Export 1080p broadcast-ready MP4s, localized variations, or hand off directly to your team's Google Workspace.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. TEMPLATE SHOWCASE GALLERY (CURATED REAL AD TEMPLATES) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                  Curated Gallery
                </span>
                <h2 className="text-3xl font-extrabold text-[#17191D] tracking-tight">
                  High-converting ad templates for every vertical.
                </h2>
                <p className="text-sm text-[#667085]">
                  Start from proven commercial storyboards engineered for brand elevation and social engagement.
                </p>
              </div>

              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5145CD] hover:text-[#4338CA] transition-colors"
              >
                <span>View all templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_AD_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="business-card overflow-hidden flex flex-col justify-between group">
                  <div className="relative aspect-video bg-[#17191D] overflow-hidden">
                    <img
                      src={tmpl.poster}
                      alt={tmpl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFFFFF]/90 text-[#17191D] backdrop-blur-sm shadow-xs">
                        {tmpl.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5145CD] text-white">
                        {tmpl.credits} credits
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#17191D] line-clamp-1">{tmpl.title}</h4>
                      <p className="text-[11px] text-[#667085] line-clamp-2 mt-1 leading-relaxed">
                        {tmpl.prompt}
                      </p>
                    </div>

                    <Link
                      href={`/create?prompt=${encodeURIComponent(tmpl.prompt)}&mode=video`}
                      className="w-full py-2 px-3 rounded-lg bg-[#F7F8FA] hover:bg-[#EEF2FF] text-[#17191D] hover:text-[#5145CD] border border-[#E5E7EB] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TRANSPARENT PRICING & CREDIT STORE PREVIEW */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#FFFFFF] border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Clear & Predictable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
                Simple plans. No hidden fees.
              </h2>
              <p className="text-sm sm:text-base text-[#667085]">
                Fixed credit pricing across all tools: 15 credits per video ad, 5 credits per product photo, 2 credits per voiceover clip.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plan 1: Starter */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17191D]">Fluvia Basic</h3>
                    <p className="text-xs text-[#667085] mt-1">For creators testing video ad concepts</p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹999 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1080p HD Video Exports</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Gemini Omni Flash Engine</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Standard Rate Limit</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_starter"
                  className="w-full py-2.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] font-semibold text-xs text-center transition-colors block"
                >
                  Choose Basic
                </Link>
              </div>

              {/* Plan 2: Pro */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between border-[#C7D2FE] bg-[#F7F8FA] relative shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#5145CD] text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#17191D]">Fluvia Pro</h3>
                    <p className="text-xs text-[#667085] mt-1">For scaling brands and marketing teams</p>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹2,499 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 1,500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Priority generation queue</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> ElevenLabs Neural Voice HD</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Multi-variant aspect ratios</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_creator"
                  className="w-full py-2.5 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs text-center transition-colors shadow-xs block"
                >
                  Choose Pro
                </Link>
              </div>

              {/* Plan 3: Max */}
              <div className="business-card p-6 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#17191D]">Fluvia Max</h3>
                      <p className="text-xs text-[#667085] mt-1">For performance marketing power users</p>
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-[#17191D]">
                    ₹4,999 <span className="text-xs font-normal text-[#667085]">/ month</span>
                  </div>
                  <div className="p-2 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-[11px] text-[#5145CD] font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Eligible for ₹570 OFF with code FIRST20</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> 3,500 Credits monthly</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Highest concurrency speed</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Brand kit & custom typography</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Dedicated account manager</li>
                  </ul>
                </div>

                <Link
                  href="/checkout?plan=plan_max&coupon=FIRST20"
                  className="w-full py-2.5 rounded-lg border border-[#5145CD] text-[#5145CD] hover:bg-[#EEF2FF] font-semibold text-xs text-center transition-colors block"
                >
                  Apply FIRST20 & Upgrade
                </Link>
              </div>
            </div>

            {/* Credit Top-Up Pack Banner */}
            <div className="mt-8 p-5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD]">Need more credits?</span>
                <h4 className="text-sm font-bold text-[#17191D]">Scale Pack: 5,000 Credits</h4>
                <p className="text-xs text-[#667085]">Pre-tax ₹6,500 + 18% GST (₹1,170) = ₹7,670 Total. Never expires.</p>
              </div>
              <Link
                href="/checkout?pack=pack_5000"
                className="px-5 py-2.5 rounded-lg bg-[#17191D] hover:bg-[#000000] text-white font-semibold text-xs text-center transition-colors shrink-0"
              >
                Buy 5,000 Credits (₹6,500)
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#F7F8FA] border-b border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17191D]">
                Frequently asked questions
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Everything you need to know about billing, generation credits, and commercial rights.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How does generation credit pricing work?',
                  a: 'Every video ad generated via Google Gemini Omni 1.1 Flash costs exactly 15 credits. High-resolution product images cost 5 credits, and ElevenLabs voiceovers cost 2 credits. If an AI generation job ever encounters a provider error, credits are automatically refunded to your wallet atomically.',
                },
                {
                  q: 'How do I use the FIRST20 coupon code?',
                  a: 'New creators receive the FIRST20 welcome code after completing registration. This coupon provides an instant ₹570 discount exclusively on the FLUVIA MAX subscription plan and is verified server-side at checkout.',
                },
                {
                  q: 'Do I own the commercial rights to generated ads?',
                  a: 'Yes. All video creatives, product images, and voiceover audio generated on Fluvia Flow come with full commercial rights for use across digital advertising platforms, television, and social media.',
                },
                {
                  q: 'Are taxes and GST included in invoices?',
                  a: 'All invoices and receipts strictly follow Indian tax regulations with full 18% GST itemization (CGST + SGST or IGST). Official vector PDF tax invoices are generated automatically after every successful transaction.',
                },
              ].map((item, idx) => (
                <div key={idx} className="business-card p-5 space-y-2">
                  <h4 className="text-sm font-bold text-[#17191D]">{item.q}</h4>
                  <p className="text-xs text-[#667085] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CALL TO ACTION SECTION */}
        {/* ========================================================================= */}
        <section className="py-16 bg-[#FFFFFF]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#17191D] tracking-tight">
              Ready to elevate your ad creative production?
            </h2>
            <p className="text-sm text-[#667085] max-w-xl mx-auto">
              Join marketing teams generating high-ROI video commercials with Fluvia Flow's AI studio.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-sm transition-all text-sm"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
