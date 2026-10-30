'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Logo } from '@/components/brand/Logo';
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Receipt as ReceiptIcon,
  CreditCard,
  Hash,
  ExternalLink,
  Coins,
  FileText,
  Clock,
  Sparkles,
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

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !receipt) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#667085]">Loading payment receipt...</p>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#FFFFFF] text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-8">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6 text-left relative">
          {/* Ambient Frosted Background Lights */}
          <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#5145CD]/10 blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-0" />

          {/* Top Actions Bar */}
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/dashboard/billing/receipts"
              className="text-xs text-[#667085] hover:text-[#5145CD] flex items-center gap-1.5 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Receipts</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-[#17191D] border border-white/60 shadow-xs backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#667085]" />
                <span>Print</span>
              </button>

              <a
                href={`/api/billing/receipts/${receipt.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Receipt (PDF)</span>
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* GLASS BLUR UI PAYMENT RECEIPT CONTAINER */}
          {/* ========================================================================= */}
          <div className="relative z-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-2xl shadow-[#5145CD]/5 overflow-hidden transition-all">
            {/* Top Brand Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5145CD] via-[#818CF8] to-[#10B981]" />

            <div className="p-6 sm:p-10 space-y-8">
              {/* Header: Official Brand Logo + Document Badge */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#E5E7EB]/80">
                <div className="space-y-2">
                  <Logo size="lg" />
                  <p className="text-xs text-[#667085] font-medium pl-0.5">
                    Payment Gateway Settlement Voucher • PayU India
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#667085]">
                    <span className="font-mono bg-white/60 px-2 py-0.5 rounded border border-[#E5E7EB] font-semibold">
                      MID: PayU Verified
                    </span>
                    <span className="font-mono bg-white/60 px-2 py-0.5 rounded border border-[#E5E7EB]">
                      Cryptographic Reconciled
                    </span>
                  </div>
                </div>

                <div className="sm:text-right space-y-2 self-stretch sm:self-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono uppercase shadow-2xs">
                    <ReceiptIcon className="w-3.5 h-3.5" />
                    <span>Payment Receipt</span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#17191D] font-mono tracking-tight">
                    {receipt.receiptNumber}
                  </h1>

                  <p className="text-xs text-[#667085] font-mono">
                    Settled:{' '}
                    {new Date(receipt.paymentDate).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              {/* Amount Highlight Card (Glassmorphic Frosted Box) */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/90 via-white/70 to-[#EEF2FF]/60 backdrop-blur-md border border-white/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider block">
                    Total Amount Received
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-[#5145CD] font-mono tracking-tight">
                    INR {receipt.amountReceived.toFixed(2)}
                  </div>
                  <p className="text-[11px] text-[#667085]">
                    Includes applicable Indian GST (18%) itemized on invoice
                  </p>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>TRANSACTION SETTLED</span>
                  </div>
                  <span className="text-[10px] text-[#667085] font-mono">
                    Ref: {receipt.verificationReference?.slice(0, 18) || 'VERIFIED'}
                  </span>
                </div>
              </div>

              {/* Settlement Parameters List (Frosted Glass Table) */}
              <div className="rounded-2xl border border-white/80 bg-white/60 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                  <span className="text-[#667085] font-medium">Customer Name:</span>
                  <strong className="text-[#17191D] font-semibold">{receipt.customerName}</strong>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                  <span className="text-[#667085] font-medium">Customer Email:</span>
                  <strong className="text-[#17191D] font-mono">{receipt.customerEmail}</strong>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                  <span className="text-[#667085] font-medium">Product / Plan Purchased:</span>
                  <strong className="text-[#17191D] font-bold text-sm text-right">
                    {receipt.productPurchased}
                  </strong>
                </div>

                {receipt.discountAmount && receipt.discountAmount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60 bg-pink-50/50 -mx-2 px-2 rounded-lg">
                    <span className="text-pink-800 font-semibold">Special Discount Applied:</span>
                    <span className="font-mono text-pink-700 font-bold">
                      Coupon {receipt.couponCode || 'FIRST20'} (-INR {receipt.discountAmount.toFixed(2)})
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                  <span className="text-[#667085] font-medium">Payment Channel:</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#17191D]">
                    <CreditCard className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>{receipt.paymentMethod || 'Online Gateway (PayU)'}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                  <span className="text-[#667085] font-medium">Merchant Order ID (txnid):</span>
                  <span className="font-mono text-[#17191D] font-bold">{receipt.txnid}</span>
                </div>

                {receipt.payuMihpayid && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                    <span className="text-[#667085] font-medium">PayU Gateway Reference (mihpayid):</span>
                    <span className="font-mono text-[#17191D]">{receipt.payuMihpayid}</span>
                  </div>
                )}

                {receipt.payuBankRefNum && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                    <span className="text-[#667085] font-medium">Bank Reference Number:</span>
                    <span className="font-mono text-[#17191D]">{receipt.payuBankRefNum}</span>
                  </div>
                )}

                {receipt.invoiceNumber && (
                  <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]/60">
                    <span className="text-[#667085] font-medium">Linked GST Tax Invoice:</span>
                    <Link
                      href={`/dashboard/billing/invoices/${receipt.invoiceId || receipt.invoiceNumber}`}
                      className="inline-flex items-center gap-1 font-mono text-[#5145CD] font-bold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{receipt.invoiceNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                <div className="flex justify-between items-center py-2">
                  <span className="text-[#667085] font-medium">Security Reference Hash:</span>
                  <span className="font-mono text-[10px] text-[#667085] truncate max-w-xs">
                    {receipt.verificationReference}
                  </span>
                </div>
              </div>

              {/* Statutory Note & Customer Support */}
              <div className="p-4 rounded-2xl bg-[#F7F8FA]/80 border border-[#E5E7EB]/80 text-[11px] text-[#667085] space-y-2">
                <div className="flex items-center gap-2 text-[#17191D] font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Computer-Generated Official Payment Receipt</span>
                </div>
                <p className="leading-relaxed">
                  {receipt.footerNotice ||
                    'Payment verified and settled against PayU merchant ledger. Credits are permanently provisioned and available in your workspace.'}
                </p>
                <p className="pt-1">
                  Need assistance or have billing questions? Contact our finance team at{' '}
                  <a href="mailto:billing@fluviaflow.ai" className="text-[#5145CD] underline font-semibold">
                    billing@fluviaflow.ai
                  </a>
                  .
                </p>
              </div>

              {/* Bottom Footer Stamp */}
              <div className="pt-4 border-t border-[#E5E7EB]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#667085]">
                <span>Fluvia Flow Inc. • Merchant Account ID Verified</span>
                <span>Protected by 256-bit SSL Gateway Encryption</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
