'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/login';
  };

  const navLinks = [
    { label: 'Product', href: '/#features' },
    { label: 'Templates', href: '/templates' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Resources', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#5145CD] bg-[#EEF2FF]'
                      : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-semibold text-[#17191D] hover:bg-[#F1F3F5] transition-colors"
                title="Wallet Balance"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>{user.credits ?? 0} cr</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#17191D] hover:border-[#5145CD] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#667085]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 p-2 rounded-xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-lg text-xs space-y-1 z-50">
                    <div className="px-2.5 py-1.5 border-b border-[#E5E7EB]">
                      <p className="font-semibold text-[#17191D] truncate">{user.displayName || 'Creator'}</p>
                      <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#17191D] hover:bg-[#F7F8FA] transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#667085]" />
                      <span>Workspace</span>
                    </Link>

                    <Link
                      href="/dashboard/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[#17191D] hover:bg-[#F7F8FA] transition-colors"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#667085]" />
                      <span>Credits & Billing</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
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
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#17191D] hover:text-[#5145CD] transition-colors"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white text-sm font-semibold shadow-xs transition-all hover:shadow"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {user && (
            <Link
              href="/dashboard"
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#5145CD] text-white text-xs font-semibold shrink-0"
            >
              Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-1.5 sm:p-2 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#17191D] hover:bg-[#F7F8FA]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#17191D] hover:bg-[#F7F8FA]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-[#5145CD] text-sm font-semibold text-white shadow-xs"
                >
                  Get started
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
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
