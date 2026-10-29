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
  X,
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
  Coins,
  Clock,
  FileText,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';

interface ModelBadgeItem {
  name: string;
  resBadge?: string;
  statusBadge: string;
  included: boolean;
  statusType?: 'included' | 'unavailable' | 'vip' | 'new';
}

interface SpecItem {
  label: string;
  value: string;
  included: boolean;
}

interface ChecklistItem {
  text: string;
  included: boolean;
  badge?: string;
}

interface PlanDefinition {
  id: string;
  title: string;
  subtitle: string;
  category: 'individual' | 'business';
  discountBadge?: string;
  bestValueBadge?: string;
  monthlyPrice: number;
  annualMonthlyPrice: number;
  creditsMonthly: number;
  creditsLabel: string;
  creditsLines: string[];
  fixedCreditsNote: string;
  ctaText: string;
  isRecommended?: boolean;
  couponTag?: string;
  modelsBox: {
    header: string;
    items: ModelBadgeItem[];
  };
  specsBox: {
    header: string;
    items: SpecItem[];
    extraCount: number;
  };
  bottomChecklist: ChecklistItem[];
}

export default function PricingPage() {
  const router = useRouter();

  // Toolbar state
  const [activeTab, setActiveTab] = useState<'individual' | 'business'>('individual');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year'); // Annual by default like screenshot
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  // Promo eligibility
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
    // Check if user is eligible for FIRST20 coupon
    fetch('/api/user/first-coupon')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.eligible === 'boolean') {
          setIsEligibleForFirst20(data.eligible);
        }
      })
      .catch(() => {});
  }, []);

  const toggleSpecsExpand = (planId: string) => {
    setExpandedSpecs((prev) => ({
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

  // Structured plans matching the attached reference's layout & information hierarchy
  const allPlans: PlanDefinition[] = [
    {
      id: 'plan_starter',
      title: 'STARTER',
      subtitle: 'For first-time commercial AI video creators',
      category: 'individual',
      monthlyPrice: 999,
      annualMonthlyPrice: 799,
      creditsMonthly: 500,
      creditsLabel: '500 credits/mo.',
      creditsLines: [
        '≈ 33 Commercial Video Ads (15 cr/ad)',
        '≈ 100 Studio Product Photos (5 cr/photo)',
      ],
      fixedCreditsNote: 'Fixed amount of 500 credits/mo • Rolls over',
      ctaText: 'Get Starter',
      modelsBox: {
        header: 'MODELS & RESOLUTION',
        items: [
          { name: 'Fluvia Cinematic HD', resBadge: '1080p', statusBadge: 'Included', included: true, statusType: 'included' },
          { name: 'Fal.ai Fast Media Engine', resBadge: 'HD', statusBadge: 'Included', included: true, statusType: 'included' },
          { name: 'Runway Gen-3 Alpha', statusBadge: 'No access', included: false, statusType: 'unavailable' },
          { name: 'Luma Ray Motion Engine', statusBadge: 'No access', included: false, statusType: 'unavailable' },
        ],
      },
      specsBox: {
        header: 'PRODUCTION SPECS',
        items: [
          { label: 'Max Video Length', value: '60 seconds', included: true },
          { label: 'Timeline Tracks', value: '2 scenes', included: true },
          { label: 'Saved Brand Kits', value: '2 Brand Kits', included: true },
          { label: 'Cloud Storage', value: '10 GB', included: true },
        ],
        extraCount: 4,
      },
      bottomChecklist: [
        { text: 'Parallel generations: up to 1 Video, 2 Images', included: true },
        { text: 'Watermark-free 1080p Full HD exports', included: true },
        { text: 'Access to standard commercial storyboard presets', included: true },
        { text: 'Full commercial advertising rights included', included: true },
        { text: 'Early access to Gemini Omni features', included: false },
        { text: 'Multi-seat collaborative workspace', included: false },
      ],
    },
    {
      id: 'plan_creator',
      title: 'PLUS',
      subtitle: 'For regular commercial video and reel pipelines',
      category: 'individual',
      discountBadge: '20% OFF',
      monthlyPrice: 2499,
      annualMonthlyPrice: 1999,
      creditsMonthly: 1600,
      creditsLabel: '1,600 credits/mo.',
      creditsLines: [
        '≈ 106 Commercial Video Ads (15 cr/ad)',
        '≈ 320 Studio Product Photos (5 cr/photo)',
      ],
      fixedCreditsNote: 'Fixed amount of 1,600 credits/mo • Rolls over',
      ctaText: 'Get Plus',
      modelsBox: {
        header: 'MODELS & RESOLUTION',
        items: [
          { name: 'Fluvia Cinematic HD', resBadge: '4K Ultra', statusBadge: 'Included', included: true, statusType: 'included' },
          { name: 'Runway Gen-3 Alpha', resBadge: '1080p', statusBadge: 'Priority Queue', included: true, statusType: 'included' },
          { name: 'Luma Ray Motion Engine', resBadge: 'HD', statusBadge: 'Included', included: true, statusType: 'included' },
          { name: 'ElevenLabs Voice Sync', statusBadge: 'Multilingual', included: true, statusType: 'included' },
        ],
      },
      specsBox: {
        header: 'PRODUCTION SPECS',
        items: [
          { label: 'Max Video Length', value: '180 seconds (3m)', included: true },
          { label: 'Timeline Tracks', value: 'Unlimited tracks', included: true },
          { label: 'Saved Brand Kits', value: '5 Brand Kits', included: true },
          { label: 'Cloud Storage', value: '50 GB', included: true },
        ],
        extraCount: 6,
      },
      bottomChecklist: [
        { text: 'Parallel generations: up to 2 Videos, 4 Images', included: true, badge: 'NEW' },
        { text: 'Multi-scene timeline storyboard editor', included: true },
        { text: 'Priority GPU hardware queue', included: true },
        { text: '10% discount on credit top-ups', included: true },
        { text: 'Full commercial advertising rights included', included: true },
        { text: 'Multi-seat collaborative workspace', included: false },
      ],
    },
    {
      id: 'plan_max',
      title: 'ULTRA',
      subtitle: 'For scaling digital agencies and high-performing ad teams',
      category: 'individual',
      discountBadge: '20% OFF',
      bestValueBadge: 'BEST VALUE',
      isRecommended: true,
      monthlyPrice: 4999,
      annualMonthlyPrice: 3999,
      creditsMonthly: 4000,
      creditsLabel: '4,000 credits/mo.',
      couponTag: isEligibleForFirst20 ? 'Use FIRST20 for ₹570 OFF' : undefined,
      creditsLines: [
        '≈ 266 Commercial Video Ads (15 cr/ad)',
        '≈ 800 Studio Product Photos (5 cr/photo)',
      ],
      fixedCreditsNote: 'Fixed amount of 4,000 credits/mo • Rolls over',
      ctaText: 'Get Ultra',
      modelsBox: {
        header: 'MODELS & RESOLUTION',
        items: [
          { name: 'Fluvia Cinema Master', resBadge: '4K 60fps', statusBadge: 'VIP Lane', included: true, statusType: 'vip' },
          { name: 'Runway Gen-3 Alpha', resBadge: '4K', statusBadge: 'Dedicated GPU', included: true, statusType: 'vip' },
          { name: 'Gemini Omni Storyboard', resBadge: '2K', statusBadge: 'Director Mode', included: true, statusType: 'vip' },
          { name: 'ElevenLabs Voice Design', statusBadge: 'Multilingual', included: true, statusType: 'vip' },
        ],
      },
      specsBox: {
        header: 'PRODUCTION SPECS',
        items: [
          { label: 'Max Video Length', value: '360 seconds (6m)', included: true },
          { label: 'Timeline Tracks', value: 'Unlimited + Director', included: true },
          { label: 'Saved Brand Kits', value: '15 Brand Kits', included: true },
          { label: 'Cloud Storage', value: '150 GB', included: true },
        ],
        extraCount: 8,
      },
      bottomChecklist: [
        { text: 'Parallel generations: up to 4 Videos, 8 Images', included: true, badge: 'NEW' },
        { text: 'Dedicated VIP priority GPU rendering lane', included: true },
        { text: '4K 60fps Cinema Master video exports', included: true },
        { text: '15% discount on credit top-ups', included: true, badge: '15% OFF' },
        { text: 'Expedited 2-hour SLA email & chat support', included: true },
        { text: 'Full commercial advertising rights included', included: true },
      ],
    },
    {
      id: 'plan_business',
      title: 'FOR TEAMS',
      subtitle: 'For agencies and marketing teams to create campaigns faster',
      category: 'business',
      discountBadge: '20% OFF',
      bestValueBadge: 'ENTERPRISE',
      monthlyPrice: 9999,
      annualMonthlyPrice: 7999,
      creditsMonthly: 10000,
      creditsLabel: 'Shared workspaces & credits',
      creditsLines: [
        '≈ Up to 10 member seats per workspace',
        '= 10,000 pooled credits/mo (≈ 666 Video Ads)',
      ],
      fixedCreditsNote: 'Starting from 1,000 credits/seat/mo • Pooled',
      ctaText: 'Explore Team Plans',
      modelsBox: {
        header: 'UNLIMITED MODELS & CLUSTER',
        items: [
          { name: 'Fluvia Cinema Master', resBadge: '4K 60fps', statusBadge: 'Cluster Queue', included: true, statusType: 'vip' },
          { name: 'Concurrent Cluster GPU', resBadge: '8 Concurrent', statusBadge: 'Dedicated', included: true, statusType: 'vip' },
          { name: 'Gemini Omni Storyboard', resBadge: '4K', statusBadge: 'Team Sharing', included: true, statusType: 'vip' },
          { name: 'ElevenLabs Voice Design', statusBadge: 'Team Library', included: true, statusType: 'vip' },
        ],
      },
      specsBox: {
        header: 'PRODUCTION SPECS',
        items: [
          { label: 'Max Video Length', value: '600 seconds (10m)', included: true },
          { label: 'Member Seats Included', value: 'Up to 10 Seats', included: true },
          { label: 'Saved Brand Kits', value: 'Unlimited Kits', included: true },
          { label: 'Cloud Storage', value: '500 GB Shared', included: true },
        ],
        extraCount: 10,
      },
      bottomChecklist: [
        { text: 'Access to all features, models & storyboard tools', included: true },
        { text: 'Dedicated capacity & 99.9% uptime SLA', included: true },
        { text: 'Shared workspace, brand asset pool & credit wallet', included: true },
        { text: 'Detailed usage analytics & team spend controls', included: true },
        { text: 'Priority cluster queue for faster task processing', included: true },
        { text: 'Custom B2B invoicing with 18% GST & PO support', included: true },
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    const couponParam = planId === 'plan_max' ? '&coupon=FIRST20' : '';
    router.push(
      `/checkout?type=subscription&id=${planId}&interval=${billingInterval}${couponParam}`
    );
  };

  const handleBuyCreditPack = (packId: string) => {
    router.push(`/checkout?type=pack&id=${packId}`);
  };

  const scrollToMatrix = () => {
    const el = document.getElementById('feature-matrix-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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

  const visiblePlans = activeTab === 'business'
    ? allPlans.filter((p) => p.category === 'business' || p.id === 'plan_max')
    : allPlans;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#17191D] selection:bg-[#EEF2FF] selection:text-[#5145CD] overflow-x-hidden max-w-full">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* TOP TOOLBAR (EXACT REFERENCE STRUCTURE: TABS + PILL + RECOMMENDER + TOGGLE) */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E7EB]">
          {/* Left: Category Tabs + Promotional Pill */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex p-1 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'individual'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Individual plans
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Business plans
              </button>
            </div>

            {/* Subtle Promotional Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-[#5145CD]" />
              <span>18% GST Compliant • Rollover Included</span>
            </div>
          </div>

          {/* Right: "Not sure which plan?" link + Monthly/Annual Toggle Switch */}
          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-auto">
            {/* Recommender link */}
            <button
              type="button"
              onClick={() => setIsRecommenderOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5145CD] hover:text-[#4338CA] hover:underline transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Not sure which plan?</span>
            </button>

            {/* Minimalist Switch Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold cursor-pointer ${
                  billingInterval === 'month' ? 'text-[#17191D]' : 'text-[#667085]'
                }`}
                onClick={() => setBillingInterval('month')}
              >
                Monthly
              </span>

              {/* Physical Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={billingInterval === 'year'}
                onClick={() => setBillingInterval(billingInterval === 'year' ? 'month' : 'year')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  billingInterval === 'year' ? 'bg-[#5145CD]' : 'bg-[#E5E7EB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    billingInterval === 'year' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                  billingInterval === 'year' ? 'text-[#5145CD]' : 'text-[#667085]'
                }`}
                onClick={() => setBillingInterval('year')}
              >
                <span>Annual</span>
                <span className="text-[10px] font-bold bg-[#EEF2FF] text-[#5145CD] px-1.5 py-0.2 rounded-full border border-[#C7D2FE]">
                  20% OFF
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUR-COLUMN PRICING GRID (EXACT ARCHITECTURE & DEPTH FROM SCREENSHOT) */}
        {/* ========================================================================= */}
        <div
          className={`grid gap-4 sm:gap-5 items-stretch ${
            visiblePlans.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
          }`}
        >
          {visiblePlans.map((plan) => {
            const isAnnual = billingInterval === 'year';
            const price = isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
            const fullAnnualBilled = plan.annualMonthlyPrice * 12;
            const annualSavings = (plan.monthlyPrice - plan.annualMonthlyPrice) * 12;
            const isSpecsExpanded = !!expandedSpecs[plan.id];

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 text-left bg-white ${
                  plan.isRecommended
                    ? 'border-2 border-[#5145CD] shadow-lg shadow-[#5145CD]/5 lg:-translate-y-1'
                    : 'border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-xs'
                }`}
              >
                <div>
                  {/* Card Header: Title + Discount / Value Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black tracking-tight text-[#17191D]">
                        {plan.title}
                      </h3>
                      {plan.discountBadge && isAnnual && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]">
                          {plan.discountBadge}
                        </span>
                      )}
                    </div>

                    {plan.bestValueBadge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5145CD] text-white">
                        {plan.bestValueBadge}
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs text-[#667085] mt-1 min-h-[34px] leading-relaxed">
                    {plan.subtitle}
                  </p>

                  {/* Inner Credit Allowance Box (Exact Reference Pattern) */}
                  <div className="mt-3.5 p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#17191D]">
                      <Coins className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span>{plan.creditsLabel}</span>
                    </div>

                    <ul className="space-y-1 text-[11px] text-[#667085] pl-1">
                      {plan.creditsLines.map((line, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#667085]">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-[#E5E7EB] flex items-center gap-1.5 text-[10px] font-medium text-[#10B981]">
                      <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                      <span>{plan.fixedCreditsNote}</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mt-4 pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {isAnnual && (
                        <span className="text-base text-[#667085] line-through font-mono">
                          ₹{plan.monthlyPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-black text-[#17191D] font-mono">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#667085] font-medium">
                        per month, {isAnnual ? 'billed annually' : 'billed monthly'}
                      </span>
                    </div>

                    {/* FIRST20 Coupon Callout on Ultra */}
                    {plan.couponTag && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-semibold font-mono">
                        <Tag className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{plan.couponTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA Button */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        plan.isRecommended
                          ? 'bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-sm'
                          : 'bg-[#F7F8FA] hover:bg-[#F1F3F5] text-[#17191D] border border-[#E5E7EB]'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-[11px] text-center text-[#667085]">
                      {isAnnual
                        ? `Save ₹${annualSavings.toLocaleString()} compared to monthly`
                        : 'No difference compared to monthly'}
                    </p>
                  </div>

                  {/* Feature Box 1: MODELS & RESOLUTION (Exact Reference Inner Panel) */}
                  <div className="mt-5 p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#17191D]">
                      <span>{plan.modelsBox.header}</span>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className="text-[#5145CD] hover:underline normal-case font-medium"
                      >
                        Learn more
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {plan.modelsBox.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] gap-1"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {item.included ? (
                              <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                            ) : (
                              <X className="w-3 h-3 text-[#667085]/40 shrink-0" />
                            )}
                            <span
                              className={`truncate ${
                                item.included ? 'text-[#17191D] font-medium' : 'text-[#667085]/60'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white border border-[#E5E7EB] text-[#667085]">
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                                item.statusType === 'vip'
                                  ? 'bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]'
                                  : item.statusType === 'included'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-white border border-[#E5E7EB] text-[#667085]/60'
                              }`}
                            >
                              {item.statusBadge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Box 2: PRODUCTION SPECS (Exact Reference Inner Panel) */}
                  <div className="mt-3.5 p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#17191D]">
                      <span>{plan.specsBox.header}</span>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className="text-[#5145CD] hover:underline normal-case font-medium"
                      >
                        Learn more
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {plan.specsBox.items.map((spec, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-[#667085]">{spec.label}</span>
                          <span className="font-semibold text-[#17191D] font-mono text-[10px]">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Expand row */}
                    <button
                      type="button"
                      onClick={() => toggleSpecsExpand(plan.id)}
                      className="pt-1 w-full text-center text-[10px] font-semibold text-[#5145CD] hover:text-[#4338CA] flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>
                        {isSpecsExpanded
                          ? 'Collapse specifications'
                          : `+ ${plan.specsBox.extraCount} more production specs`}
                      </span>
                      {isSpecsExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Checklist */}
                  <div className="mt-4 pt-3 border-t border-[#F1F3F5] space-y-1.5">
                    {plan.bottomChecklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px]">
                        {item.included ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-[#667085]/40 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`leading-snug ${
                            item.included ? 'text-[#17191D]' : 'text-[#667085]/60'
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.badge && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer note */}
                <div className="mt-5 pt-3 border-t border-[#E5E7EB] text-[10px] text-[#667085] flex items-center justify-between">
                  <span>+ 18% GST at checkout</span>
                  <span className="text-[#10B981] font-semibold">Instant setup</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small Footnote below Cards (Matching Screenshot) */}
        <div className="mt-6 text-center text-[11px] text-[#667085] max-w-3xl mx-auto space-y-1">
          <p>
            Generation speeds, resolution exports, and model access apply directly via the Fluvia Flow creative suite.
          </p>
          <p>
            Prices exclude applicable 18% GST, calculated transparently at checkout. Unused subscription credits roll over into subsequent months while active. Cancel anytime.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE SIDE-BY-SIDE FEATURE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <div id="feature-matrix-section">
          <FeatureComparisonMatrix
            billingInterval={billingInterval}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED CREDIT TOP-UP PACKS SECTION */}
        {/* ========================================================================= */}
        <CreditTopUpSection onBuyPack={handleBuyCreditPack} />

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section className="mt-20 pt-16 border-t border-[#E5E7EB] max-w-3xl mx-auto text-left">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#C7D2FE]">
              Billing & Credit FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#667085]">
              Everything you need to know about Fluvia Flow plans, rollovers, and GST compliance.
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
