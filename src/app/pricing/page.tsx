'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PlanRecommenderModal } from '@/components/pricing/PlanRecommenderModal';
import { FeatureComparisonMatrix } from '@/components/pricing/FeatureComparisonMatrix';
import { CreditTopUpSection } from '@/components/pricing/CreditTopUpSection';
import { AnimatedDiscountGiftBox } from '@/components/pricing/AnimatedDiscountGiftBox';
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
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

interface FreeGenItem {
  name: string;
  resBadge?: string;
  gensBadge: string;
  included: boolean;
}

interface UnlimitedModelItem {
  name: string;
  resBadge?: string;
  unlimitedBadge: string;
  included: boolean;
}

interface PlanCardData {
  id: string;
  title: string;
  subtitle: string;
  category: 'individual' | 'business';
  discountBadge?: string;
  bestValueBadge?: string;
  usdPriceAnnual: number;
  usdPriceMonthly: number;
  usdStrikethrough?: number;
  inrPriceAnnual: number;
  inrPriceMonthly: number;
  inrStrikethrough?: number;
  creditsMonthly: number;
  creditsLabel: string;
  creditsLines: string[];
  fixedCreditsNote: string;
  ctaText: string;
  isRecommended?: boolean;
  couponTag?: string;
  freeGensBox: {
    header: string;
    items: FreeGenItem[];
  };
  unlimitedGensBox: {
    header: string;
    items: UnlimitedModelItem[];
    extraCount: number;
    extraItems: UnlimitedModelItem[];
  };
  specialBanner?: {
    title: string;
    subtitle: string;
  };
  bottomChecklist: {
    text: string;
    included: boolean;
    badge?: string;
    badgeColor?: string;
  }[];
}

