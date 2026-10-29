'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CreditCard,
  Zap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Tag,
  X,
  Loader2,
  Clock,
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
  const itemId = searchParams.get('id') || 'pack_5000';
  const interval = (searchParams.get('interval') || 'month') as 'month' | 'year';
  const initialCoupon = searchParams.get('coupon') || searchParams.get('code') || '';

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
  const isSubmittingRef = useRef(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle countdown for rate-limit cooldown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const intervalId = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [cooldownSeconds]);

  // Coupon state
  const [couponInput, setCouponInput] = useState(initialCoupon);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponPricing, setCouponPricing] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Item details
  const [itemDetails, setItemDetails] = useState<{
    name: string;
    description: string;
    basePrice: number;
    credits: number;
    isSubscription: boolean;
    intervalLabel?: string;
  }>({
    name: '5,000 Credits Pro Top-Up Pack',
    description: 'Instant top-up credits for video, voice and image generation.',
    basePrice: 6500,
    credits: 5000,
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
        pack_1000: { name: '1,000 Credits Starter Pack', basePrice: 1400, credits: 1000 },
        pack_1200: { name: '1,200 Credits Studio', basePrice: 999, credits: 1200 },
        pack_2500: { name: '2,500 Credits Growth Pack', basePrice: 3400, credits: 2500 },
        pack_3500: { name: '3,500 Credits Scale', basePrice: 2499, credits: 3500 },
        pack_5000: { name: '5,000 Credits Pro Top-Up', basePrice: 6500, credits: 5000 },
        pack_10000: { name: '10,000 Credits Agency Pack', basePrice: 12500, credits: 10000 },
        pack_25000: { name: '25,000 Credits Enterprise Pack', basePrice: 29000, credits: 25000 },
      };
      const p = packs[itemId] || packs.pack_5000;
      setItemDetails({
        name: p.name,
        description: 'Instant creative computing credits. Valid for all models.',
        basePrice: p.basePrice,
        credits: p.credits,
        isSubscription: false,
      });
    } else {
      const plans: Record<string, any> = {
        plan_starter: { name: 'Fluvia Basic', monthly: 999, annualPerMo: 799, credits: 500, desc: '1080p Full HD exports with Fluvia Cinematic & Flux.' },
        plan_creator: { name: 'Fluvia Pro', monthly: 2499, annualPerMo: 1999, credits: 1600, desc: '4K Ultra HD exports, priority queue & timeline editor.' },
        plan_max: { name: 'Fluvia Max', monthly: 4999, annualPerMo: 3999, credits: 4000, desc: '4K 60fps cinema master, dedicated GPU & Gemini storyboard.' },
        plan_business: { name: 'Fluvia Teams', monthly: 9999, annualPerMo: 7999, credits: 10000, desc: 'Multi-seat team workspace, shared wallet & custom SLA.' },
      };
      const pl = plans[itemId] || plans.plan_max;
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

  // If initial coupon passed in URL (e.g. FIRST20), validate and apply it
  useEffect(() => {
    if (initialCoupon && !appliedCoupon) {
      handleApplyCoupon(initialCoupon, true);
    }
  }, [initialCoupon]);

  // Revalidate coupon if item, interval, or state changes
  useEffect(() => {
    if (appliedCoupon?.code) {
      handleApplyCoupon(appliedCoupon.code, false);
    }
  }, [itemType, itemId, interval, customerState]);

  const handleApplyCoupon = async (codeToValidate?: string, showSuccessMsg = true) => {
    const code = (codeToValidate || couponInput).trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      setCouponSuccess('');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError('');
    if (showSuccessMsg) setCouponSuccess('');

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          paymentType: itemType === 'pack' ? 'credit_pack' : 'subscription',
          itemPlanOrPackId: itemId,
          billingInterval: interval,
          customerState,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Invalid or expired coupon code.');
        setAppliedCoupon(null);
        setCouponPricing(null);
      } else {
        setAppliedCoupon(data.coupon);
        setCouponPricing(data.pricing);
        if (showSuccessMsg) {
          setCouponSuccess(`Coupon ${data.coupon.code} applied! Saved INR ${data.pricing.discountAmount.toFixed(2)}.`);
        }
      }
    } catch {
      setCouponError('Network error while validating coupon. Please try again.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponPricing(null);
    setCouponInput('');
    setCouponError('');
    setCouponSuccess('');
  };

  // Tax and pricing calculation
  const isInterState = customerState !== 'Delhi';
  const taxRate = 18;
  const finalBasePrice = couponPricing ? couponPricing.discountedBaseAmount : itemDetails.basePrice;
  const discountAmount = couponPricing ? couponPricing.discountAmount : 0;
  const taxAmount = couponPricing ? couponPricing.taxAmount : Math.round(((finalBasePrice * taxRate) / 100) * 100) / 100;
  const totalAmount = couponPricing ? couponPricing.totalAmount : Math.round((finalBasePrice + taxAmount) * 100) / 100;
  const isZeroPayable = couponPricing?.isZeroPayable || totalAmount === 0;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current || isSubmitting || cooldownSeconds > 0) {
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please fill in your name, email, and mobile phone number.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to proceed.');
      return;
    }

    isSubmittingRef.current = true;
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
          couponCode: appliedCoupon?.code,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        if (res.status === 429) {
          setCooldownSeconds(errData.retryAfter || 60);
          throw new Error(errData.error || 'Too many requests. Please wait before retrying.');
        }
        throw new Error(errData.error || 'Failed to initiate payment.');
      }

      const orderData = await res.json();

      if (orderData.isZeroPayment && orderData.redirectUrl) {
        window.location.href = orderData.redirectUrl;
        return;
      }

      const { payuParams } = orderData;
      if (!payuParams || !payuParams.actionUrl) {
        throw new Error('Payment gateway parameters missing.');
      }

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
      console.error('Payment initiation error:', err);
      setErrorMessage(err.message || 'Payment initiation failed.');
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMessage('Please fill in your name, email, and mobile phone number.');
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
          couponCode: appliedCoupon?.code,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to initialize payment order');
      }

      const orderData = await res.json();
      if (orderData.isZeroPayment && orderData.redirectUrl) {
        window.location.href = orderData.redirectUrl;
        return;
      }

      const simRes = await fetch('/api/payments/payu/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnid: orderData.order.txnid }),
      });

      if (!simRes.ok) {
        const simData = await simRes.json();
        throw new Error(simData.error || 'Simulation failed');
      }

      window.location.href = `/payment/status?txnid=${encodeURIComponent(orderData.order.txnid)}&status=success`;
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment simulation failed.');
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#17191D]">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-8 flex items-center justify-between">
        <Link href="/pricing" className="flex items-center gap-2 text-xs text-[#667085] hover:text-[#17191D] font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Pricing</span>
        </Link>
        <Logo size="sm" />
        <div className="flex items-center gap-1.5 sm:gap-2 text-[#5145CD] text-[11px] sm:text-xs font-medium">
          <Lock className="w-3.5 h-3.5 text-[#5145CD] shrink-0" />
          <span>PayU India Verified</span>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:p-10 text-left">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight">Complete Your Order</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#667085]">
            Secure checkout powered by PayU India. Instant credit fulfillment with official tax invoice.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Billing Details Form */}
          <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-[#E5E7EB]">
              <Building2 className="w-5 h-5 text-[#5145CD]" />
              <h2 className="text-base font-bold text-[#17191D]">Billing Information</h2>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17191D] mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 placeholder:text-[#667085]/60"
                    placeholder="e.g. Alex Vance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17191D] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 placeholder:text-[#667085]/60"
                    placeholder="creator@fluviaflow.ai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17191D] mb-1.5">
                    Phone (PayU Mobile) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 font-mono placeholder:text-[#667085]/60"
                    placeholder="10-digit mobile"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17191D] mb-1.5">
                    State / Place of Supply <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 cursor-pointer"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17191D] mb-1.5">
                  Billing Address <span className="text-[#667085] font-normal">(Optional for Individual)</span>
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 placeholder:text-[#667085]/60"
                  placeholder="Street address, city, pincode"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17191D] mb-1.5">
                  Tax ID / GSTIN <span className="text-[#667085] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                  className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:ring-2 focus:ring-[#5145CD]/20 font-mono placeholder:text-[#667085]/60"
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  maxLength={15}
                />
                <p className="mt-1 text-[11px] text-[#667085]">
                  Include your GSTIN if you require tax input credit on your company invoice.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#667085]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#E5E7EB] text-[#5145CD] focus:ring-[#5145CD] cursor-pointer"
                  />
                  <span>
                    I accept the{' '}
                    <Link href="/terms" target="_blank" className="text-[#5145CD] underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link href="/refund-policy" target="_blank" className="text-[#5145CD] underline font-medium">
                      Refund Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-4">
                {cooldownSeconds > 0 && (
                  <div className="mb-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 shadow-2xs">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold">Rate Limit Protection Active</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        Please wait{' '}
                        <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                          {cooldownSeconds}s
                        </span>{' '}
                        before attempting payment again to prevent PayU gateway throttling.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || cooldownSeconds > 0}
                  className="w-full py-3.5 px-6 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to PayU Secure Gateway...</span>
                    </>
                  ) : cooldownSeconds > 0 ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Retry Available in {cooldownSeconds}s</span>
                    </>
                  ) : isZeroPayable ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Claim Free Order (INR 0.00)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Continue to Pay INR {totalAmount.toFixed(2)}</span>
                    </>
                  )}
                </button>

                {/* Gateway Status Banner */}
                {!isZeroPayable && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#5145CD] font-medium bg-[#EEF2FF] border border-[#5145CD]/20 rounded-xl py-2 px-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5145CD] shrink-0" />
                    <span>PayU Live Production Gateway • 256-Bit SSL Encrypted</span>
                  </div>
                )}

                {/* Local Sandbox Simulator (Visible in test mode) */}
                {!isZeroPayable && process.env.NEXT_PUBLIC_PAYU_ENV === 'test' && (
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isSubmitting}
                      className="text-[11px] text-[#5145CD] hover:underline font-medium transition-colors cursor-pointer"
                    >
                      Developer Sandbox: Test Immediate Fulfillment & Invoice Clearance →
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-[11px] text-[#667085] font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5145CD] shrink-0" /> UPI (GPay, PhonePe, Paytm)
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5145CD] shrink-0" /> Credit / Debit Cards
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5145CD] shrink-0" /> Net Banking
                </span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-[#17191D] pb-4 border-b border-[#E5E7EB]">Order Summary</h2>

            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#17191D]">{itemDetails.name}</h3>
                  <p className="text-xs text-[#667085] mt-0.5">{itemDetails.description}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#5145CD]/10 text-[#5145CD] flex items-center justify-center shrink-0 border border-[#5145CD]/20">
                  <Zap className="w-4 h-4 text-[#5145CD]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#667085] pt-2 border-t border-[#E5E7EB]">
                <span>Credits Included:</span>
                <strong className="text-[#5145CD] font-mono font-bold">
                  {itemDetails.credits.toLocaleString()} Credits
                </strong>
              </div>

              {itemDetails.intervalLabel && (
                <div className="flex items-center justify-between text-xs text-[#667085] pt-2 border-t border-[#E5E7EB]">
                  <span>Billing Cycle:</span>
                  <span className="text-[#17191D] font-semibold">{itemDetails.intervalLabel}</span>
                </div>
              )}
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#17191D] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>Have a promo code?</span>
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#EEF2FF] border border-[#5145CD]/30 text-xs">
                  <div className="flex items-center gap-2 text-[#5145CD] font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#5145CD] shrink-0" />
                    <span>{appliedCoupon.code}</span>
                    <span className="text-[#667085] font-normal font-sans text-[11px]">
                      ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `INR ${appliedCoupon.discountValue} off`})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded hover:bg-slate-200 text-[#667085] hover:text-rose-600 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      if (couponError) setCouponError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    placeholder="e.g. FIRST20"
                    className="flex-1 bg-white rounded-xl px-3 py-2 text-xs text-[#17191D] font-mono uppercase border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] placeholder:text-[#667085]/60"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isValidatingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isValidatingCoupon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              )}

              {couponSuccess && (
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{couponSuccess}</span>
                </p>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#667085]">
                <span>Base Price:</span>
                <span className={`text-[#17191D] font-mono font-medium ${appliedCoupon ? 'line-through text-[#667085]' : ''}`}>
                  INR {itemDetails.basePrice.toFixed(2)}
                </span>
              </div>

              {appliedCoupon && couponPricing && (
                <>
                  <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 shrink-0" />
                      <span>Coupon: {appliedCoupon.code}</span>
                    </span>
                    <span className="font-bold">-INR {couponPricing.discountAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#667085]">
                    <span>Discounted Base:</span>
                    <span className="text-[#17191D] font-mono font-medium">
                      INR {couponPricing.discountedBaseAmount.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between text-[#667085]">
                  <span>GST (18% {isInterState ? 'IGST' : 'CGST + SGST'}):</span>
                  <span className="text-[#17191D] font-mono font-medium">INR {taxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#17191D]">Total Payable:</span>
                <span className="text-lg font-bold text-[#5145CD] font-mono">
                  INR {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Satisfaction / Guarantee info */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs text-[#667085] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-[#17191D]">
                <ShieldCheck className="w-4 h-4 text-[#5145CD]" />
                <span>Instant Crediting & Official Tax Invoice</span>
              </div>
              <p className="text-[11px] text-[#667085] leading-relaxed">
                Credits are added to your Fluvia workspace wallet immediately upon confirmation. You will be able to download your
                official GST invoice and receipt immediately.
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
        <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
