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
    <div className="min-h-screen text-[#17211D] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-emerald-500/10">
          <Logo size="md" />

          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-500/20">
            Fluvia Flow Light Signature
          </span>
        </div>

        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Visual Identity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17211D] tracking-tight">
            White + Emerald Green + Soft Pink Glassmorphism
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Fluvia Flow features a clean, focused single-theme creative environment built for maximum contrast, clarity, and creative flow.
          </p>
        </div>

        {/* Live Studio Mockup & Confirmation Card */}
        <div className="max-w-3xl mx-auto space-y-6">
          <MiniStudioPreview theme={themeDetails} mode={mode} />

          <div className="p-6 rounded-3xl glass-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-[#17211D]">Your Workspace is Ready</h4>
                <p className="text-xs text-slate-600">Optimized for high-precision timeline editing and generation.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
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
        <div className="min-h-screen text-[#17211D] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThemeSelectionContent />
    </Suspense>
  );
}
