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

    // Pre-fill previously registered or used email
    if (typeof window !== 'undefined' && !email) {
      try {
        const remembered = localStorage.getItem('fluvia_last_email');
        if (remembered) setEmail(remembered);
      } catch {}
    }
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
      const vaultToken = typeof window !== 'undefined' ? localStorage.getItem('fluvia_vault') || '' : '';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-fluvia-vault': vaultToken,
        },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in. Please verify your credentials.');
      }

      if (typeof window !== 'undefined') {
        try {
          if (data.vaultToken) {
            localStorage.setItem('fluvia_vault', data.vaultToken);
          }
          localStorage.setItem('fluvia_last_email', email.trim().toLowerCase());
        } catch {}
      }

      if (useTemplate === 'true' && returnUrl.startsWith('/templates/')) {
        window.location.href = `${returnUrl}?autoUse=true`;
      } else {
        window.location.href = returnUrl;
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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-[#667085]">
            Sign in to access your AI ad studio, generation history, and projects.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold leading-relaxed">{successMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-950"
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
              <div className="leading-relaxed">
                <span className="font-semibold">{error}</span>
                {error.includes('Create an account') && (
                  <Link
                    href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}
                    className="ml-1.5 underline font-bold text-[#5145CD] hover:text-[#4338CA] inline-flex items-center gap-0.5"
                  >
                    <span>Register now &rarr;</span>
                  </Link>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-600 hover:text-rose-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Google Sign-In */}
        <div className="mb-5">
          <GoogleSignInButton returnUrl={returnUrl} label="Continue with Google" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#667085] font-mono text-[11px]">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Sign-In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-xs font-semibold uppercase tracking-wider text-[#17191D] mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email-input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-white text-[#17191D] pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/20 focus:border-[#5145CD] text-sm shadow-2xs transition-all placeholder:text-[#667085]/60"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold uppercase tracking-wider text-[#17191D]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#5145CD] hover:text-[#4338CA] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white text-[#17191D] pl-10 pr-11 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/20 focus:border-[#5145CD] text-sm shadow-2xs transition-all placeholder:text-[#667085]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#17191D] p-1 rounded-md transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign in to FLUVIA FLOW</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Development Shortcuts */}
        <DevDemoShortcuts onFill={handleDevFill} />

        {/* Signup Link */}
        <div className="mt-8 text-center text-xs text-[#667085]">
          Don&apos;t have an account?{' '}
          <Link
            href={`/signup?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-[#5145CD] font-semibold hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Footer Legal Links */}
      <div className="pt-8 border-t border-[#E5E7EB] flex items-center justify-center gap-4 text-[11px] text-[#667085]">
        <Link href="/privacy" className="hover:underline hover:text-[#17191D]">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="hover:underline hover:text-[#17191D]">
          Terms of Service
        </Link>
        <span>•</span>
        <Link href="/help" className="hover:underline hover:text-[#17191D]">
          Help & Support
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-[#17191D] bg-white">
      {/* LEFT SIDE: Brand Visual & Product Showcase */}
      <AuthHeroVisual />

      {/* RIGHT SIDE: Authentication Form Card */}
      <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 relative overflow-hidden bg-white">
        <Suspense fallback={<div className="text-xs text-[#667085] font-mono">Loading authentication portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
