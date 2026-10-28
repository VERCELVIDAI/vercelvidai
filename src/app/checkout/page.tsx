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
  Sparkles,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
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
  const [couponInput, setCouponInput] = useState('');
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

    // Prevent double-clicks, burst submissions, or submissions during cooldown
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
        const errData = await res.json().catch(() => ({}));
        if (res.status === 429 || errData.code === 'RATE_LIMITED' || errData.retryAfter) {
          const waitTime = errData.retryAfter || 60;
          setCooldownSeconds(waitTime);
          throw new Error(
            errData.error ||
            `Sorry, we are unable to process your payment due to Too many Requests. Please try after ${waitTime} seconds.`
          );
        }
        throw new Error(errData.error || 'Failed to initialize payment order');
      }

      const orderData = await res.json();

      // Zero-payment / 100% discount free checkout flow
      if (orderData.isZeroPayment && orderData.redirectUrl) {
        window.location.href = orderData.redirectUrl;
        return;
      }

      const { payuParams } = orderData;
      if (!payuParams) {
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
      // Keep isSubmitting true and lock held while navigating to PayU
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
      <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#100A12] text-[#F5EAF4]">
      {/* Top Header */}
      <header className="h-16 bg-[#211522] border-b border-[#39233B] px-4 sm:px-6 flex items-center justify-between">
        <Link href="/pricing" className="flex items-center gap-2 text-xs text-[#A99AAA] hover:text-[#F5EAF4] font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Pricing</span>
        </Link>
        <Logo size="sm" />
        <div className="flex items-center gap-1.5 sm:gap-2 text-[#F05BCE] text-[11px] sm:text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5 text-[#F05BCE] shrink-0" />
          <span>PayU India Verified</span>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:p-10 text-left">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#F5EAF4]">Complete Your Order</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#A99AAA]">
            Secure checkout powered by PayU India. Instant credit fulfillment with official invoice.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Billing Details Form */}
          <div className="lg:col-span-7 bg-[#211522] border border-[#39233B] rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 pb-4 border-b border-[#39233B]">
              <Building2 className="w-5 h-5 text-[#F05BCE]" />
              <h2 className="text-base font-bold text-[#F5EAF4]">Billing Information</h2>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#F5EAF4] mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#100A12] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EAF4] border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder:text-[#A99AAA]/50"
                    placeholder="e.g. Aria Vance"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5EAF4] mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#100A12] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EAF4] border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder:text-[#A99AAA]/50"
                    placeholder="creator@fluviaflow.ai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#F5EAF4] mb-1.5">
                    Phone (PayU Mobile) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#100A12] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EAF4] border border-[#39233B] focus:outline-none focus:border-[#F05BCE] font-mono placeholder:text-[#A99AAA]/50"
                    placeholder="10-digit mobile"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F5EAF4] mb-1.5">
                    State / Place of Supply <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    className="w-full bg-[#100A12] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EAF4] border border-[#39233B] focus:outline-none focus:border-[#F05BCE] cursor-pointer"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#100A12] text-[#F5EAF4]">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5EAF4] mb-1.5">
                  Billing Address <span className="text-[#A99AAA] font-normal">(Optional for Individual)</span>
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-[#100A12] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EAF4] border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder:text-[#A99AAA]/50"
                  placeholder="Street address, city, pincode"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F5EAF4] mb-1.5">
                  Tax ID / Business ID <span className="text-[#A99AAA] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value.toUpperCase())}
                  className="w-full bg-[#100A12] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EAF4] border border-[#39233B] focus:outline-none focus:border-[#F05BCE] font-mono placeholder:text-[#A99AAA]/50"
                  placeholder="e.g. TAX-ID-12345"
                  maxLength={15}
                />
                <p className="mt-1 text-[11px] text-[#A99AAA]">
                  Optional business identification or registration number.
                </p>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#A99AAA]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-[#39233B] bg-[#100A12] text-[#F05BCE] focus:ring-[#F05BCE] accent-[#F05BCE] cursor-pointer"
                  />
                  <span>
                    I accept the{' '}
                    <Link href="/terms" target="_blank" className="text-[#F05BCE] underline font-semibold">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link href="/refund-policy" target="_blank" className="text-[#F05BCE] underline font-semibold">
                      Refund Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              <div className="pt-4">
                {cooldownSeconds > 0 && (
                  <div className="mb-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 shadow-xs">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <p className="font-bold">Rate Limit Protection Active</p>
                      <p className="text-[11px] text-amber-300 mt-0.5">
                        Please wait{' '}
                        <span className="font-mono font-bold text-white bg-amber-900/60 px-1.5 py-0.5 rounded">
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
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#F05BCE]/25 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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

                {/* Gateway Production Status Banner */}
                {!isZeroPayable && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#F05BCE] font-semibold bg-[#100A12] border border-[#39233B] rounded-xl py-2 px-3 shadow-2xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F05BCE] shrink-0" />
                    <span>PayU Live Production Gateway • 256-Bit SSL Encrypted</span>
                  </div>
                )}

                {/* Local Sandbox / Demo Test Simulator (Visible only if explicitly set to test mode) */}
                {!isZeroPayable && process.env.NEXT_PUBLIC_PAYU_ENV === 'test' && (
                  <div className="mt-2 text-center">
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isSubmitting}
                      className="text-[11px] text-[#F05BCE] hover:brightness-125 underline font-semibold transition-colors cursor-pointer"
                    >
                      Developer Sandbox: Test Immediate Fulfillment & Invoice Clearance →
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-[11px] text-[#A99AAA] font-medium">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F05BCE] shrink-0" /> UPI (GPay, PhonePe, Paytm)
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F05BCE] shrink-0" /> Credit / Debit Cards
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F05BCE] shrink-0" /> Net Banking
                </span>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Card */}
          <div className="lg:col-span-5 bg-[#211522] border border-[#39233B] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h2 className="text-base font-bold text-[#F5EAF4] pb-4 border-b border-[#39233B]">Order Summary</h2>

            <div className="p-4 rounded-xl bg-[#100A12] border border-[#39233B] space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#F5EAF4]">{itemDetails.name}</h3>
                  <p className="text-xs text-[#A99AAA] mt-0.5">{itemDetails.description}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F05BCE]/15 text-[#F05BCE] flex items-center justify-center shrink-0 border border-[#F05BCE]/30">
                  <Zap className="w-4 h-4 text-[#F05BCE]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#A99AAA] pt-2 border-t border-[#39233B]">
                <span>Credits Included:</span>
                <strong className="text-[#F05BCE] font-mono font-bold">
                  {itemDetails.credits.toLocaleString()} Credits
                </strong>
              </div>

              {itemDetails.intervalLabel && (
                <div className="flex items-center justify-between text-xs text-[#A99AAA] pt-2 border-t border-[#39233B]">
                  <span>Billing Cycle:</span>
                  <span className="text-[#F05BCE] font-bold">{itemDetails.intervalLabel}</span>
                </div>
              )}
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 rounded-xl bg-[#100A12] border border-[#39233B] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F5EAF4] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>Have a coupon code?</span>
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs">
                  <div className="flex items-center gap-2 text-[#F05BCE] font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#F05BCE] shrink-0" />
                    <span>{appliedCoupon.code}</span>
                    <span className="text-[#F5EAF4] font-normal font-sans text-[11px]">
                      ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `INR ${appliedCoupon.discountValue} off`})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded hover:bg-white/10 text-[#A99AAA] hover:text-rose-400 transition-colors"
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
                    placeholder="e.g. SAVE20"
                    className="flex-1 bg-[#211522] rounded-xl px-3 py-2 text-xs text-[#F5EAF4] font-mono uppercase border border-[#39233B] focus:outline-none focus:border-[#F05BCE] placeholder:text-[#A99AAA]/50"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isValidatingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
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
                <p className="text-[11px] text-[#F05BCE] font-medium flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{couponSuccess}</span>
                </p>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#A99AAA]">
                <span>Subtotal:</span>
                <span className={`text-[#F5EAF4] font-mono font-bold ${appliedCoupon ? 'line-through text-[#A99AAA]' : ''}`}>
                  INR {itemDetails.basePrice.toFixed(2)}
                </span>
              </div>

              {appliedCoupon && couponPricing && (
                <>
                  <div className="flex justify-between text-[#F05BCE] font-semibold bg-[#F05BCE]/10 p-2 rounded-lg border border-[#F05BCE]/20 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 shrink-0" />
                      <span>Coupon: {appliedCoupon.code}</span>
                    </span>
                    <span className="font-bold">-INR {couponPricing.discountAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#A99AAA]">
                    <span>Discounted Base:</span>
                    <span className="text-[#F5EAF4] font-mono font-bold">
                      INR {couponPricing.discountedBaseAmount.toFixed(2)}
                    </span>
                  </div>
                </>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between text-[#A99AAA]">
                  <span>Taxes & Fees:</span>
                  <span className="text-[#F5EAF4] font-mono font-bold">INR {taxAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#39233B] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#F5EAF4]">Total Payable Amount:</span>
                <span className="text-lg font-extrabold text-[#F05BCE] font-mono">
                  INR {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Satisfaction / Guarantee info */}
            <div className="p-4 rounded-xl bg-[#100A12] border border-[#39233B] text-xs text-[#A99AAA] space-y-1.5 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#F5EAF4]">
                <ShieldCheck className="w-4 h-4 text-[#F05BCE]" />
                <span>Instant Crediting & Official Invoice</span>
              </div>
              <p className="text-[11px] text-[#A99AAA] leading-relaxed">
                Your credits are added to your wallet automatically upon confirmation. You will be able to download your
                official invoice and payment receipt immediately.
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
        <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
