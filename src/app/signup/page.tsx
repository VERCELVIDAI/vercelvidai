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
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  Shield,
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

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-lg text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-[#5145CD]/10 border border-[#5145CD]/20 flex items-center justify-center text-[#5145CD]">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#17191D]">Check your email</h2>
          <p className="mt-2 text-sm text-[#667085] leading-relaxed">
            We&apos;ve sent a verification link to <strong className="text-[#17191D]">{registeredEmail}</strong>. Please click the link to confirm your account and get started.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
              className="w-full py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-sm text-center transition-all cursor-pointer shadow-sm"
            >
              Go to Sign In
            </Link>
            <button
              type="button"
              onClick={() => setVerificationSent(false)}
              className="text-xs text-[#667085] hover:text-[#17191D] font-medium py-1 cursor-pointer"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#667085]">
          Start producing high-converting AI video ads and commercial campaigns.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold leading-relaxed">{error}</span>
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
          <GoogleSignInButton returnUrl={returnUrl} label="Sign up with Google" />
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[#667085] font-mono text-[11px]">
              Or register with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#17191D] mb-1.5">
              Full Name or Brand Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-white text-[#17191D] pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/20 focus:border-[#5145CD] text-sm shadow-2xs placeholder:text-[#667085]/60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#17191D] mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-white text-[#17191D] pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/20 focus:border-[#5145CD] text-sm shadow-2xs placeholder:text-[#667085]/60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#17191D]">
                Password
              </label>
              <span className={`text-[10px] font-mono ${passwordLengthValid ? 'text-[#5145CD] font-bold' : 'text-[#667085]'}`}>
                min. 8 characters
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="w-full bg-white text-[#17191D] pl-10 pr-11 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/20 focus:border-[#5145CD] text-sm shadow-2xs placeholder:text-[#667085]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#17191D] p-1 rounded-md cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#17191D]">
                Confirm Password
              </label>
              {confirmPassword.length > 0 && (
                <span className={`text-[10px] font-mono flex items-center gap-1 ${passwordsMatch ? 'text-emerald-600 font-bold' : 'text-rose-500'}`}>
                  {passwordsMatch ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full bg-white text-[#17191D] pl-10 pr-11 py-2.5 rounded-xl border ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-[#E5E7EB] focus:border-[#5145CD] focus:ring-[#5145CD]/20'
                } focus:outline-none focus:ring-2 text-sm shadow-2xs placeholder:text-[#667085]/60`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#17191D] p-1 rounded-md cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-[#667085] select-none">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#E5E7EB] text-[#5145CD] focus:ring-[#5145CD]"
              />
              <span>
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#5145CD] hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#5145CD] hover:underline font-medium">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreeTerms}
            className="w-full mt-2 py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Fluvia Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Existing account link */}
        <div className="mt-6 text-center text-xs text-[#667085]">
          Already have an account?{' '}
          <Link
            href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
            className="text-[#5145CD] font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#667085]">
        <Shield className="w-4 h-4 text-[#5145CD]" />
        <span>Bank-grade 256-bit SSL encryption & privacy protection</span>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen text-[#17191D] bg-[#F7F8FA] flex items-center justify-center p-4 sm:p-8">
      <Suspense fallback={<div className="text-xs text-[#667085] font-mono">Loading registration form...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
