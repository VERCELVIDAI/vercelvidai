'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../theme/ThemeToggle';
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
  ShoppingBag,
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
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-surface)',
        borderColor: 'var(--app-card-border)',
        color: 'var(--app-text-primary)',
      }}
    >
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
                className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                  pathname.startsWith('/studios') ? 'text-cyan-400 bg-white/[0.05]' : 'text-zinc-300'
                }`}
              >
                <span>Studios</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${studiosOpen ? 'rotate-180' : ''}`} />
              </button>

              {studiosOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl bg-[#0C0E17]/95 border border-white/10 shadow-2xl backdrop-blur-xl space-y-1">
                    <Link
                      href="/studios/cinema"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">Cinema Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">Director</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Camera motion paths & anamorphic lens profiles</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/marketing"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0">
                        <Megaphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">Marketing Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">Brand</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Commercials, UGC hooks & product briefs</p>
                      </div>
                    </Link>

                    <Link
                      href="/studios/storyboard"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">Storyboard Studio</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold">Gemini</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Multi-shot scene orchestration & shotlists</p>
                      </div>
                    </Link>

                    <Link
                      href="/editor"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">Creative Canvas</span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Non-linear multi-track timeline video editor</p>
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
                className={`flex items-center gap-1 px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                  pathname.startsWith('/create') || pathname.startsWith('/ai-') ? 'text-violet-400 bg-white/[0.05]' : 'text-zinc-300'
                }`}
              >
                <span>Create</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="p-2 rounded-2xl bg-[#0C0E17]/95 border border-white/10 shadow-2xl backdrop-blur-xl space-y-1">
                    <Link
                      href="/create?mode=video"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">AI Video Engine</div>
                        <div className="text-[11px] text-zinc-400">Cinematic text & image to video</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=image"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">AI Image Studio</div>
                        <div className="text-[11px] text-zinc-400">Flux Pro photorealistic generation</div>
                      </div>
                    </Link>

                    <Link
                      href="/create?mode=audio"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Mic className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">Voice & Narration</div>
                        <div className="text-[11px] text-zinc-400">Neural multilingual voiceovers</div>
                      </div>
                    </Link>

                    <Link
                      href="/ai-avatar-generator"
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">AI Talking Avatars</div>
                        <div className="text-[11px] text-zinc-400">Presenter videos & spokespersons</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/templates"
              className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                pathname === '/templates' ? 'text-violet-400 bg-white/[0.05]' : 'text-zinc-300'
              }`}
            >
              Templates
            </Link>

            <Link
              href="/models"
              className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                pathname === '/models' ? 'text-violet-400 bg-white/[0.05]' : 'text-zinc-300'
              }`}
            >
              Models
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                pathname === '/pricing' ? 'text-violet-400 bg-white/[0.05]' : 'text-zinc-300'
              }`}
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-600/20 hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Start Creating</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-600/20 hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Start Creating</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle variant="icon" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 p-4 space-y-3 bg-[#0A0C13]">
          <Link
            href="/studios/cinema"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 text-sm font-semibold text-zinc-200"
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>Cinema Studio</span>
          </Link>
          <Link
            href="/studios/marketing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 text-sm font-semibold text-zinc-200"
          >
            <Megaphone className="w-4 h-4 text-violet-400" />
            <span>Marketing Studio</span>
          </Link>
          <Link
            href="/create"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 text-sm font-semibold text-zinc-200"
          >
            <Video className="w-4 h-4 text-indigo-400" />
            <span>AI Video & Image Creation</span>
          </Link>
          <Link
            href="/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 text-sm font-semibold text-zinc-200"
          >
            <Layers className="w-4 h-4 text-zinc-400" />
            <span>Templates</span>
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 text-sm font-semibold text-zinc-200"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Pricing</span>
          </Link>
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-violet-600 text-white font-bold text-center text-sm"
            >
              Start Creating
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
