'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { BRAND } from '@/lib/brand';
import {
  Film,
  Megaphone,
  Layers,
  Sliders,
  Video,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Mic,
  Image as ImageIcon,
  UserCheck,
  Zap,
  LogOut,
  User as UserIcon,
  CreditCard,
  Wallet,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
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
    } catch (e) {}
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090A0D]/90 backdrop-blur-2xl border-b border-white/[0.08] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-6 lg:gap-8 shrink-0 min-w-0">
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {/* Studios Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setStudiosOpen(true)}
              onMouseLeave={() => setStudiosOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/studios')
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>Studios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 ${studiosOpen ? 'rotate-180' : ''}`} />
              </button>

              {studiosOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl bg-[#11131A] border border-white/10 shadow-2xl space-y-1">
                    <Link
                      href="/studios/cinema"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">Cinema Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">Director</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Camera motion paths & optical lens grades</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/marketing"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">Marketing Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">Ads</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Commercials, viral hooks & product briefs</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/storyboard"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">Storyboard Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">Gemini</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">Multi-shot scene orchestration & timing</p>
                      </div>
                    </Link>

                    <Link
                      href="/editor"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">Creative Canvas</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Non-linear multi-track timeline video editor</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AI Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  pathname.startsWith('/create') || pathname.startsWith('/ai-')
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>AI Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform text-slate-400 ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl bg-[#11131A] border border-white/10 shadow-2xl space-y-1">
                    <Link
                      href="/create?mode=video"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">AI Video Engine</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">15 cr</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Gemini Omni Flash 4K</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=audio"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">AI Voiceover HD</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-mono font-bold">2 cr</span>
                        </div>
                        <div className="text-[11px] text-slate-400">ElevenLabs 40+ Neural Voices</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=image"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">AI Image Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">5 cr</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Gemini 3.1 & Flux Pro Stills</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/templates"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                pathname === '/templates'
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Templates
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                pathname === '/pricing'
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Wallet Credits Pill */}
              <Link
                href="/dashboard/wallet"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-mono font-bold text-slate-200 transition-all shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
                <span>{user.credits ?? 0}</span>
                <span className="text-[10px] text-slate-400">cr</span>
              </Link>

              <Link
                href="/create"
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Launch Studio</span>
                <span className="inline sm:hidden">Studio</span>
              </Link>

              {/* User Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User account menu"
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-white/10 transition-all border border-white/10 bg-white/[0.04] cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#11131A] flex items-center justify-center text-xs font-black text-indigo-300">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="p-2 rounded-2xl bg-[#11131A] border border-white/10 shadow-2xl space-y-1 text-left">
                      <div className="px-3 py-2 border-b border-white/[0.08]">
                        <div className="text-xs font-bold text-white truncate">
                          {user.displayName || 'Kling Studio Creator'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {user.email}
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-indigo-400" />
                        <span>Command Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/wallet"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-emerald-400" />
                        <span>Credit Wallet</span>
                      </Link>

                      <Link
                        href="/dashboard/billing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <span>Invoices & Plans</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/create"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Studio</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0E1015] p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
          <div className="space-y-1 font-semibold text-xs text-slate-300">
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-600 text-white font-bold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Studio (15 cr)</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              Dashboard
            </Link>
            <Link
              href="/create?mode=video"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              AI Video Engine (15 cr)
            </Link>
            <Link
              href="/create?mode=audio"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              AI Voiceover HD (2 cr)
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              Curated Templates
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 rounded-lg hover:bg-white/[0.06]"
            >
              Pricing & Credits
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
