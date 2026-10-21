import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export default function EcommerceUseCasePage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ecommerce & Direct-to-Consumer</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Turn product shots into high-converting commercials
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-300 leading-relaxed">
            Upload a flat product photo and watch Vercel Vidai place it into photorealistic 3D environments with studio lighting, camera sweeps, and motion graphics.
          </p>

          <div className="mt-8">
            <Link
              href="/create?mode=video&prompt=Transform%20product%20photo%20into%20commercial"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-600/25 text-sm"
            >
              <span>Animate Product Video</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
