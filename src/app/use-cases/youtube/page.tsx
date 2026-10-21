import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Youtube, ArrowRight, Play, Sparkles } from 'lucide-react';

export default function YouTubeUseCasePage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-xs font-semibold text-red-400 mb-4">
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube & Faceless Automation</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Scale your YouTube channel with AI
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed">
            Turn scripts into documentary-style videos, daily shorts, and high-CTR explainers. Automated voiceovers, B-roll synthesis, and dynamic captions included.
          </p>

          <div className="mt-8">
            <Link
              href="/create?mode=video&prompt=Create%20a%20YouTube%20explainer%20breakdown%20video"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/25 text-sm"
            >
              <span>Create YouTube Video</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
