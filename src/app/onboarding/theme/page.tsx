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
    <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-[#E5E7EB]">
          <Logo size="md" />

          <span className="text-xs font-mono font-semibold text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#5145CD]/20">
            Fluvia Studio Workspace
          </span>
        </div>

        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#5145CD] text-xs font-semibold border border-[#5145CD]/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Visual Identity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#17191D] tracking-tight">
            Minimalist Commercial Creative Studio
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            Fluvia Flow features a clean, high-clarity creative environment engineered for commercial campaign generation, color accuracy, and seamless timeline workflows.
          </p>
        </div>

        {/* Live Studio Mockup & Confirmation Card */}
        <div className="max-w-3xl mx-auto space-y-6">
          <MiniStudioPreview theme={themeDetails} mode={mode} />

          <div className="p-6 rounded-3xl bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#5145CD] shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-[#17191D]">Your Studio Workspace is Ready</h4>
                <p className="text-xs text-[#667085]">Optimized for high-precision timeline editing and generation.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
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
        <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ThemeSelectionContent />
    </Suspense>
  );
}
