'use client';

import React, { useState } from 'react';
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
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-40 shrink-0 w-full text-[#17191D]">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={handleOpenMobileSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden min-h-[40px] min-w-[40px] p-2 rounded-xl text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-[#17191D]" />
        </button>

        {/* Workspace indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold text-[#17191D] truncate shrink-0">
          <div className="w-2 h-2 rounded-full bg-[#5145CD]" />
          <span className="truncate">{workspaceName}</span>
        </div>

        <span className="hidden sm:inline-block text-[#E5E7EB]">•</span>

        {/* Operational badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#667085] min-w-0 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">Gemini Engine Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Credit Quick Display */}
        <Link
          href="/dashboard/billing"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold hover:bg-[#EEF2FF]/80 transition-all border border-[#5145CD]/20 bg-[#EEF2FF] text-[#5145CD] shadow-2xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-[#5145CD] shrink-0" />
          <span>{credits.toLocaleString()} <span className="hidden xs:inline">Credits</span></span>
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
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[#F7F8FA] transition-all border border-[#E5E7EB] bg-white cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#5145CD] flex items-center justify-center text-xs font-bold text-white">
              {effectiveAvatar ? (
                <img src={effectiveAvatar} alt={effectiveDisplayName} className="w-full h-full object-cover" />
              ) : (
                effectiveDisplayName.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-[#17191D] max-w-[100px] truncate">
              {effectiveDisplayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-1.5 rounded-xl bg-white border border-[#E5E7EB] shadow-lg text-xs space-y-0.5 text-left">
                <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                  <p className="font-bold text-[#17191D] truncate">{effectiveDisplayName}</p>
                  <p className="text-[11px] text-[#667085] capitalize truncate">{effectiveRole} account</p>
                </div>

                <Link
                  href="/dashboard/billing"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-[#5145CD]" />
                  <span>Credits & Billing</span>
                </Link>

                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#667085]" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  href="/help"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#667085]" />
                  <span>Help & Support</span>
                </Link>

                {effectiveRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5145CD] hover:bg-[#EEF2FF] transition-colors font-medium"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <div className="pt-1 border-t border-[#E5E7EB] mt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
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
