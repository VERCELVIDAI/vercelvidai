import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function EcommerceUseCasePage() {
  return (
    <div className="min-h-screen text-[#17211D] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800 mb-4">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span>Ecommerce & Direct-to-Consumer</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#17211D] tracking-tight">
            Turn product shots into high-converting commercials
          </h1>
          <p className="mt-6 text-base sm:text-xl text-slate-600 leading-relaxed">
            Upload a flat product photo and watch Fluvia Flow place it into photorealistic 3D environments with studio lighting, camera sweeps, and motion graphics.
          </p>

          <div className="mt-8">
            <Link
              href="/create?mode=video&prompt=Transform%20product%20photo%20into%20commercial"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 text-sm transition-all"
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
