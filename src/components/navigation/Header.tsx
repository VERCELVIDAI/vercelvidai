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

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studiosOpen, setStudiosOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; displayName?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full glass-navbar transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
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
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/studios')
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                <span>Studios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studiosOpen ? 'rotate-180' : ''}`} />
              </button>

              {studiosOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl glass-modal shadow-xl space-y-1">
                    <Link
                      href="/studios/cinema"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#17211D] text-xs">Cinema Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full glass-badge-emerald font-bold">Director</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Camera motion paths & anamorphic lens grades</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/marketing"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#17211D] text-xs">Marketing Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full glass-badge-pink font-bold">Ads</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Commercials, UGC hooks & product briefs</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/storyboard"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#17211D] text-xs">Storyboard Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full glass-badge-emerald font-bold">Gemini</span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Multi-shot visual scene orchestration</p>
                      </div>
                    </Link>

                    <Link
                      href="/editor"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#17211D] text-xs block">Creative Canvas</span>
                        <p className="text-[11px] text-[#64748B] mt-0.5">Non-linear multi-track timeline video editor</p>
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
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                <span>Create</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl glass-modal shadow-xl space-y-1">
                    <Link
                      href="/create?mode=video"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17211D] text-xs">AI Video Engine</div>
                        <div className="text-[11px] text-[#64748B]">Cinematic text & image to video</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=image"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17211D] text-xs">AI Image Studio</div>
                        <div className="text-[11px] text-[#64748B]">Flux Pro photorealistic generation</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=audio"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17211D] text-xs">Voice & Narration</div>
                        <div className="text-[11px] text-[#64748B]">Neural multilingual voiceovers</div>
                      </div>
                    </Link>

                    <Link
                      href="/ai-avatar-generator"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#17211D] text-xs">AI Talking Avatars</div>
                        <div className="text-[11px] text-[#64748B]">Presenter videos & spokespersons</div>
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
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
              }`}
            >
              Templates
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/pricing'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-[#17211D] hover:text-emerald-700 hover:bg-emerald-50/70'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold glass-button flex items-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold glass-button-secondary"
              >
                Sign In
              </Link>
              <Link
                href="/create"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold glass-button flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Creating</span>
              </Link>
            </>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-[#17211D] hover:bg-emerald-50 flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-800" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-500/20 glass-modal p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
          <div className="space-y-1 font-semibold text-sm">
            <Link
              href="/studios/cinema"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl hover:bg-emerald-50 text-[#17211D] transition-colors"
            >
              <Film className="w-4 h-4 text-emerald-600" />
              <span>Cinema Studio</span>
            </Link>
            <Link
              href="/studios/marketing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl hover:bg-emerald-50 text-[#17211D] transition-colors"
            >
              <Megaphone className="w-4 h-4 text-pink-500" />
              <span>Marketing Studio</span>
            </Link>
            <Link
              href="/studios/storyboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl hover:bg-emerald-50 text-[#17211D] transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Storyboard Studio</span>
            </Link>
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl hover:bg-emerald-50 text-[#17211D] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Create Video & Visuals</span>
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl hover:bg-emerald-50 text-[#17211D] transition-colors"
            >
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Templates</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 min-h-[44px] rounded-xl hover:bg-emerald-50 text-[#17211D] transition-colors"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Pricing & Plans</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] py-3 rounded-xl text-center text-xs font-bold glass-button flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] py-3 rounded-xl text-center text-xs font-bold glass-button-secondary flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full min-h-[44px] py-3 rounded-xl text-center text-xs font-bold glass-button flex items-center justify-center gap-1.5"
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
