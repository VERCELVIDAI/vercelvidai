'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { AuthHeroVisual } from '@/components/auth/AuthHeroVisual';
import { DevDemoShortcuts } from '@/components/auth/DevDemoShortcuts';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Sparkles,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const useTemplate = searchParams.get('useTemplate');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      // Check if user has completed theme preferences
      const hasCompletedTheme = data.user?.themePreferences?.completed === true;

      // If returning to a template with useTemplate intent
      if (useTemplate === 'true' && returnUrl.startsWith('/templates/')) {
        router.push(`${returnUrl}?autoUse=true`);
      } else if (!hasCompletedTheme) {
        router.push(`/onboarding/theme?returnUrl=${encodeURIComponent(returnUrl)}`);
      } else {
        router.push(returnUrl);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 flex flex-col justify-between min-h-[580px]">
      {/* Top Header: Mobile Logo & Theme Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="lg:hidden">
          <Logo size="md" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div>
        {/* Welcome Headline */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to access your creative studio, video timelines and credit balance.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {/* Clean Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white dark:bg-[#0E1017] text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-400"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white dark:bg-[#0E1017] text-slate-900 dark:text-white pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm shadow-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-md transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Gradient Sign-in CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Fluvia Flow</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Development-Only Testing Component (Rendered strictly when DEV flag is enabled) */}
        <DevDemoShortcuts onFill={handleDevFill} />

        {/* Signup Link */}
        <div className="mt-8 text-center text-xs text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-violet-600 dark:text-violet-400 font-bold hover:underline"
          >
            Create an account (+100 Free Credits)
          </Link>
        </div>
      </div>

      {/* Footer Legal Links */}
      <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/help" className="hover:underline">
          Help & Support
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      {/* LEFT SIDE: Brand Visual & 3D Interactive Media Composition */}
      <AuthHeroVisual />

      {/* RIGHT SIDE: Authentication Form Card */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
