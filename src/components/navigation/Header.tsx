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
} from 'lucide-react';

interface HeaderProps {
  variant?: 'light' | 'cinematic';
}

export function Header({ variant }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; displayName?: string } | null>(null);
  const [creditBalance, setCreditBalance] = useState<number | null>(null);

  const isCinematic = variant === 'cinematic' || (variant === undefined && (pathname === '/' || pathname === '/create'));

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
          if (data?.credits?.availableBalance !== undefined) {
            setCreditBalance(data.credits.availableBalance);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isCinematic ? 'cinematic-navbar' : 'glass-navbar'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <div className="flex items-center gap-4 lg:gap-8 shrink-0 min-w-0">
          <Logo size="md" darkVariant={isCinematic} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {/* Studios Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setStudiosOpen(true)}
              onMouseLeave={() => setStudiosOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/studios')
                    ? isCinematic ? 'text-emerald-400 bg-emerald-500/15' : 'text-emerald-700 bg-emerald-50'
                    : isCinematic ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                <span>Studios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studiosOpen ? 'rotate-180' : ''}`} />
              </button>

              {studiosOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className={`p-2 rounded-2xl shadow-2xl space-y-1 ${isCinematic ? 'bg-[#121A16] border border-[#293831]' : 'glass-modal'}`}>
                    <Link
                      href="/studios/cinema"
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>Cinema Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Director</span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Camera motion paths & anamorphic lens grades</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/marketing"
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>Marketing Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 font-bold">Ads</span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Commercials, UGC hooks & product briefs</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/storyboard"
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>Storyboard Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Gemini</span>
                        </div>
                        <p className={`text-[11px] mt-0.5 ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Multi-shot visual scene orchestration</p>
                      </div>
                    </Link>

                    <Link
                      href="/editor"
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`font-bold text-xs block ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>Creative Canvas</span>
                        <p className={`text-[11px] mt-0.5 ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Non-linear multi-track timeline video editor</p>
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
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/create') || pathname.startsWith('/ai-')
                    ? isCinematic ? 'text-emerald-400 bg-emerald-500/15' : 'text-emerald-700 bg-emerald-50'
                    : isCinematic ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                <span>Create</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className={`p-2 rounded-2xl shadow-2xl space-y-1 ${isCinematic ? 'bg-[#121A16] border border-[#293831]' : 'glass-modal'}`}>
                    <Link
                      href="/create?mode=video"
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>AI Video Engine</div>
                        <div className={`text-[11px] ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Cinematic text & image to video</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=image"
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>Gemini & Flux Image</div>
                        <div className={`text-[11px] ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Google Imagen & Flux Pro 1.1</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=audio"
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>Voice & Narration</div>
                        <div className={`text-[11px] ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Neural multilingual voiceovers</div>
                      </div>
                    </Link>

                    <Link
                      href="/ai-avatar-generator"
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors group ${isCinematic ? 'hover:bg-white/5' : 'hover:bg-emerald-50/80'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={`font-bold text-xs ${isCinematic ? 'text-white' : 'text-[#17211D]'}`}>AI Talking Avatars</div>
                        <div className={`text-[11px] ${isCinematic ? 'text-slate-400' : 'text-[#64748B]'}`}>Presenter videos & spokespersons</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/templates"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/templates'
                  ? isCinematic ? 'text-emerald-400 bg-emerald-500/15' : 'text-emerald-700 bg-emerald-50'
                  : isCinematic ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
              }`}
            >
              Templates
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/pricing'
                  ? isCinematic ? 'text-emerald-400 bg-emerald-500/15' : 'text-emerald-700 bg-emerald-50'
                  : isCinematic ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {creditBalance !== null && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${
              isCinematic ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border border-emerald-300 text-emerald-800'
            }`}>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>{creditBalance} Cr</span>
            </div>
          )}

          {user ? (
            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold glass-button flex items-center gap-1 sm:gap-1.5 shrink-0"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`hidden sm:inline-flex px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-colors ${
                  isCinematic ? 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10' : 'glass-button-secondary'
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/create"
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white flex items-center gap-1 sm:gap-1.5 shrink-0 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Start Creating</span>
                <span className="inline sm:hidden">Create</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className={`md:hidden min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] p-2 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              isCinematic ? 'text-slate-200 hover:bg-white/10' : 'text-[#17211D] hover:bg-emerald-50'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl ${
          isCinematic ? 'bg-[#121A16]/98 border-[#293831] text-slate-200' : 'glass-modal border-emerald-500/20 text-[#17211D]'
        }`}>
          <div className="space-y-1 font-semibold text-sm">
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl transition-colors ${
                isCinematic ? 'hover:bg-white/5 text-white' : 'hover:bg-emerald-50 text-[#17211D]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Create Video & Visuals</span>
            </Link>
            <Link
              href="/studios/cinema"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl transition-colors ${
                isCinematic ? 'hover:bg-white/5 text-white' : 'hover:bg-emerald-50 text-[#17211D]'
              }`}
            >
              <Film className="w-4 h-4 text-emerald-400" />
              <span>Cinema Studio</span>
            </Link>
            <Link
              href="/studios/marketing"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl transition-colors ${
                isCinematic ? 'hover:bg-white/5 text-white' : 'hover:bg-emerald-50 text-[#17211D]'
              }`}
            >
              <Megaphone className="w-4 h-4 text-pink-400" />
              <span>Marketing Studio</span>
            </Link>
            <Link
              href="/studios/storyboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl transition-colors ${
                isCinematic ? 'hover:bg-white/5 text-white' : 'hover:bg-emerald-50 text-[#17211D]'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Storyboard Studio</span>
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl transition-colors ${
                isCinematic ? 'hover:bg-white/5 text-white' : 'hover:bg-emerald-50 text-[#17211D]'
              }`}
            >
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Templates</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl transition-colors ${
                isCinematic ? 'hover:bg-white/5 text-white' : 'hover:bg-emerald-50 text-[#17211D]'
              }`}
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Pricing</span>
            </Link>
          </div>

          <div className={`pt-3 border-t flex flex-col gap-2 ${isCinematic ? 'border-[#293831]' : 'border-emerald-500/20'}`}>
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] py-3 rounded-xl text-center text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-2 shadow-md"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full min-h-[44px] py-3 rounded-xl text-center text-xs font-bold flex items-center justify-center ${
                    isCinematic ? 'bg-white/10 text-white' : 'glass-button-secondary'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] py-3 rounded-xl text-center text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Creating Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
