'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { useTheme } from '@/components/theme/ThemeContext';
import { MiniStudioPreview } from '@/components/theme/MiniStudioPreview';
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

  const { themeDetails, mode } = useTheme();

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
      <div className="min-h-screen bg-[#090A0D] text-white flex items-center justify-center font-mono text-xs">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = userData?.user || {};
  const credits = userData?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-[#090A0D] text-white relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#090A0D]">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={userData?.workspace?.name}
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/settings"
                className="text-xs font-semibold hover:underline flex items-center gap-1 text-slate-500 hover:text-emerald-700"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </Link>
              <span className="text-slate-400">/</span>
              <span className="text-xs font-bold text-emerald-700">
                Appearance & Workspace Themes
              </span>
            </div>
          </div>

          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Official Design System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Kling AI Cinematic Studio Theme
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Near-black obsidian charcoal canvas with electric indigo flares and cyber cyan badges.
              </p>
            </div>

            <div className="p-2 rounded-2xl bg-[#0E1015] border border-white/10 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-indigo-300">Permanent Dark Studio Active</span>
            </div>
          </div>

          {/* Theme Palette Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1015] border border-white/8 space-y-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Official Design Tokens</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#090A0D] border border-white/8" />
                    <span className="font-bold text-white block">Obsidian Base</span>
                    <span className="font-mono text-[10px] text-slate-400">#090A0D</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#6366F1]" />
                    <span className="font-bold text-white block">Electric Indigo</span>
                    <span className="font-mono text-[10px] text-slate-400">#6366F1</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#7C3AED]" />
                    <span className="font-bold text-white block">Vivid Violet</span>
                    <span className="font-mono text-[10px] text-slate-400">#7C3AED</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#06B6D4]" />
                    <span className="font-bold text-white block">Cyber Cyan</span>
                    <span className="font-mono text-[10px] text-slate-400">#06B6D4</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#151822]" />
                    <span className="font-bold text-white block">Surface Card</span>
                    <span className="font-mono text-[10px] text-slate-400">#151822</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#F8FAFC]" />
                    <span className="font-bold text-white block">Primary Text</span>
                    <span className="font-mono text-[10px] text-slate-400">#F8FAFC</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Permanent Design Standard</span>
                  </div>
                  <p>
                    All workspaces, public studio landing pages, editors, billing invoices, receipts, and dashboards consistently apply this signature dark cinematic visual identity.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Studio Mockup */}
            <div className="lg:col-span-5 sticky top-6">
              <MiniStudioPreview theme={themeDetails} mode={mode} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
