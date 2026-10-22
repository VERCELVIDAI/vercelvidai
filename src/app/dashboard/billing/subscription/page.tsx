'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function SubscriptionManagementPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/billing/overview'),
    ])
      .then(async ([authRes, billRes]) => {
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        setData(await authRes.json());
        if (billRes.ok) {
          setBilling(await billRes.json());
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = billing?.plan;
  const subscription = billing?.subscription;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link href="/dashboard/billing" className="hover:text-white transition-colors">
                Billing
              </Link>
              <span>/</span>
              <span className="text-white">Subscription</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Subscription Management</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Your active recurring plan, auto-renewal settings, and computing quota.
            </p>
          </div>

          {/* Plan Card */}
          <div className="bg-[#12141C] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  Active Subscription
                </span>
                <h2 className="text-2xl font-black text-white mt-2">
                  {plan?.name || 'Studio Creator Plan'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  1,500 creative credits replenished each billing cycle.
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-violet-400 font-mono">
                  INR {plan?.priceInr || 2499}
                  <span className="text-xs text-slate-400 font-normal"> / month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">+ 18% GST (SAC 998314)</p>
              </div>
            </div>

            {/* Plan Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Plan Entitlements</span>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Maximum 1080p Full HD Video Rendering</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero Watermarks on Exported Media</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Runway Gen-3, Luma Ray & Flux Pro Access</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Priority Cloud Rendering Queue</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Billing Cycle & Payment</span>
                <div className="flex justify-between text-slate-300">
                  <span>Billing Interval:</span>
                  <strong className="text-white">Monthly</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Payment Gateway:</span>
                  <span className="text-white font-semibold">PayU India</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Next Renewal Date:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {subscription?.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                      : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10 justify-between items-center">
              <span className="text-xs text-slate-400">
                Need more GPU hours or 4K resolution? Upgrade your subscription anytime.
              </span>

              <Link
                href="/pricing"
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all shrink-0"
              >
                Upgrade to Agency Plan
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
