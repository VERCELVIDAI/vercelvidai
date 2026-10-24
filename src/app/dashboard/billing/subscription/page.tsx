'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CheckCircle2,
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
      <div className="min-h-screen text-[#17211D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = billing?.plan;
  const subscription = billing?.subscription;

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-[#17211D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
              <Link href="/dashboard/billing" className="hover:text-emerald-700 transition-colors">
                Billing
              </Link>
              <span>/</span>
              <span className="text-[#17211D]">Subscription</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D]">Subscription Management</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Your active recurring plan, auto-renewal settings, and computing quota.
            </p>
          </div>

          {/* Plan Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-emerald-500/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  Active Subscription
                </span>
                <h2 className="text-2xl font-black text-[#17211D] mt-2">
                  {plan?.name || 'Studio Creator Plan'}
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  1,500 creative credits replenished each billing cycle.
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  INR {plan?.priceInr || 2499}
                  <span className="text-xs text-slate-500 font-normal"> / month</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">All standard platform features included</p>
              </div>
            </div>

            {/* Plan Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-500/15 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Plan Entitlements</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Maximum 1080p Full HD Video Rendering</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zero Watermarks on Exported Media</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Runway Gen-3, Luma Ray & Flux Pro Access</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Priority Cloud Rendering Queue</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-500/15 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-500">Billing Cycle & Payment</span>
                <div className="flex justify-between text-slate-700">
                  <span>Billing Interval:</span>
                  <strong className="text-[#17211D]">Monthly</strong>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Payment Gateway:</span>
                  <span className="text-[#17211D] font-semibold">PayU India</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Next Renewal Date:</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {subscription?.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                      : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-500/10 justify-between items-center">
              <span className="text-xs text-slate-600">
                Need more GPU hours or 4K resolution? Upgrade your subscription anytime.
              </span>

              <Link
                href="/pricing"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all shrink-0"
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
