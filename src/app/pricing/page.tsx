'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PlanRecommenderModal } from '@/components/pricing/PlanRecommenderModal';
import { FeatureComparisonMatrix } from '@/components/pricing/FeatureComparisonMatrix';
import { CreditTopUpSection } from '@/components/pricing/CreditTopUpSection';
import {
  Check,
  Minus,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Video,
  Film,
  Camera,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';

interface PlanFeatureItem {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PlanDefinition {
  id: string;
  name: string;
  tier: 'starter' | 'plus' | 'ultra' | 'teams';
  category: 'individual' | 'business';
  headline: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  credits: number;
  badge?: string;
  isPopular?: boolean;
  couponTag?: string;
  outputDescription: string;
  ctaText: string;
  storageGb: number;
  maxResolution: string;
  keyFeatures: PlanFeatureItem[];
  moreFeatures: PlanFeatureItem[];
}

export default function PricingPage() {
  const router = useRouter();

  // Toolbar state
  const [activeTab, setActiveTab] = useState<'all' | 'individual' | 'business'>('all');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  // User & Promo eligibility
  const [isEligibleForFirst20, setIsEligibleForFirst20] = useState(true);

  // FAQ Accordion state
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  useEffect(() => {
    // Check if user is logged in and eligible for FIRST20 coupon
    fetch('/api/user/first-coupon')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.eligible === 'boolean') {
          setIsEligibleForFirst20(data.eligible);
        }
      })
      .catch(() => {});
  }, []);

  const toggleFeatureExpand = (planId: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Canonical Plan Specifications
  const plans: PlanDefinition[] = [
    {
      id: 'plan_starter',
      name: 'Starter',
      tier: 'starter',
      category: 'individual',
      headline: 'For solo creators and creators testing their first commercial AI ads.',
      monthlyPrice: 999,
      annualMonthlyPrice: 799,
      credits: 500,
      outputDescription: '≈ 33 video ads (15 cr/ad), 100 product photos (5 cr/photo), or 250 voiceovers (2 cr/vo)',
      ctaText: 'Choose Starter',
      storageGb: 10,
      maxResolution: '1080p Full HD',
      keyFeatures: [
        { text: '500 Credits every month (rolls over)', included: true, highlight: true },
        { text: '1080p Full HD video exports', included: true },
        { text: 'Standard GPU rendering queue', included: true },
        { text: '2 Timeline scene tracks', included: true },
        { text: '10 GB Cloud asset storage', included: true },
        { text: 'Full commercial advertising rights', included: true },
      ],
      moreFeatures: [
        { text: '2 Saved Brand Kits (Logos & Colors)', included: true },
        { text: 'Official 18% GST vector tax invoices', included: true },
        { text: 'Standard community & email support', included: true },
        { text: '4K Ultra HD video exports', included: false },
        { text: 'Runway Gen-3 & Luma Ray motion engines', included: false },
        { text: 'Multi-seat team workspace', included: false },
      ],
    },
    {
      id: 'plan_creator',
      name: 'Plus',
      tier: 'plus',
      category: 'individual',
      headline: 'For regular commercial producers and growing brands needing consistent ad volume.',
      monthlyPrice: 2499,
      annualMonthlyPrice: 1999,
      credits: 1600,
      outputDescription: '≈ 106 video ads (15 cr/ad), 320 product photos (5 cr/photo), or 800 voiceovers (2 cr/vo)',
      ctaText: 'Choose Plus',
      storageGb: 50,
      maxResolution: '4K Ultra HD',
      keyFeatures: [
        { text: '1,600 Credits every month (rolls over)', included: true, highlight: true },
        { text: '4K Ultra HD video exports', included: true },
        { text: 'Priority GPU rendering queue', included: true },
        { text: 'Multi-scene timeline storyboard editor', included: true },
        { text: 'ElevenLabs multilingual voiceover sync', included: true },
        { text: '50 GB High-speed cloud storage', included: true },
      ],
      moreFeatures: [
        { text: '5 Brand Kits (Logos, Fonts, Colors)', included: true },
        { text: '10% discount on credit top-ups', included: true },
        { text: 'Runway Gen-3 Alpha & Luma Ray models', included: true },
        { text: 'Priority customer email & chat support', included: true },
        { text: 'Full commercial advertising rights', included: true },
        { text: 'Multi-seat team collaboration pool', included: false },
      ],
    },
    {
      id: 'plan_max',
      name: 'Ultra',
      tier: 'ultra',
      category: 'individual',
      headline: 'High-volume studio for scaling digital agencies and high-performing advertising teams.',
      monthlyPrice: 4999,
      annualMonthlyPrice: 3999,
      credits: 4000,
      badge: 'Most Popular',
      isPopular: true,
      couponTag: isEligibleForFirst20 ? 'Use FIRST20 for ₹570 OFF' : undefined,
      outputDescription: '≈ 266 video ads (15 cr/ad), 800 product photos (5 cr/photo), or 2,000 voiceovers (2 cr/vo)',
      ctaText: 'Choose Ultra',
      storageGb: 150,
      maxResolution: '4K 60fps Cinema',
      keyFeatures: [
        { text: '4,000 Credits every month (rolls over)', included: true, highlight: true },
        { text: '4K 60fps Cinema Master exports', included: true },
        { text: 'Dedicated VIP priority GPU lane', included: true },
        { text: 'Gemini Omni Storyboard & Director Mode', included: true },
        { text: 'All flagship & beta video engines', included: true },
        { text: '150 GB Cloud asset storage', included: true },
      ],
      moreFeatures: [
        { text: '15 Brand Kits & custom presets', included: true },
        { text: '15% discount on credit top-ups', included: true },
        { text: 'Expedited 2-hour SLA support', included: true },
        { text: 'Dedicated 1-on-1 account onboarding', included: true },
        { text: 'Official GST vector tax invoices', included: true },
        { text: 'Full commercial advertising rights', included: true },
      ],
    },
    {
      id: 'plan_business',
      name: 'For Teams',
      tier: 'teams',
      category: 'business',
      headline: 'Collaborative multi-seat workspace for marketing teams, creative agencies and production houses.',
      monthlyPrice: 9999,
      annualMonthlyPrice: 7999,
      credits: 10000,
      badge: 'Enterprise',
      outputDescription: '≈ 666 video ads (15 cr/ad), 2,000 product photos (5 cr/photo), or 5,000 voiceovers (2 cr/vo)',
      ctaText: 'Explore Team Plans',
      storageGb: 500,
      maxResolution: '4K 60fps Cinema',
      keyFeatures: [
        { text: '10,000 Pooled Credits / mo (rolls over)', included: true, highlight: true },
        { text: 'Up to 10 Team member seats included', included: true },
        { text: 'Shared credit wallet & asset pool', included: true },
        { text: 'Concurrent GPU cluster rendering', included: true },
        { text: '4K 60fps Cinema Master exports', included: true },
        { text: '500 GB High-speed shared storage', included: true },
      ],
      moreFeatures: [
        { text: 'Unlimited Brand Kits & shared templates', included: true },
        { text: '20% discount on credit top-ups', included: true },
        { text: 'Custom B2B Invoicing & 99.9% SLA', included: true },
        { text: 'Dedicated Account Director', included: true },
        { text: 'Custom contracts & PO support', included: true },
        { text: 'Full commercial advertising rights', included: true },
      ],
    },
  ];

  // Filter plans according to active tab
  const visiblePlans = plans.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'individual') return p.category === 'individual';
    if (activeTab === 'business') return p.tier === 'ultra' || p.category === 'business';
    return true;
  });

  const handleSelectPlan = (planId: string) => {
    const couponParam = planId === 'plan_max' ? '&coupon=FIRST20' : '';
    router.push(
      `/checkout?type=subscription&id=${planId}&interval=${billingInterval}${couponParam}`
    );
  };

  const handleBuyCreditPack = (packId: string) => {
    router.push(`/checkout?type=pack&id=${packId}`);
  };

  const faqs = [
    {
      q: 'How does the credit billing and consumption system work?',
      a: 'Credits are consumed dynamically as you generate creative assets. Generating a video ad costs 15 credits, high-resolution product photography costs 5 credits, and natural AI voice-overs cost 2 credits. If an AI generation job ever encounters a provider error, credits are instantly refunded to your wallet atomically.',
    },
    {
      q: 'Do unused monthly subscription credits expire?',
      a: 'No. On all active subscription plans, your unused monthly credits roll over into the following billing period as long as your subscription remains active. Purchased one-time top-up credits never expire under any circumstance.',
    },
    {
      q: 'How does the FIRST20 welcome coupon work?',
      a: 'Eligible new registered creators can apply coupon code FIRST20 exclusively on the FLUVIA MAX (Ultra) plan to receive an immediate ₹570 discount verified server-side at checkout.',
    },
    {
      q: 'Can I purchase credits without an active subscription plan?',
      a: 'Yes. You can purchase one-time credit top-ups at any time directly through our Credit Top-Up section. Our featured 5,000-credit pack (₹6,500 + 18% GST = ₹7,670 Total) provides immediate activation with no recurring commitment.',
    },
    {
      q: 'Are taxes and Indian GST included in the price?',
      a: 'Subscription and top-up prices are listed in Indian Rupees (₹). Applicable 18% GST (CGST + SGST or IGST) is itemized transparently before payment. You can enter your company GSTIN at checkout to receive official vector PDF tax invoices for business expense input tax credit (ITC) claims.',
    },
    {
      q: 'Can I upgrade, downgrade, or cancel my subscription at any time?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription plan at any time directly in your account billing dashboard. When upgrading, remaining credits are preserved.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17191D] selection:bg-[#EEF2FF] selection:text-[#5145CD] overflow-x-hidden max-w-full">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ========================================================================= */}
        {/* TOP TOOLBAR: CATEGORY TABS + BILLING TOGGLE + RECOMMENDER LINK */}
        {/* ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F8FA] border border-[#E5E7EB] text-xs font-semibold text-[#17191D] mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>PayU India Verified • 18% GST Compliant • Instant Credit Fulfillment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#17191D] tracking-tight leading-tight">
            Predictable commercial pricing <br className="hidden sm:inline" />
            <span className="text-[#5145CD]">engineered for scale.</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#667085] max-w-2xl mx-auto leading-relaxed">
            Choose a recurring subscription plan for regular commercial video production, or purchase one-time credit top-ups as your campaigns scale.
          </p>

          {/* Controls Bar: Category Selector + Billing Interval + Recommender */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {/* Category Segmented Control */}
            <div className="inline-flex p-1 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                All Plans (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'individual'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Individual Plans
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Business Plans
              </button>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] shadow-2xs">
              <button
                type="button"
                onClick={() => setBillingInterval('month')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  billingInterval === 'month'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval('year')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingInterval === 'year'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] font-bold bg-[#EEF2FF] text-[#5145CD] px-1.5 py-0.2 rounded-full border border-[#C7D2FE]">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Plan Recommender Link */}
            <button
              type="button"
              onClick={() => setIsRecommenderOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5145CD] hover:text-[#4338CA] hover:underline transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Not sure which plan?</span>
            </button>
          </div>

          {/* Quick Credit Cost Reference */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#667085]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              <span>
                <strong>15 credits</strong> / video ad
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              <span>
                <strong>5 credits</strong> / product photo
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              <span>
                <strong>2 credits</strong> / voiceover
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>Credits roll over while active</span>
            </span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FOUR-COLUMN PRICING COMPARISON GRID */}
        {/* ========================================================================= */}
        <div
          className={`grid gap-5 sm:gap-6 items-stretch ${
            visiblePlans.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : visiblePlans.length === 3
              ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
          }`}
        >
          {visiblePlans.map((plan) => {
            const isAnnual = billingInterval === 'year';
            const price = isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
            const fullAnnualBilled = plan.annualMonthlyPrice * 12;
            const annualSavings = (plan.monthlyPrice - plan.annualMonthlyPrice) * 12;
            const isExpanded = !!expandedFeatures[plan.id];

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 text-left bg-white ${
                  plan.isPopular
                    ? 'border-2 border-[#5145CD] shadow-lg shadow-[#5145CD]/5 lg:-translate-y-1'
                    : 'border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-xs'
                }`}
              >
                {/* Most Popular Badge on Ultra */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <span
                      className={`text-[11px] font-semibold px-3 py-0.5 rounded-full border shadow-2xs ${
                        plan.isPopular
                          ? 'bg-[#5145CD] text-white border-[#5145CD]'
                          : 'bg-[#F7F8FA] text-[#17191D] border-[#E5E7EB]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Category */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <h3 className="text-xl font-bold text-[#17191D]">{plan.name}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#667085] bg-[#F7F8FA] px-2 py-0.5 rounded border border-[#E5E7EB]">
                      {plan.maxResolution}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#667085] leading-relaxed min-h-[36px]">
                    {plan.headline}
                  </p>

                  {/* Price Block */}
                  <div className="mt-4 pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {isAnnual && (
                        <span className="text-base text-[#667085] line-through font-mono">
                          ₹{plan.monthlyPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-extrabold text-[#17191D] font-mono">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#667085] font-medium">/ month</span>
                    </div>

                    {isAnnual ? (
                      <p className="mt-1 text-[11px] text-[#5145CD] font-medium">
                        Billed annually (₹{fullAnnualBilled.toLocaleString()} / yr) •{' '}
                        <strong>Save ₹{annualSavings.toLocaleString()}</strong>
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-[#667085]">
                        Billed monthly • Cancel or switch anytime
                      </p>
                    )}

                    {/* Genuine Coupon Promotion Tag on Ultra */}
                    {plan.couponTag && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold font-mono">
                        <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{plan.couponTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Monthly Credit Allowance Card */}
                  <div className="mt-4 p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17191D]">
                        {plan.tier === 'teams' ? 'Pooled Team Credits' : 'Monthly Credits'}
                      </span>
                      <span className="text-base font-extrabold text-[#5145CD] font-mono">
                        {plan.credits.toLocaleString()} CR
                      </span>
                    </div>
                    <p className="text-[10px] text-[#667085] leading-snug">
                      {plan.outputDescription}
                    </p>
                  </div>

                  {/* Primary Features List */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085] block mb-2">
                      Included Capabilities
                    </span>
                    <ul className="space-y-2 text-xs text-[#17191D]">
                      {plan.keyFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span className={feat.highlight ? 'font-semibold text-[#17191D]' : 'text-[#17191D]'}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Expandable Additional Features */}
                    {isExpanded && (
                      <ul className="pt-2 space-y-2 text-xs border-t border-[#F1F3F5] animate-in fade-in duration-200">
                        {plan.moreFeatures.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            {feat.included ? (
                              <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            ) : (
                              <Minus className="w-4 h-4 text-[#667085]/40 shrink-0 mt-0.5" />
                            )}
                            <span className={feat.included ? 'text-[#667085]' : 'text-[#667085]/60'}>
                              {feat.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Show more / Show less toggle */}
                    <button
                      type="button"
                      onClick={() => toggleFeatureExpand(plan.id)}
                      className="mt-2 text-[11px] font-semibold text-[#5145CD] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>{isExpanded ? 'Show less' : 'Show full feature list'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                      plan.isPopular
                        ? 'bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-[#5145CD]/20'
                        : 'bg-[#F7F8FA] hover:bg-[#F1F3F5] text-[#17191D] border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="mt-2 text-[10px] text-center text-[#667085]">
                    + 18% GST • Instant setup • Roll over unused credits
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE FEATURE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <FeatureComparisonMatrix
          billingInterval={billingInterval}
          onSelectPlan={handleSelectPlan}
        />

        {/* ========================================================================= */}
        {/* DEDICATED CREDIT TOP-UP PACKS SECTION */}
        {/* ========================================================================= */}
        <CreditTopUpSection onBuyPack={handleBuyCreditPack} />

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        {/* ========================================================================= */}
        <section className="mt-20 pt-16 border-t border-[#E5E7EB] max-w-3xl mx-auto text-left">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#C7D2FE]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight mt-3">
              Billing, credits & commercial rights.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#667085]">
              Everything you need to know about Fluvia Flow subscriptions, GST invoicing, and rollovers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-[#17191D] cursor-pointer hover:bg-[#F7F8FA] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaqs[i] ? (
                    <ChevronUp className="w-4 h-4 text-[#667085] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#667085] shrink-0" />
                  )}
                </button>
                {openFaqs[i] && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-[#667085] leading-relaxed border-t border-[#E5E7EB] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CONCISE BILLING & COMPLIANCE FOOTER NOTE */}
        {/* ========================================================================= */}
        <div className="mt-16 p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] text-center max-w-3xl mx-auto text-xs text-[#667085] space-y-2">
          <div className="flex items-center justify-center gap-2 font-semibold text-[#17191D]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Secure Indian Payment Gateway & Enterprise Tax Compliance</span>
          </div>
          <p className="leading-relaxed">
            All credit card, debit card, UPI, and NetBanking payments are securely processed by PayU India. Prices exclude 18% GST (CGST + SGST or IGST), itemized at checkout with immediate downloadable PDF tax invoice generation. Unused subscription credits roll over indefinitely while active. Cancel anytime with zero lock-in contracts.
          </p>
        </div>
      </main>

      {/* Plan Recommender Interactive Modal */}
      <PlanRecommenderModal
        isOpen={isRecommenderOpen}
        onClose={() => setIsRecommenderOpen(false)}
        billingInterval={billingInterval}
      />

      <Footer />
    </div>
  );
}
