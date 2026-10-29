'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CreditCard,
  Zap,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function BillingOverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBilling = async () => {
    try {
      const [authRes, billRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/billing/overview'),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (billRes.ok) {
        setBilling(await billRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = billing?.plan;
  const recentTransactions = billing?.recentTransactions || [];
  const latestInvoices = billing?.latestInvoices || [];
  const latestReceipts = billing?.latestReceipts || [];

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-white">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8 text-left">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight">Credits & Billing</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Manage subscription plans, top-up packs, GST tax invoices, and receipts.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="px-4 py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Top Up Credits</span>
              </Link>

              <Link
                href="/pricing"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] rounded-xl text-xs font-semibold transition-all shadow-2xs"
              >
                Change Plan
              </Link>
            </div>
          </div>

          {/* Subscription Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-[#5145CD] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#5145CD]/20 font-bold">
                  Active Workspace Plan
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Active
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17191D]">
                {plan?.name || 'Fluvia Pro Plan'}
              </h2>
              <p className="text-xs text-[#667085] max-w-xl">
                Priority GPU queue, 4K rendering, Gemini Omni 1.1 Flash Engine, and ElevenLabs voice synchronization.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xs text-[#667085]">Plan Price</div>
                <div className="text-xl font-bold text-[#17191D] font-mono">
                  ₹{plan?.priceInr || 2499}
                  <span className="text-xs text-[#667085] font-normal"> / mo</span>
                </div>
              </div>

              <Link
                href="/pricing"
                className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Change Plan
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#667085] font-semibold">
                <span>Available Balance</span>
                <Zap className="w-4 h-4 text-[#5145CD]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#17191D] font-mono">
                {(billing?.availableCredits ?? credits.availableBalance).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#667085]">Live spendable credits</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#667085] font-semibold">
                <span>Total Purchased</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#17191D] font-mono">
                {(billing?.purchasedCredits ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#667085]">Top-ups & plan allocations</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#667085] font-semibold">
                <span>Total Spent</span>
                <CreditCard className="w-4 h-4 text-[#5145CD]" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#5145CD] font-mono">
                ₹{(billing?.totalSpentInr ?? 0).toFixed(2)}
              </div>
              <p className="text-[11px] text-[#667085]">Processed via PayU India</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-[#667085] font-semibold">
                <span>Successful Orders</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#17191D] font-mono">
                {billing?.totalSuccessfulPayments ?? 0}
              </div>
              <p className="text-[11px] text-[#667085]">Verified transactions on ledger</p>
            </div>
          </div>

          {/* Featured Top-Up Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#EEF2FF] to-white border border-[#5145CD]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5145CD] text-white text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Featured Pack</span>
              </div>
              <h3 className="text-lg font-bold text-[#17191D]">5,000 Credits Pro Top-Up</h3>
              <p className="text-xs text-[#667085]">
                Base ₹6,500 + 18% GST (₹1,170) = <strong className="text-[#17191D]">₹7,670 Total</strong>. Immediate wallet fulfillment.
              </p>
            </div>

            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Buy 5,000 Credits (₹7,670)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Credit Packs */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#17191D]">Credit Top-Up Packs</h3>
                <p className="text-xs text-[#667085]">One-time credit packs that never expire.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { id: 'pack_5000', name: '5,000 Credits', price: 6500, total: 7670, tag: 'Featured' },
                { id: 'pack_1000', name: '1,000 Credits', price: 1400, total: 1652, tag: 'Starter' },
                { id: 'pack_2500', name: '2,500 Credits', price: 3400, total: 4012, tag: 'Growth' },
                { id: 'pack_10000', name: '10,000 Credits', price: 12500, total: 14750, tag: 'Agency' },
              ].map((pack) => (
                <div
                  key={pack.id}
                  className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-[#5145CD] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                      {pack.tag}
                    </span>
                    <div className="font-bold text-[#17191D] text-sm mt-2">{pack.name}</div>
                    <div className="text-xs text-[#667085] mt-1 font-mono">
                      ₹{pack.price.toLocaleString()} + GST (₹{pack.total.toLocaleString()} total)
                    </div>
                  </div>

                  <Link
                    href={`/checkout?type=pack&id=${pack.id}`}
                    className="mt-4 w-full py-2 bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-center block transition-all shadow-2xs"
                  >
                    Purchase Pack
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#17191D] text-sm">Recent Transactions</h3>
                <p className="text-xs text-[#667085]">PayU orders settled on ledger with official tax invoices</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              {recentTransactions.length === 0 ? (
                <div className="p-8 text-center text-[#667085] text-xs space-y-2">
                  <p>No transactions recorded yet in this workspace.</p>
                  <Link href="/checkout?type=pack&id=pack_5000" className="text-[#5145CD] font-semibold underline">
                    Top up credits now
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA] text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-mono font-semibold">
                    <tr>
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Invoices</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                    {recentTransactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-[#F7F8FA] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#17191D]">
                          {tx.txnid}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#17191D] max-w-xs truncate">
                          {tx.productInfo}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#17191D]">
                          INR {tx.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              tx.status === 'success'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : tx.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#667085]">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {tx.invoiceId && (
                            <a
                              href={`/api/billing/invoices/${tx.invoiceId}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-[11px] font-medium inline-flex items-center gap-1 shadow-2xs"
                              title="Download GST Invoice"
                            >
                              <FileText className="w-3 h-3 text-[#5145CD]" />
                              <span>Invoice PDF</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
