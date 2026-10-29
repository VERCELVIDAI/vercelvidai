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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const plan = billing?.plan;
  const subscription = billing?.subscription;

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-white text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 text-left">
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#667085] mb-1 font-medium">
              <Link href="/dashboard/billing" className="hover:text-[#5145CD] transition-colors">
                Billing
              </Link>
              <span>/</span>
              <span className="text-[#17191D] font-semibold">Subscription</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17191D]">Subscription Management</h1>
            <p className="mt-1 text-xs sm:text-sm text-[#667085]">
              Your active recurring plan, auto-renewal settings, and computing quota.
            </p>
          </div>

          {/* Plan Card */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E5E7EB]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5145CD] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#5145CD]/20 font-semibold">
                  Active Subscription
                </span>
                <h2 className="text-2xl font-bold text-[#17191D] mt-2">
                  {plan?.name || 'Studio Creator Plan'}
                </h2>
                <p className="text-xs text-[#667085] mt-1">
                  1,500 creative credits replenished each billing cycle.
                </p>
              </div>

              <div className="sm:text-right">
                <div className="text-2xl font-bold text-[#5145CD] font-mono">
                  INR {plan?.priceInr || 2499}
                  <span className="text-xs text-[#667085] font-normal"> / month</span>
                </div>
                <p className="text-[11px] text-[#667085] mt-0.5">All standard platform features included</p>
              </div>
            </div>

            {/* Plan Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[#667085]">Plan Entitlements</span>
                <div className="flex items-center gap-2 text-[#17191D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Maximum 1080p Full HD Video Rendering</span>
                </div>
                <div className="flex items-center gap-2 text-[#17191D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zero Watermarks on Exported Media</span>
                </div>
                <div className="flex items-center gap-2 text-[#17191D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Runway Gen-3, Luma Ray & Flux Pro Access</span>
                </div>
                <div className="flex items-center gap-2 text-[#17191D]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Priority Cloud Rendering Queue</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-[#667085]">Billing Cycle & Payment</span>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Billing Interval:</span>
                  <strong>Monthly</strong>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Payment Gateway:</span>
                  <span className="font-semibold">PayU India</span>
                </div>
                <div className="flex justify-between text-[#17191D]">
                  <span className="text-[#667085]">Next Renewal Date:</span>
                  <span className="text-[#5145CD] font-mono font-semibold">
                    {subscription?.currentPeriodEnd
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                      : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E5E7EB] justify-between items-center">
              <span className="text-xs text-[#667085]">
                Need more GPU hours or 4K resolution? Upgrade your subscription anytime.
              </span>

              <Link
                href="/pricing"
                className="px-5 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer"
              >
                Upgrade to Agency Plan
              </Link>
            </div>
          </div>

          {/* Subscription Purchase History & Tax Documents */}
          <div className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden shadow-xs space-y-0">
            <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#5145CD] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full border border-[#5145CD]/20 font-semibold">
                  Document History
                </span>
                <h3 className="text-lg font-bold text-[#17191D] mt-1">Subscription Invoices & Receipts</h3>
                <p className="text-xs text-[#667085]">
                  Every subscription plan payment includes verified GST tax invoices and receipts with direct download links.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/billing/invoices"
                  className="px-3 py-1.5 rounded-lg bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>All Invoices</span>
                </Link>
                <Link
                  href="/dashboard/billing/receipts"
                  className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#667085]" />
                  <span>All Receipts</span>
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              {subscriptionPurchases.length === 0 ? (
                <div className="p-10 text-center text-[#667085] text-xs space-y-2">
                  <CreditCard className="w-8 h-8 text-[#667085] opacity-50 mx-auto" />
                  <p className="font-semibold text-[#17191D]">No subscription purchases found yet.</p>
                  <p>When you purchase or renew a subscription plan via PayU, your invoice and receipt will be available here.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA] text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Plan Name</th>
                      <th className="py-3 px-4">Purchase Date</th>
                      <th className="py-3 px-4">Amount Paid</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-[#17191D]">
                    {subscriptionPurchases.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-[#F7F8FA] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#17191D]">
                            {sub.productInfo || (plan?.name || 'Fluvia Subscription Plan')}
                          </div>
                          <div className="text-[11px] font-mono text-[#667085]">{sub.txnid}</div>
                        </td>
                        <td className="py-3.5 px-4 text-[#667085] font-medium">
                          {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#17191D]">
                          INR {sub.totalAmount ? Number(sub.totalAmount).toFixed(2) : (sub.baseAmount ? Number(sub.baseAmount).toFixed(2) : '0.00')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            sub.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : sub.status === 'pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
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
                                  className="px-2.5 py-1 rounded-md bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                  title="View Invoice"
                                >
                                  <FileText className="w-3 h-3 text-[#5145CD]" />
                                  <span>View Invoice</span>
                                </Link>
                                <a
                                  href={`/api/billing/invoices/${sub.invoiceId}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-md border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] text-[#17191D] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                  title="Download Invoice PDF"
                                >
                                  <Download className="w-3 h-3 text-[#667085]" />
                                  <span>PDF</span>
                                </a>
                              </>
                            )}
                            {sub.receiptId && (
                              <>
                                <Link
                                  href={`/dashboard/billing/receipts/${sub.receiptId}`}
                                  className="px-2.5 py-1 rounded-md border border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] text-[#17191D] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                  title="View Receipt"
                                >
                                  <Receipt className="w-3 h-3 text-[#667085]" />
                                  <span>View Receipt</span>
                                </Link>
                                <a
                                  href={`/api/billing/receipts/${sub.receiptId}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2 py-1 rounded-md bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                                  title="Download Receipt PDF"
                                >
                                  <Download className="w-3 h-3 text-[#5145CD]" />
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
