'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CreditCard,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Receipt,
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [txData, setTxData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch(`/api/billing/transactions/${params.id}`),
    ])
      .then(async ([authRes, res]) => {
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        setData(await authRes.json());
        if (res.ok) {
          setTxData(await res.json());
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [params.id, router]);

  if (isLoading || !txData) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const order = txData.order;
  const invoice = txData.invoice;
  const receipt = txData.receipt;

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

        <main className="flex-1 p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/billing/transactions"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Transactions</span>
            </Link>

            <div className="flex items-center gap-3">
              {receipt?.id && (
                <a
                  href={`/api/billing/receipts/${receipt.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Receipt PDF</span>
                </a>
              )}
              {invoice?.id && (
                <a
                  href={`/api/billing/invoices/${invoice.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>Invoice PDF</span>
                </a>
              )}
            </div>
          </div>

          {/* Main Transaction Card */}
          <div className="bg-[#12141C] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Merchant Transaction Record
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1 font-mono">{order.txnid}</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Ordered on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase font-bold border ${
                    order.status === 'success'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                      : order.status === 'pending'
                      ? 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                      : 'bg-red-950/80 text-red-400 border-red-500/30'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Payment Breakdown</span>
                <div className="flex justify-between text-slate-300">
                  <span>Product:</span>
                  <strong className="text-white">{order.productInfo}</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Base Taxable Amount:</span>
                  <span className="font-mono text-white">INR {order.baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>GST Rate:</span>
                  <span className="font-mono text-white">{order.taxBreakdown?.taxRate || 18}%</span>
                </div>
                {order.taxBreakdown?.cgstAmount > 0 ? (
                  <>
                    <div className="flex justify-between text-slate-300">
                      <span>CGST (9%):</span>
                      <span className="font-mono text-white">INR {order.taxBreakdown.cgstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>SGST (9%):</span>
                      <span className="font-mono text-white">INR {order.taxBreakdown.sgstAmount.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-slate-300">
                    <span>IGST (18%):</span>
                    <span className="font-mono text-white">INR {order.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-emerald-400 text-sm">INR {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* PayU Gateway Parameters */}
              <div className="space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">PayU Gateway Technical Identifiers</span>
                <div className="flex justify-between text-slate-300">
                  <span>Payment Gateway:</span>
                  <span className="font-semibold text-white">PayU India Hosted Checkout</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>PayU ID (mihpayid):</span>
                  <span className="font-mono text-slate-200">{order.payuMihpayid || 'Pending Gateway Return'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Bank Reference:</span>
                  <span className="font-mono text-slate-200">{order.payuBankRefNum || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Payment Channel:</span>
                  <span className="text-slate-200">{order.payuPaymentMode || 'UPI / NetBanking / Cards'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Idempotency Hash:</span>
                  <span className="font-mono text-[10px] text-slate-500 truncate max-w-xs">{order.idempotencyKey}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Snapshot */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl text-xs space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Customer Billing Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <span className="text-slate-500 block">Name:</span>
                  <strong className="text-white">{order.customerDetails?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Email:</span>
                  <span className="text-slate-300">{order.customerDetails?.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Place of Supply:</span>
                  <span className="text-slate-300">{order.customerDetails?.state || 'Delhi'}</span>
                </div>
              </div>
              {order.customerDetails?.gstin && (
                <div className="pt-2 text-[11px] text-slate-400">
                  <span>Customer GSTIN for Input Tax Credit: </span>
                  <strong className="text-emerald-400 font-mono">{order.customerDetails.gstin}</strong>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
