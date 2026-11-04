'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User,
  Zap,
  Menu,
  LogOut,
  Settings,
  CreditCard,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Film,
  Image as ImageIcon,
  LayoutDashboard,
  ExternalLink,
  Scissors,
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
  workspaceName = 'Fluvia Creative Studio',
  user,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const effectiveDisplayName = user?.displayName || displayName;
  const effectiveRole = user?.role || role;
  const effectiveAvatar = user?.avatarUrl || avatarUrl;

  // Handle outside clicks to close dropdown menu on mobile touch
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [menuOpen]);

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
    <header className="h-16 bg-[#070A0F]/95 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 shrink-0 w-full text-white shadow-xl">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={handleOpenMobileSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Workspace indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-[#121824] text-xs font-bold text-white max-w-[120px] xs:max-w-[160px] sm:max-w-none truncate shrink shadow-xs">
          <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0 animate-pulse shadow-[0_0_8px_#8b5cf6]" />
          <span className="truncate">{workspaceName}</span>
          <span className="hidden xl:inline text-[10px] text-violet-300 bg-violet-950/80 px-1.5 py-0.2 rounded font-mono font-black border border-violet-500/40">
            STUDIO PRO
          </span>
        </div>

        <span className="hidden md:inline-block text-slate-700">•</span>

        {/* Operational badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 min-w-0 truncate font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_#34d399]" />
          <span className="truncate">Gemini Omni 1.1 Active</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Studio Shortcut: OpenHiggs */}
        <Link
          href="/openhiggs"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border border-[#d4ff00]/50 bg-[#0E150F] text-[#d4ff00] hover:bg-[#152216] hover:border-[#d4ff00] shadow-[0_0_15px_rgba(212,255,0,0.22)] shrink-0 group"
          title="OpenHiggs Studio — 38 Foundation Models"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00] animate-pulse" />
          <span>OpenHiggs</span>
          <span className="text-[10px] bg-[#d4ff00]/20 text-[#d4ff00] px-1.5 py-0.2 rounded font-mono font-black">
            38 Models
          </span>
        </Link>

        {/* Quick Studio Shortcut: Vox Motion */}
        <Link
          href="/dashboard/vox-motion"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border border-violet-500/50 bg-violet-950/40 text-violet-300 hover:bg-violet-950/60 hover:border-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.25)] shrink-0"
          title="Vox AI Motion Graphics — 2 Free Tries"
        >
          <Scissors className="w-3.5 h-3.5 text-violet-400" />
          <span>Vox Motion</span>
          <span className="text-[10px] bg-violet-900/60 text-violet-200 border border-violet-500/50 px-1.5 py-0.2 rounded font-mono font-black">
            2 Free
          </span>
        </Link>

        {/* Credit Quick Display */}
        <Link
          href="/dashboard/billing"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black font-mono hover:border-violet-400 transition-all border border-violet-500/40 bg-[#141A26] text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.2)] shrink-0"
          title="Available Credits Balance"
        >
          <Zap className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
          <span>{credits.toLocaleString()} <span className="hidden sm:inline font-sans font-medium text-[11px] text-slate-400">cr</span></span>
        </Link>

        {/* User Account Menu with Logout */}
        <div
          ref={menuContainerRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="User account options"
            className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 rounded-full hover:bg-white/10 transition-all border border-slate-800 bg-[#121824] cursor-pointer shadow-xs"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-black text-white shadow-[0_0_10px_rgba(139,92,246,0.4)]">
              {effectiveAvatar ? (
                <img src={effectiveAvatar} alt={effectiveDisplayName} className="w-full h-full object-cover" />
              ) : (
                effectiveDisplayName.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-white max-w-[100px] truncate">
              {effectiveDisplayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2.5 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-xs space-y-1 text-left text-white">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-white truncate">{effectiveDisplayName}</p>
                    <span className="text-[10px] font-mono uppercase font-black px-1.5 py-0.2 rounded bg-violet-950/80 text-violet-300 border border-violet-500/40">
                      {effectiveRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'Active Workspace'}</p>
                  <div className="mt-2 p-2 rounded-xl bg-[#141A26] border border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Credits Available</span>
                    <span className="font-mono font-black text-[#d4ff00]">{credits.toLocaleString()} cr</span>
                  </div>
                </div>

                <Link
                  href="/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-violet-300 bg-violet-950/40 hover:bg-violet-950/80 font-bold transition-colors border border-violet-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>New Video Ad Generation</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                  <span>Credits & Subscription</span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  <Settings className="w-3.5 h-3.5 text-violet-400" />
                  <span>Settings & Preferences</span>
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  <span>Explore All Plans</span>
                </Link>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
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
