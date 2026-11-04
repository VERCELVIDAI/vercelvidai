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
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 shrink-0 w-full text-slate-900 shadow-2xs">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={handleOpenMobileSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-slate-800" />
        </button>

        {/* Workspace indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/90 text-xs font-bold text-slate-900 max-w-[120px] xs:max-w-[160px] sm:max-w-none truncate shrink shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-violet-600 shrink-0 animate-pulse" />
          <span className="truncate">{workspaceName}</span>
          <span className="hidden xl:inline text-[10px] text-violet-700 bg-violet-100 px-1.5 py-0.2 rounded font-mono font-black">
            STUDIO PRO
          </span>
        </div>

        <span className="hidden md:inline-block text-slate-300">•</span>

        {/* Operational badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 min-w-0 truncate font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">Gemini Omni 1.1 Live</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Studio Shortcut: OpenHiggs */}
        <Link
          href="/openhiggs"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border border-[#d4ff00]/50 bg-[#0E150F] text-[#d4ff00] hover:bg-[#152216] hover:border-[#d4ff00] shadow-[0_0_12px_rgba(212,255,0,0.18)] shrink-0 group"
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
          href="/studios/motion-graphics"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border border-violet-400/40 bg-violet-950/20 text-violet-700 hover:bg-violet-950/30 hover:border-violet-500 shadow-xs shrink-0"
          title="Vox AI Motion Graphics — 2 Free Tries"
        >
          <Film className="w-3.5 h-3.5 text-violet-600" />
          <span>Vox Motion</span>
          <span className="text-[10px] bg-violet-100 text-violet-900 border border-violet-300 px-1.5 py-0.2 rounded font-mono font-black">
            2 Free
          </span>
        </Link>

        {/* Credit Quick Display */}
        <Link
          href="/dashboard/billing"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-mono hover:border-violet-400 transition-all border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-900 shadow-2xs shrink-0"
          title="Available Credits Balance"
        >
          <Zap className="w-3.5 h-3.5 text-violet-600 shrink-0" />
          <span>{credits.toLocaleString()} <span className="hidden sm:inline font-sans font-medium text-[11px] text-slate-500">cr</span></span>
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
            className="flex items-center gap-1.5 sm:gap-2 p-1 pr-2 rounded-full hover:bg-slate-100 transition-all border border-slate-200 bg-white cursor-pointer shadow-xs"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {effectiveAvatar ? (
                <img src={effectiveAvatar} alt={effectiveDisplayName} className="w-full h-full object-cover" />
              ) : (
                effectiveDisplayName.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
              {effectiveDisplayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full pt-1.5 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs space-y-1 text-left">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-slate-900 truncate">{effectiveDisplayName}</p>
                    <span className="text-[10px] font-mono uppercase font-black px-1.5 py-0.2 rounded bg-violet-100 text-violet-800 border border-violet-200">
                      {effectiveRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email || 'Active Workspace'}</p>
                  <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 font-medium">Credits</span>
                    <span className="font-mono font-black text-violet-700">{credits.toLocaleString()} cr</span>
                  </div>
                </div>

                <Link
                  href="/create"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-violet-700 bg-violet-50 hover:bg-violet-100 font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>New Video Ad Generation</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Credits & Subscription</span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Settings & Preferences</span>
                </Link>

                <Link
                  href="/pricing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Explore All Plans</span>
                </Link>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-bold"
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
