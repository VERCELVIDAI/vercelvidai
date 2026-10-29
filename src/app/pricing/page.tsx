'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Video,
  Film,
  Camera,
  Layers,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  Users,
} from 'lucide-react';

interface FeatureGroup {
  category: string;
  items: string[];
}

interface PlanConfig {
  id: string;
  name: string;
  tier: 'basic' | 'pro' | 'max' | 'teams';
  monthlyPrice: number;
  annualMonthlyPrice: number;
  credits: number;
  badge?: string;
  desc: string;
  highlight?: boolean;
  couponHighlight?: string;
  exportResolution: string;
  storageGb: number;
  features: string[];
  ctaText: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showDetailedMatrix, setShowDetailedMatrix] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const allPlans: PlanConfig[] = [
    {
      id: 'plan_starter',
      name: 'Fluvia Basic',
      tier: 'basic',
      monthlyPrice: 999,
      annualMonthlyPrice: 799,
      credits: 500,
      desc: 'Ideal for solo creators experimenting with AI advertising clips.',
      exportResolution: '1080p Full HD',
      storageGb: 10,
      features: [
        '500 Credits every month',
        '1080p Full HD video exports',
        'Standard GPU rendering queue',
        '2 active timeline tracks',
        'Commercial usage rights',
        'Official downloadable GST invoices',
      ],
      ctaText: 'Get Started with Basic',
    },
    {
      id: 'plan_creator',
      name: 'Fluvia Pro',
      tier: 'pro',
      monthlyPrice: 2499,
      annualMonthlyPrice: 1999,
      credits: 1600,
      badge: 'Most Popular',
      desc: 'For brands and content creators needing regular commercial video production.',
      highlight: true,
      exportResolution: '4K Ultra HD',
      storageGb: 50,
      features: [
        '1,600 Credits every month',
        '4K Ultra HD video exports',
        'Priority GPU rendering queue',
        'Multi-scene timeline storyboard editor',
        'ElevenLabs AI voiceover sync',
        '50 GB High-Speed cloud storage',
        '10% discount on credit top-ups',
        'Priority customer support',
      ],
      ctaText: 'Start with Fluvia Pro',
    },
    {
      id: 'plan_max',
      name: 'Fluvia Max',
      tier: 'max',
      monthlyPrice: 4999,
      annualMonthlyPrice: 3999,
      credits: 4000,
      badge: 'Director Choice',
      couponHighlight: 'Use FIRST20 for ₹570 OFF',
      desc: 'High-volume production studio for digital agencies and fast-growing brands.',
      exportResolution: '4K 60fps Cinema',
      storageGb: 150,
      features: [
        '4,000 Credits every month',
        '4K 60fps Cinema Master exports',
        'Dedicated VIP render lane',
        'Unlimited timeline tracks',
        'Gemini Omni 1.1 Multi-Scene Storyboard',
        '150 GB Cloud Storage',
        'Eligible for ₹570 OFF with FIRST20',
        'Dedicated 1-on-1 account onboarding',
      ],
      ctaText: 'Claim Max with FIRST20',
    },
    {
      id: 'plan_business',
      name: 'Fluvia Teams',
      tier: 'teams',
      monthlyPrice: 9999,
      annualMonthlyPrice: 7999,
      credits: 10000,
      badge: 'Enterprise',
      desc: 'Collaborative creative workspace for marketing teams and production houses.',
      exportResolution: '4K 60fps Cinema',
      storageGb: 500,
      features: [
        '10,000 Pooled Credits every month',
        'Up to 10 Team member seats',
        'Shared workspace, brand kits & templates',
        'Concurrent GPU cluster rendering',
        '500 GB Shared team cloud storage',
        'Custom B2B Invoicing & 99.9% SLA',
        'Dedicated account director',
      ],
      ctaText: 'Upgrade to Teams',
    },
  ];

  const creditPacks = [
    {
      id: 'pack_5000',
      name: '5,000 Credits Pro Top-Up',
      credits: 5000,
      priceInr: 6500,
      taxInr: 1170,
      totalInr: 7670,
      perCredit: '₹1.30',
      featured: true,
      desc: 'Best value for high-volume commercial campaigns. Complete with full GST invoice.',
    },
    {
      id: 'pack_1000',
      name: '1,000 Credits Starter Pack',
      credits: 1000,
      priceInr: 1400,
      taxInr: 252,
      totalInr: 1652,
      perCredit: '₹1.40',
      featured: false,
      desc: 'Ideal for launching 1–2 test campaigns.',
    },
    {
      id: 'pack_2500',
      name: '2,500 Credits Growth Pack',
      credits: 2500,
      priceInr: 3400,
      taxInr: 612,
      totalInr: 4012,
      perCredit: '₹1.36',
      featured: false,
      desc: 'Great for weekly social reel pipelines.',
    },
    {
      id: 'pack_10000',
      name: '10,000 Credits Agency Pack',
      credits: 10000,
      priceInr: 12500,
      taxInr: 2250,
      totalInr: 14750,
      perCredit: '₹1.25',
      featured: false,
      desc: 'Heavy commercial workflows & client work.',
    },
    {
      id: 'pack_25000',
      name: '25,000 Credits Enterprise Pack',
      credits: 25000,
      priceInr: 29000,
      taxInr: 5220,
      totalInr: 34220,
      perCredit: '₹1.16',
      featured: false,
      desc: 'Enterprise tier volume for scaled production.',
    },
    {
      id: 'pack_500',
      name: '500 Credits Boost',
      credits: 500,
      priceInr: 499,
      taxInr: 89.82,
      totalInr: 588.82,
      perCredit: '₹0.99',
      featured: false,
      desc: 'Quick generation top-up.',
    },
  ];

  const handleSelectPlan = (planId: string) => {
    const couponParam = planId === 'plan_max' ? '&coupon=FIRST20' : '';
    router.push(`/checkout?type=subscription&id=${planId}&interval=${billingInterval}${couponParam}`);
  };

  const handleBuyCreditPack = (packId: string) => {
    router.push(`/checkout?type=pack&id=${packId}`);
  };

  const faqs = [
    {
      q: 'How does the credit system work?',
      a: 'Credits are consumed dynamically when you generate creative assets. A video generation consumes 15 credits, high-resolution image generation consumes 5 credits, and natural AI voice-overs consume 2 credits. If a generation fails for any reason, your credits are refunded immediately.',
    },
    {
      q: 'Do unused credits expire at the end of the month?',
      a: 'On active subscription plans, your unused monthly credits roll over into the next billing cycle as long as your subscription remains active. Purchased top-up credit packs never expire.',
    },
    {
      q: 'What is the FIRST20 coupon code?',
      a: 'Eligible new users can apply coupon code FIRST20 during checkout to get an immediate flat discount of ₹570 OFF on the FLUVIA MAX plan.',
    },
    {
      q: 'Can I purchase credits without an active subscription?',
      a: 'Yes. You can top up your account with any credit pack at any time. Our featured 5,000 credits pack (₹6,500 + 18% GST = ₹7,670 Total) provides high volume and immediate activation.',
    },
    {
      q: 'Do I get an official GST tax invoice for business expense claims?',
      a: 'Yes. Every transaction generates an official Indian GST-compliant invoice that you can view and download instantly as a PDF from your Billing settings.',
    },
    {
      q: 'Can I cancel or switch my plan at any time?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription at any time directly in your account dashboard. There are no lock-in contracts.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        {/* Header Controls */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-xs font-semibold text-[#5145CD] mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>PayU India Verified • Instant Token Fulfillment • GST Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-[#17191D] tracking-tight">
            Simple, predictable pricing for modern brands.
          </h1>
          <p className="mt-3 text-base text-[#667085] max-w-2xl mx-auto">
            Choose a monthly subscription plan or purchase top-up credits as you need them. All plans include multi-scene timeline editing, high-resolution rendering, and commercial licensing.
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setBillingInterval('month')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                billingInterval === 'month'
                  ? 'bg-white text-[#17191D] shadow-xs'
                  : 'text-[#667085] hover:text-[#17191D]'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingInterval('year')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingInterval === 'year'
                  ? 'bg-white text-[#17191D] shadow-xs'
                  : 'text-[#667085] hover:text-[#17191D]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold bg-[#EEF2FF] text-[#5145CD] px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>

          {/* Real Cost Reference */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#667085]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              <strong>Video Ad:</strong> 15 credits / video
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              <strong>Image Ad:</strong> 5 credits / image
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#5145CD]" />
              <strong>Voice-over:</strong> 2 credits / voice
            </span>
          </div>
        </div>

        {/* 4 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {allPlans.map((plan) => {
            const isAnnual = billingInterval === 'year';
            const price = isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
            const fullAnnualCharged = plan.annualMonthlyPrice * 12;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 text-left bg-white ${
                  plan.highlight
                    ? 'border-2 border-[#5145CD] shadow-lg shadow-[#5145CD]/10 lg:-translate-y-1'
                    : 'border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-sm'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold px-3 py-0.5 rounded-full border shadow-2xs ${
                        plan.highlight
                          ? 'bg-[#5145CD] text-white border-[#5145CD]'
                          : 'bg-[#F7F8FA] text-[#17191D] border-[#E5E7EB]'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <h3 className="text-xl font-bold text-[#17191D]">{plan.name}</h3>
                  </div>

                  <p className="mt-2 text-xs text-[#667085] leading-relaxed min-h-[36px]">
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="mt-5 pb-5 border-b border-[#E5E7EB]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#17191D] font-mono">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#667085] font-medium">/ month</span>
                    </div>

                    {isAnnual ? (
                      <p className="mt-1 text-[11px] text-[#5145CD] font-medium">
                        Billed annually (₹{fullAnnualCharged.toLocaleString()} / yr)
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] text-[#667085]">
                        Billed monthly • Cancel anytime
                      </p>
                    )}

                    {/* FIRST20 Promo Tag on FLUVIA MAX */}
                    {plan.couponHighlight && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold font-mono">
                        <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{plan.couponHighlight}</span>
                      </div>
                    )}
                  </div>

                  {/* Monthly Credits Pill */}
                  <div className="mt-5 p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#17191D] block">Monthly Credits</span>
                      <span className="text-[10px] text-[#667085]">Rolls over while active</span>
                    </div>
                    <span className="text-base font-bold text-[#5145CD] font-mono">
                      {plan.credits.toLocaleString()}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="mt-6 space-y-2.5 text-xs text-[#667085]">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#5145CD] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      plan.highlight
                        ? 'bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-sm'
                        : 'bg-[#F7F8FA] hover:bg-[#F1F3F5] text-[#17191D] border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* CREDIT TOP-UP PACKS SECTION */}
        {/* ========================================================================= */}
        <div className="mt-20 pt-16 border-t border-[#E5E7EB]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight">
              Top-Up Credit Packs
            </h2>
            <p className="mt-2 text-sm text-[#667085]">
              Need more credits without changing your plan? Purchase one-time top-ups that never expire.
            </p>
          </div>

          {/* Featured 5,000 Credits Pack Highlight Banner */}
          <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#EEF2FF] via-white to-[#EEF2FF] border-2 border-[#5145CD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5145CD] text-white text-[11px] font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Featured Business Top-Up</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#17191D]">
                5,000 Credits Pro Top-Up Pack
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] max-w-xl">
                Base price ₹6,500 + 18% GST (₹1,170) = <strong className="text-[#17191D]">₹7,670 Total</strong>. Includes instant credit fulfillment and official GST tax invoice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-[#5145CD] font-mono">₹6,500</p>
                <p className="text-[11px] text-[#667085]">+ 18% GST (₹7,670 incl.)</p>
              </div>
              <button
                type="button"
                onClick={() => handleBuyCreditPack('pack_5000')}
                className="py-3 px-6 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Purchase 5,000 Credits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Other Configurable Packs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks
              .filter((p) => p.id !== 'pack_5000')
              .map((pack) => (
                <div
                  key={pack.id}
                  className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all flex flex-col justify-between text-left shadow-2xs"
                >
                  <div>
                    <h4 className="font-bold text-sm text-[#17191D]">{pack.name}</h4>
                    <p className="text-xs text-[#667085] mt-1">{pack.desc}</p>
                    <div className="mt-4 pb-3 border-b border-[#E5E7EB] flex items-baseline justify-between">
                      <span className="text-xl font-bold text-[#17191D] font-mono">
                        ₹{pack.priceInr.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-[#667085]">
                        + 18% GST (₹{pack.totalInr.toFixed(0)})
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-[#667085]">
                      <span>Credits:</span>
                      <strong className="text-[#5145CD] font-mono">{pack.credits.toLocaleString()}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBuyCreditPack(pack.id)}
                    className="mt-5 w-full py-2 px-3 rounded-lg bg-[#F7F8FA] hover:bg-[#F1F3F5] text-[#17191D] border border-[#E5E7EB] text-xs font-semibold transition-all cursor-pointer"
                  >
                    Buy Pack
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <div className="mt-20 pt-16 border-t border-[#E5E7EB] max-w-3xl mx-auto text-left">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-[#667085]">
              Everything you need to know about billing, credit calculations, and invoices.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-semibold text-[#17191D] cursor-pointer hover:bg-[#F7F8FA]"
                >
                  <span>{faq.q}</span>
                  {faqOpen[i] ? (
                    <ChevronUp className="w-4 h-4 text-[#667085] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#667085] shrink-0" />
                  )}
                </button>
                {faqOpen[i] && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-[#667085] leading-relaxed border-t border-[#E5E7EB] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
