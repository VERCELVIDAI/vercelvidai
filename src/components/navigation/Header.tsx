'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../theme/ThemeToggle';
import {
  Video,
  Sparkles,
  Layers,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Mic,
  Image as ImageIcon,
  UserCheck,
  ShoppingBag,
  Youtube,
  Share2,
  TrendingUp,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
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
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
            {/* AI Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                  pathname.startsWith('/ai-') ? 'text-violet-400 bg-white/[0.05]' : ''
                }`}
              >
                <span>AI Tools</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 rounded-xl glass-dropdown border border-white/10 shadow-2xl">
                    <Link
                      href="/ai-video-generator"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">AI Video Generator</div>
                        <div className="text-xs text-slate-400">Cinematic text-to-video & ads</div>
                      </div>
                    </Link>

                    <Link
                      href="/ai-image-generator"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">AI Image Studio</div>
                        <div className="text-xs text-slate-400">Flux & photorealistic visuals</div>
                      </div>
                    </Link>

                    <Link
                      href="/ai-voice-generator"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Voice & Audio AI</div>
                        <div className="text-xs text-slate-400">Neural voices & music tracks</div>
                      </div>
                    </Link>

                    <Link
                      href="/ai-avatar-generator"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">AI Talking Avatars</div>
                        <div className="text-xs text-slate-400">Presenter videos & UGC spokespersons</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Templates Link */}
            <Link
              href="/templates"
              className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                pathname === '/templates' ? 'text-violet-400 bg-white/[0.05]' : ''
              }`}
            >
              Templates
            </Link>

            {/* Use Cases Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setUseCasesOpen(true)}
              onMouseLeave={() => setUseCasesOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                  pathname.startsWith('/use-cases') ? 'text-violet-400 bg-white/[0.05]' : ''
                }`}
              >
                <span>Use Cases</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${useCasesOpen ? 'rotate-180' : ''}`} />
              </button>

              {useCasesOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 rounded-xl glass-dropdown border border-white/10 shadow-2xl">
                    <Link
                      href="/use-cases/marketing"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Performance Marketing</div>
                        <div className="text-xs text-slate-400">Paid ads & promo creatives</div>
                      </div>
                    </Link>

                    <Link
                      href="/use-cases/youtube"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">YouTube & Shorts</div>
                        <div className="text-xs text-slate-400">Explainers & faceless channels</div>
                      </div>
                    </Link>

                    <Link
                      href="/use-cases/ecommerce"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">E-commerce Brands</div>
                        <div className="text-xs text-slate-400">Product reveals & Amazon videos</div>
                      </div>
                    </Link>

                    <Link
                      href="/use-cases/social-media"
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.08] transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">Social Media Managers</div>
                        <div className="text-xs text-slate-400">Instagram Reels & TikToks</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/models"
              className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                pathname === '/models' ? 'text-violet-400 bg-white/[0.05]' : ''
              }`}
            >
              Models
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-2 rounded-lg hover:text-white hover:bg-white/[0.05] transition-colors ${
                pathname === '/pricing' ? 'text-violet-400 bg-white/[0.05]' : ''
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
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-violet-600/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create with AI</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg shadow-lg shadow-violet-600/25 transition-all"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0E1017] px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/ai-video-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-white/5"
            >
              AI Video Generator
            </Link>
            <Link
              href="/ai-image-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-white/5"
            >
              AI Image Generator
            </Link>
            <Link
              href="/ai-voice-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-white/5"
            >
              AI Voice & Audio
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Templates
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Blog
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-slate-200 bg-white/5 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-lg"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
