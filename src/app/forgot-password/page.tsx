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
    <div className="min-h-screen text-[#17211D] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-white via-[#F0FDF4]/50 to-[#FFF1F7]/40">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-400/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="w-full max-w-md relative z-10 text-left">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <Logo size="lg" />
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-[#17211D] tracking-tight">Reset your password</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-emerald-500/20 shadow-2xl bg-white/95">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#17211D]">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                If an account exists for <strong className="text-[#17211D] font-bold">{email}</strong>, a secure password reset link has been dispatched.
              </p>

              {devResetLink && (
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-300 text-left text-xs space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Development Direct Reset Link:</span>
                  </div>
                  <Link
                    href={devResetLink}
                    className="block text-[11px] font-mono text-emerald-700 hover:text-emerald-900 underline truncate"
                  >
                    {devResetLink}
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@fluviaflow.ai"
                    className="w-full glass-input text-[#17211D] pl-10 pr-4 py-2.5 rounded-xl border border-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold"
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
