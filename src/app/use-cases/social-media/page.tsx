import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Share2, ArrowRight, Sparkles } from 'lucide-react';

export default function SocialMediaUseCasePage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/20 text-xs font-semibold text-purple-400 mb-4">
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Media Managers & Agencies</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Weekly content calendars generated in hours
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed">
            Batch-generate 30 Reels and TikToks in one creative sitting. Maintain brand typography, logos, and color palettes across every client account.
          </p>

          <div className="mt-8">
            <Link
              href="/create?mode=video&prompt=Create%20a%20viral%20Instagram%20Reel%20template"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/25 text-sm"
            >
              <span>Batch Create Reels</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
