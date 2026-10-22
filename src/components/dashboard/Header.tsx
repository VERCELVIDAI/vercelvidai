'use client';

import React from 'react';
import Link from 'next/link';
import { User, Bell, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

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
    <header
      className="h-16 border-b backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-surface)',
        borderColor: 'var(--app-card-border)',
        color: 'var(--app-text-primary)',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono px-2.5 py-1 rounded-md border"
          style={{
            backgroundColor: 'var(--app-card)',
            borderColor: 'var(--app-card-border)',
            color: 'var(--app-text-secondary)',
          }}
        >
          {workspaceName}
        </span>
        <span className="hidden sm:inline-block opacity-40">•</span>
        <span className="hidden sm:inline-block text-xs" style={{ color: 'var(--app-text-muted)' }}>
          All AI Inference Nodes Operational
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Mode Switcher */}
        <ThemeToggle />

        {/* Credit Quick Display */}
        <Link
          href="/dashboard/wallet"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold hover:opacity-90 transition-all border"
          style={{
            backgroundColor: 'var(--app-badge-bg)',
            color: 'var(--app-badge-text)',
            borderColor: 'var(--app-badge-border)',
          }}
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