export default function PricingPage() {
  const router = useRouter();

  // Toolbar state
  const [activeTab, setActiveTab] = useState<'individual' | 'business'>('individual');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year'); // Annual by default like screenshot
  const [currency, setCurrency] = useState<'usd' | 'inr'>('usd'); // USD default to match screenshot exactly, toggleable to INR
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark'); // Dark mode by default to match screenshot 1:1
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});

  // Ultra Tier selector: 0 = 3,000, 1 = 6,000, 2 = 9,000
  const [ultraTierIndex, setUltraTierIndex] = useState<number>(0);

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

  const isDark = themeMode === 'dark';

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

  const toggleAccordion = (planId: string) => {
    setExpandedAccordions((prev) => ({
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

  // Ultra Tier definitions matching `< 3,000 • 6,000 • 9,000 >`
  const ultraTiers = [
    {
      credits: 3000,
      gens: 1500,
      videos: 200,
      usdAnnual: 99,
      usdMonthly: 129,
      usdStrikethrough: 129,
      inrAnnual: 3999,
      inrMonthly: 4999,
      inrStrikethrough: 4999,
    },
    {
      credits: 6000,
      gens: 3000,
      videos: 400,
      usdAnnual: 189,
      usdMonthly: 249,
      usdStrikethrough: 249,
      inrAnnual: 7499,
      inrMonthly: 9499,
      inrStrikethrough: 9499,
    },
    {
      credits: 9000,
      gens: 4500,
      videos: 600,
      usdAnnual: 269,
      usdMonthly: 349,
      usdStrikethrough: 349,
      inrAnnual: 10999,
      inrMonthly: 13999,
      inrStrikethrough: 13999,
    },
  ];

  const currentUltraTier = ultraTiers[ultraTierIndex];

  // 4 Core Plans matching the screenshot 1:1
  const plansData: PlanCardData[] = [
    {
      id: 'plan_starter',
      title: 'STARTER',
      subtitle: 'For first-time AI creators',
      category: 'individual',
      usdPriceAnnual: 15,
      usdPriceMonthly: 15,
      inrPriceAnnual: 799,
      inrPriceMonthly: 999,
      creditsMonthly: currency === 'usd' ? 200 : 500,
      creditsLabel: currency === 'usd' ? '200 credits/mo.' : '500 credits/mo.',
      creditsLines: [
        '= 100 Nano Banana Pro Generations',
        '~ 11 Seedance 2.0 Fast videos',
      ],
      fixedCreditsNote: currency === 'usd' ? 'Fixed amount of 200 credits/mo' : 'Fixed amount of 500 credits/mo',
      ctaText: 'Get Starter',
      freeGensBox: {
        header: 'FREE GENERATIONS',
        items: [
          { name: 'Genjutsu Lite', resBadge: '720p / 1080p', gensBadge: '5 free gens', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '10 free gens', included: true },
          { name: 'Higgsfield Genjutsu', gensBadge: 'No free gens', included: false },
          { name: 'Higgsfield Ads Studio', gensBadge: '10 free gens', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & FREE GENS',
        items: [
          { name: 'Nano Banana 2', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Kling 3.0', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Nano Banana Pro', unlimitedBadge: 'No unlimited', included: false },
        ],
        extraCount: 3,
        extraItems: [
          { name: 'Seedream 5.0 Pro', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Luma Ray Motion', unlimitedBadge: 'No unlimited', included: false },
          { name: 'ElevenLabs Voice Sync', unlimitedBadge: 'Standard speed', included: false },
        ],
      },
      bottomChecklist: [
        { text: 'Parallel generations: up to 2 Videos, 4 Images', included: true },
        { text: 'Access to Seedance 2.0 Fast & 2.0 Mini', included: true },
        { text: 'Access to selected models only & features', included: false },
        { text: 'Early access to advanced AI features', included: false },
        { text: 'Access to unlimited marketplace', included: false },
        { text: 'Lowest cost per credit', included: false },
      ],
    },
    {
      id: 'plan_creator',
      title: 'PLUS',
      subtitle: 'For everyday AI creation',
      category: 'individual',
      discountBadge: '20% OFF',
      usdPriceAnnual: 39,
      usdPriceMonthly: 49,
      usdStrikethrough: 49,
      inrPriceAnnual: 1999,
      inrPriceMonthly: 2499,
      inrStrikethrough: 2499,
      creditsMonthly: currency === 'usd' ? 1000 : 1600,
      creditsLabel: currency === 'usd' ? '1,000 credits/mo.' : '1,600 credits/mo.',
      creditsLines: [
        '= 500 Nano Banana Pro Generations',
        '~ 67 Seedance 2.5 videos',
      ],
      fixedCreditsNote: currency === 'usd' ? 'Fixed amount of 1,000 credits/mo' : 'Fixed amount of 1,600 credits/mo',
      ctaText: 'Get Plus',
      freeGensBox: {
        header: 'FREE GENERATIONS',
        items: [
          { name: 'Genjutsu Lite', resBadge: '720p / 1080p', gensBadge: '5 free gens', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '30 free gens', included: true },
          { name: 'Higgsfield Genjutsu', resBadge: '720p', gensBadge: '3 free gens', included: true },
          { name: 'Higgsfield Ads Studio', gensBadge: '10 free gens', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & FREE GENS',
        items: [
          { name: 'Nano Banana 2', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Nano Banana Pro', unlimitedBadge: 'No unlimited', included: false },
        ],
        extraCount: 7,
        extraItems: [
          { name: 'Seedream 5.0 Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedance 2.0 Fast', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Luma Ray Motion', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Runway Gen-3 Alpha', resBadge: '1080p', unlimitedBadge: 'Priority Queue', included: true },
          { name: 'ElevenLabs Voice Sync', unlimitedBadge: 'Multilingual', included: true },
          { name: 'Ad Studio Templates', unlimitedBadge: 'Full Library', included: true },
          { name: 'Fast Media Engine', unlimitedBadge: 'Unlimited', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Unlimited paid parallel generations', included: true, badge: 'NEW', badgeColor: 'bg-[#FEF08A] text-[#854D0E]' },
        { text: 'Access to all Seedance models', included: true },
        { text: 'Access to all models & features', included: true },
        { text: 'Early access to advanced AI features', included: true },
        { text: 'Access to unlimited marketplace', included: true },
        { text: 'Lowest cost per credit', included: false },
      ],
    },
    {
      id: 'plan_max',
      title: 'ULTRA',
      subtitle: 'For ambitious AI projects',
      category: 'individual',
      discountBadge: '23% OFF',
      bestValueBadge: 'BEST VALUE',
      isRecommended: true,
      usdPriceAnnual: currentUltraTier.usdAnnual,
      usdPriceMonthly: currentUltraTier.usdMonthly,
      usdStrikethrough: currentUltraTier.usdStrikethrough,
      inrPriceAnnual: currentUltraTier.inrAnnual,
      inrPriceMonthly: currentUltraTier.inrMonthly,
      inrStrikethrough: currentUltraTier.inrStrikethrough,
      creditsMonthly: currentUltraTier.credits,
      creditsLabel: `${currentUltraTier.credits.toLocaleString()} credits/mo.`,
      creditsLines: [
        `= ${currentUltraTier.gens.toLocaleString()} Nano Banana Pro Generations`,
        `~ ${currentUltraTier.videos} Seedance 2.5 videos`,
      ],
      fixedCreditsNote: `Tiered allowance: ${currentUltraTier.credits.toLocaleString()} credits/mo`,
      ctaText: 'Get Ultra',
      couponTag: isEligibleForFirst20 ? (currency === 'usd' ? 'Use FIRST20 for $7 OFF' : 'Use FIRST20 for ₹570 OFF') : undefined,
      freeGensBox: {
        header: 'FREE GENERATIONS',
        items: [
          { name: 'Genjutsu Lite', resBadge: '720p / 1080p', gensBadge: '5 free gens', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '30 free gens', included: true },
          { name: 'Higgsfield Genjutsu', resBadge: '720p', gensBadge: '3 free gens', included: true },
          { name: 'Higgsfield Ads Studio', gensBadge: '10 free gens', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & FREE GENS',
        items: [
          { name: 'Nano Banana 2', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Nano Banana Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
        ],
        extraCount: 7,
        extraItems: [
          { name: 'Seedream 5.0 Pro', resBadge: '4K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedance 2.5 Director Mode', resBadge: '4K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0 Pro', resBadge: '4K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Gemini Omni Storyboard Director', resBadge: '4K', unlimitedBadge: 'VIP Dedicated', included: true },
          { name: 'Runway Gen-3 Alpha Dedicated GPU', resBadge: '4K', unlimitedBadge: 'VIP Lane', included: true },
          { name: 'ElevenLabs Voice Design', unlimitedBadge: 'Multilingual VIP', included: true },
          { name: 'Cinema Master 60fps', resBadge: '4K 60fps', unlimitedBadge: 'VIP Queue', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Unlimited paid parallel generations', included: true, badge: 'NEW', badgeColor: 'bg-[#FEF08A] text-[#854D0E]' },
        { text: 'Access to all Seedance models', included: true },
        { text: 'Access to all models & features', included: true },
        { text: 'Early access to advanced AI features', included: true },
        { text: 'Access to unlimited marketplace', included: true },
        { text: 'Lowest cost per credit', included: true, badge: '60% CHEAPER', badgeColor: 'bg-[#CCFF00] text-black font-extrabold' },
      ],
    },
    {
      id: 'plan_business',
      title: 'FOR TEAMS',
      subtitle: 'For agencies and small teams to create faster',
      category: 'business',
      discountBadge: 'UP TO 30% OFF',
      usdPriceAnnual: 65,
      usdPriceMonthly: 85,
      inrPriceAnnual: 7999,
      inrPriceMonthly: 9999,
      creditsMonthly: 10000,
      creditsLabel: 'Shared workspaces & credits',
      creditsLines: [
        '= 2–15 seats per workspace',
        '= Up to 37,500 credits/mo pooled',
      ],
      fixedCreditsNote: 'Starting from 1,000 credits/seat/mo',
      ctaText: 'Explore Plans',
      specialBanner: {
        title: '30-DAY UNLIMITED SEEDANCE 2.5',
        subtitle: 'Available on business plans only',
      },
      freeGensBox: {
        header: 'UNLIMITED MODELS',
        items: [
          { name: 'Nano Banana Pro', resBadge: '4K', gensBadge: '7-day unlimited', included: true },
          { name: 'Seedream 5.0 Pro', resBadge: '2K', gensBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0', gensBadge: '7-day unlimited', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'AGENCY COLLABORATION',
        items: [
          { name: 'Cluster GPU Rendering', resBadge: '8 Concurrent', unlimitedBadge: 'Dedicated', included: true },
          { name: 'Shared Team Workspace', unlimitedBadge: 'Unlimited Seats', included: true },
          { name: 'Gemini Omni Storyboard Director', resBadge: '4K', unlimitedBadge: 'Team Library', included: true },
        ],
        extraCount: 4,
        extraItems: [
          { name: 'ElevenLabs Voice Design', unlimitedBadge: 'Shared Assets', included: true },
          { name: 'Centralized Brand Kits', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Admin Spend Controls', unlimitedBadge: 'Granular', included: true },
          { name: 'Custom SSO & SAML', unlimitedBadge: 'Included', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Access to all features & models', included: true },
        { text: 'Dedicated capacity (SLA)', included: true },
        { text: 'Shared workspace & credit pool', included: true },
        { text: 'Early access to advanced AI features', included: true },
        { text: 'Detailed analytics & priority support', included: true },
        { text: 'Admin spend control', included: true },
        { text: 'Priority queue for faster task processing', included: true },
        { text: 'Custom SSO', included: true },
        { text: 'Delegated top-up access', included: true },
      ],
    },
  ];

  const visiblePlans = activeTab === 'business'
    ? plansData.filter((p) => p.category === 'business' || p.id === 'plan_max')
    : plansData;

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
      a: 'Eligible new registered creators can apply coupon code FIRST20 exclusively on the ULTRA plan to receive an immediate discount verified server-side at checkout.',
    },
    {
      q: 'Can I purchase credits without an active subscription plan?',
      a: 'Yes. You can purchase one-time credit top-ups at any time directly through our Credit Top-Up section. Top-up packs provide immediate balance with zero recurring commitments.',
    },
    {
      q: 'Are taxes and local GST included in the price?',
      a: 'Prices exclude applicable local sales taxes or Indian GST (18%), itemized transparently before payment. You can enter your company GSTIN at checkout to receive official vector PDF tax invoices for business expense input tax credit (ITC) claims.',
    },
    {
      q: 'Can I upgrade, downgrade, or cancel my subscription at any time?',
      a: 'Yes. You can upgrade, downgrade, or cancel your subscription plan at any time directly in your account billing dashboard. When upgrading, remaining credits are preserved.',
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 selection:bg-[#5145CD] selection:text-white ${
        isDark ? 'bg-[#0B0D14] text-white' : 'bg-[#FFFFFF] text-[#17191D]'
      }`}
    >
      <Header />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* TOP TOOLBAR (EXACT REFERENCE SCREENSHOT STRUCTURE) */}
        {/* ========================================================================= */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b ${
            isDark ? 'border-white/10' : 'border-[#E5E7EB]'
          }`}
        >
          {/* Left: Category Tabs + Promotional Pill */}
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className={`inline-flex p-1 rounded-xl border ${
                isDark ? 'bg-[#141824] border-white/10' : 'bg-[#F7F8FA] border-[#E5E7EB]'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'individual'
                    ? isDark
                      ? 'bg-[#22293D] text-white shadow-xs'
                      : 'bg-white text-[#17191D] shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
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
                    ? isDark
                      ? 'bg-[#22293D] text-white shadow-xs'
                      : 'bg-white text-[#17191D] shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Business plans
              </button>
            </div>

            {/* Glowing Promotional Pill Badge (Matching Screenshot) */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80 border-blue-500/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-[#EEF2FF] border-[#C7D2FE] text-[#5145CD]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>⚡ 30-DAY UNLIMITED SEEDANCE 2.5</span>
            </div>
          </div>

          {/* Right: Recommender + Currency Switch + Monthly/Annual Toggle + Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap self-start md:self-auto">
            {/* Recommender link */}
            <button
              type="button"
              onClick={() => setIsRecommenderOpen(true)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-[#5145CD] hover:text-[#4338CA]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Not sure which plan?</span>
            </button>

            {/* Currency Selector Pill */}
            <div
              className={`inline-flex p-0.5 rounded-lg border text-[11px] font-bold ${
                isDark ? 'bg-[#141824] border-white/10' : 'bg-[#F1F3F5] border-[#E5E7EB]'
              }`}
            >
              <button
                type="button"
                onClick={() => setCurrency('usd')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  currency === 'usd'
                    ? isDark
                      ? 'bg-white text-black'
                      : 'bg-white text-[#17191D] shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#667085]'
                }`}
              >
                $ USD
              </button>
              <button
                type="button"
                onClick={() => setCurrency('inr')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  currency === 'inr'
                    ? isDark
                      ? 'bg-white text-black'
                      : 'bg-white text-[#17191D] shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#667085]'
                }`}
              >
                ₹ INR
              </button>
            </div>

            {/* Minimalist Switch Toggle (Monthly vs Annual) */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold cursor-pointer ${
                  billingInterval === 'month'
                    ? isDark
                      ? 'text-white'
                      : 'text-[#17191D]'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-[#667085]'
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
                  billingInterval === 'year'
                    ? 'bg-[#A3E635]'
                    : isDark
                    ? 'bg-slate-700'
                    : 'bg-[#E5E7EB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-sm ring-0 transition duration-200 ease-in-out ${
                    billingInterval === 'year' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-xs font-semibold cursor-pointer flex items-center gap-1 ${
                  billingInterval === 'year'
                    ? isDark
                      ? 'text-white'
                      : 'text-[#5145CD]'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-[#667085]'
                }`}
                onClick={() => setBillingInterval('year')}
              >
                <span>Annual</span>
                {billingInterval === 'year' && (
                  <span className="text-[10px] font-bold bg-[#EF4444] text-white px-1.5 py-0.2 rounded">
                    20% OFF
                  </span>
                )}
              </span>
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#141824] border-white/10 text-slate-300 hover:text-white'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:text-black'
              }`}
              title={isDark ? 'Switch to Studio Light' : 'Switch to Obsidian Dark'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#5145CD]" />}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ANIMATED DISCOUNT GIFT BOX (UNWRAP VOUCHER BANNER) */}
        {/* ========================================================================= */}
        <AnimatedDiscountGiftBox
          billingInterval={billingInterval}
          isDark={isDark}
          onApplyCoupon={(code) => handleSelectPlan('plan_max')}
        />

        {/* ========================================================================= */}
        {/* FOUR-COLUMN PRICING GRID (EXACT SCREENSHOT COLOURS, SHADOWS & HIERARCHY) */}
        {/* ========================================================================= */}
        <div
          className={`grid gap-4 lg:gap-5 items-stretch ${
            visiblePlans.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
          }`}
        >
          {visiblePlans.map((plan) => {
            const isAnnual = billingInterval === 'year';
            const price = currency === 'usd'
              ? (isAnnual ? plan.usdPriceAnnual : plan.usdPriceMonthly)
              : (isAnnual ? plan.inrPriceAnnual : plan.inrPriceMonthly);
            const strikethroughPrice = currency === 'usd' ? plan.usdStrikethrough : plan.inrStrikethrough;
            const currencySymbol = currency === 'usd' ? '$' : '₹';
            const annualSavings = currency === 'usd'
              ? (plan.usdPriceMonthly - plan.usdPriceAnnual) * 12
              : (plan.inrPriceMonthly - plan.inrPriceAnnual) * 12;
            const isAccordionExpanded = !!expandedAccordions[plan.id];

            // Card Themes mapping to screenshot
            const isStarter = plan.id === 'plan_starter';
            const isPlus = plan.id === 'plan_creator';
            const isUltra = plan.id === 'plan_max';
            const isTeams = plan.id === 'plan_business';

            // Distinct card styling
            let cardWrapperClass = '';
            let allowanceBoxClass = '';
            let allowanceHeaderColor = '';
            let ctaButtonClass = '';
            let freeGensHeaderColor = '';
            let freeGensBoxClass = '';
            let unlimitedBoxClass = '';

            if (isStarter) {
              cardWrapperClass = isDark
                ? 'bg-[#12151D] border border-[#2B303C] hover:border-slate-500'
                : 'bg-white border border-slate-300 shadow-sm';
              allowanceBoxClass = isDark
                ? 'bg-[#181D29] border border-white/5'
                : 'bg-slate-50 border-slate-200';
              allowanceHeaderColor = isDark ? 'text-white' : 'text-slate-900';
              ctaButtonClass = isDark
                ? 'bg-white hover:bg-slate-200 text-black font-extrabold shadow-md'
                : 'bg-slate-900 hover:bg-slate-800 text-white font-extrabold';
              freeGensHeaderColor = isDark ? 'text-white' : 'text-slate-800';
              freeGensBoxClass = isDark
                ? 'bg-[#181D29]/60 border border-white/5'
                : 'bg-slate-50/80 border-slate-200';
              unlimitedBoxClass = isDark
                ? 'bg-[#181D29]/60 border border-white/5'
                : 'bg-slate-50/80 border-slate-200';
            } else if (isPlus) {
              cardWrapperClass = isDark
                ? 'bg-[#0F1813] border-2 border-[#84CC16] shadow-[0_0_30px_rgba(132,204,22,0.18)]'
                : 'bg-white border-2 border-[#84CC16] shadow-md shadow-emerald-500/10';
              allowanceBoxClass = isDark
                ? 'bg-[#142318] border border-[#84CC16]/30'
                : 'bg-emerald-50/70 border-emerald-200';
              allowanceHeaderColor = 'text-[#A3E635]';
              ctaButtonClass = 'bg-[#CCFF00] hover:bg-[#B6E600] text-black font-black shadow-[0_0_20px_rgba(204,255,0,0.35)]';
              freeGensHeaderColor = 'text-[#A3E635]';
              freeGensBoxClass = isDark
                ? 'bg-[#142318]/70 border border-[#84CC16]/20'
                : 'bg-emerald-50/50 border-emerald-200';
              unlimitedBoxClass = isDark
                ? 'bg-[#142318]/70 border border-[#84CC16]/20'
                : 'bg-emerald-50/50 border-emerald-200';
            } else if (isUltra) {
              cardWrapperClass = isDark
                ? 'bg-[#1E0F1A] border-2 border-[#FF2D78] shadow-[0_0_40px_rgba(255,45,120,0.3)] ring-1 ring-[#FF2D78]/40 lg:-translate-y-2'
                : 'bg-white border-2 border-[#EC4899] shadow-xl shadow-pink-500/15 ring-2 ring-pink-400/20 lg:-translate-y-2';
              allowanceBoxClass = isDark
                ? 'bg-[#271323] border border-[#FF2D78]/35'
                : 'bg-pink-50/70 border-pink-200';
              allowanceHeaderColor = 'text-[#FF66B2]';
              ctaButtonClass = 'bg-[#FF2D78] hover:bg-[#E02469] text-white font-black shadow-[0_0_25px_rgba(255,45,120,0.55)]';
              freeGensHeaderColor = 'text-[#FF66B2]';
              freeGensBoxClass = isDark
                ? 'bg-[#271323]/60 border border-[#FF2D78]/25'
                : 'bg-pink-50/40 border-pink-200';
              unlimitedBoxClass = isDark
                ? 'bg-[#271323]/60 border border-[#FF2D78]/25'
                : 'bg-pink-50/40 border-pink-200';
            } else if (isTeams) {
              cardWrapperClass = isDark
                ? 'bg-[#0D1628] border-2 border-[#2563EB] shadow-[0_0_30px_rgba(37,99,235,0.25)]'
                : 'bg-white border-2 border-blue-400 shadow-md shadow-blue-500/10';
              allowanceBoxClass = isDark
                ? 'bg-[#101D33] border border-[#2563EB]/35'
                : 'bg-blue-50/70 border-blue-200';
              allowanceHeaderColor = 'text-[#60A5FA]';
              ctaButtonClass = 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black shadow-[0_0_20px_rgba(37,99,235,0.4)]';
              freeGensHeaderColor = 'text-[#60A5FA]';
              freeGensBoxClass = isDark
                ? 'bg-[#101D33]/70 border border-[#2563EB]/20'
                : 'bg-blue-50/50 border-blue-200';
              unlimitedBoxClass = isDark
                ? 'bg-[#101D33]/70 border border-[#2563EB]/20'
                : 'bg-blue-50/50 border-blue-200';
            }

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 text-left ${cardWrapperClass}`}
              >
                <div>
                  {/* Card Header: Title + Discount / Value Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
                        {plan.title}
                      </h3>
                      {plan.discountBadge && isAnnual && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#FF1F66] text-white shadow-xs">
                          {plan.discountBadge}
                        </span>
                      )}
                    </div>

                    {plan.bestValueBadge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#0284C7] text-white flex items-center gap-1 shadow-xs">
                        <span>◆</span>
                        <span>{plan.bestValueBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className={`text-xs mt-1 min-h-[32px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
                    {plan.subtitle}
                  </p>

                  {/* Allowance Box (Matching Screenshot Pattern) */}
                  <div className={`mt-3.5 p-3.5 rounded-xl border space-y-2 ${allowanceBoxClass}`}>
                    <div className={`flex items-center gap-1.5 font-black text-xs ${allowanceHeaderColor}`}>
                      {isTeams ? (
                        <Users className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <Coins className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{plan.creditsLabel}</span>
                    </div>

                    <ul className={`space-y-1 text-[11px] pl-1 ${isDark ? 'text-slate-300' : 'text-[#667085]'}`}>
                      {plan.creditsLines.map((line, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="opacity-60">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Interactive Ultra Tier Slider if Ultra */}
                    {isUltra ? (
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setUltraTierIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                          title="Previous credit tier"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 font-mono">
                          {ultraTiers.map((tier, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setUltraTierIndex(idx)}
                              className={`px-1.5 py-0.5 rounded font-bold cursor-pointer transition-all ${
                                ultraTierIndex === idx
                                  ? 'bg-[#FF2D78] text-white shadow-xs'
                                  : isDark
                                  ? 'text-slate-400 hover:text-white'
                                  : 'text-slate-600 hover:text-black'
                              }`}
                            >
                              {tier.credits.toLocaleString()}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setUltraTierIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                          title="Next credit tier"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`pt-2 border-t flex items-center gap-1.5 text-[10px] font-semibold ${
                          isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-[#667085]'
                        }`}
                      >
                        <Check className="w-3 h-3 shrink-0 text-[#10B981]" />
                        <span>{plan.fixedCreditsNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  <div className={`mt-4 pb-4 border-b ${isDark ? 'border-white/10' : 'border-[#E5E7EB]'}`}>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {isAnnual && strikethroughPrice && (
                        <span className="text-base line-through font-mono text-[#FF1F66] font-bold">
                          {currencySymbol}{strikethroughPrice.toLocaleString()}
                        </span>
                      )}
                      <span className={`text-3xl font-black font-mono tracking-tight ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
                        {isTeams ? 'From ' : ''}{currencySymbol}{price.toLocaleString()}
                      </span>
                      <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
                        {isTeams ? 'per seat/month' : `per month, ${isAnnual ? 'billed annually' : 'billed monthly'}`}
                      </span>
                    </div>

                    {/* FIRST20 Coupon Tag Callout on Ultra */}
                    {plan.couponTag && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FF2D78]/20 border border-[#FF2D78]/40 text-[10px] text-[#FF66B2] font-black font-mono">
                        <Tag className="w-3 h-3 text-[#FF2D78] shrink-0" />
                        <span>{plan.couponTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA Button */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 transform hover:scale-[1.01] active:scale-98 ${ctaButtonClass}`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <p className={`text-[11px] text-center ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
                      {isTeams
                        ? 'Save up to 30% with annual billing'
                        : isAnnual
                        ? `Save ${currencySymbol}${annualSavings.toLocaleString()} compared to monthly`
                        : 'No difference compared to monthly'}
                    </p>
                  </div>

                  {/* Special Banner for Teams (Matching Screenshot) */}
                  {plan.specialBanner && (
                    <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 border border-blue-500/40 text-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <p className="text-[11px] font-black text-blue-300 uppercase tracking-wider flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span>{plan.specialBanner.title}</span>
                      </p>
                      <p className="text-[10px] text-blue-400/80 mt-0.5">
                        {plan.specialBanner.subtitle}
                      </p>
                    </div>
                  )}

                  {/* Feature Box 1: FREE GENERATIONS / UNLIMITED MODELS */}
                  <div className={`mt-4 p-3 rounded-xl border space-y-2 ${freeGensBoxClass}`}>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400">🎁</span>
                        <span className={freeGensHeaderColor}>{plan.freeGensBox.header}</span>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className={`hover:underline normal-case font-medium text-[10px] ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-[#5145CD]'
                        }`}
                      >
                        Learn more
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {plan.freeGensBox.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            {item.included ? (
                              <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                            ) : (
                              <X className={`w-3 h-3 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            )}
                            <span
                              className={`truncate ${
                                item.included
                                  ? isDark
                                    ? 'text-slate-200 font-medium'
                                    : 'text-[#17191D] font-medium'
                                  : isDark
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                                  isDark
                                    ? 'bg-white/5 border-white/10 text-slate-300'
                                    : 'bg-white border-[#E5E7EB] text-[#667085]'
                                }`}
                              >
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                item.included
                                  ? 'bg-[#393113] text-[#FACC15] border border-[#CA8A04]/40'
                                  : isDark
                                  ? 'bg-white/5 text-slate-500 border border-white/5'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {item.gensBadge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Box 2: UNLIMITED & FREE GENS */}
                  <div className={`mt-3.5 p-3 rounded-xl border space-y-2 ${unlimitedBoxClass}`}>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-400 font-bold">∞</span>
                        <span className={freeGensHeaderColor}>{plan.unlimitedGensBox.header}</span>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className={`hover:underline normal-case font-medium text-[10px] ${
                          isDark ? 'text-slate-400 hover:text-white' : 'text-[#5145CD]'
                        }`}
                      >
                        Learn more
                      </button>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {plan.unlimitedGensBox.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            {item.included ? (
                              <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                            ) : (
                              <X className={`w-3 h-3 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            )}
                            <span
                              className={`truncate ${
                                item.included
                                  ? isDark
                                    ? 'text-slate-200 font-medium'
                                    : 'text-[#17191D] font-medium'
                                  : isDark
                                  ? 'text-slate-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                                  isDark
                                    ? 'bg-white/5 border-white/10 text-slate-300'
                                    : 'bg-white border-[#E5E7EB] text-[#667085]'
                                }`}
                              >
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                item.included
                                  ? 'bg-[#393113] text-[#FACC15] border border-[#CA8A04]/40'
                                  : isDark
                                  ? 'bg-white/5 text-slate-500 border border-white/5'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {item.unlimitedBadge}
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Expandable Extra Models */}
                      {isAccordionExpanded &&
                        plan.unlimitedGensBox.extraItems.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-1 animate-in fade-in duration-200">
                            <div className="flex items-center gap-1.5 truncate">
                              {item.included ? (
                                <Check className="w-3 h-3 text-[#10B981] shrink-0" />
                              ) : (
                                <X className={`w-3 h-3 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                              )}
                              <span className={`truncate ${item.included ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                                {item.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {item.resBadge && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono border bg-white/5 border-white/10 text-slate-300">
                                  {item.resBadge}
                                </span>
                              )}
                              <span
                                className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                  item.included
                                    ? 'bg-[#393113] text-[#FACC15] border border-[#CA8A04]/40'
                                    : 'bg-white/5 text-slate-500 border border-white/5'
                                }`}
                              >
                                {item.unlimitedBadge}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Accordion Expand Link (Exact Reference Pattern) */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(plan.id)}
                      className={`pt-1 w-full text-center text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        isDark ? 'text-slate-400 hover:text-white' : 'text-[#5145CD] hover:text-[#4338CA]'
                      }`}
                    >
                      <span>
                        {isAccordionExpanded
                          ? 'Collapse models'
                          : `+ ${plan.unlimitedGensBox.extraCount} unlimited & free generation models`}
                      </span>
                      {isAccordionExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Checklist */}
                  <div className={`mt-4 pt-3 border-t space-y-1.5 ${isDark ? 'border-white/10' : 'border-[#F1F3F5]'}`}>
                    {plan.bottomChecklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px]">
                        {item.included ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        ) : (
                          <X className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                        )}
                        <span
                          className={`leading-snug ${
                            item.included
                              ? isDark
                                ? 'text-slate-200'
                                : 'text-[#17191D]'
                              : isDark
                              ? 'text-slate-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.badge && (
                          <span
                            className={`px-1 py-0.2 rounded text-[8px] font-black shrink-0 ${
                              item.badgeColor || (isDark ? 'bg-[#5145CD]/30 text-[#A5B4FC] border border-[#5145CD]/40' : 'bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]')
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer note */}
                <div
                  className={`mt-5 pt-3 border-t text-[10px] flex items-center justify-between ${
                    isDark ? 'border-white/10 text-slate-400' : 'border-[#E5E7EB] text-[#667085]'
                  }`}
                >
                  <span>{currency === 'usd' ? 'Excl. local taxes' : '+ 18% GST at checkout'}</span>
                  <span className="text-[#10B981] font-semibold">Instant setup</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small Footnote below Cards (Matching Screenshot) */}
        <div
          className={`mt-6 text-center text-[11px] max-w-3xl mx-auto space-y-1 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-[#667085]'
          }`}
        >
          <p>
            Unlimited models and Free Generations on plans are accessible only via Fluvia Flow creative suite and are not accessible on MCP/CLI.
          </p>
          <p>
            Prices exclude VAT and local taxes, calculated at checkout. Unlimited usage may be subject to dynamic speed adjustments during high-traffic periods.{' '}
            <button
              type="button"
              onClick={scrollToMatrix}
              className={`underline font-medium ${isDark ? 'text-slate-300 hover:text-white' : 'text-[#5145CD]'}`}
            >
              Learn more
            </button>
          </p>
          <p className="text-[10px] opacity-80">
            Access to new models and advanced features may be done on a rolling basis and not available to all users at launch.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE SIDE-BY-SIDE FEATURE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <div id="feature-matrix-section">
          <FeatureComparisonMatrix
            billingInterval={billingInterval}
            onSelectPlan={handleSelectPlan}
            isDark={isDark}
          />
        </div>

        {/* ========================================================================= */}
        {/* DEDICATED CREDIT TOP-UP PACKS SECTION */}
        {/* ========================================================================= */}
        <CreditTopUpSection onBuyPack={handleBuyCreditPack} isDark={isDark} />

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <section
          className={`mt-20 pt-16 border-t max-w-3xl mx-auto text-left ${
            isDark ? 'border-white/10' : 'border-[#E5E7EB]'
          }`}
        >
          <div className="text-center mb-10">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isDark
                  ? 'text-[#818CF8] bg-[#1E1B4B]/80 border-[#6366F1]/40'
                  : 'text-[#5145CD] bg-[#EEF2FF] border-[#C7D2FE]'
              }`}
            >
              Billing & Credit FAQ
            </span>
            <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mt-3 ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`mt-2 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
              Everything you need to know about Fluvia Flow plans, rollovers, and tax compliance.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isDark
                    ? 'border-white/10 bg-[#121522]'
                    : 'border-[#E5E7EB] bg-white shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isDark
                      ? 'text-white hover:bg-white/[0.03]'
                      : 'text-[#17191D] hover:bg-[#F7F8FA]'
                  }`}
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaqs[i] ? (
                    <ChevronUp className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-400' : 'text-[#667085]'}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-400' : 'text-[#667085]'}`} />
                  )}
                </button>
                {openFaqs[i] && (
                  <div
                    className={`px-4 pb-5 sm:px-5 text-xs leading-relaxed border-t pt-3 ${
                      isDark
                        ? 'border-white/10 text-slate-300'
                        : 'border-[#E5E7EB] text-[#667085]'
                    }`}
                  >
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
        <div
          className={`mt-16 p-6 rounded-2xl border text-center max-w-3xl mx-auto text-xs space-y-2 ${
            isDark
              ? 'bg-[#121522] border-white/10 text-slate-400'
              : 'bg-[#F7F8FA] border-[#E5E7EB] text-[#667085]'
          }`}
        >
          <div className={`flex items-center justify-center gap-2 font-semibold ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Secure Indian Payment Gateway & Enterprise Tax Compliance</span>
          </div>
          <p className="leading-relaxed">
            All credit card, debit card, UPI, and NetBanking payments are securely processed by PayU India. Prices exclude local taxes / 18% GST (CGST + SGST or IGST), itemized at checkout with immediate downloadable PDF tax invoice generation. Unused subscription credits roll over indefinitely while active. Cancel anytime with zero lock-in contracts.
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
