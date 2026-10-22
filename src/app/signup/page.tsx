'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Check if user had a pending prompt in localStorage
      const pendingPrompt = localStorage.getItem('fluvia_pending_prompt') || localStorage.getItem('vidai_pending_prompt');
      if (pendingPrompt) {
        router.push('/create');
      } else {
        router.push(`/onboarding/theme?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 mx-auto">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="md" />
        </Link>
        <ThemeToggle />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 dark:bg-violet-600/20 text-violet-600 dark:text-violet-300 text-xs font-semibold mb-3 border border-violet-500/25">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Includes 100 Free Generative Credits</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Start producing cinema-grade AI videos, ads, and viral clips in minutes
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11131C] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-400 mb-1.5">
              Full Name or Creator Handle
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-slate-50 dark:bg-[#0E1017] text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-50 dark:bg-[#0E1017] text-slate-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 dark:text-slate-400 mb-1.5">
              Password (min. 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-slate-50 dark:bg-[#0E1017] text-slate-900 dark:text-white pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 text-sm shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-violet-600 dark:text-violet-400 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-violet-600 dark:text-violet-400 underline">
              Privacy Policy
            </Link>.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-violet-600/25 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Get Started — Claim 100 Credits</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-violet-600 dark:text-violet-400 font-bold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading signup portal...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
