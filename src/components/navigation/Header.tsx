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
    <header className="sticky top-0 z-50 w-full bg-[#100A12]/90 backdrop-blur-2xl border-b border-[#39233B] transition-all duration-200">
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
                    ? 'text-[#F05BCE] bg-[#211522]'
                    : 'text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]/50'
                }`}
              >
                <span>Studios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform text-[#A99AAA] ${studiosOpen ? 'rotate-180' : ''}`} />
              </button>

              {studiosOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl space-y-1">
                    <Link
                      href="/studios/cinema"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 flex items-center justify-center shrink-0 group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#F5EAF4] text-xs">Cinema Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F05BCE]/20 text-[#F05BCE] font-mono font-bold">Director</span>
                        </div>
                        <p className="text-[11px] text-[#A99AAA] mt-0.5">Camera motion paths & optical lens grades</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/marketing"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 flex items-center justify-center shrink-0 group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#F5EAF4] text-xs">Marketing Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F05BCE]/20 text-[#F05BCE] font-mono font-bold">Ads</span>
                        </div>
                        <p className="text-[11px] text-[#A99AAA] mt-0.5">Commercials, viral hooks & product briefs</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/storyboard"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 flex items-center justify-center shrink-0 group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#F5EAF4] text-xs">Storyboard Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F05BCE]/20 text-[#F05BCE] font-mono font-bold">Gemini</span>
                        </div>
                        <p className="text-[11px] text-[#A99AAA] mt-0.5">Multi-shot scene orchestration & timing</p>
                      </div>
                    </Link>

                    <Link
                      href="/editor"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 flex items-center justify-center shrink-0 group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#F5EAF4] text-xs block">Creative Canvas</span>
                        <p className="text-[11px] text-[#A99AAA] mt-0.5">Non-linear multi-track timeline video editor</p>
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
                    ? 'text-[#F05BCE] bg-[#211522]'
                    : 'text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]/50'
                }`}
              >
                <span>AI Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform text-[#A99AAA] ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl space-y-1">
                    <Link
                      href="/create?mode=video"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F05BCE]/20 text-[#F05BCE] flex items-center justify-center group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F5EAF4] text-xs">AI Video Engine</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F05BCE]/20 text-[#F05BCE] font-mono font-bold">15 cr</span>
                        </div>
                        <div className="text-[11px] text-[#A99AAA]">Gemini Omni Flash 4K</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=audio"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F05BCE]/20 text-[#F05BCE] flex items-center justify-center group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F5EAF4] text-xs">AI Voiceover HD</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F05BCE]/20 text-[#F05BCE] font-mono font-bold">2 cr</span>
                        </div>
                        <div className="text-[11px] text-[#A99AAA]">ElevenLabs 40+ Neural Voices</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=image"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#2A1A2B] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F05BCE]/20 text-[#F05BCE] flex items-center justify-center group-hover:bg-[#F05BCE] group-hover:text-white transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#F5EAF4] text-xs">AI Image Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F05BCE]/20 text-[#F05BCE] font-mono font-bold">5 cr</span>
                        </div>
                        <div className="text-[11px] text-[#A99AAA]">Gemini 3.1 & Flux Pro Stills</div>
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
                  ? 'text-[#F05BCE] bg-[#211522]'
                  : 'text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]/50'
              }`}
            >
              Templates
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                pathname === '/pricing'
                  ? 'text-[#F05BCE] bg-[#211522]'
                  : 'text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]/50'
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#211522] hover:bg-[#2A1A2B] border border-[#39233B] text-xs font-mono font-bold text-[#F5EAF4] transition-all shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 text-[#F05BCE] fill-[#F05BCE]/30" />
                <span>{user.credits ?? 0}</span>
                <span className="text-[10px] text-[#A99AAA]">cr</span>
              </Link>

              <Link
                href="/create"
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:from-[#E046BD] hover:to-[#A21CAF] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#F05BCE]/30 transition-all cursor-pointer border border-[#F05BCE]/30"
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
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[#211522] transition-all border border-[#39233B] bg-[#211522] cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#F05BCE] to-[#C026D3] p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#211522] flex items-center justify-center text-xs font-black text-[#F05BCE]">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#A99AAA] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                    <div className="p-2 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl space-y-1 text-left">
                      <div className="px-3 py-2 border-b border-[#39233B]">
                        <div className="text-xs font-bold text-[#F5EAF4] truncate">
                          {user.displayName || 'Fluvia Studio Creator'}
                        </div>
                        <div className="text-[11px] text-[#A99AAA] truncate mt-0.5">
                          {user.email}
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#2A1A2B] transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 text-[#F05BCE]" />
                        <span>Command Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/wallet"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#2A1A2B] transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-[#F05BCE]" />
                        <span>Credit Wallet</span>
                      </Link>

                      <Link
                        href="/dashboard/billing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#2A1A2B] transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-[#F05BCE]" />
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
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:from-[#E046BD] hover:to-[#A21CAF] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#F05BCE]/30 transition-all border border-[#F05BCE]/30"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#39233B] bg-[#100A12] px-4 py-6 space-y-4 text-left">
          <div className="space-y-1">
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F05BCE] text-white font-bold text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Creation Studio</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs font-semibold text-[#F5EAF4] hover:bg-[#211522] rounded-lg"
            >
              Command Dashboard
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs font-semibold text-[#F5EAF4] hover:bg-[#211522] rounded-lg"
            >
              Creative Templates
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 text-xs font-semibold text-[#F5EAF4] hover:bg-[#211522] rounded-lg"
            >
              Pricing & Credit Wallet
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
