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
    <div className="min-h-screen bg-[#07080B] text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="h-16 border-b border-white/[0.08] bg-[#0B0C11] px-6 flex items-center justify-between">
        <Logo size="sm" />
        <Link
          href="/dashboard"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full p-6 sm:p-10 flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <div className="p-10 rounded-2xl bg-[#0E1017] border border-white/10 space-y-4 w-full">
            <div className="w-12 h-12 border-3 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white">Verifying Payment with PayU India...</h2>
            <p className="text-xs text-slate-400">
              Reconciling cryptographic reverse hash and confirming credit grant. Please do not close this window.
            </p>
          </div>
        ) : isSuccess ? (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0E1017] border border-emerald-500/30 space-y-6 w-full shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold font-mono uppercase text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                Payment Verified & Settled
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                Welcome to Fluvia Flow
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Your payment was processed securely by PayU. Your workspace credits are ready to spend immediately.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-left space-y-2.5">
              <div className="flex justify-between items-center text-slate-400">
                <span>Product / Plan:</span>
                <strong className="text-white font-semibold">{order?.productInfo || 'Fluvia Flow Credits'}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Amount Paid (INR):</span>
                <strong className="text-emerald-400 font-mono font-bold">
                  INR {order?.totalAmount ? order.totalAmount.toFixed(2) : '---'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Merchant Txn ID:</span>
                <span className="font-mono text-slate-200">{txnid}</span>
              </div>
              {order?.payuMihpayid && (
                <div className="flex justify-between items-center text-slate-400">
                  <span>PayU Payment ID:</span>
                  <span className="font-mono text-slate-200">{order.payuMihpayid}</span>
                </div>
              )}
              {invoice?.invoiceNumber && (
                <div className="flex justify-between items-center text-slate-400">
                  <span>GST Tax Invoice:</span>
                  <span className="font-mono text-sky-400">{invoice.invoiceNumber}</span>
                </div>
              )}
              {receipt?.receiptNumber && (
                <div className="flex justify-between items-center text-slate-400">
                  <span>Official Receipt:</span>
                  <span className="font-mono text-emerald-400">{receipt.receiptNumber}</span>
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
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Receipt (PDF)</span>
                  </a>
                )}

                {invoice?.id && (
                  <a
                    href={`/api/billing/invoices/${invoice.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span>Download Invoice (PDF)</span>
                  </a>
                )}
              </div>

              <Link
                href="/create"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all block text-center"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch AI Creative Studio</span>
              </Link>

              <Link
                href="/dashboard/billing"
                className="block text-xs text-slate-400 hover:text-white pt-2 transition-colors"
              >
                View Full Billing History & Receipts →
              </Link>
            </div>
          </div>
        ) : isPending ? (
          /* PENDING STATE */
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0E1017] border border-amber-500/30 space-y-6 w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold font-mono uppercase text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                Payment Under Verification
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-3">Confirmation Pending</h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                PayU has received your payment request and is awaiting clearance from your issuing bank. Your order has
                been preserved safely.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={checkVerification}
                className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-Check Status Now</span>
              </button>
              <Link
                href="/dashboard/billing"
                className="py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs flex items-center justify-center"
              >
                Go to Billing Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* FAILED / CANCELLED STATE */
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0E1017] border border-red-500/30 space-y-6 w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              {isCancelled ? <AlertTriangle className="w-8 h-8 text-amber-400" /> : <XCircle className="w-8 h-8" />}
            </div>

            <div>
              <span
                className={`text-[11px] font-bold font-mono uppercase px-3 py-1 rounded-full border ${
                  isCancelled
                    ? 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                    : 'text-red-400 bg-red-950/60 border-red-500/30'
                }`}
              >
                {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-3">
                {isCancelled ? 'Checkout Cancelled' : 'Transaction Declined'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                {errorMessage ||
                  (isCancelled
                    ? 'You cancelled the payment on the PayU gateway portal.'
                    : 'Your card issuer or UPI bank declined this transaction. No funds were debited.')}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="py-3 px-6 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center"
              >
                Try Another Payment Method
              </Link>
              <Link
                href="/dashboard"
                className="py-3 px-6 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-white/[0.08] px-6 flex items-center justify-center text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
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
        <div className="min-h-screen bg-[#07080B] text-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
