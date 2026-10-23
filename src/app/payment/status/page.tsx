'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    <div className="min-h-screen text-[#17211D] flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 glass-navbar border-b border-emerald-500/10 px-6 flex items-center justify-between">
        <Logo size="sm" />
        <Link
          href="/dashboard"
          className="text-xs text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors font-medium"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <div className="p-10 rounded-3xl glass-card space-y-4 w-full">
            <div className="w-12 h-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-[#17211D]">Verifying Payment with PayU India...</h2>
            <p className="text-xs text-slate-600">
              Reconciling cryptographic reverse hash and confirming credit grant. Please do not close this window.
            </p>
          </div>
        ) : isSuccess ? (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-10 rounded-3xl glass-card border-emerald-500/30 space-y-6 w-full shadow-xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold font-mono uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-500/30">
                Payment Verified & Settled
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] mt-3">
                Welcome to Fluvia Flow
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                Your payment was processed securely by PayU. Your workspace credits are ready to spend immediately.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-500/15 text-xs text-left space-y-2.5">
              <div className="flex justify-between items-center text-slate-600">
                <span>Product / Plan:</span>
                <strong className="text-[#17211D] font-semibold">{order?.productInfo || 'Fluvia Flow Credits'}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Amount Paid (INR):</span>
                <strong className="text-emerald-700 font-mono font-bold text-sm">
                  INR {order?.totalAmount ? order.totalAmount.toFixed(2) : '---'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Merchant Txn ID:</span>
                <span className="font-mono text-slate-800">{txnid}</span>
              </div>
              {order?.payuMihpayid && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>PayU Payment ID:</span>
                  <span className="font-mono text-slate-800">{order.payuMihpayid}</span>
                </div>
              )}
              {invoice?.invoiceNumber && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Invoice Number:</span>
                  <span className="font-mono text-teal-700 font-semibold">{invoice.invoiceNumber}</span>
                </div>
              )}
              {receipt?.receiptNumber && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Official Receipt:</span>
                  <span className="font-mono text-emerald-700 font-semibold">{receipt.receiptNumber}</span>
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
                    className="py-3 px-4 glass-button text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors hover:text-emerald-700 hover:border-emerald-400"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Download Receipt (PDF)</span>
                  </a>
                )}

                {invoice?.id && (
                  <a
                    href={`/api/billing/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 glass-button text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors hover:text-emerald-700 hover:border-emerald-400"
                  >
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Download Invoice (PDF)</span>
                  </a>
                )}
              </div>

              <Link
                href="/create"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all block text-center"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Launch AI Creative Studio</span>
              </Link>

              <Link
                href="/dashboard/billing"
                className="block text-xs text-slate-600 hover:text-emerald-700 pt-2 transition-colors font-medium"
              >
                View Full Billing History & Receipts →
              </Link>
            </div>
          </div>
        ) : isPending ? (
          /* PENDING STATE */
          <div className="p-8 sm:p-10 rounded-3xl glass-card border-amber-500/30 space-y-6 w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold font-mono uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-500/30">
                Payment Under Verification
              </span>
              <h1 className="text-2xl font-extrabold text-[#17211D] mt-3">Confirmation Pending</h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                PayU has received your payment request and is awaiting clearance from your issuing bank. Your order has
                been preserved safely.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={checkVerification}
                className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-Check Status Now</span>
              </button>
              <Link
                href="/dashboard/billing"
                className="py-3 px-6 glass-button text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center"
              >
                Go to Billing Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* FAILED / CANCELLED STATE */
          <div className="p-8 sm:p-10 rounded-3xl glass-card border-rose-500/30 space-y-6 w-full text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              {isCancelled ? <AlertTriangle className="w-8 h-8 text-amber-600" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div>
              <span
                className={`text-[11px] font-bold font-mono uppercase px-3 py-1 rounded-full border ${
                  isCancelled
                    ? 'text-amber-700 bg-amber-50 border-amber-500/30'
                    : 'text-rose-700 bg-rose-50 border-rose-500/30'
                }`}
              >
                {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
              </span>
              <h1 className="text-2xl font-extrabold text-[#17211D] mt-3">
                {isCancelled ? 'Checkout Cancelled' : 'Transaction Declined'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600">
                {errorMessage ||
                  (isCancelled
                    ? 'You cancelled the payment on the PayU gateway portal.'
                    : 'Your card issuer or UPI bank declined this transaction. No funds were debited.')}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center shadow-sm"
              >
                Try Another Payment Method
              </Link>
              <Link
                href="/dashboard"
                className="py-3 px-6 glass-button text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 glass-navbar border-t border-emerald-500/10 px-6 flex items-center justify-center text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
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
        <div className="min-h-screen text-[#17211D] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
