'use client';

import React from 'react';
import Link from 'next/link';
import { User, Bell, Sparkles, Zap, ShieldCheck, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  credits?: number;
  workspaceName?: string;
  user?: any;
}

export function DashboardHeader({
  displayName = 'Creator',
  avatarUrl,
  role = 'creator',
  credits = 0,
  workspaceName = 'Personal Studio',
  user,
}: DashboardHeaderProps) {
  const effectiveDisplayName = user?.displayName || displayName;
  const effectiveRole = user?.role || role;
  const effectiveAvatar = user?.avatarUrl || avatarUrl;

  const handleOpenMobileSidebar = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fluvia-toggle-mobile-sidebar'));
    }
  };

  return (
    <header className="h-16 glass-navbar border-b border-emerald-500/15 px-3 sm:px-6 flex items-center justify-between gap-2 sticky top-0 z-40 transition-colors duration-200 text-[#17211D]">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={handleOpenMobileSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        <span className="text-[11px] sm:text-xs font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-emerald-500/20 bg-emerald-50/60 text-slate-700 font-bold shadow-2xs truncate max-w-[100px] xs:max-w-[130px] sm:max-w-none shrink-0">
          {workspaceName}
        </span>
        <span className="hidden sm:inline-block opacity-40">•</span>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All AI Inference Nodes Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Credit Quick Display */}
        <Link
          href="/dashboard/wallet"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-300 bg-emerald-50 text-emerald-800 shadow-xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{credits} <span className="hidden xs:inline">Credits</span></span>
        </Link>

        {/* User Profile Pill */}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-emerald-50/70 transition-colors border border-emerald-500/15"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-500 to-teal-700 p-[1.5px] shadow-xs">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-black text-emerald-800">
              {effectiveAvatar ? (
                <img src={effectiveAvatar} alt={effectiveDisplayName} className="w-full h-full object-cover rounded-full" />
              ) : (
                effectiveDisplayName[0] || 'U'
              )}
            </div>
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-bold text-[#17211D] leading-tight">{effectiveDisplayName}</div>
            <div className="text-[10px] text-slate-500 capitalize font-medium">{effectiveRole}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
