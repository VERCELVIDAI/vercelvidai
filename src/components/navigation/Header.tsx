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
  Layers,
  Tag,
  Scissors,
  BookOpen,
  ChevronDown,
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

  // Synchronized Categories with Multi-Color Highlighted Text & Badges
  const navCategories = [
    {
      categoryName: 'AI Studios',
      categoryTag: 'STUDIOS',
      categoryColor: 'text-violet-600',
      items: [
        {
          label: 'Vox Motion',
          href: '/studios/motion-graphics',
          icon: Scissors,
          badge: '2 Free',
          textColor: 'text-purple-600 hover:text-purple-700 font-black',
          pillBg: 'bg-purple-50/80 hover:bg-purple-100/80 border border-purple-200/80',
          badgeColor: 'bg-purple-100 text-purple-900 border border-purple-300 font-black',
          activeBg: 'bg-purple-100/90 text-purple-800 border-purple-300 ring-2 ring-purple-400/20',
          desc: 'Paper-collage viral living posters',
        },
        {
          label: 'OpenHiggs',
          href: '/openhiggs',
          icon: Zap,
          badge: '38 Models',
          textColor: 'text-emerald-600 hover:text-emerald-700 font-black',
          pillBg: 'bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80',
          badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black',
          activeBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/20',
          desc: 'Soul 4K, Kling 3.0 & open-source studio',
        },
        {
          label: 'Free Images',
          href: '/ai-image-generator',
          icon: ImageIcon,
          badge: '100k Free',
          textColor: 'text-amber-600 hover:text-amber-700 font-black',
          pillBg: 'bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80',
          badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300 font-black',
          activeBg: 'bg-amber-100/90 text-amber-800 border-amber-300 ring-2 ring-amber-400/20',
          desc: 'Sub-second Cloudflare Workers AI SDXL',
        },
      ],
    },
    {
      categoryName: 'Creative Tools',
      categoryTag: 'TOOLS',
      categoryColor: 'text-indigo-600',
      items: [
        {
          label: 'Templates',
          href: '/templates',
          icon: Layers,
          badge: 'Curated',
          textColor: 'text-indigo-600 hover:text-indigo-700 font-bold',
          pillBg: 'bg-indigo-50/60 hover:bg-indigo-100/60 border border-indigo-200/60',
          badgeColor: 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold',
          activeBg: 'bg-indigo-100/90 text-indigo-800 border-indigo-300 ring-2 ring-indigo-400/20',
          desc: 'Farm-fresh high-converting ad templates',
        },
        {
          label: 'Product',
          href: '/#features',
          icon: Sparkles,
          textColor: 'text-blue-600 hover:text-blue-700 font-bold',
          pillBg: 'hover:bg-blue-50/60 border border-transparent hover:border-blue-200/60',
          activeBg: 'bg-blue-50 text-blue-700 font-black',
          desc: 'Enterprise generative AI features',
        },
      ],
    },
    {
      categoryName: 'Plans & Pricing',
      categoryTag: 'PRICING',
      categoryColor: 'text-rose-600',
      items: [
        {
          label: 'Pricing',
          href: '/pricing',
          icon: Tag,
          badge: '20% OFF',
          textColor: 'text-rose-600 hover:text-rose-700 font-black',
          pillBg: 'bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/80',
          badgeColor: 'bg-rose-100 text-rose-900 border border-rose-300 font-black',
          activeBg: 'bg-rose-100/90 text-rose-800 border-rose-300 ring-2 ring-rose-400/20',
          desc: 'Flexible creator & enterprise subscriptions',
        },
      ],
    },
    {
      categoryName: 'Resources',
      categoryTag: 'DOCS',
      categoryColor: 'text-teal-600',
      items: [
        {
          label: 'Resources',
          href: '/blog',
          icon: BookOpen,
          textColor: 'text-teal-600 hover:text-teal-700 font-bold',
          pillBg: 'hover:bg-teal-50/60 border border-transparent hover:border-teal-200/60',
          activeBg: 'bg-teal-50 text-teal-700 font-black',
          desc: 'Tutorials, case studies, & release updates',
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo + Categorized Synchronized Desktop Nav */}
        <div className="flex items-center gap-3 xl:gap-6 min-w-0">
          <Logo size="md" />

          {/* Desktop Navigation: Synchronized by Categories with Multi-Color Highlighted Text */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navCategories.map((cat, catIdx) => (
              <div key={cat.categoryName} className="flex items-center gap-1">
                {/* Divider between categories */}
                {catIdx > 0 && (
                  <span className="w-1 h-1 rounded-full bg-slate-300 mx-1 shrink-0" />
                )}

                {/* Category Items with Multi-Color Text */}
                {cat.items.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && link.href !== '/#features' && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isActive
                          ? link.activeBg
                          : `${link.textColor} ${link.pillBg}`
                      }`}
                      title={link.desc}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 shrink-0 opacity-90" />}
                      <span className="tracking-tight">{link.label}</span>
                      {link.badge && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase tracking-wider ${link.badgeColor}`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-bold text-[#17191D] hover:bg-[#F1F3F5] transition-colors shadow-2xs"
                title="Wallet Balance"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>{user.credits ?? 0} cr</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-bold shadow-xs transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center text-[#17191D] hover:border-[#5145CD] transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#667085]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 p-2 rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-xl text-xs space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2.5 py-1.5 border-b border-[#E5E7EB]">
                      <p className="font-bold text-[#17191D] truncate">{user.displayName || 'Creator'}</p>
                      <p className="text-[11px] text-[#667085] truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#17191D] hover:bg-[#F7F8FA] transition-colors font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#667085]" />
                      <span>Workspace</span>
                    </Link>

                    <Link
                      href="/dashboard/billing"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#17191D] hover:bg-[#F7F8FA] transition-colors font-medium"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#667085]" />
                      <span>Credits & Billing</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-bold"
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
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#17191D] hover:text-[#5145CD] transition-colors"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-black shadow-xs transition-all hover:scale-102"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {user && (
            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 rounded-lg bg-[#5145CD] text-white text-xs font-bold shrink-0 shadow-xs"
            >
              Dashboard
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] shrink-0 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown: Synchronized by Category with Multi-Color Highlighted Text */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {navCategories.map((cat) => (
            <div key={cat.categoryName} className="space-y-1.5">
              <div className="px-2 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider ${cat.categoryColor}`}>
                  {cat.categoryName}
                </span>
                <span className="text-[9px] font-mono text-slate-400">{cat.categoryTag}</span>
              </div>

              <div className="flex flex-col space-y-1">
                {cat.items.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${link.pillBg}`}
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 shrink-0 opacity-90" />}
                        <span className={`${link.textColor} font-bold text-xs`}>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase tracking-wider ${link.badgeColor}`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#17191D] hover:bg-[#F7F8FA]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#5145CD] text-xs font-black text-white shadow-xs"
                >
                  Get started
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
