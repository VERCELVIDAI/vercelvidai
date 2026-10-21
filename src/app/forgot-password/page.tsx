'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowLeft, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-1 text-xs text-slate-400">
            Enter your email to receive recovery instructions
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel border border-white/10 shadow-2xl">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">Check your inbox</h3>
              <p className="mt-2 text-xs text-slate-400">
                A password reset authorization link has been sent to <strong className="text-white">{email}</strong>.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">Email Address</label>
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

              <button
                type="submit"
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/30 text-xs transition-all"
              >
                Send Password Reset Email
              </button>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
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
