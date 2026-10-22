import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { FluviaMotionBackground } from '@/components/home/FluviaMotionBackground';
import { CinematicPromptComposer } from '@/components/home/CinematicPromptComposer';
import { FeatureDiscoveryGrid } from '@/components/home/FeatureDiscoveryGrid';
import { CinematicInspirationGallery } from '@/components/home/CinematicInspirationGallery';
import {
  Sparkles,
  ArrowRight,
  Film,
  Megaphone,
  Layers,
  ChevronRight,
  Zap,
  Shield,
  Sliders,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080D0B] text-[#F1F5F3] relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-white">
      {/* Signature Fluvia Flow Motion Ambient Background */}
      <FluviaMotionBackground />

      {/* Cinematic Glass Navigation Header */}
      <Header variant="cinematic" />

      <main className="flex-1 relative z-10">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION & PROMPT COMPOSER */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          {/* Subtle Ambient Glow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-300 mb-6 backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Gemini AI & Multi-Model Inference</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Runway, Luma & Fluvia Core</span>
          </div>

          {/* Official Required Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08] uppercase">
            Imagine it.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-pink-400 bg-clip-text text-transparent">
              Create it.
            </span>
          </h1>

          {/* Official Supporting Copy */}
          <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Turn your ideas into extraordinary images and videos with AI.
          </p>

          {/* Main AI Prompt Composer — Centerpiece directly below headline */}
          <div className="mt-8 sm:mt-12">
            <CinematicPromptComposer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. FEATURE DISCOVERY CARDS */}
        {/* ========================================================================= */}
        <FeatureDiscoveryGrid />

        {/* ========================================================================= */}
        {/* 3. INSPIRATION & TEMPLATE GALLERY (Playable Videos) */}
        {/* ========================================================================= */}
        <CinematicInspirationGallery />

        {/* ========================================================================= */}
        {/* 4. PRODUCTION STUDIOS SHOWCASE (Dark Cinematic Styling) */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-[#293831] bg-[#0C1310]/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-mono font-bold mb-2 block">
                Specialized Creative Environments
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Purpose-Built Studios for Cinematic Creators
              </h2>
              <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
                Seamlessly move from raw text concept to multi-shot storyboards, camera motion paths, and timeline finishing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Studio 1: Cinema Studio */}
              <Link
                href="/studios/cinema"
                className="p-6 sm:p-8 rounded-3xl bg-[#121A16] border border-[#293831] hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Cinema Studio
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                        Director
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      Full camera trajectory controls (Dolly, Orbit, Crane, Handheld), anamorphic optical simulation, and Kodak 2383 grading.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#293831] flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Open Cinema Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Studio 2: Marketing Studio */}
              <Link
                href="/studios/marketing"
                className="p-6 sm:p-8 rounded-3xl bg-[#121A16] border border-[#293831] hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/10 transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center justify-center">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-pink-300 transition-colors">
                        Marketing Studio
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono font-bold">
                        Ads & Ecom
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      Product commercials, viral UGC hooks, ecom showcases, and platform-tailored ad briefs engineered with Gemini Copilot.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#293831] flex items-center justify-between text-xs font-bold text-pink-400 group-hover:text-pink-300">
                  <span>Open Marketing Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Studio 3: Storyboard Studio */}
              <Link
                href="/studios/storyboard"
                className="p-6 sm:p-8 rounded-3xl bg-[#121A16] border border-[#293831] hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/10 transition-all group flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                        Storyboard Studio
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold">
                        Gemini Copilot
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">
                      Automated multi-shot scene sequencing, timing breakdown, narration voiceover sync, and seamless export to the Creative Canvas.
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#293831] flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
                  <span>Open Storyboard Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Cinematic Dark Footer */}
      <Footer darkVariant={true} />
    </div>
  );
}
