'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
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
  Check,
  X,
} from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Client-side validations
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordLengthValid = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!passwordLengthValid) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          agreeTerms: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create your account.');
      }

      if (data.requiresEmailVerification) {
        setVerificationSent(true);
        setRegisteredEmail(email.trim().toLowerCase());
        return;
      }

      if (typeof window !== 'undefined') {
        try {
          if (data.vaultToken) {
            localStorage.setItem('fluvia_vault', data.vaultToken);
          }
          localStorage.setItem('fluvia_last_email', email.trim().toLowerCase());
        } catch {}
      }

      // Check if user had a pending prompt in localStorage
      const pendingPrompt =
        typeof window !== 'undefined'
          ? localStorage.getItem('fluvia_pending_prompt') || localStorage.getItem('vidai_pending_prompt')
          : null;

      if (pendingPrompt) {
        window.location.href = '/create';
      } else {
        window.location.href = returnUrl;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="w-full max-w-md relative z-10 mx-auto text-left py-6 px-4 sm:px-0">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="md" />
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20 shadow-xl bg-white/90 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-xs">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-[#17211D]">Check your email</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            We&apos;ve sent a verification link to <strong className="text-[#17211D]">{registeredEmail}</strong>. Please click the link to confirm your account and claim your 100 free credits.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 text-sm text-center transition-all"
            >
              Go to Sign In
            </Link>
            <button
              type="button"
              onClick={() => setVerificationSent(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
            >
              Didn&apos;t receive it or want to change your email?
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10 mx-auto text-left py-6 px-4 sm:px-0">
      {/* Top Controls: Logo */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo size="md" />
        </Link>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3 border border-emerald-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Includes 100 Free Generative Credits</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          Start producing cinema-grade AI videos, ads, and viral clips in minutes
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20 shadow-xl bg-white/90">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
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
          <GoogleSignInButton returnUrl={returnUrl} label="Sign up with Google" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0E1015] px-3 text-slate-500 font-mono text-[11px]">
              Or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Name or Creator Handle
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-[#11131A] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm shadow-xs placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-[#11131A] text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm shadow-xs placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <span className={`text-[10px] font-mono ${passwordLengthValid ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
                min. 8 characters
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full bg-[#11131A] text-white pl-10 pr-11 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm shadow-xs placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 rounded-md cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Confirm Password
              </label>
              {confirmPassword.length > 0 && (
                <span className={`text-[10px] font-mono flex items-center gap-1 ${passwordsMatch ? 'text-indigo-400 font-bold' : 'text-rose-400'}`}>
                  {passwordsMatch ? <Check className="w-3 h-3 text-cyan-400" /> : null}
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full bg-[#11131A] text-white pl-10 pr-11 py-2.5 rounded-xl border ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20'
                } focus:outline-none focus:ring-2 text-sm shadow-xs placeholder:text-slate-500`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 rounded-md cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-[#11131A] text-indigo-600 focus:ring-indigo-500/20 cursor-pointer accent-indigo-600"
              />
              <span className="text-xs text-slate-400 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-indigo-400 font-bold hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-indigo-400 font-bold hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Register CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Fluvia Studio Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-indigo-400 font-bold hover:underline"
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
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden bg-[#090A0D]">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0E1015] border border-white/10 shadow-2xl relative z-10">
        <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading registration portal...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
