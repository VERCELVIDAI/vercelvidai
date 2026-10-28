'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Bell,
  Sparkles,
  Zap,
  ShieldCheck,
  Menu,
  LogOut,
  Settings,
  CreditCard,
  ChevronDown,
} from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const effectiveDisplayName = user?.displayName || displayName;
  const effectiveRole = user?.role || role;
  const effectiveAvatar = user?.avatarUrl || avatarUrl;

  const handleOpenMobileSidebar = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fluvia-toggle-mobile-sidebar'));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-[#090A0D]/90 backdrop-blur-xl border-b border-white/8 px-3 sm:px-6 flex items-center justify-between gap-2 sticky top-0 z-40 shrink-0 w-full transition-colors duration-200 text-slate-200">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={handleOpenMobileSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-slate-300" />
        </button>

        <span className="text-[11px] sm:text-xs font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 bg-white/[0.04] text-slate-300 font-bold shadow-2xs truncate max-w-[100px] xs:max-w-[130px] sm:max-w-none shrink-0">
          {workspaceName}
        </span>
        <span className="hidden sm:inline-block opacity-40 text-slate-500">•</span>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-400 font-semibold min-w-0 truncate">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <span className="truncate">All AI Inference Nodes Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Credit Quick Display */}
        <Link
          href="/dashboard/wallet"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold hover:bg-indigo-500/25 transition-all border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 shadow-xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span>{credits} <span className="hidden xs:inline">Credits</span></span>
        </Link>

        {/* User Account Menu with Logout */}
        <div
          className="relative"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="User account options"
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-white/[0.06] transition-all border border-white/10 bg-white/[0.03] shadow-2xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-600 p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-[#11131A] flex items-center justify-center text-xs font-black text-indigo-300">
                {effectiveAvatar ? (
                  <img src={effectiveAvatar} alt={effectiveDisplayName} className="w-full h-full object-cover rounded-full" />
                ) : (
                  (effectiveDisplayName[0] || 'U').toUpperCase()
                )}
              </div>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-white leading-tight max-w-[110px] truncate">{effectiveDisplayName}</div>
              <div className="text-[10px] text-slate-400 capitalize font-medium">{effectiveRole}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="p-2 rounded-2xl shadow-2xl space-y-1 text-left border border-white/10 bg-[#0E1015]/95 backdrop-blur-xl text-slate-200">
                <div className="px-3 py-2 border-b border-white/8">
                  <div className="text-xs font-bold text-white truncate">{effectiveDisplayName}</div>
                  {user?.email && (
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</div>
                  )}
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mt-1">
                    Role: {effectiveRole}
                  </div>
                </div>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>Billing & Invoices</span>
                </Link>

                <Link
                  href="/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Creative Studio</span>
                </Link>

                <div className="pt-1 border-t border-white/8">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
