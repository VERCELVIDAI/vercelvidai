'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight, Lock, Mail, User, Sparkles, AlertCircle } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const pendingPrompt = localStorage.getItem('vidai_pending_prompt');
      if (pendingPrompt) {
        router.push('/create');
      } else {
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-xs font-semibold mb-3 border border-violet-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Includes 100 Free Generative Credits</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create your account</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Start producing cinematic AI videos and ads in minutes
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Aria Vance"
                className="w-full bg-[#0E1017] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Work or Personal Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@vidai.io"
                className="w-full bg-[#0E1017] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#0E1017] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Claim 100 Free Credits & Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-[11px] text-slate-500 text-center">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-violet-400 hover:underline">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</Link>.
        </p>

        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/5 pt-4">
          Already have an account?{' '}
          <Link href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-violet-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-slate-400 font-mono">Loading signup portal...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
