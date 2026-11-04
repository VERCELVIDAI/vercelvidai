'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  LogOut,
  CreditCard,
  Sparkles,
  LayoutDashboard,
  Zap,
  Film,
  Image as ImageIcon,
  ChevronDown,
  Layers,
  Flame,
  Scissors,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<{ email?: string; displayName?: string; credits?: number } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser({
            ...data.user,
            credits: data.credits?.availableBalance ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/login';
  };

  const navLinks = [
    { label: 'Product', href: '/#features' },
    {
      label: 'OpenHiggs',
      href: '/openhiggs',
      icon: Zap,
      badge: '38 Models',
      badgeClass: 'bg-[#121c10] text-[#d4ff00] border border-[#d4ff00]/40 shadow-[0_0_10px_rgba(212,255,0,0.25)]',
    },
    {
      label: 'Vox Motion',
      href: '/studios/motion-graphics',
      icon: Scissors,
      badge: '2 Free',
      badgeClass: 'bg-violet-950/80 text-violet-300 border border-violet-400/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
    },
    {
      label: 'Free Images',
      href: '/ai-image-generator',
      icon: ImageIcon,
      badge: '100k Free',
      badgeClass: 'bg-amber-950/80 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    },
    { label: 'Templates', href: '/templates' },
    {
      label: 'Pricing',
      href: '/pricing',
      badge: '20% OFF',
      badgeClass: 'bg-[#ff1f66]/20 text-[#ff1f66] border border-[#ff1f66]/40 font-black shadow-[0_0_8px_rgba(255,31,102,0.3)]',
    },
    { label: 'Resources', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070A0F]/90 backdrop-blur-2xl border-b border-white/[0.08] text-white shadow-2xl transition-all">
      {/* Subtle Glowing Hairline Top Accent */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-500/40 via-purple-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Logo size="md" isDark={true} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 relative group ${
                    isActive
                      ? 'text-white bg-white/10 border border-white/15 shadow-[0_0_15px_rgba(255,255,255,0.06)] font-black'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black uppercase tracking-wider ${link.badgeClass}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Wallet Chip */}
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141A26] border border-violet-500/40 text-xs font-bold font-mono text-violet-300 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
                title="Available Wallet Credits"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d4ff00] animate-pulse" />
                <span>{user.credits?.toLocaleString() ?? 0} cr</span>
              </Link>

              {/* Workspace CTA */}
              <Link
                href="/dashboard"
                className="relative overflow-hidden group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-black shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:scale-[1.02] active:scale-95 transition-all border border-violet-400/30"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Studio Dashboard</span>
              </Link>

              {/* User Dropdown */}
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 border-2 border-violet-400/50 flex items-center justify-center text-white hover:border-violet-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                  <UserIcon className="w-4 h-4 text-white" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 p-2.5 rounded-2xl bg-[#0E121B] border border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] text-xs space-y-1 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150 text-white">
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="font-black text-white truncate">{user.displayName || 'Creator'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-950/80 text-violet-300 text-[10px] font-bold font-mono border border-violet-500/40">
                        <Sparkles className="w-3 h-3 text-[#d4ff00]" />
                        <span>{user.credits?.toLocaleString() ?? 0} Credits Available</span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                      <span>Workspace Studio</span>
                    </Link>

                    <Link
                      href="/dashboard/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-violet-400" />
                      <span>Credits & Billing</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="relative overflow-hidden group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:scale-[1.02] active:scale-95 transition-all border border-violet-400/30"
              >
                {/* Shimmer sweep animation */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Get started free</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {user && (
            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold shrink-0 shadow-xs"
            >
              Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#070A0F]/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 text-white">
          <nav className="flex flex-col space-y-1 text-left">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-violet-400" />}
                    <span>{link.label}</span>
                  </span>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black uppercase tracking-wider ${link.badgeClass}`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-white hover:bg-white/5"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-black text-white shadow-lg shadow-violet-500/30"
                >
                  Get started free
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 border border-rose-500/40"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
