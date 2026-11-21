'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Video,
  Layers,
  Users,
  FileText,
  Plus,
  Coins,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';

const DASHBOARD_TABS = [
  { href: '/mythology/dashboard', label: 'My Videos', icon: Video },
  { href: '/mythology/dashboard/series', label: 'Series Manager', icon: Layers },
  { href: '/mythology/dashboard/characters', label: 'Character Bible', icon: Users },
  { href: '/mythology/dashboard/scripts', label: 'Scripts & Idea Bank', icon: FileText },
];

export default function MythologyDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-slate-950 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/mythology"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Back to Landing"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center">
              ॐ
            </span>
            <div>
              <h1 className="text-sm font-black text-slate-900 dark:text-white leading-none">
                Fluvia Mythos Creator Dashboard
              </h1>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                Mythology Video Hub
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/billing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/20"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Manage Wallet</span>
          </Link>

          <Link
            href="/mythology/studio"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Mythology Video</span>
          </Link>
        </div>
      </header>

      {/* Subnav Tabs */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {DASHBOARD_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-3 px-3 sm:px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
