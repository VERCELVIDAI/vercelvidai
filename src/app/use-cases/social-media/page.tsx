import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Share2, ArrowRight } from 'lucide-react';

export default function SocialMediaUseCasePage() {
  return (
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-xs font-semibold text-[#5145CD] mb-4 font-mono">
            <Share2 className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Social Media Managers & Agencies</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-[#17191D] tracking-tight">
            Weekly content calendars generated in hours
          </h1>
          <p className="mt-6 text-base sm:text-xl text-[#667085] leading-relaxed">
            Batch-generate 30 Reels and TikToks in one creative sitting. Maintain brand typography, logos, and color palettes across every client account.
          </p>

          <div className="mt-8">
            <Link
              href="/create?mode=video&prompt=Create%20a%20viral%20Instagram%20Reel%20template"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-[#5145CD] hover:bg-[#4338CA] shadow-xs text-sm transition-all cursor-pointer"
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
