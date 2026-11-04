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
      <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading billing & subscription ledger...</span>
        </div>
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
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#070A0F] text-white relative selection:bg-[#d4ff00] selection:text-black">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#070A0F] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 text-left">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Credits & Billing</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Manage subscription plans, top-up packs, GST tax invoices, and receipts.
              </p>
            </div>

            <div className="flex flex-wrap xs:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="flex-1 sm:flex-initial text-center justify-center px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-1.5 transition-all cursor-pointer border border-violet-400/30"
              >
                <Zap className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Top Up Credits</span>
              </Link>

              <Link
                href="/pricing"
                className="flex-1 sm:flex-initial text-center justify-center px-4 py-2.5 bg-[#141A26] hover:bg-[#1C2538] text-white border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Change Plan
              </Link>
            </div>
          </div>

          {/* Subscription Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-violet-300 bg-violet-950/80 px-2.5 py-0.5 rounded-full border border-violet-500/40 font-black">
                  Active Workspace Plan
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Active
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {plan?.name || 'Fluvia Pro Plan'}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Priority GPU queue, 4K rendering, Gemini Omni 1.1 Flash Engine, and ElevenLabs voice synchronization.
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400">Plan Price</div>
                <div className="text-xl font-bold text-[#d4ff00] font-mono">
                  ₹{plan?.priceInr || 2499}
                  <span className="text-xs text-slate-400 font-normal"> / mo</span>
                </div>
              </div>

              <Link
                href="/pricing"
                className="px-4 py-2.5 bg-[#141A26] hover:bg-[#1C2538] text-white border border-slate-700 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                Change Plan
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Available Balance</span>
                <Zap className="w-4 h-4 text-[#d4ff00]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#d4ff00] font-mono">
                {(billing?.availableCredits ?? credits.availableBalance).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Live spendable credits</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Total Purchased</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {(billing?.purchasedCredits ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">Top-ups & plan allocations</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Total Spent</span>
                <CreditCard className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-violet-300 font-mono">
                ₹{(billing?.totalSpentInr ?? 0).toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-400">Processed via PayU India</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>Successful Orders</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {billing?.totalSuccessfulPayments ?? 0}
              </div>
              <p className="text-[11px] text-slate-400">Verified transactions on ledger</p>
            </div>
          </div>

          {/* Featured Top-Up Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#101422] to-violet-950/60 border-2 border-violet-500/40 shadow-[0_0_35px_rgba(139,92,246,0.2)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-900/80 text-violet-200 border border-violet-400/40 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-[#d4ff00]" />
                <span>Featured Pack</span>
              </div>
              <h3 className="text-lg font-black text-white">5,000 Credits Pro Top-Up</h3>
              <p className="text-xs text-slate-300">
                Base ₹6,500 + 18% GST (₹1,170) = <strong className="text-[#d4ff00]">₹7,670 Total</strong>. Immediate wallet fulfillment.
              </p>
            </div>

            <Link
              href="/checkout?type=pack&id=pack_5000"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center gap-1.5 shrink-0 border border-violet-400/30"
            >
              <span>Buy 5,000 Credits (₹7,670)</span>
              <ArrowRight className="w-4 h-4 text-[#d4ff00]" />
            </Link>
          </div>

          {/* Quick Credit Packs */}
          <div className="rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Credit Top-Up Packs</h3>
                <p className="text-xs text-slate-400">One-time credit packs that never expire.</p>
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
                  className="p-4 rounded-2xl bg-[#141A26] border-2 border-slate-800 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-black text-violet-300 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-500/40">
                      {pack.tag}
                    </span>
                    <div className="font-black text-white text-sm mt-2">{pack.name}</div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      ₹{pack.price.toLocaleString()} + GST (₹{pack.total.toLocaleString()} total)
                    </div>
                  </div>

                  <Link
                    href={`/checkout?type=pack&id=${pack.id}`}
                    className="mt-4 w-full py-2 bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white border border-violet-500/40 rounded-xl text-xs font-black text-center block transition-all shadow-xs"
                  >
                    Purchase Pack
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-white text-base">Recent Billing Transactions</h3>
                <p className="text-xs text-slate-400">PayU orders settled on ledger with official tax invoices and vouchers</p>
              </div>
              <Link
                href="/dashboard/billing/transactions"
                className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View Full Transaction History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {recentTransactions.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs space-y-2">
                  <p>No transactions recorded yet in this workspace.</p>
                  <Link href="/checkout?type=pack&id=pack_5000" className="text-violet-400 hover:underline font-bold">
                    Top up credits now
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141A26] text-slate-400 border-b border-slate-800 uppercase text-[10px] font-mono font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Merchant Txn ID</th>
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">Item</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-5 text-right">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {recentTransactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-white">
                          <Link href={`/dashboard/billing/transactions/${tx.id}`} className="hover:text-violet-400 underline">
                            {tx.txnid}
                          </Link>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-violet-400">
                          {tx.invoiceNumber || tx.invoiceId ? (
                            <Link href={`/dashboard/billing/invoices/${tx.invoiceId || tx.invoiceNumber}`} className="hover:underline">
                              #{tx.invoiceNumber || tx.invoiceId}
                            </Link>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-semibold text-white max-w-xs truncate">
                          {tx.productInfo}
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-[#d4ff00]">
                          INR {Number(tx.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                              tx.status === 'success'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : tx.status === 'pending'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                                : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {tx.status === 'success' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                            <span>{tx.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end flex-wrap gap-1.5">
                            {tx.invoiceId && (
                              <a
                                href={`/api/billing/invoices/${tx.invoiceId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white border border-violet-500/40 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                                title="Download Official Tax Invoice PDF"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </a>
                            )}
                            {tx.receiptId && (
                              <a
                                href={`/api/billing/receipts/${tx.receiptId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                                title="Download Official Receipt PDF"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Receipt</span>
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
