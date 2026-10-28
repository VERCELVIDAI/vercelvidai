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
    <div className="min-h-screen text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090A0D]">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="w-full max-w-md relative z-10 text-left">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="hover:opacity-85 transition-opacity">
              <Logo size="lg" />
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Reset your password</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1015] border border-white/10 shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                If an account exists for <strong className="text-white font-bold">{email}</strong>, a secure password reset link has been dispatched.
              </p>

              {devResetLink && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-left text-xs space-y-1.5">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Development Direct Reset Link:</span>
                  </div>
                  <Link
                    href={devResetLink}
                    className="block text-[11px] font-mono text-cyan-300 hover:text-cyan-200 underline truncate"
                  >
                    {devResetLink}
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Back to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@brand.com"
                    className="w-full bg-[#11131A] border border-white/10 text-white pl-10 pr-3.5 py-2.5 rounded-xl text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Dispatching Link...</span>
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-white/8 text-center text-xs">
            <Link
              href="/login"
              className="text-slate-400 hover:text-white font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
