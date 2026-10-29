'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit recovery request.');
      }

      setSent(true);
      if (data.devResetLink) {
        setDevResetLink(data.devResetLink);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#17191D] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#F7F8FA]">
      <div className="w-full max-w-md relative z-10 text-left">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <Logo size="lg" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-[#17191D] tracking-tight">Reset your password</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#667085]">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#5145CD]/10 border border-[#5145CD]/20 text-[#5145CD] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17191D]">Recovery Instructions Sent</h3>
              <p className="text-xs text-[#667085] leading-relaxed max-w-xs mx-auto">
                If an account exists for <strong className="text-[#17191D] font-bold">{email}</strong>, a secure password reset link has been dispatched.
              </p>

              {devResetLink && (
                <div className="p-3 rounded-xl bg-[#5145CD]/5 border border-[#5145CD]/20 text-left text-xs space-y-1.5">
                  <div className="font-bold text-[#5145CD] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Development Direct Reset Link:</span>
                  </div>
                  <Link
                    href={devResetLink}
                    className="block text-[11px] font-mono text-[#5145CD] hover:underline truncate"
                  >
                    {devResetLink}
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full mt-4 py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
              >
                <span>Back to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#17191D] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full bg-white text-[#17191D] pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/20 focus:border-[#5145CD] text-sm shadow-2xs placeholder:text-[#667085]/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#17191D] font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
