'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || '';
  const urlStatus = searchParams.get('status') || '';
  const urlError = searchParams.get('error') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState(urlError);

  const checkVerification = async () => {
    setIsLoading(true);
    setErrorMessage('');

    if (!txnid) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/payments/payu/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid }),
      });

      const data = await res.json();
      if (res.ok) {
        setVerificationData(data);
      } else {
        setErrorMessage(data.error || 'Could not verify transaction with server.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Verification network request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkVerification();
  }, [txnid]);

  const order = verificationData?.order;
  const invoice = verificationData?.invoice;
  const receipt = verificationData?.receipt;
  const isSuccess =
    urlStatus === 'success' ||
    verificationData?.status === 'success' ||
    order?.status === 'success';

  const isPending =
    urlStatus === 'pending' ||
    verificationData?.status === 'pending' ||
    order?.status === 'pending';

  const isCancelled = urlStatus === 'cancelled' || order?.status === 'cancelled';

  return (
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shadow-2xs">
        <Logo size="sm" />
        <Link
          href="/dashboard"
          className="text-xs text-[#667085] hover:text-[#17191D] flex items-center gap-1.5 transition-colors font-medium"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <div className="p-10 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-4 w-full">
            <div className="w-12 h-12 border-3 border-[#5145CD] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-[#17191D]">Verifying Payment with PayU India...</h2>
            <p className="text-xs text-[#667085]">
              Reconciling cryptographic reverse hash and confirming credit grant. Please do not close this window.
            </p>
          </div>
        ) : isSuccess ? (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E5E7EB] space-y-6 w-full shadow-lg relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold font-mono uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Verified & Settled
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#17191D] mt-3">
                Welcome to Fluvia Flow
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#667085]">
                Your payment was processed securely by PayU. Your workspace credits are ready to spend immediately.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-left space-y-2.5">
              <div className="flex justify-between items-center text-[#667085]">
                <span>Product / Plan:</span>
                <strong className="text-[#17191D] font-semibold">{order?.productInfo || 'Fluvia Flow Credits'}</strong>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>Amount Paid (INR):</span>
                <strong className="text-[#5145CD] font-mono font-bold text-sm">
                  INR {order?.totalAmount ? order.totalAmount.toFixed(2) : '---'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>Merchant Txn ID:</span>
                <span className="font-mono text-[#17191D]">{txnid}</span>
              </div>
              {order?.payuMihpayid && (
                <div className="flex justify-between items-center text-[#667085]">
                  <span>PayU Payment ID:</span>
                  <span className="font-mono text-[#17191D]">{order.payuMihpayid}</span>
                </div>
              )}
              {invoice?.invoiceNumber && (
                <div className="flex justify-between items-center text-[#667085]">
                  <span>Invoice Number:</span>
                  <span className="font-mono text-[#5145CD] font-semibold">{invoice.invoiceNumber}</span>
                </div>
              )}
              {receipt?.receiptNumber && (
                <div className="flex justify-between items-center text-[#667085]">
                  <span>Official Receipt:</span>
                  <span className="font-mono text-[#5145CD] font-semibold">{receipt.receiptNumber}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {receipt?.id && (
                  <a
                    href={`/api/billing/receipts/${receipt.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Download className="w-4 h-4 text-[#5145CD]" />
                    <span>Download Receipt (PDF)</span>
                  </a>
                )}

                {invoice?.id && (
                  <a
                    href={`/api/billing/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-white border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <FileText className="w-4 h-4 text-[#5145CD]" />
                    <span>Download Invoice (PDF)</span>
                  </a>
                )}
              </div>

              <Link
                href="/create"
                className="w-full py-3.5 px-6 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all block text-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Launch AI Creative Studio</span>
              </Link>

              <Link
                href="/dashboard/billing"
                className="block text-xs text-[#667085] hover:text-[#5145CD] pt-2 transition-colors font-medium"
              >
                View Full Billing History & Receipts →
              </Link>
            </div>
          </div>
        ) : isPending ? (
          /* PENDING STATE */
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-amber-200 space-y-6 w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold font-mono uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Payment Under Verification
              </span>
              <h1 className="text-2xl font-bold text-[#17191D] mt-3">Confirmation Pending</h1>
              <p className="mt-2 text-xs sm:text-sm text-[#667085]">
                PayU has received your payment request and is awaiting clearance from your issuing bank. Your order has
                been preserved safely.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={checkVerification}
                className="py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-Check Status Now</span>
              </button>
              <Link
                href="/dashboard/billing"
                className="py-3 px-6 bg-white border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] font-semibold rounded-xl text-xs flex items-center justify-center"
              >
                Go to Billing Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* FAILED / CANCELLED STATE */
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-rose-200 space-y-6 w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              {isCancelled ? <AlertTriangle className="w-8 h-8 text-amber-500" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div>
              <span
                className={`text-[11px] font-bold font-mono uppercase px-3 py-1 rounded-full border ${
                  isCancelled
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-rose-800 bg-rose-50 border-rose-200'
                }`}
              >
                {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
              </span>
              <h1 className="text-2xl font-bold text-[#17191D] mt-3">
                {isCancelled ? 'Checkout Cancelled' : 'Transaction Declined'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#667085]">
                {errorMessage ||
                  (isCancelled
                    ? 'You cancelled the payment on the PayU gateway portal.'
                    : 'Your card issuer or UPI bank declined this transaction. No funds were debited.')}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="py-3 px-6 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs flex items-center justify-center shadow-xs cursor-pointer"
              >
                Try Another Payment Method
              </Link>
              <Link
                href="/dashboard"
                className="py-3 px-6 bg-white border border-[#E5E7EB] hover:bg-[#F7F8FA] text-[#17191D] font-semibold rounded-xl text-xs flex items-center justify-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 bg-white border-t border-[#E5E7EB] px-6 flex items-center justify-center text-xs text-[#667085]">
        <span className="flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5145CD]" />
          <span>PayU India Hosted Checkout — Official Merchant Integration</span>
        </span>
      </footer>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
