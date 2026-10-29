'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);
  }, [tokenParam, emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Missing reset token. Please request a new password reset link.');
      return;
    }

    if (!email) {
      setError('Email address is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: token.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login?message=Password%20successfully%20updated.%20Please%20log%20in.');
      }, 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="w-full max-w-md relative z-10 text-left">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Link href="/" className="hover:opacity-85 transition-opacity">
            <Logo size="lg" />
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-[#17191D] tracking-tight">Create New Password</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#667085]">
          Enter a secure password for your Fluvia Flow account.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#5145CD]/10 border border-[#5145CD]/20 text-[#5145CD] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#17191D]">Password Reset Complete</h3>
            <p className="text-xs text-[#667085] leading-relaxed max-w-xs mx-auto">
              Your password has been securely updated. Redirecting you to sign in...
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full mt-4 py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
            >
              <span>Sign In Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {!tokenParam && (
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#17191D] mb-1.5 text-[11px]">
                  Reset Token
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste token from reset email"
                  className="w-full bg-white text-[#17191D] px-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] text-xs shadow-2xs font-mono"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#17191D] mb-1.5 text-[11px]">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@fluviaflow.ai"
                className="w-full bg-white text-[#17191D] px-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] text-xs shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-[#17191D] mb-1.5 text-[11px]">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-white text-[#17191D] pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] text-xs shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#17191D] transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-semibold uppercase tracking-wider text-[#17191D] text-[11px]">
                  Confirm New Password
                </label>
                {passwordsMatch && (
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Passwords match
                  </span>
                )}
                {passwordsMismatch && (
                  <span className="text-[11px] font-semibold text-rose-500">
                    Passwords do not match
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={`w-full bg-white text-[#17191D] pl-10 pr-4 py-2.5 rounded-xl border text-xs shadow-2xs transition-colors ${
                    passwordsMismatch
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-[#E5E7EB] focus:border-[#5145CD]'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || password !== confirmPassword}
              className="w-full py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving New Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-[#E5E7EB] text-center">
          <Link
            href="/login"
            className="text-xs font-medium text-[#667085] hover:text-[#17191D] transition-colors"
          >
            Remember your credentials? <span className="text-[#5145CD] underline font-semibold">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen text-[#17191D] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#F7F8FA]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-[#667085] font-medium">Loading password reset form...</p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
