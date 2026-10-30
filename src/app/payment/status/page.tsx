'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Receipt as ReceiptIcon,
  Copy,
  Check,
  CreditCard,
  Calendar,
  Zap,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { LiquidGlassCard } from '@/components/billing/LiquidGlassCard';
import { AnimatedCheckmark } from '@/components/billing/AnimatedCheckmark';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || '';
  const urlStatus = searchParams.get('status') || '';
  const urlError = searchParams.get('error') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState(urlError);
  const [copiedTxn, setCopiedTxn] = useState(false);

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

  const copyTxnId = () => {
    if (txnid) {
      navigator.clipboard.writeText(txnid);
      setCopiedTxn(true);
      setTimeout(() => setCopiedTxn(false), 2000);
    }
  };

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
    <div className="min-h-screen bg-[#F7F8FA] text-[#17191D] flex flex-col justify-between relative overflow-hidden">
      {/* Ambient Frosted Background Lights */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#5145CD]/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-0" />

      {/* Top Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]/80 px-6 flex items-center justify-between shadow-2xs relative z-10">
        <Logo size="sm" />
        <Link
          href="/dashboard"
          className="text-xs text-[#667085] hover:text-[#5145CD] flex items-center gap-1.5 transition-colors font-semibold"
        >
          <span>Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 sm:py-10 flex flex-col items-center justify-center text-center relative z-10">
        {isLoading ? (
          <div className="p-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 space-y-4 w-full shadow-2xl shadow-[#5145CD]/5">
            <div className="w-12 h-12 border-3 border-[#5145CD] border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-[#17191D]">Verifying Settlement with PayU India...</h2>
            <p className="text-xs text-[#667085] max-w-md mx-auto">
              Reconciling cryptographic reverse hash and confirming credit grant. Please do not close this window.
            </p>
          </div>
        ) : isSuccess ? (
          /* SUCCESS STATE — FLOATING LIQUID GLASS RECEIPT CARD */
          <LiquidGlassCard
            interactive={true}
            tiltMax={3}
            className="w-full text-center"
          >
            {/* Top Brand Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#5145CD] via-[#818CF8] to-[#10B981]" />

            <div className="p-6 sm:p-8 space-y-6">
              {/* Header: Brand Logo & Animated Checkmark */}
              <div className="flex flex-col items-center gap-4">
                <Logo size="md" />
                <AnimatedCheckmark size={68} />
              </div>

              {/* Title & Status */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Payment Verified & Settled</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#17191D] mt-3 tracking-tight">
                  Payment Successful
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                  Funds cleared via PayU India. Your workspace credits are active immediately.
                </p>
              </div>

              {/* Prominent Amount Display Card */}
              <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#667085] tracking-wider block">
                  Amount Received
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#5145CD] font-mono tracking-tight">
                  INR {order?.totalAmount ? Number(order.totalAmount).toFixed(2) : '---'}
                </div>
                <div className="text-[11px] text-[#667085] pt-1">
                  Includes applicable GST (18%) • Zero additional gateway surcharge
                </div>
              </div>

              {/* Order Specifications Table */}
              <div className="p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-xs text-left space-y-3 shadow-xs">
                <div className="flex justify-between items-center text-[#667085]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Product / Pack:</span>
                  </span>
                  <strong className="text-[#17191D] font-bold text-right">
                    {order?.productInfo || 'Fluvia Flow Credits'}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-[#667085]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Payment Date:</span>
                  </span>
                  <span className="text-[#17191D] font-mono">
                    {new Date(order?.updatedAt || Date.now()).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#667085]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Payment Method:</span>
                  </span>
                  <span className="text-[#17191D] font-medium">
                    {order?.payuPaymentMode || 'PayU India (256-bit Secure)'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[#667085] pt-1 border-t border-[#E5E7EB]/60">
                  <span>Merchant Txn ID:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-[#17191D] font-semibold text-[11px]">{txnid}</span>
                    <button
                      type="button"
                      onClick={copyTxnId}
                      className="p-1 rounded text-[#667085] hover:text-[#5145CD] hover:bg-white/80 transition-colors"
                      title="Copy Txn ID"
                    >
                      {copiedTxn ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {order?.payuMihpayid && (
                  <div className="flex justify-between items-center text-[#667085]">
                    <span>PayU Payment ID:</span>
                    <span className="font-mono text-[#17191D] text-[11px]">{order.payuMihpayid}</span>
                  </div>
                )}

                {invoice?.invoiceNumber && (
                  <div className="flex justify-between items-center text-[#667085]">
                    <span>Tax Invoice:</span>
                    <Link
                      href={`/dashboard/billing/invoices/${invoice.id || invoice.invoiceNumber}`}
                      className="font-mono text-[#5145CD] font-bold hover:underline"
                    >
                      #{invoice.invoiceNumber}
                    </Link>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {receipt?.id && (
                    <a
                      href={`/api/billing/receipts/${receipt.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 bg-white/80 hover:bg-white text-[#17191D] border border-white/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs backdrop-blur-md"
                    >
                      <ReceiptIcon className="w-4 h-4 text-[#5145CD]" />
                      <span>Download Receipt</span>
                    </a>
                  )}

                  {invoice?.id && (
                    <Link
                      href={`/dashboard/billing/invoices/${invoice.id}`}
                      className="py-3 px-4 bg-white/80 hover:bg-white text-[#17191D] border border-white/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs backdrop-blur-md"
                    >
                      <FileText className="w-4 h-4 text-[#5145CD]" />
                      <span>View Tax Invoice</span>
                    </Link>
                  )}
                </div>

                <Link
                  href="/create"
                  className="w-full py-3.5 px-6 bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all block text-center cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Launch Creative AI Studio</span>
                </Link>

                <Link
                  href="/dashboard/billing"
                  className="block text-xs text-[#667085] hover:text-[#5145CD] pt-1 transition-colors font-semibold"
                >
                  View Full Billing History & Receipts →
                </Link>
              </div>
            </div>
          </LiquidGlassCard>
        ) : isPending ? (
          /* PENDING STATE */
          <div className="p-8 sm:p-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-amber-200/80 space-y-6 w-full text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
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
                className="py-3 px-6 bg-white/80 border border-[#E5E7EB] hover:bg-white text-[#17191D] font-semibold rounded-xl text-xs flex items-center justify-center backdrop-blur-md"
              >
                Go to Billing Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* FAILED / CANCELLED STATE */
          <div className="p-8 sm:p-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-rose-200/80 space-y-6 w-full text-center shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
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
                {isCancelled ? 'Checkout Cancelled' : 'Transaction Not Completed'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[#667085] max-w-md mx-auto">
                {errorMessage ||
                  (isCancelled
                    ? 'You cancelled the checkout session before completion. No funds were debited.'
                    : 'The payment gateway could not settle this transaction. Please try a different card, UPI or NetBanking method.')}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="py-3 px-6 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Retry Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/billing"
                className="py-3 px-6 bg-white/80 border border-[#E5E7EB] hover:bg-white text-[#17191D] font-semibold rounded-xl text-xs flex items-center justify-center backdrop-blur-md"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 border-t border-[#E5E7EB]/80 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between text-xs text-[#667085] relative z-10">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>PayU India Verified • 256-bit SSL Encrypted</span>
        </div>
        <span>Fluvia Flow Inc.</span>
      </footer>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
