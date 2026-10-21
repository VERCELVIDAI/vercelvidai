'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight, Lock, Mail, Sparkles, AlertCircle, Shield } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.error || 'Failed to sign in');
      }

      router.push(returnUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400">
          Sign in to access your creative studio and credit wallet
        </p>
      </div>

      {/* Demo Fast-Fill Bar */}
      <div className="mb-6 p-3 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-violet-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Fast Test Sign-In Accounts:</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('creator@vidai.io', 'Demo1234!')}
            className="flex-1 py-1.5 px-2 bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 rounded border border-violet-500/30 font-medium transition-colors text-center"
          >
            Demo Creator (Aria)
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@vidai.io', 'Admin1234!')}
            className="flex-1 py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded border border-indigo-500/30 font-medium transition-colors text-center"
          >
            Admin Master
          </button>
        </div>
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
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Email</label>
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase text-slate-400">Password</label>
              <Link href="/forgot-password" className="text-xs text-violet-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0E1017] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`} className="text-violet-400 font-semibold hover:underline">
            Create an account (+100 Free Credits)
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
      <Suspense fallback={<div className="text-xs text-slate-400 font-mono">Loading authentication portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
