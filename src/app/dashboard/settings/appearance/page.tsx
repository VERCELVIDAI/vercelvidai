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
      <div className="min-h-screen text-[#17211D] flex items-center justify-center font-mono text-xs">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = userData?.user || {};
  const credits = userData?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-[#17211D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-500/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/20 text-xs font-semibold text-emerald-700 mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Official Design System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D]">
                Fluvia Flow Signature Theme
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                White + Emerald Green + Soft Pink Glassmorphism with fluid animated motion ribbons.
              </p>
            </div>

            <div className="p-2 rounded-2xl glass-card flex items-center gap-2 border border-emerald-500/20">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-800">Permanent Single Theme Active</span>
            </div>
          </div>

          {/* Theme Palette Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#17211D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Official Design Tokens</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-white border border-slate-200" />
                    <span className="font-bold text-[#17211D] block">Primary White</span>
                    <span className="font-mono text-[10px] text-slate-500">#FFFFFF</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#10B981]" />
                    <span className="font-bold text-[#17211D] block">Emerald Green</span>
                    <span className="font-mono text-[10px] text-slate-500">#10B981</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#047857]" />
                    <span className="font-bold text-[#17211D] block">Deep Emerald</span>
                    <span className="font-mono text-[10px] text-slate-500">#047857</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#FCE7F3]" />
                    <span className="font-bold text-[#17211D] block">Soft Pink</span>
                    <span className="font-mono text-[10px] text-slate-500">#FCE7F3</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#EC4899]" />
                    <span className="font-bold text-[#17211D] block">Accent Pink</span>
                    <span className="font-mono text-[10px] text-slate-500">#EC4899</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                    <div className="w-full h-8 rounded-xl bg-[#17211D]" />
                    <span className="font-bold text-[#17211D] block">Primary Text</span>
                    <span className="font-mono text-[10px] text-slate-500">#17211D</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-500/20 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Permanent Design Standard</span>
                  </div>
                  <p>
                    All workspaces, public studio landing pages, editors, billing invoices, receipts, and dashboards consistently apply this signature light glassmorphism visual identity.
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
