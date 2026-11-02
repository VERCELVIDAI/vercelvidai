'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { Header } from '@/components/navigation/Header';
import { OpenHiggsfieldApp } from '@/openhiggsfield/openhiggsfield-app';
import '@/openhiggsfield/openhiggsfield.css';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap, Layers } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ohf-inter',
  display: 'swap',
});

export default function OpenHiggsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#edefef] flex flex-col selection:bg-[#d1fe17] selection:text-[#141a02]">
      {/* Universal Fluvia Flow Header */}
      <Header />

      {/* OpenHiggs Announcement Sub-Bar */}
      <div className="w-full bg-[#101112] border-b border-white/[0.08] px-4 py-2 sm:px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-black text-[10px] tracking-wider uppercase bg-[#d1fe17] text-[#141a02] shadow-[0_0_12px_rgba(209,254,23,0.35)]">
              OpenHiggs AI
            </span>
            <span className="text-[#a8aeaf] font-medium hidden sm:inline">
              Open-source alternative to Higgsfield AI • 38 Image & Video Models
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-[#d1fe17] hover:text-[#ddfe51] font-bold transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Get OpenHiggs Unlimited Plan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Studio App Area */}
      <div className="flex-1 w-full relative">
        <OpenHiggsfieldApp fontClassName={inter.variable} />
      </div>
    </div>
  );
}
