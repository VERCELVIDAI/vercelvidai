'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Palette,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login');
        else setUserData(d);
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center font-mono text-xs">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = userData?.user || {};
  const credits = userData?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={userData?.workspace?.name}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-left">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#17191D] font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Settings</span>
            </Link>

            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
              Active Design System
            </span>
          </div>

          {/* Header Title */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-[#5145CD]">
              <Palette className="w-4 h-4" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider">Design System</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17191D]">Workspace Appearance</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#667085]">
              FLUVIA FLOW locked design standard (Synthesia-inspired minimalist business creative studio).
            </p>
          </div>

          {/* System Spec Cards */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#17191D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5145CD]" />
              <span>Core Brand Palette Tokens</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <div className="w-full h-8 rounded-lg bg-white border border-[#E5E7EB]" />
                <span className="font-mono text-[11px] text-[#17191D] font-bold block">#FFFFFF</span>
                <span className="text-[10px] text-[#667085]">Canvas Primary</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <div className="w-full h-8 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB]" />
                <span className="font-mono text-[11px] text-[#17191D] font-bold block">#F7F8FA</span>
                <span className="text-[10px] text-[#667085]">Surface Secondary</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <div className="w-full h-8 rounded-lg bg-[#5145CD]" />
                <span className="font-mono text-[11px] text-[#17191D] font-bold block">#5145CD</span>
                <span className="text-[10px] text-[#667085]">Accent Indigo</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <div className="w-full h-8 rounded-lg bg-[#17191D]" />
                <span className="font-mono text-[11px] text-[#17191D] font-bold block">#17191D</span>
                <span className="text-[10px] text-[#667085]">Text Primary</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#5145CD]/20 text-xs text-[#5145CD] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#5145CD]" />
              <span>Theme locked across all studio routes for business consistency and high contrast.</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}