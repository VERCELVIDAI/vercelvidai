'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Video,
  Coins,
  ArrowLeft,
  Flame,
} from 'lucide-react';

export default function MythologyDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090A11] text-white flex flex-col font-sans selection:bg-[#FFB800] selection:text-black">
      {/* Top Header */}
      <header className="bg-[#0E0D1B]/95 backdrop-blur-xl border-b border-[#231F3D] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/mythology"
            className="p-1.5 rounded-lg text-[#9E9AB7] hover:text-white hover:bg-[#1A1733] transition-colors"
            title="Back to Landing"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-[#FFB800] text-black font-black text-xs flex items-center justify-center shadow-md">
              ॐ
            </span>
            <div>
              <h1 className="text-sm font-black text-white leading-none">
                Fluvia Mythos Creator Dashboard
              </h1>
              <span className="text-[11px] text-[#FFB800] font-semibold">
                JSON-to-Video Studio & History
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/mythology/pricing"
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-[#FFB800] text-xs font-bold border border-amber-500/25 flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Mythology Plans</span>
          </Link>

          <Link
            href="/mythology/studio"
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Open Studio</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}