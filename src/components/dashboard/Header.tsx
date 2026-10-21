'use client';

import React from 'react';
import Link from 'next/link';
import { User, Bell, Sparkles, Zap, ShieldCheck } from 'lucide-react';

interface DashboardHeaderProps {
  displayName?: string;
  avatarUrl?: string;
  role?: string;
  credits?: number;
  workspaceName?: string;
}

export function DashboardHeader({
  displayName = 'Creator',
  avatarUrl,
  role = 'creator',
  credits = 0,
  workspaceName = 'Personal Studio',
}: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#090A0F]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
          {workspaceName}
        </span>
        <span className="hidden sm:inline-block text-slate-500">•</span>
        <span className="hidden sm:inline-block text-xs text-slate-400">
          All AI Inference Nodes Operational
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Credit Quick Display */}
        <Link
          href="/dashboard/wallet"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{credits} Credits</span>
        </Link>

        {/* User Profile Pill */}
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-xs font-bold text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName[0] || 'U'
            )}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-bold text-white leading-tight">{displayName}</div>
            <div className="text-[10px] text-slate-400 capitalize">{role}</div>
          </div>
        </Link>
      </div>
    </header>
  );
}
