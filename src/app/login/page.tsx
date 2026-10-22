'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { AuthHeroVisual } from '@/components/auth/AuthHeroVisual';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { DevDemoShortcuts } from '@/components/auth/DevDemoShortcuts';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const useTemplate = searchParams.get('useTemplate');

  const queryError = searchParams.get('error');
  const queryMessage = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(queryError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(queryMessage || null);

  useEffect(() => {
    if (queryError) setError(queryError);
    if (queryMessage) setSuccessMessage(queryMessage);
  }, [queryError, queryMessage]);

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

      if (useTemplate === 'true' && returnUrl.startsWith('/templates/')) {
        router.push(`${returnUrl}?autoUse=true`);
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
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 sm:px-6 flex flex-col justify-between min-h-[580px] text-left">
      {/* Top Header: Mobile Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="lg:hidden">
          <Logo size="md" />
        </div>
      </div>

      <div>
        {/* Welcome Headline */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to access your creative studio, video timelines and credit balance.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold leading-relaxed">{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Official Google Sign-In */}
        <div className="mb-5">
          <GoogleSignInButton returnUrl={returnUrl} label="Continue with Google" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-emerald-500/15" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FAFDFB] px-3 text-slate-500 font-mono text-[11px]">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Clean Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full glass-input text-[#17211D] pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="password-input"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full glass-input text-[#17211D] pl-10 pr-11 py-2.5 rounded-xl border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm shadow-xs transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Gradient Sign-in CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 cursor-pointer"
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

        {/* Development-Only Testing Component */}
        <DevDemoShortcuts onFill={handleDevFill} />

        {/* Signup Link */}
        <div className="mt-8 text-center text-xs text-slate-600">
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-emerald-700 font-bold hover:underline"
          >
            Create an account (+100 Free Credits)
          </Link>
        </div>
      </div>

      {/* Footer Legal Links */}
      <div className="pt-8 border-t border-emerald-500/15 flex items-center justify-center gap-4 text-[11px] text-slate-500">
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 transition-colors duration-200 text-[#17211D] bg-[#FAFDFB]">
      {/* LEFT SIDE: Brand Visual & 3D Interactive Media Composition */}
      <AuthHeroVisual />

      {/* RIGHT SIDE: Authentication Form Card */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none -z-10" />
        <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
