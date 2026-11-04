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
      badgeClass: 'bg-emerald-950/80 text-[#d4ff00] border border-[#d4ff00]/40 shadow-[0_0_8px_rgba(212,255,0,0.25)]',
    },
    {
      label: 'Vox Motion',
      href: '/studios/motion-graphics',
      icon: Film,
      badge: '2 Free',
      badgeClass: 'bg-violet-950/80 text-violet-300 border border-violet-400/50 shadow-[0_0_8px_rgba(139,92,246,0.25)]',
    },
    {
      label: 'Free Images',
      href: '/ai-image-generator',
      icon: ImageIcon,
      badge: '100k Free',
      badgeClass: 'bg-amber-950/80 text-amber-300 border border-amber-400/50 shadow-[0_0_8px_rgba(245,158,11,0.25)]',
    },
    { label: 'Templates', href: '/templates' },
    {
      label: 'Pricing',
      href: '/pricing',
      badge: '20% OFF',
      badgeClass: 'bg-rose-500/10 text-rose-600 border border-rose-300 font-extrabold',
    },
    { label: 'Resources', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Logo size="md" />

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
                      ? 'text-violet-700 bg-violet-50/80 shadow-2xs font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />}
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-50 via-slate-50 to-indigo-50 border border-violet-200/80 text-xs font-bold font-mono text-violet-900 hover:border-violet-400 hover:shadow-xs transition-all"
                title="Wallet Available Balance"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
                <span>{user.credits?.toLocaleString() ?? 0} cr</span>
              </Link>

              {/* Workspace CTA */}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-md shadow-violet-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Studio Dashboard</span>
              </Link>

              {/* User Dropdown */}
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 border-2 border-violet-300 flex items-center justify-center text-violet-900 hover:border-violet-500 transition-all cursor-pointer shadow-xs"
                >
                  <UserIcon className="w-4 h-4 text-violet-700" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs space-y-1 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-black text-slate-900 truncate">{user.displayName || 'Creator'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[10px] font-bold font-mono border border-violet-200">
                        <Sparkles className="w-3 h-3 text-violet-600" />
                        <span>{user.credits?.toLocaleString() ?? 0} Credits Available</span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                      <span>Workspace Studio</span>
                    </Link>

                    <Link
                      href="/dashboard/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                      <span>Credits & Billing</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-bold"
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
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-violet-700 hover:bg-slate-100/70 transition-colors"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="relative overflow-hidden group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-md shadow-violet-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
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
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1 text-left">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-violet-600" />}
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

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-black text-white shadow-md shadow-violet-500/25"
                >
                  Get started free
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200"
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
