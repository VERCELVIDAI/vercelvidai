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
    <header className="h-16 bg-[#100A12]/90 backdrop-blur-xl border-b border-[#39233B] px-3 sm:px-6 flex items-center justify-between gap-2 sticky top-0 z-40 shrink-0 w-full transition-colors duration-200 text-[#F5EAF4]">
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
        {/* Mobile Sidebar Hamburger Trigger */}
        <button
          type="button"
          onClick={handleOpenMobileSidebar}
          aria-label="Toggle navigation drawer"
          className="md:hidden min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 rounded-xl text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522] flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-[#F5EAF4]" />
        </button>

        <span className="text-[11px] sm:text-xs font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-[#39233B] bg-[#211522] text-[#F5EAF4] font-bold shadow-2xs truncate max-w-[100px] xs:max-w-[130px] sm:max-w-none shrink-0">
          {workspaceName}
        </span>
        <span className="hidden sm:inline-block opacity-40 text-[#A99AAA]">•</span>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#F05BCE] font-semibold min-w-0 truncate">
          <span className="w-2 h-2 rounded-full bg-[#F05BCE] animate-pulse shadow-[0_0_8px_rgba(240,91,206,0.9)]" />
          <span className="truncate">All AI Inference Nodes Operational</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Credit Quick Display */}
        <Link
          href="/dashboard/wallet"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold hover:bg-[#F05BCE]/25 transition-all border border-[#F05BCE]/40 bg-[#F05BCE]/15 text-[#F05BCE] shadow-xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5 text-[#F05BCE] shrink-0" />
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
            className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-[#2A1A2B] transition-all border border-[#39233B] bg-[#211522] shadow-2xs cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#F05BCE] to-[#C026D3] p-[1.5px] shadow-xs">
              <div className="w-full h-full rounded-full bg-[#211522] flex items-center justify-center text-xs font-black text-[#F05BCE]">
                {effectiveAvatar ? (
                  <img src={effectiveAvatar} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  effectiveDisplayName.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <span className="text-xs font-bold text-[#F5EAF4] hidden sm:inline max-w-[100px] truncate">
              {effectiveDisplayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#A99AAA] hidden sm:inline" />
          </button>

          {/* Account Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl space-y-1 text-xs">
                <div className="px-3 py-2 border-b border-[#39233B] mb-1">
                  <p className="font-bold text-[#F5EAF4] truncate">{effectiveDisplayName}</p>
                  <p className="text-[10px] text-[#A99AAA] capitalize font-mono mt-0.5">Role: {effectiveRole}</p>
                </div>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F5EAF4] hover:bg-[#2A1A2B] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#F5EAF4] hover:bg-[#2A1A2B] transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>Billing & Plans</span>
                </Link>

                <div className="border-t border-[#39233B] pt-1 mt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
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
