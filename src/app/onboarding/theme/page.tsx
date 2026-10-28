'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useTheme } from '@/components/theme/ThemeContext';
import { MiniStudioPreview } from '@/components/theme/MiniStudioPreview';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

function ThemeSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const {
    themeDetails,
    mode,
    markCompleted,
  } = useTheme();

  const handleContinue = async () => {
    try {
      await markCompleted();
      router.push(returnUrl);
    } catch (e) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-white py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/8">
          <Logo size="md" />

          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30">
            Kling AI Obsidian Dark Studio
          </span>
        </div>

        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Visual Identity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cinematic Dark Studio Workspace
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Fluvia Flow features a near-black obsidian creative environment inspired by Kling AI, engineered for color accuracy, timeline focus, and professional generation workflows.
          </p>
        </div>

        {/* Live Studio Mockup & Confirmation Card */}
        <div className="max-w-3xl mx-auto space-y-6">
          <MiniStudioPreview theme={themeDetails} mode={mode} />

          <div className="p-6 rounded-3xl bg-[#0E1015] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Your Studio Workspace is Ready</h4>
                <p className="text-xs text-slate-400">Optimized for high-precision timeline editing and generation.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
            >
              <span>Enter Creative Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeOnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0D] text-white flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThemeSelectionContent />
    </Suspense>
  );
}
