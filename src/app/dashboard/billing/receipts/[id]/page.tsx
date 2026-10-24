'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Download,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function ReceiptDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch(`/api/billing/receipts/${params.id}`),
    ])
      .then(async ([authRes, rcpRes]) => {
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        setData(await authRes.json());
        if (rcpRes.ok) {
          const rcpData = await rcpRes.json();
          setReceipt(rcpData.receipt);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [params.id, router]);

  if (isLoading || !receipt) {
    return (
      <div className="min-h-screen text-[#17211D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

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

        <main className="flex-1 p-6 sm:p-8 max-w-3xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/billing/receipts"
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Receipts</span>
            </Link>

            <a
              href={`/api/billing/receipts/${receipt.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt (PDF)</span>
            </a>
          </div>

          {/* Visual Receipt Paper */}
          <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-emerald-500/10">
              <div>
                <span className="text-xl font-extrabold text-[#17211D] tracking-tight">
                  FLUVIA <span className="text-emerald-600">FLOW</span>
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Payment Gateway Settlement Voucher</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-500/30">
                  Official Receipt
                </span>
                <h1 className="text-xl font-black text-[#17211D] mt-2 font-mono">{receipt.receiptNumber}</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Settled: {new Date(receipt.paymentDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>

            {/* Total Amount Box */}
            <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-500/15 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase">Total Amount Received</span>
                <div className="text-3xl font-black text-emerald-700 font-mono mt-1">
                  INR {receipt.amountReceived.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>VERIFIED SUCCESS</span>
              </div>
            </div>

            {/* Verification Parameters List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-emerald-500/10">
                <span className="text-slate-500">Customer Name:</span>
                <strong className="text-[#17211D]">{receipt.customerName}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-500/10">
                <span className="text-slate-500">Customer Email:</span>
                <strong className="text-[#17211D]">{receipt.customerEmail}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-500/10">
                <span className="text-slate-500">Product / Plan Purchased:</span>
                <strong className="text-[#17211D]">{receipt.productPurchased}</strong>
              </div>
              {receipt.discountAmount && receipt.discountAmount > 0 && (
                <div className="flex justify-between py-2 border-b border-emerald-500/10">
                  <span className="text-slate-500">Discount Applied:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    Coupon {receipt.couponCode || 'PROMO'} (-INR {receipt.discountAmount.toFixed(2)})
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-emerald-500/10">
                <span className="text-slate-500">Payment Channel:</span>
                <strong className="text-[#17211D]">{receipt.paymentMethod}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-emerald-500/10">
                <span className="text-slate-500">Merchant Txn ID:</span>
                <span className="font-mono text-slate-700">{receipt.txnid}</span>
              </div>
              {receipt.payuMihpayid && (
                <div className="flex justify-between py-2 border-b border-emerald-500/10">
                  <span className="text-slate-500">PayU Payment Ref (mihpayid):</span>
                  <span className="font-mono text-slate-700">{receipt.payuMihpayid}</span>
                </div>
              )}
              {receipt.payuBankRefNum && (
                <div className="flex justify-between py-2 border-b border-emerald-500/10">
                  <span className="text-slate-500">Bank Reference Number:</span>
                  <span className="font-mono text-slate-700">{receipt.payuBankRefNum}</span>
                </div>
              )}
              {receipt.invoiceNumber && (
                <div className="flex justify-between py-2 border-b border-emerald-500/10">
                  <span className="text-slate-500">Linked Invoice:</span>
                  <Link
                    href={`/dashboard/billing/invoices/${receipt.invoiceId || receipt.invoiceNumber}`}
                    className="font-mono text-teal-700 font-semibold hover:underline"
                  >
                    {receipt.invoiceNumber}
                  </Link>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-emerald-500/10">
                <span className="text-slate-500">Cryptographic Reference:</span>
                <span className="font-mono text-[11px] text-slate-600">{receipt.verificationReference}</span>
              </div>
            </div>

            {/* Mandatory Footer Notice */}
            <div className="pt-4 border-t border-emerald-500/10 text-[11px] text-slate-500 leading-relaxed space-y-1">
              <p className="italic">
                {receipt.footerNotice ||
                  'Computer-generated payment receipt. Payment status is subject to verification against the merchant payment records.'}
              </p>
              <p>For questions or assistance with your order, please reach out to billing@fluviaflow.ai.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
