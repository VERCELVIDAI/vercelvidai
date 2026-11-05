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
  ChevronDown,
  Film,
  Layers,
  Video,
  Image as ImageIcon,
  Zap,
  BookOpen,
  HelpCircle,
  Wand2,
  Sliders,
} from 'lucide-react';

interface StudioItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const STUDIOS_MENU: StudioItem[] = [
  {
    title: 'Cinema Studio',
    description: 'Direct 3D camera & optical lens emulation',
    href: '/studios/cinema',
    icon: Film,
    badge: 'Flagship',
  },
  {
    title: 'Marketing Studio',
    description: 'High-converting video ads & viral UGC hooks',
    href: '/studios/marketing',
    icon: Wand2,
    badge: 'Popular',
  },
  {
    title: 'Storyboard Studio',
    description: 'Multi-scene sequencing with Google Gemini',
    href: '/studios/storyboard',
    icon: Layers,
  },
  {
    title: 'Vox Motion',
    description: 'Kinetic visual typography & motion design',
    href: '/studios/motion-graphics',
    icon: Video,
  },
  {
    title: 'Free AI Images',
    description: 'Prompt-to-visual generation with Flux & Imagen',
    href: '/ai-image-generator',
    icon: ImageIcon,
    badge: 'Free',
  },
  {
    title: 'OpenHiggs Models',
    description: 'Open-weights generative motion models',
    href: '/openhiggs',
    icon: Zap,
    badge: 'New',
  },
];

