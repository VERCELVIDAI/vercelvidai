'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CheckCircle2,
  FileText,
  Receipt,
  Download,
  Calendar,
  CreditCard,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default function SubscriptionManagementPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [billing, setBilling] = useState<any>(null);
  const [subscriptionPurchases, setSubscriptionPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/billing/overview'),
      fetch('/api/billing/transactions?limit=50'),
    ])
      .then(async ([authRes, billRes, txRes]) => {
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        setData(await authRes.json());
        if (billRes.ok) {
          setBilling(await billRes.json());
        }
        if (txRes.ok) {
          const txData = await txRes.json();
          const allTx = txData.transactions || [];
          const subOrders = allTx.filter((t: any) => t.paymentType === 'subscription' || (t.productInfo && t.productInfo.toLowerCase().includes('subscription')));
          setSubscriptionPurchases(subOrders.length > 0 ? subOrders : allTx.slice(0, 5));
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

          {/* Subscription Purchase History & Tax Documents */}
          <div className="glass-card rounded-3xl overflow-hidden shadow-xl space-y-0">
            <div className="p-6 border-b border-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  Document History
                </span>
                <h3 className="text-lg font-bold text-[#17211D] mt-1">Subscription Invoices & Receipts</h3>
                <p className="text-xs text-slate-500">
                  Every subscription plan payment includes verified GST tax invoices and receipts with direct download links.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/billing/invoices"
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>All Invoices</span>
                </Link>
                <Link
                  href="/dashboard/billing/receipts"
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                  <span>All Receipts</span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              {subscriptionPurchases.length === 0 ? (
                <div className="p-10 text-center text-slate-500 text-xs space-y-2">
                  <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-semibold text-[#17211D]">No subscription purchases found yet.</p>
                  <p>When you purchase or renew a subscription plan via PayU, your invoice and receipt will be available here.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50/50 text-slate-600 border-b border-emerald-500/10 uppercase text-[10px] font-mono font-bold">
                    <tr>
                      <th className="py-3 px-4">Plan Name</th>
                      <th className="py-3 px-4">Purchase Date</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10 text-slate-700">
                    {subscriptionPurchases.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#17211D]">
                            {sub.productInfo || (plan?.name || 'Fluvia Subscription Plan')}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">{sub.txnid}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#17211D]">
                          INR {sub.totalAmount ? Number(sub.totalAmount).toFixed(2) : (sub.baseAmount ? Number(sub.baseAmount).toFixed(2) : '0.00')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            sub.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : sub.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}>
                            {sub.status || 'Settled'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end flex-wrap gap-1.5">
                            {sub.invoiceId && (
                              <>
                                <Link
                                  href={`/dashboard/billing/invoices/${sub.invoiceId}`}
                                  className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="View Invoice"
                                >
                                  <FileText className="w-3 h-3 text-teal-700" />
                                  <span>View Invoice</span>
                                </Link>
                                <a
                                  href={`/api/billing/invoices/${sub.invoiceId}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-md bg-teal-100 hover:bg-teal-200 text-teal-800 border border-teal-300 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="Download Invoice PDF"
                                >
                                  <Download className="w-3 h-3 text-teal-700" />
                                  <span>PDF</span>
                                </a>
                              </>
                            )}
                            {sub.receiptId && (
                              <>
                                <Link
                                  href={`/dashboard/billing/receipts/${sub.receiptId}`}
                                  className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="View Receipt"
                                >
                                  <Receipt className="w-3 h-3 text-emerald-700" />
                                  <span>View Receipt</span>
                                </Link>
                                <a
                                  href={`/api/billing/receipts/${sub.receiptId}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                                  title="Download Receipt PDF"
                                >
                                  <Download className="w-3 h-3 text-emerald-700" />
                                  <span>PDF</span>
                                </a>
                              </>
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
