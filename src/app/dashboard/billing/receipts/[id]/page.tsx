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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

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

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6 text-left">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/billing/receipts"
              className="text-xs text-[#667085] hover:text-[#5145CD] flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Receipts</span>
            </Link>

            <a
              href={`/api/billing/receipts/${receipt.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt (PDF)</span>
            </a>
          </div>

          {/* Visual Receipt Paper */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 space-y-8 border border-[#E5E7EB] shadow-xs relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E5E7EB]">
              <div>
                <span className="text-xl font-bold text-[#17191D] tracking-tight">
                  FLUVIA <span className="text-[#5145CD]">FLOW</span>
                </span>
                <p className="text-xs text-[#667085] mt-0.5">Payment Gateway Settlement Voucher</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono uppercase font-semibold text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-md border border-[#5145CD]/20">
                  Official Receipt
                </span>
                <h1 className="text-xl font-bold text-[#17191D] mt-2 font-mono">{receipt.receiptNumber}</h1>
                <p className="text-xs text-[#667085] mt-1">
                  Settled: {new Date(receipt.paymentDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>

            {/* Total Amount Box */}
            <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-[#667085] font-semibold uppercase tracking-wider">Total Amount Received</span>
                <div className="text-3xl font-black text-[#5145CD] font-mono mt-1">
                  INR {receipt.amountReceived.toFixed(2)}
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>VERIFIED SUCCESS</span>
              </div>
            </div>

            {/* Verification Parameters List */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-[#667085]">Customer Name:</span>
                <strong className="text-[#17191D]">{receipt.customerName}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-[#667085]">Customer Email:</span>
                <strong className="text-[#17191D]">{receipt.customerEmail}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-[#667085]">Product / Plan Purchased:</span>
                <strong className="text-[#17191D]">{receipt.productPurchased}</strong>
              </div>
              {receipt.discountAmount && receipt.discountAmount > 0 && (
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">Discount Applied:</span>
                  <span className="font-mono text-[#5145CD] font-bold">
                    Coupon {receipt.couponCode || 'PROMO'} (-INR {receipt.discountAmount.toFixed(2)})
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-[#667085]">Payment Channel:</span>
                <strong className="text-[#17191D]">{receipt.paymentMethod}</strong>
              </div>
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-[#667085]">Merchant Txn ID:</span>
                <span className="font-mono text-[#17191D]">{receipt.txnid}</span>
              </div>
              {receipt.payuMihpayid && (
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">PayU Payment Ref (mihpayid):</span>
                  <span className="font-mono text-[#17191D]">{receipt.payuMihpayid}</span>
                </div>
              )}
              {receipt.payuBankRefNum && (
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">Bank Reference Number:</span>
                  <span className="font-mono text-[#17191D]">{receipt.payuBankRefNum}</span>
                </div>
              )}
              {receipt.invoiceNumber && (
                <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                  <span className="text-[#667085]">Linked Invoice:</span>
                  <Link
                    href={`/dashboard/billing/invoices/${receipt.invoiceId || receipt.invoiceNumber}`}
                    className="font-mono text-[#5145CD] font-semibold hover:underline"
                  >
                    {receipt.invoiceNumber}
                  </Link>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-[#E5E7EB]">
                <span className="text-[#667085]">Cryptographic Reference:</span>
                <span className="font-mono text-[11px] text-[#667085]">{receipt.verificationReference}</span>
              </div>
            </div>

            {/* Mandatory Footer Notice */}
            <div className="pt-4 border-t border-[#E5E7EB] text-[11px] text-[#667085] leading-relaxed space-y-1">
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