const RESOURCES_MENU = [
  {
    title: 'AI Video Generator',
    description: 'Dedicated text & image to cinematic video engine',
    href: '/ai-video-generator',
    icon: Film,
  },
  {
    title: 'Platform Features',
    description: 'Deep dive into rendering, lenses & color chemistry',
    href: '/features',
    icon: Sliders,
  },
  {
    title: 'Supported Models',
    description: 'Compare Runway, Luma, Fal, Gemini & ElevenLabs',
    href: '/models',
    icon: Zap,
  },
  {
    title: 'Engineering Blog',
    description: 'Guides, prompts, benchmarks & releases',
    href: '/blog',
    icon: BookOpen,
  },
  {
    title: 'Help & FAQ',
    description: 'Documentation, API guides & customer support',
    href: '/help',
    icon: HelpCircle,
  },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; displayName?: string; credits?: number } | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const studiosTimeout = useRef<NodeJS.Timeout | null>(null);
  const resourcesTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setStudiosOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  // Click outside listener to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
        setStudiosOpen(false);
        setResourcesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
        setStudiosOpen(false);
        setResourcesOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    window.location.href = '/login';
  };

  const isStudiosActive =
    pathname.startsWith('/studios') ||
    pathname === '/ai-image-generator' ||
    pathname === '/openhiggs';

  const isResourcesActive =
    pathname.startsWith('/blog') ||
    pathname === '/features' ||
    pathname === '/models' ||
    pathname === '/help' ||
    pathname === '/ai-video-generator';

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 flex-nowrap">
        {/* Left: Brand Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0 shrink-0">
          <Logo size="md" />

          {/* Clean Desktop Navigation (Visible on lg >= 1024px screens) */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0 whitespace-nowrap">
            {/* 1. Studios Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (studiosTimeout.current) clearTimeout(studiosTimeout.current);
                setStudiosOpen(true);
              }}
              onMouseLeave={() => {
                studiosTimeout.current = setTimeout(() => setStudiosOpen(false), 150);
              }}
            >
              <button
                type="button"
                onClick={() => setStudiosOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isStudiosActive || studiosOpen
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
                aria-expanded={studiosOpen}
              >
                <span>Studios</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    studiosOpen ? 'rotate-180 text-[#5145CD]' : 'text-[#98A2B3]'
                  }`}
                />
              </button>

              {studiosOpen && (
                <div className="absolute left-0 mt-2 w-[480px] rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-3 z-50 grid grid-cols-2 gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {STUDIOS_MENU.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setStudiosOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                          isActive
                            ? 'bg-[#EEF2FF] text-[#5145CD]'
                            : 'hover:bg-[#F7F8FA] text-[#17191D]'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#5145CD]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">{item.title}</span>
                            {item.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#5145CD]/10 text-[#5145CD]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#667085] leading-snug line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Direct Link: Templates */}
            <Link
              href="/templates"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/templates'
                  ? 'text-[#5145CD] bg-[#EEF2FF]'
                  : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]'
              }`}
            >
              Templates
            </Link>

            {/* 3. Direct Link: Pricing */}
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/pricing'
                  ? 'text-[#5145CD] bg-[#EEF2FF]'
                  : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]'
              }`}
            >
              Pricing
            </Link>

            {/* 4. Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (resourcesTimeout.current) clearTimeout(resourcesTimeout.current);
                setResourcesOpen(true);
              }}
              onMouseLeave={() => {
                resourcesTimeout.current = setTimeout(() => setResourcesOpen(false), 150);
              }}
            >
              <button
                type="button"
                onClick={() => setResourcesOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isResourcesActive || resourcesOpen
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
                aria-expanded={resourcesOpen}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    resourcesOpen ? 'rotate-180 text-[#5145CD]' : 'text-[#98A2B3]'
                  }`}
                />
              </button>

              {resourcesOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl p-2 z-50 flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  {RESOURCES_MENU.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setResourcesOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-[#EEF2FF] text-[#5145CD]'
                            : 'hover:bg-[#F7F8FA] text-[#17191D]'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5 text-[#5145CD]">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-semibold block">{item.title}</span>
                          <span className="text-[11px] text-[#667085] block truncate mt-0.5">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 whitespace-nowrap">
          {/* Scratch & Win Discount Trigger Button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-discount-modal'));
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#EEF2FF] to-[#ECFDF5] border border-[#C7D2FE] text-[#5145CD] hover:border-[#5145CD] hover:shadow-xs transition-all text-xs font-bold cursor-pointer group"
            title="Scratch & Reveal Discount (₹500–₹1,000)"
          >
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            <span>🎁 ₹500–₹1,000 Scratch Gift</span>
          </button>          {user ? (
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
                  aria-label="User profile menu"
                >
                  <UserIcon className="w-4 h-4 text-[#667085]" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white border border-[#E5E7EB] shadow-xl py-1.5 px-1 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                      <p className="font-semibold text-[#17191D] truncate">{user.displayName || 'Creator'}</p>
                      <p className="text-[#667085] text-[11px] truncate">{user.email}</p>
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

        {/* Mobile & Tablet Toggle Controls (Visible on < lg screens) */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          {user ? (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-[#5145CD] text-white text-xs font-semibold shrink-0"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#17191D] hover:bg-[#F7F8FA] shrink-0"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] border border-transparent hover:border-[#E5E7EB] shrink-0 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#17191D]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer (Organized & Touch-friendly) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          {/* Special Scratch Gift Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-discount-modal'));
              }
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#5145CD] bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>🎁 Scratch & Win ₹500–₹1,000</span>
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white text-[#5145CD] font-bold">
              Claim
            </span>
          </button>
          {/* Section 1: Studios */}
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#98A2B3] px-2 block mb-1.5">
              Creative Studios
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {STUDIOS_MENU.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EEF2FF] text-[#5145CD]'
                        : 'text-[#17191D] hover:bg-[#F7F8FA]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center shrink-0 text-[#5145CD]">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 rounded-full bg-[#5145CD]/10 text-[#5145CD]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: Explore & Resources */}
          <div className="pt-2 border-t border-[#E5E7EB]">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#98A2B3] px-2 block mb-1.5">
              Explore & Resources
            </span>
            <nav className="flex flex-col space-y-0.5">
              <Link
                href="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === '/templates'
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === '/pricing'
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                Pricing Plans
              </Link>
              <Link
                href="/features"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === '/features'
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                Platform Features
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === '/blog'
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                Blog & News
              </Link>
              <Link
                href="/help"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  pathname === '/help'
                    ? 'text-[#5145CD] bg-[#EEF2FF]'
                    : 'text-[#17191D] hover:bg-[#F7F8FA]'
                }`}
              >
                Help & Support
              </Link>
            </nav>
          </div>

          {/* Section 3: Auth Buttons */}
          <div className="pt-2 border-t border-[#E5E7EB] flex flex-col gap-2">
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-[#E5E7EB] text-xs font-semibold text-[#17191D] hover:bg-[#F7F8FA]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-[#5145CD] text-xs font-semibold text-white shadow-xs hover:bg-[#4338CA]"
                >
                  Get started free
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-center py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50"
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
