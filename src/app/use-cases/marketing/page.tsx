import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function MarketingUseCasePage() {
  return (
    <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs font-semibold text-[#F05BCE] mb-4 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-[#F05BCE]" />
            <span>Performance Marketing & User Acquisition</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#F5EAF4] tracking-tight">
            Stop scrolling. Start converting.
          </h1>
          <p className="mt-6 text-base sm:text-xl text-[#A99AAA] leading-relaxed">
            Generate 20+ viral ad variations for TikTok, Meta, and YouTube in under 15 minutes. Test hooks, value props, and calls to action with scientific precision.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/create?mode=video&prompt=Create%20a%20high-converting%20Meta%20video%20ad%20with%20bold%20hook"
              className="px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 shadow-lg shadow-[#F05BCE]/25 flex items-center gap-2 text-sm transition-all cursor-pointer"
            >
              <span>Build an Ad Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-20">
          <div className="p-8 rounded-3xl bg-[#211522] border border-[#39233B] shadow-sm">
            <h3 className="text-lg font-bold text-[#F5EAF4] mb-2">Automated Hook Variations</h3>
            <p className="text-sm text-[#A99AAA] leading-relaxed">
              Generate 5 distinct 3-second opening hooks for the same product to test emotional curiosity vs problem-solving angles.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#211522] border border-[#39233B] shadow-sm">
            <h3 className="text-lg font-bold text-[#F5EAF4] mb-2">Dynamic Caption Overlays</h3>
            <p className="text-sm text-[#A99AAA] leading-relaxed">
              Over 80% of social users watch ads without sound. Fluvia Flow automatically embeds high-contrast kinetic karaoke subtitles.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-[#211522] border border-[#39233B] shadow-sm">
            <h3 className="text-lg font-bold text-[#F5EAF4] mb-2">Multi-Ratio Batch Exports</h3>
            <p className="text-sm text-[#A99AAA] leading-relaxed">
              One-click reformatting across 9:16 vertical reels and 16:9 widescreen ads without losing framing or focal points.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
