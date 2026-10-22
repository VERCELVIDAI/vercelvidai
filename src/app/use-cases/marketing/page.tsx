import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { TrendingUp, ArrowRight, CheckCircle2, Video, Sparkles, Sliders } from 'lucide-react';

export default function MarketingUseCasePage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-600/10 border border-pink-500/20 text-xs font-semibold text-pink-400 mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Performance Marketing & User Acquisition</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Stop scrolling. Start converting.
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed">
            Generate 20+ viral ad variations for TikTok, Meta, and YouTube in under 15 minutes. Test hooks, value props, and calls to action with scientific precision.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/create?mode=video&prompt=Create%20a%20high-converting%20Meta%20video%20ad%20with%20bold%20hook"
              className="px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-600/25 flex items-center gap-2 text-sm"
            >
              <span>Build an Ad Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-20">
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Automated Hook Variations</h3>
            <p className="text-sm text-slate-400">
              Generate 5 distinct 3-second opening hooks for the same product to test emotional curiosity vs problem-solving angles.
            </p>
          </div>
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Dynamic Caption Overlays</h3>
            <p className="text-sm text-slate-400">
              Over 80% of social users watch ads without sound. Fluvia Flow automatically embeds high-contrast kinetic karaoke subtitles.
            </p>
          </div>
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Multi-Ratio Batch Exports</h3>
            <p className="text-sm text-slate-400">
              One click exports 9:16 vertical for Instagram Reels, 16:9 for YouTube preroll, and 1:1 for Facebook feeds.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
