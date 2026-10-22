'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CreditCard,
  Zap,
  ArrowUpRight,
  Download,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Receipt,
  Layers,
  Sparkles,
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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = billing?.plan;
  const subscription = billing?.subscription;
  const recentTransactions = billing?.recentTransactions || [];
  const latestInvoices = billing?.latestInvoices || [];
  const latestReceipts = billing?.latestReceipts || [];

  return (
    <div
      className="min-h-screen flex transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Title & Subnavigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Billing & Financial Management</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Manage your subscription plans, PayU India transactions, official GST tax invoices, and receipts.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/checkout?type=pack&id=pack_1200"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/25 flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Buy Credits</span>
              </Link>

              <Link
                href="/pricing"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold transition-all"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>

          {/* Subnavigation Pills */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto text-xs font-semibold">
            <Link
              href="/dashboard/billing"
              className="px-3.5 py-1.5 bg-violet-600 text-white rounded-lg shadow-sm"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/billing/invoices"
              className="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Invoices ({latestInvoices.length})
            </Link>
            <Link
              href="/dashboard/billing/receipts"
              className="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Payment Receipts ({latestReceipts.length})
            </Link>
            <Link
              href="/dashboard/billing/transactions"
              className="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Transactions History
            </Link>
            <Link
              href="/dashboard/billing/subscription"
              className="px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Subscription Details
            </Link>
          </div>

          {/* Subscription & Active Plan Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141622] to-[#12141F] border border-white/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-violet-400 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/30 font-bold">
                  Active Subscription
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-Renewal Active
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {plan?.name || 'Studio Creator Plan'}
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Priority GPU queue, 1080p rendering, access to Runway Gen-3, Luma Ray, Fal Flux, and ElevenLabs voices.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xs text-slate-400">Monthly Billing</div>
                <div className="text-xl font-extrabold text-white font-mono">
                  INR {plan?.priceInr || 2499}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </div>
              </div>

              <Link
                href="/pricing"
                className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all"
              >
                Change Plan
              </Link>
            </div>
          </div>

          {/* Financial Overview Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Available Compute</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {billing?.availableCredits ?? credits.availableBalance}
              </div>
              <p className="text-[11px] text-slate-500">Live spendable credits</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Purchased Credits</span>
                <TrendingUp className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {billing?.purchasedCredits ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">Total top-ups & plan allowances</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Total Spent (INR)</span>
                <CreditCard className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                ₹{billing?.totalSpentInr?.toFixed(2) ?? '0.00'}
              </div>
              <p className="text-[11px] text-slate-500">Paid via PayU India</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#12141A] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Successful Orders</span>
                <ShieldCheck className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {billing?.totalSuccessfulPayments ?? 0}
              </div>
              <p className="text-[11px] text-slate-500">Verified transactions on ledger</p>
            </div>
          </div>

          {/* Quick Credit Packs Section */}
          <div className="rounded-2xl bg-[#12141A] border border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Instant Credit Top-Up Packs</h3>
                <p className="text-xs text-slate-400">Never let rendering stop. Instant delivery via PayU UPI & Cards.</p>
              </div>
              <Link href="/pricing" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1">
                <span>View All Packs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { id: 'pack_500', name: '500 Credits', price: 499, tag: 'Quick Refill' },
                { id: 'pack_1200', name: '1,200 Credits', price: 999, tag: 'Most Popular' },
                { id: 'pack_3500', name: '3,500 Credits', price: 2499, tag: 'Scale' },
                { id: 'pack_10000', name: '10,000 Credits', price: 5999, tag: 'Agency' },
              ].map((pack) => (
                <div
                  key={pack.id}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-violet-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-950/60 px-2 py-0.5 rounded">
                        {pack.tag}
                      </span>
                    </div>
                    <div className="font-bold text-white text-base mt-2">{pack.name}</div>
                    <div className="text-sm font-extrabold text-slate-200 mt-1 font-mono">
                      INR {pack.price} <span className="text-[10px] text-slate-500 font-normal">+ 18% GST</span>
                    </div>
                  </div>

                  <Link
                    href={`/checkout?type=pack&id=${pack.id}`}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-violet-600 text-white rounded-lg text-xs font-bold text-center block transition-colors"
                  >
                    Purchase Pack
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions & Invoices Table */}
          <div className="rounded-2xl bg-[#12141A] border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Recent PayU Transactions</h3>
                <p className="text-xs text-slate-400">Latest orders processed with immediate settlement</p>
              </div>
              <Link
                href="/dashboard/billing/transactions"
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
              >
                View Full Ledger →
              </Link>
            </div>

            <div className="overflow-x-auto">
              {recentTransactions.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                  <p>No transactions recorded yet in this workspace.</p>
                  <Link href="/checkout?type=pack&id=pack_1200" className="text-violet-400 font-bold underline">
                    Make your first credit purchase
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {recentTransactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-white">
                          <Link href={`/dashboard/billing/transactions/${tx.id}`} className="hover:text-violet-400 underline">
                            {tx.txnid}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                          {tx.productInfo}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          INR {tx.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              tx.status === 'success'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                                : tx.status === 'pending'
                                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                                : 'bg-red-950/80 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {tx.receiptId && (
                              <a
                                href={`/api/billing/receipts/${tx.receiptId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors"
                                title="Download Receipt PDF"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                              </a>
                            )}
                            {tx.invoiceId && (
                              <a
                                href={`/api/billing/invoices/${tx.invoiceId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-600 text-slate-300 hover:text-white transition-colors"
                                title="Download Tax Invoice PDF"
                              >
                                <FileText className="w-3.5 h-3.5 text-sky-400" />
                              </a>
                            )}
                          </div>
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
