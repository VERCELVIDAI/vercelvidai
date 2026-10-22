'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CreditCard,
  Zap,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '@/components/brand/Logo';

const INDIAN_STATES = [
  'Delhi',
  'Maharashtra',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Gujarat',
  'Haryana',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Kerala',
  'Andhra Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Goa',
  'Other State / UT',
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemType = searchParams.get('type') || 'pack';
  const itemId = searchParams.get('id') || 'pack_1200';
  const interval = (searchParams.get('interval') || 'month') as 'month' | 'year';

  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('9876543210');
  const [customerState, setCustomerState] = useState('Delhi');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Item details
  const [itemDetails, setItemDetails] = useState<{
    name: string;
    description: string;
    basePrice: number;
    credits: number;
    isSubscription: boolean;
    intervalLabel?: string;
  }>({
    name: '1,200 Credits Studio Pack',
    description: 'Instant top-up credits for video, voice and image generation.',
    basePrice: 999,
    credits: 1200,
    isSubscription: false,
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.push(`/login?redirect=/checkout?type=${itemType}&id=${itemId}&interval=${interval}`);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setCustomerName(data.user.displayName || '');
          setCustomerEmail(data.user.email || '');
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingAuth(false));

    // Resolve plan or pack details
    if (itemType === 'pack') {
      const packs: Record<string, any> = {
        pack_500: { name: '500 Credits Boost', basePrice: 499, credits: 500 },
        pack_1200: { name: '1,200 Credits Studio', basePrice: 999, credits: 1200 },
        pack_3500: { name: '3,500 Credits Scale', basePrice: 2499, credits: 3500 },
        pack_10000: { name: '10,000 Credits Agency', basePrice: 5999, credits: 10000 },
      };
      const p = packs[itemId] || packs.pack_1200;
      setItemDetails({
        name: p.name,
        description: 'Instant creative computing credits. Valid for all models.',
        basePrice: p.basePrice,
        credits: p.credits,
        isSubscription: false,
      });
    } else {
      const plans: Record<string, any> = {
        plan_free: { name: 'Free Explorer', monthly: 0, annualPerMo: 0, credits: 60, desc: 'Testing workflows.' },
        plan_starter: { name: 'Fluvia Basic', monthly: 999, annualPerMo: 799, credits: 500, desc: '1080p Full HD exports with Fluvia Cinematic & Flux.' },
        plan_creator: { name: 'Fluvia Pro', monthly: 2499, annualPerMo: 1999, credits: 1600, desc: '4K Ultra HD exports, priority queue & timeline editor.' },
        plan_max: { name: 'Fluvia Max', monthly: 4999, annualPerMo: 3999, credits: 4000, desc: '4K 60fps cinema master, dedicated GPU & Gemini storyboard.' },
        plan_business: { name: 'Fluvia Teams', monthly: 9999, annualPerMo: 7999, credits: 10000, desc: 'Multi-seat team workspace, shared wallet & custom SLA.' },
      };
      const pl = plans[itemId] || plans.plan_creator;
      const isAnnual = interval === 'year';
      const calculatedPrice = isAnnual ? pl.annualPerMo * 12 : pl.monthly;

      setItemDetails({
        name: pl.name,
        description: pl.desc,
        basePrice: calculatedPrice,
        credits: pl.credits,
        isSubscription: true,
        intervalLabel: isAnnual ? `Annual (₹${pl.annualPerMo}/mo billed ₹${calculatedPrice}/yr)` : 'Monthly',
      });
    }
  }, [itemType, itemId, interval, router]);

  // Tax calculation
  const isInterState = customerState !== 'Delhi';
  const taxRate = 18;
  const taxAmount = Math.round((itemDetails.basePrice * taxRate) / 100 * 100) / 100;
  const totalAmount = Math.round((itemDetails.basePrice + taxAmount) * 100) / 100;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please fill in your name, email, and mobile phone number.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to proceed.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/payu/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: itemType === 'pack' ? 'credit_pack' : 'subscription',
          itemPlanOrPackId: itemId,
          billingInterval: interval,
          customerDetails: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            state: customerState,
            address: customerAddress,
            gstin: customerGstin,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to initialize PayU payment order');
      }

      const { payuParams } = await res.json();

      // Submit Form directly to PayU Hosted Checkout Gateway
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuParams.actionUrl;

      Object.entries(payuParams).forEach(([k, v]) => {
        if (k !== 'actionUrl') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = String(v);
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Payment initiation failed.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#07080B] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      {/* Top Header */}
      <header
        className="h-16 border-b px-6 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--app-surface)',
          borderColor: 'var(--app-card-border)',
        }}
      >
        <Link href="/pricing" className="flex items-center gap-2 text-xs opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pricing</span>
        </Link>
        <Logo size="sm" />
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit Encrypted PayU Checkout</span>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Complete Your Order</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Secure checkout powered by PayU India. Instant credit fulfillment with official GST tax invoice.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Billing Details Form */}
          <div className="lg:col-span-7 bg-[#0E1017] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <Building2 className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-bold text-white">Billing Information</h2>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    placeholder="e.g. Aria Vance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    placeholder="creator@fluviaflow.ai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone (PayU Mobile) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                    placeholder="10-digit mobile"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    State / Place of Supply <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#141722]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Billing Address <span className="text-slate-500">(Optional for Individual)</span>
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  placeholder="Street address, city, pincode"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  GSTIN <span className="text-slate-500">(Optional for B2B Input Tax Credit)</span>
                </label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                  className="w-full bg-[#141722] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  maxLength={15}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Provide your 15-character GSTIN to receive an official B2B tax invoice.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                  />
                  <span>
                    I accept the{' '}
                    <Link href="/terms" target="_blank" className="text-violet-400 underline">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link href="/refund-policy" target="_blank" className="text-violet-400 underline">
                      Refund Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Connecting to PayU...' : `Continue to Pay INR ${totalAmount.toFixed(2)}`}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> UPI (GPay, PhonePe, Paytm)
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Credit / Debit Cards
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Net Banking
                </span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-5 bg-[#0E1017] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-white pb-4 border-b border-white/10">Order Summary</h2>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{itemDetails.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{itemDetails.description}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/5">
                <span>Credits Included:</span>
                <strong className="text-violet-400 font-mono font-bold">
                  {itemDetails.credits.toLocaleString()} Credits
                </strong>
              </div>

              {itemDetails.intervalLabel && (
                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/5">
                  <span>Billing Cycle:</span>
                  <span className="text-emerald-400 font-semibold">{itemDetails.intervalLabel}</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base Plan Price:</span>
                <span className="text-white font-mono">INR {itemDetails.basePrice.toFixed(2)}</span>
              </div>

              {isInterState ? (
                <div className="flex justify-between text-slate-400">
                  <span>IGST @ 18%:</span>
                  <span className="text-white font-mono">INR {taxAmount.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST @ 9%:</span>
                    <span className="text-white font-mono">INR {(taxAmount / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SGST @ 9%:</span>
                    <span className="text-white font-mono">INR {(taxAmount / 2).toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Payable Amount:</span>
                <span className="text-lg font-extrabold text-violet-400 font-mono">
                  INR {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Satisfaction / Guarantee info */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-violet-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Instant Crediting & GST Tax Invoice</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Your credits are added to your wallet automatically upon confirmation. You will be able to download your
                official GST invoice and payment receipt immediately.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080B] text-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
