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

  // Intelligent parameter parsing for any link format (?plan=..., ?pack=..., ?type=...&id=...)
  const rawPlan = searchParams.get('plan');
  const rawPack = searchParams.get('pack');
  const rawId = searchParams.get('id');
  const rawType = searchParams.get('type');
  const rawTier = searchParams.get('tier');
  const rawCurrency = (searchParams.get('currency') || 'inr').toLowerCase();

  const planAliases: Record<string, string> = {
    basic: 'plan_starter',
    starter: 'plan_starter',
    plan_basic: 'plan_starter',
    pro: 'plan_creator',
    plus: 'plan_creator',
    creator: 'plan_creator',
    plan_pro: 'plan_creator',
    max: 'plan_max',
    ultra: 'plan_max',
    power: 'plan_max',
    plan_ultra: 'plan_max',
    teams: 'plan_business',
    business: 'plan_business',
    plan_teams: 'plan_business',
    openhiggs: 'plan_openhiggs',
    openhiggs_lite: 'plan_openhiggs_lite',
    openhiggs_max: 'plan_openhiggs_max',
  };

  const rawTargetId = rawPlan || rawPack || rawId || '';
  const isPlan = Boolean(rawPlan || (rawId && rawId.startsWith('plan_')) || (rawType === 'subscription') || planAliases[rawTargetId.toLowerCase()]);
  const itemType = isPlan ? 'subscription' : 'pack';
  const resolvedTarget = rawPlan || rawPack || rawId || (isPlan ? 'plan_openhiggs' : 'pack_5000');
  const itemId = planAliases[resolvedTarget.toLowerCase()] || resolvedTarget;
  const interval = (searchParams.get('interval') || 'year') as 'month' | 'year';
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
          // Allow seamless guest checkout without forcing redirect
          return null;
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
        pack_500: { name: '500 Credits Boost', basePrice: 499, credits: 500, desc: 'Quick top-up for fast video and image generation.' },
        pack_1000: { name: '1,000 Credits Starter Pack', basePrice: 1500, credits: 1000, desc: 'Ideal for testing campaigns and quick creative generation tasks.' },
        pack_1200: { name: '1,200 Credits Studio', basePrice: 999, credits: 1200, desc: 'Special edition generation credits pack.' },
        pack_2500: { name: '2,500 Credits Growth Pack', basePrice: 3500, credits: 2500, desc: 'For regular video ad creators producing weekly social content.' },
        pack_3500: { name: '3,500 Credits Scale', basePrice: 2499, credits: 3500, desc: 'Scale pack for high-concurrency production workflows.' },
        pack_5000: { name: '5,000 Credits Pro Top-Up', basePrice: 6500, credits: 5000, desc: 'Most popular top-up for scaling e-commerce brands & agencies.' },
        pack_10000: { name: '10,000 Credits Agency Pack', basePrice: 12000, credits: 10000, desc: 'Designed for production studios running high-concurrency 4K jobs.' },
        pack_25000: { name: '25,000 Credits Enterprise Pack', basePrice: 27500, credits: 25000, desc: 'High-volume commercial pack with dedicated GPU processing queue.' },
      };
      packs['500'] = packs.pack_500;
      packs['1000'] = packs.pack_1000;
      packs['2500'] = packs.pack_2500;
      packs['5000'] = packs.pack_5000;
      packs['10000'] = packs.pack_10000;
      packs['25000'] = packs.pack_25000;

      const p = packs[itemId] || packs.pack_5000;
      setItemDetails({
        name: p.name,
        description: p.desc || 'Instant creative computing credits. Valid for all models.',
        basePrice: p.basePrice,
        credits: p.credits,
        isSubscription: false,
      });
    } else {
      const tierIdx = parseInt(rawTier || '0', 10);
      const isAnnual = interval === 'year';

      const plans: Record<string, any> = {
        plan_starter: {
          name: 'Basic Plan',
          monthly: 999,
          annualPerMo: 799,
          credits: 500,
          usdMonthly: 9,
          usdAnnualPerMo: 9,
          desc: '1080p Full HD video generations with Fluvia Cinematic & Seedance 2.0 Fast.',
        },
        plan_creator: {
          name: 'Pro Plan',
          monthly: 2499,
          annualPerMo: 1999,
          credits: 1600,
          usdMonthly: 29,
          usdAnnualPerMo: 23,
          desc: '4K Ultra HD exports, priority queue, Kling 3.0 & timeline editor.',
        },
        plan_max: {
          name: tierIdx === 1 ? 'Max Plan (6,000 Credits)' : tierIdx === 2 ? 'Max Plan (9,000 Credits)' : 'Max Plan (Most Popular)',
          monthly: tierIdx === 1 ? 8499 : tierIdx === 2 ? 11999 : 4999,
          annualPerMo: tierIdx === 1 ? 6999 : tierIdx === 2 ? 9999 : 3999,
          credits: tierIdx === 1 ? 6000 : tierIdx === 2 ? 9000 : 3000,
          usdMonthly: tierIdx === 1 ? 149 : tierIdx === 2 ? 219 : 79,
          usdAnnualPerMo: tierIdx === 1 ? 118 : tierIdx === 2 ? 177 : 59,
          desc: '4K 60fps cinema master, dedicated GPU queue, Gemini storyboard director.',
        },
        plan_business: {
          name: 'For Teams Plan',
          monthly: 9999,
          annualPerMo: 7999,
          credits: 10000,
          usdMonthly: 85,
          usdAnnualPerMo: 65,
          desc: 'Multi-seat team workspace, shared credits pool, dedicated capacity & SLA.',
        },
        plan_openhiggs_lite: {
          name: 'OpenHiggs Lite',
          monthly: 2499,
          annualPerMo: 1999, // 20% discount
          credits: 1500,
          usdMonthly: 29,
          usdAnnualPerMo: 23,
          desc: '15 Core open-source AI models (Seedance 2.0 Fast, Kling 3.0 Turbo, Ideogram 4).',
        },
        plan_openhiggs: {
          name: 'OpenHiggs Studio Pro',
          monthly: 5100,
          annualPerMo: 4080, // 20% discount
          credits: 3500,
          usdMonthly: 59,
          usdAnnualPerMo: 47,
          desc: 'Full access to all 38 OpenHiggs foundation models, Soul Cinema 4K & Seedance 2.5 Director.',
        },
        plan_openhiggs_max: {
          name: 'OpenHiggs GPU Cluster Max',
          monthly: 9999,
          annualPerMo: 7999, // 20% discount
          credits: 8000,
          usdMonthly: 119,
          usdAnnualPerMo: 95,
          desc: 'Dedicated A100 GPU cluster priority, zero-wait queue, direct REST API & automated webhooks.',
        },
      };

      plans['plan_pro'] = plans.plan_creator;
      plans['pro'] = plans.plan_creator;
      plans['plan_basic'] = plans.plan_starter;
      plans['basic'] = plans.plan_starter;
      plans['starter'] = plans.plan_starter;
      plans['plus'] = plans.plan_creator;
      plans['ultra'] = plans.plan_max;
      plans['max'] = plans.plan_max;
      plans['teams'] = plans.plan_business;
      plans['business'] = plans.plan_business;
      plans['openhiggs'] = plans.plan_openhiggs;
      plans['openhiggs_lite'] = plans.plan_openhiggs_lite;
      plans['openhiggs_max'] = plans.plan_openhiggs_max;

      const pl = plans[itemId] || plans.plan_openhiggs;
      const calculatedPrice = isAnnual ? pl.annualPerMo * 12 : pl.monthly;

      const usdLabel = rawCurrency === 'usd' && pl.usdAnnualPerMo
        ? isAnnual
          ? ` ($${pl.usdAnnualPerMo}/mo • $${pl.usdAnnualPerMo * 12}/yr)`
          : ` ($${pl.usdMonthly}/mo)`
        : '';

      setItemDetails({
        name: pl.name,
        description: pl.desc,
        basePrice: calculatedPrice,
        credits: pl.credits,
        isSubscription: true,
        intervalLabel: isAnnual
          ? `Annual (₹${pl.annualPerMo.toLocaleString('en-IN')}/mo • Billed ₹${calculatedPrice.toLocaleString('en-IN')}/yr${usdLabel})`
          : `Monthly (Billed ₹${pl.monthly.toLocaleString('en-IN')}/mo${usdLabel})`,
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
      let activeDiscountAmount: number | undefined = undefined;
      const urlDiscount = searchParams.get('discount');
      if (urlDiscount) {
        const parsed = parseInt(urlDiscount, 10);
        if (!isNaN(parsed) && parsed >= 500 && parsed <= 1000) activeDiscountAmount = parsed;
      }
      if (!activeDiscountAmount && typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('fluvia_scratch_discount_amount');
        if (stored) {
          const parsed = parseInt(stored, 10);
          if (!isNaN(parsed) && parsed >= 500 && parsed <= 1000) activeDiscountAmount = parsed;
        }
      }

      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          paymentType: itemType === 'pack' ? 'credit_pack' : 'subscription',
          itemPlanOrPackId: itemId,
          billingInterval: interval,
          customerState,
          discountAmount: activeDiscountAmount,
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
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#17191D] overflow-x-hidden max-w-full">
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
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#5145CD]" />
                <h2 className="text-base font-bold text-[#17191D]">Billing Information</h2>
              </div>
              {user ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Logged in as {user.email}</span>
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-[#5145CD] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-0.5 rounded-full">
                  ⚡ Instant Guest Checkout
                </span>
              )}
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

              {itemDetails.isSubscription ? (
                <>
                  <div className="flex items-center justify-between text-xs text-[#667085] pt-2 border-t border-[#E5E7EB]">
                    <span>Billing Cycle:</span>
                    <div className="inline-flex p-0.5 rounded-lg border bg-[#F1F3F5] border-[#E5E7EB]">
                      <button
                        type="button"
                        onClick={() => {
                          const url = `/checkout?type=subscription&id=${itemId}&interval=month${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ''}`;
                          router.push(url);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          interval === 'month'
                            ? 'bg-white text-[#17191D] shadow-xs'
                            : 'text-[#667085] hover:text-[#17191D]'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const url = `/checkout?type=subscription&id=${itemId}&interval=year${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ''}`;
                          router.push(url);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          interval === 'year'
                            ? 'bg-[#5145CD] text-white shadow-xs'
                            : 'text-[#667085] hover:text-[#17191D]'
                        }`}
                      >
                        <span>Annual</span>
                        <span className="px-1 py-0.2 rounded text-[9px] bg-red-500 text-white font-black">
                          {itemId.startsWith('plan_openhiggs') ? '20% OFF' : 'UP TO 30% OFF'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Instant Plan Switcher */}
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between text-xs text-[#667085] mb-1.5">
                      <span>Select Different Plan:</span>
                      <Link href="/pricing" className="text-[11px] font-bold text-[#5145CD] hover:underline">
                        Pricing Matrix →
                      </Link>
                    </div>
                    <select
                      value={itemId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        const url = `/checkout?type=subscription&id=${newId}&interval=${interval}${appliedCoupon ? `&coupon=${appliedCoupon.code}` : ''}`;
                        router.push(url);
                      }}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold text-[#17191D] focus:outline-none focus:border-[#5145CD] cursor-pointer"
                    >
                      <optgroup label="Creative Studio Plans (Matching Screenshot)">
                        <option value="plan_starter">Basic Plan (₹999/mo / $9 • 500 Credits)</option>
                        <option value="plan_creator">Pro Plan (₹2,499/mo / $29 • 1,600 Credits)</option>
                        <option value="plan_max">Max Plan (₹4,999/mo / $79 • 3,000–9,000 Credits)</option>
                      </optgroup>
                      <optgroup label="OpenHiggs Studio Suite (38 Foundation Models • 20% OFF)">
                        <option value="plan_openhiggs_lite">OpenHiggs Lite (₹2,499/mo • 1,500 Credits)</option>
                        <option value="plan_openhiggs">OpenHiggs Studio Pro (₹5,100/mo • 3,500 Credits)</option>
                        <option value="plan_openhiggs_max">OpenHiggs GPU Cluster Max (₹9,999/mo • 8,000 Credits)</option>
                      </optgroup>
                      <optgroup label="Business & Teams">
                        <option value="plan_business">For Teams Plan (₹9,999/mo / $85 • 10,000 Credits)</option>
                      </optgroup>
                    </select>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#667085] pt-2 border-t border-[#E5E7EB]">
                  <span>Package Type:</span>
                  <span className="text-[#17191D] font-semibold">One-Time Credit Pack (Never Expires)</span>
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
