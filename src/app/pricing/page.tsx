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
  CreditCard,
  ArrowRight,
  HelpCircle,
  Clock,
  Download,
  Database,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Sliders,
  Check,
  Plus,
  Flame,
  Users,
  Video,
  Film,
  Camera,
  Cpu,
  Star,
  Award,
} from 'lucide-react';

interface FeatureGroup {
  category: string;
  items: string[];
}

interface PlanConfig {
  id: string;
  name: string;
  tier: 'basic' | 'pro' | 'max' | 'teams';
  category: 'individual' | 'business';
  monthlyPrice: number;
  annualMonthlyPrice: number;
  credits: number;
  badge?: string;
  desc: string;
  highlight?: boolean;
  videoGenerationsEstimate: number; // e.g. 5s videos @ 25 credits
  imageGenerationsEstimate: number; // images @ 5 credits
  exportResolution: '1080p' | '4K' | '4K 60fps' | '4K 60fps Master';
  storageGb: number;
  models: string[];
  features: string[];
  featureGroups: FeatureGroup[];
  ctaText: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [planCategory, setPlanCategory] = useState<'individual' | 'business'>('individual');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showRecommenderModal, setShowRecommenderModal] = useState(false);
  const [showDetailedMatrix, setShowDetailedMatrix] = useState(false);
  
  // Mobile active plan tab for focused browsing (Basic, Pro, Max, Teams)
  const [mobileActivePlan, setMobileActivePlan] = useState<'all' | 'basic' | 'pro' | 'max' | 'teams'>('all');
  
  // Expandable feature groups per plan card
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    plan_creator: true, // Pro expanded by default
  });

  // Mobile matrix accordion category toggle
  const [mobileMatrixSection, setMobileMatrixSection] = useState<string>('models');

  // Questionnaire state
  const [qVolume, setQVolume] = useState<'low' | 'medium' | 'high' | 'agency'>('medium');
  const [qQuality, setQQuality] = useState<'1080p' | '4k'>('4k');
  const [qTeam, setQTeam] = useState<'solo' | 'team'>('solo');

  // Persist billing interval preference in session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('fluvia_billing_interval');
      if (saved === 'month' || saved === 'year') {
        setBillingInterval(saved);
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const handleIntervalChange = (interval: 'month' | 'year') => {
    setBillingInterval(interval);
    try {
      sessionStorage.setItem('fluvia_billing_interval', interval);
    } catch {
      // Ignore
    }
  };

  const toggleCardExpansion = (planId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  // Four authentic Fluvia Flow plans with distinct identity
  const allPlans: PlanConfig[] = [
    {
      id: 'plan_starter',
      name: 'Fluvia Basic',
      tier: 'basic',
      category: 'individual',
      monthlyPrice: 999,
      annualMonthlyPrice: 799,
      credits: 500,
      desc: 'For individual creators and experimenters exploring high-motion cinematic AI.',
      videoGenerationsEstimate: 20, // 500 / 25
      imageGenerationsEstimate: 100, // 500 / 5
      exportResolution: '1080p',
      storageGb: 10,
      models: ['Fluvia Cinematic v1', 'Flux 1.1 Pro Vision'],
      features: [
        '500 Monthly refilled credits',
        '1080p Full HD video exports',
        'Standard GPU generation queue',
        'Multi-track timeline editor (2 tracks)',
        '10 GB High-Speed cloud storage',
        'Commercial usage rights included',
        'Official SAC 998314 GST Invoices',
      ],
      featureGroups: [
        {
          category: 'AI Models & Generation',
          items: [
            'Fluvia Cinematic v1 (Fast Motion)',
            'Flux 1.1 Pro Vision (100 images/mo)',
            'Standard inference priority',
            'Prompt Copilot with basic enhancement',
          ],
        },
        {
          category: 'Editing & Canvas Studio',
          items: [
            '1080p Full HD video exports',
            'Multi-track canvas (2 active tracks)',
            'Zero export watermarks',
            'Standard aspect ratios (16:9, 9:16, 1:1)',
          ],
        },
        {
          category: 'Storage & Compliance',
          items: [
            '10 GB High-Speed cloud storage',
            'Standard email support',
            'Commercial license for all renders',
            'GSTIN B2B input tax credit supported',
          ],
        },
      ],
      ctaText: 'Get Fluvia Basic',
    },
    {
      id: 'plan_creator',
      name: 'Fluvia Pro',
      tier: 'pro',
      category: 'individual',
      monthlyPrice: 2499,
      annualMonthlyPrice: 1999,
      credits: 1600,
      badge: 'Recommended',
      desc: 'For content creators, indie filmmakers and social media power users seeking high fidelity.',
      highlight: true,
      videoGenerationsEstimate: 64, // 1600 / 25
      imageGenerationsEstimate: 320, // 1600 / 5
      exportResolution: '4K',
      storageGb: 50,
      models: ['Runway Gen-3 Alpha', 'Luma Ray', 'Fluvia Cinematic HD', 'Flux Pro Vision'],
      features: [
        '1,600 Monthly refilled credits',
        '4K Ultra HD video exports',
        'Priority GPU generation queue',
        'Full Multi-Track Creative Canvas',
        'Gemini Storyboard Copilot',
        '50 GB High-Speed cloud storage',
        'Camera Motion & Lens Studio',
        'Instant credit top-up discounts (10%)',
      ],
      featureGroups: [
        {
          category: 'AI Models & Generation',
          items: [
            'Runway Gen-3 Alpha & Luma Ray',
            'Fluvia Cinematic HD (64 clips/mo)',
            'Flux Pro Photoreal (320 images/mo)',
            'Priority GPU inference queue',
            'Gemini Storyboard & Scene Copilot',
          ],
        },
        {
          category: 'Editing & Canvas Studio',
          items: [
            '4K Ultra HD video exports',
            'Full Multi-Track Creative Canvas',
            'Camera Motion & Anamorphic Lens Studio',
            'Custom aspect ratios (21:9, 16:9, 9:16, 1:1)',
            'Zero export watermarks',
          ],
        },
        {
          category: 'Storage & Compliance',
          items: [
            '50 GB High-Speed cloud storage',
            'Priority creator support',
            '10% discount on credit top-ups',
            'Commercial rights & B2B GST ITC',
          ],
        },
      ],
      ctaText: 'Get Fluvia Pro',
    },
    {
      id: 'plan_max',
      name: 'Fluvia Max',
      tier: 'max',
      category: 'individual',
      monthlyPrice: 4999,
      annualMonthlyPrice: 3999,
      credits: 4000,
      badge: 'Director Choice',
      desc: 'For professional video producers, directors and high-volume digital creators.',
      videoGenerationsEstimate: 160, // 4000 / 25
      imageGenerationsEstimate: 800, // 4000 / 5
      exportResolution: '4K 60fps',
      storageGb: 150,
      models: ['All Models Uncapped', 'Early Beta Model Access', 'Dedicated Rendering Lane'],
      features: [
        '4,000 Monthly refilled credits',
        '4K 60fps Cinema Master exports',
        'Dedicated VIP GPU render lane',
        'Unlimited Canvas timeline tracks',
        'Full Gemini Script & Storyboard Studio',
        '150 GB High-Speed cloud storage',
        'Audio Stem & Voiceover Generator',
        'Instant credit top-up discounts (20%)',
      ],
      featureGroups: [
        {
          category: 'AI Models & Generation',
          items: [
            'All AI Models Uncapped (160 clips/mo)',
            'Flux 1.1 Pro Vision (800 images/mo)',
            'Dedicated VIP GPU render lane',
            'Gemini Director Script & Prompt Engine',
            'Early Beta model access',
          ],
        },
        {
          category: 'Editing & Canvas Studio',
          items: [
            '4K 60fps Cinema Master exports',
            'Unlimited Canvas timeline tracks',
            'Audio Stem & Neural Voiceover Generator',
            'Custom camera motion paths',
            'Instant sub-second frame re-rendering',
          ],
        },
        {
          category: 'Storage & Compliance',
          items: [
            '150 GB High-Speed cloud storage',
            'VIP 24/7 priority support',
            '20% discount on credit top-ups',
            'Commercial rights & B2B GST ITC',
          ],
        },
      ],
      ctaText: 'Get Fluvia Max',
    },
    {
      id: 'plan_business',
      name: 'Fluvia Teams',
      tier: 'teams',
      category: 'business',
      monthlyPrice: 9999,
      annualMonthlyPrice: 7999,
      credits: 10000,
      badge: 'Agencies & Teams',
      desc: 'For creative agencies, studios, and production teams requiring collaborative workspaces.',
      videoGenerationsEstimate: 400, // 10000 / 25
      imageGenerationsEstimate: 2000, // 10000 / 5
      exportResolution: '4K 60fps Master',
      storageGb: 500,
      models: ['All Models Uncapped', 'Concurrent GPU Nodes', 'Custom Model Weights', 'Full API'],
      features: [
        '10,000 Pooled Credits every month',
        'Up to 10 Team Member Seats',
        'Shared Workspace, Asset Pool & Wallet',
        '4K 60fps Cinema Master exports',
        'Unlimited Brand Kits & Templates',
        '500 GB Shared Team Storage',
        'Dedicated Account Director',
        'Custom B2B GST Invoicing & SLA',
      ],
      featureGroups: [
        {
          category: 'AI Models & Generation',
          items: [
            'All Models Uncapped (400 clips/mo)',
            'Flux 1.1 Pro Vision (2,000 images/mo)',
            'Concurrent GPU cluster nodes',
            'Custom model fine-tuning & weights',
            'Full REST API access for automation',
          ],
        },
        {
          category: 'Editing & Canvas Studio',
          items: [
            '4K 60fps Cinema Master exports',
            'Unlimited Canvas tracks & templates',
            'Shared brand kits & typography',
            'Multi-user project collaboration',
            'Custom export presets & color LUTs',
          ],
        },
        {
          category: 'Storage & Compliance',
          items: [
            'Up to 10 Team member seats included',
            '500 GB Shared cloud storage',
            'Dedicated Account Director',
            'Custom B2B GST Invoicing & 99.9% SLA',
          ],
        },
      ],
      ctaText: 'Get Fluvia Teams',
    },
  ];

  // Filter plans based on category if business tab selected
  const displayedPlans =
    planCategory === 'business'
      ? [allPlans[1], allPlans[2], allPlans[3]]
      : allPlans;

  // For mobile tab switcher: determine which plans to show on mobile
  const mobileFilteredPlans =
    mobileActivePlan === 'all'
      ? displayedPlans
      : displayedPlans.filter((p) => p.tier === mobileActivePlan);

  const creditPacks = [
    {
      id: 'pack_500',
      name: '500 Credits Boost',
      credits: 500,
      priceInr: 499,
      taxInr: 89.82,
      totalInr: 588.82,
      perCredit: '₹0.99',
      popular: false,
      accent: 'emerald',
    },
    {
      id: 'pack_1200',
      name: '1,200 Credits Studio',
      credits: 1200,
      priceInr: 999,
      taxInr: 179.82,
      totalInr: 1178.82,
      perCredit: '₹0.83',
      popular: true,
      accent: 'emerald',
    },
    {
      id: 'pack_3500',
      name: '3,500 Credits Scale',
      credits: 3500,
      priceInr: 2499,
      taxInr: 449.82,
      totalInr: 2948.82,
      perCredit: '₹0.71',
      popular: false,
      accent: 'pink',
    },
    {
      id: 'pack_10000',
      name: '10,000 Credits Agency',
      credits: 10000,
      priceInr: 5999,
      taxInr: 1079.82,
      totalInr: 7078.82,
      perCredit: '₹0.59',
      popular: false,
      accent: 'teal',
    },
  ];

  // Compute plan recommendation based on questionnaire
  const getRecommendedPlan = () => {
    if (qTeam === 'team' || qVolume === 'agency') return allPlans[3]; // Teams
    if (qVolume === 'high' || (qVolume === 'medium' && qQuality === '4k')) return allPlans[2]; // Max
    if (qVolume === 'medium' || qQuality === '4k') return allPlans[1]; // Pro
    return allPlans[0]; // Basic
  };

  const handleSelectPlan = (planId: string) => {
    router.push(`/checkout?type=subscription&id=${planId}&interval=${billingInterval}`);
  };

  const handleBuyCreditPack = (packId: string) => {
    router.push(`/checkout?type=pack&id=${packId}`);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 text-[#17211D] relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* FLOATING SUBTLE FLUID GLASS RIBBON BACKGROUND (EMERALD & PINK) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <svg
          className="absolute w-[1400px] h-[900px] -top-40 -left-60 opacity-60 blur-3xl transform -rotate-12 animate-pulse"
          style={{ animationDuration: '8s' }}
          viewBox="0 0 1400 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 250 C 350 50, 700 500, 1050 220 S 1350 550, 1500 350"
            stroke="url(#emerald-ribbon-grad)"
            strokeWidth="140"
            strokeLinecap="round"
          />
          <path
            d="M50 500 C 400 280, 650 700, 1100 420 S 1300 750, 1450 550"
            stroke="url(#pink-ribbon-grad)"
            strokeWidth="110"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="emerald-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#34D399" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#D1FAE5" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="pink-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.26" />
              <stop offset="50%" stopColor="#F472B6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#FCE7F3" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ambient bottom-right glow */}
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-200/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-200/20 rounded-full blur-[90px]" />
      </div>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* ========================================================================= */}
        {/* HEADER CONTROLS SECTION */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">PayU India Verified • 18% GST Compliant • Instant GPU Allocation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#17211D] tracking-tight">
            Plans built for creators who move fast.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-normal max-w-2xl mx-auto">
            Every plan includes authentic server-grade AI rendering, multi-track timeline editing, and zero export watermarks.
          </p>

          {/* Navigation Controls: Tabs & Billing Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Individual vs Business Tabs */}
            <div className="inline-flex p-1 rounded-xl glass-panel border border-emerald-500/20 shadow-xs w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setPlanCategory('individual')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  planCategory === 'individual'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                Individual Creators
              </button>
              <button
                type="button"
                onClick={() => setPlanCategory('business')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  planCategory === 'business'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Business & Teams</span>
              </button>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl glass-panel border border-emerald-500/20 shadow-xs w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => handleIntervalChange('month')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  billingInterval === 'month'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleIntervalChange('year')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  billingInterval === 'year'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-extrabold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200 shadow-2xs">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Not sure which plan? */}
            <button
              type="button"
              onClick={() => setShowRecommenderModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 glass-card border border-emerald-500/20 shadow-xs transition-all w-full sm:w-auto"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Not sure which plan?</span>
            </button>
          </div>

          {/* Transparent Credit Consumption Note */}
          <div className="mt-5 text-xs text-slate-600 max-w-2xl mx-auto flex items-center justify-center gap-2 px-2 text-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              <strong>Credit consumption:</strong> 1s Fluvia Cinematic Video = 5 credits (25 credits / 5s clip). Flux Image = 5 credits. Unused credits roll over while your subscription is active.
            </span>
          </div>

          {/* Mobile Plan Tab Switcher (Visible only on small viewports) */}
          <div className="mt-6 sm:hidden flex items-center justify-between p-1 rounded-xl bg-emerald-50/80 border border-emerald-500/25">
            <button
              type="button"
              onClick={() => setMobileActivePlan('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#17211D]'
              }`}
            >
              All Plans
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('basic')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'basic'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#17211D]'
              }`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('pro')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mobileActivePlan === 'pro'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 font-extrabold'
              }`}
            >
              <span>Pro</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('max')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'max'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-pink-600'
              }`}
            >
              Max
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('teams')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'teams'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-teal-700'
              }`}
            >
              Teams
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUR DISTINCT PREMIUM PRICING CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {mobileFilteredPlans.map((plan) => {
            const isAnnual = billingInterval === 'year';
            const price = isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
            const fullAnnualCharged = plan.annualMonthlyPrice * 12;
            const savingsPercent = Math.round(
              ((plan.monthlyPrice - plan.annualMonthlyPrice) / plan.monthlyPrice) * 100
            );
            const isExpanded = !!expandedCards[plan.id];

            // 4 Distinct Visual Styles per Plan Tier
            const cardTheme = {
              basic: {
                wrapper:
                  'bg-white/85 backdrop-blur-xl border-2 border-emerald-500/25 hover:border-emerald-500/40 shadow-[0_8px_30px_rgba(16,185,129,0.08)] hover:shadow-[0_12px_36px_rgba(16,185,129,0.14)]',
                accentBg: 'bg-emerald-50/70',
                badgeText: 'text-emerald-800',
                badgeBorder: 'border-emerald-300',
                badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                creditBox: 'bg-emerald-50/90 text-emerald-950 border-emerald-200/80',
                creditNumber: 'text-emerald-700',
                ctaButton:
                  'bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-500/40 hover:border-emerald-500 font-bold shadow-xs',
                checkColor: 'text-emerald-600',
                tag: 'Essential Starter',
              },
              pro: {
                wrapper:
                  'bg-gradient-to-b from-white/95 via-emerald-50/20 to-white/95 backdrop-blur-2xl border-2 border-emerald-500 ring-4 ring-emerald-500/15 shadow-[0_20px_50px_rgba(16,185,129,0.18)] hover:shadow-[0_25px_60px_rgba(16,185,129,0.25)] lg:-translate-y-2 lg:scale-[1.02] relative z-10',
                accentBg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
                badgeText: 'text-white',
                badgeBorder: 'border-emerald-400',
                badgeBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black border-emerald-400 shadow-md shadow-emerald-500/30',
                creditBox: 'bg-emerald-100/70 text-emerald-950 border-emerald-300',
                creditNumber: 'text-emerald-800',
                ctaButton:
                  'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold shadow-lg shadow-emerald-500/30',
                checkColor: 'text-emerald-600',
                tag: 'Creator Choice',
              },
              max: {
                wrapper:
                  'bg-gradient-to-b from-white/95 via-pink-50/25 to-white/95 backdrop-blur-2xl border-2 border-pink-400/70 hover:border-pink-500 ring-2 ring-pink-500/15 shadow-[0_16px_45px_rgba(236,72,153,0.14)] hover:shadow-[0_22px_55px_rgba(236,72,153,0.22)]',
                accentBg: 'bg-pink-50/80',
                badgeText: 'text-pink-700',
                badgeBorder: 'border-pink-300',
                badgeBg: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black border-pink-400 shadow-md shadow-pink-500/25',
                creditBox: 'bg-pink-50/90 text-pink-950 border-pink-200',
                creditNumber: 'text-pink-600',
                ctaButton:
                  'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-500/30',
                checkColor: 'text-pink-600',
                tag: 'Director VFX',
              },
              teams: {
                wrapper:
                  'bg-gradient-to-b from-white/95 via-teal-50/25 to-rose-50/15 backdrop-blur-2xl border-2 border-teal-500/50 hover:border-teal-500 ring-2 ring-teal-500/15 shadow-[0_12px_40px_rgba(20,184,166,0.12)] hover:shadow-[0_18px_50px_rgba(20,184,166,0.20)]',
                accentBg: 'bg-teal-50/80',
                badgeText: 'text-teal-800',
                badgeBorder: 'border-teal-300',
                badgeBg: 'bg-teal-700 text-white font-black border-teal-600 shadow-md shadow-teal-700/25',
                creditBox: 'bg-teal-50/90 text-teal-950 border-teal-200',
                creditNumber: 'text-teal-700',
                ctaButton:
                  'bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold shadow-lg shadow-teal-600/30',
                checkColor: 'text-teal-700',
                tag: 'Team Collaboration',
              },
            }[plan.tier];

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 text-left ${cardTheme.wrapper}`}
              >
                {/* Elevated Top Ribbon / Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`text-[11px] uppercase tracking-wider font-extrabold px-3.5 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${cardTheme.badgeBg}`}
                    >
                      {plan.tier === 'pro' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                      {plan.tier === 'max' && <Award className="w-3.5 h-3.5 text-rose-100" />}
                      {plan.tier === 'teams' && <Users className="w-3.5 h-3.5 text-teal-100" />}
                      <span>{plan.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Category Tag */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <h3 className="text-xl sm:text-2xl font-black text-[#17211D] tracking-tight">{plan.name}</h3>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold px-2 py-0.5 rounded bg-slate-100">
                      {cardTheme.tag}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed min-h-[38px]">
                    {plan.desc}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-5 pb-5 border-b border-emerald-500/15">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-500 font-bold">INR</span>
                      <span className="text-3xl sm:text-4xl font-black text-[#17211D] tracking-tight">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
                    </div>

                    {isAnnual ? (
                      <div className="mt-1.5 text-[11px] text-emerald-800 flex items-center gap-1.5 font-semibold">
                        <span>Billed annually (₹{fullAnnualCharged.toLocaleString()} / yr)</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded text-[9px] font-extrabold border border-emerald-200">
                          SAVE {savingsPercent}%
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1.5 text-[11px] text-slate-500 font-medium">
                        Billed monthly • Cancel anytime
                      </div>
                    )}
                  </div>

                  {/* Included Monthly Credits Box */}
                  <div className="mt-5 space-y-3">
                    <div
                      className={`p-3 rounded-2xl border flex items-center justify-between shadow-xs ${cardTheme.creditBox}`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold block leading-tight">Monthly Wallet Credits:</span>
                          <span className="text-[10px] text-slate-500">Unused credits roll over</span>
                        </div>
                      </div>
                      <span className={`text-base sm:text-lg font-black font-mono ${cardTheme.creditNumber}`}>
                        {plan.credits.toLocaleString()}
                      </span>
                    </div>

                    {/* Visual Clear Credit Usage Breakdown Summary */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-500/15 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-semibold flex items-center gap-1">
                          <Video className="w-3 h-3 text-emerald-600" />
                          <span>Video Output</span>
                        </span>
                        <strong className="text-[#17211D] font-mono text-xs block mt-0.5">
                          ~{plan.videoGenerationsEstimate} clips (5s)
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-500/15 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-semibold flex items-center gap-1">
                          <Film className="w-3 h-3 text-teal-600" />
                          <span>Max Quality</span>
                        </span>
                        <strong className="text-[#17211D] font-mono text-xs block mt-0.5">
                          {plan.exportResolution}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-500/15 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-pink-600" />
                          <span>Photoreal Images</span>
                        </span>
                        <strong className="text-[#17211D] font-mono text-xs block mt-0.5">
                          ~{plan.imageGenerationsEstimate} images
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/80 border border-emerald-500/15 shadow-2xs">
                        <span className="text-slate-500 block text-[10px] font-semibold flex items-center gap-1">
                          <Database className="w-3 h-3 text-slate-500" />
                          <span>Cloud Storage</span>
                        </span>
                        <strong className="text-[#17211D] font-mono text-xs block mt-0.5">
                          {plan.storageGb} GB Storage
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Core Features:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 5).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${cardTheme.checkColor}`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expandable Grouped Features (Models, Studio, Support) */}
                  <div className="mt-4 pt-3 border-t border-emerald-500/15">
                    <button
                      type="button"
                      onClick={() => toggleCardExpansion(plan.id)}
                      className="w-full py-1.5 flex items-center justify-between text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide detailed groups' : 'View full feature groups'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 pt-2 text-xs border-t border-emerald-500/10 animate-in fade-in duration-200">
                        {plan.featureGroups.map((group, gIdx) => (
                          <div key={gIdx} className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              {group.category}
                            </span>
                            <ul className="space-y-1 pl-1">
                              {group.items.map((item, iIdx) => (
                                <li key={iIdx} className="flex items-start gap-2 text-[11px] text-slate-600">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="mt-6 pt-4 border-t border-emerald-500/15">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3.5 px-4 min-h-[48px] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${cardTheme.ctaButton}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                    PayU India Secured • Instant Activation
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Feature Comparison Toggle */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setShowDetailedMatrix(!showDetailedMatrix)}
            className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl glass-card border border-emerald-500/20 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{showDetailedMatrix ? 'Hide Detailed Feature Matrix' : 'Compare All Plan Entitlements & Models'}</span>
            {showDetailedMatrix ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DETAILED ENTITLEMENT MATRIX (DESKTOP TABLE + MOBILE STACKED ACCORDION) */}
        {/* ========================================================================= */}
        {showDetailedMatrix && (
          <div className="mt-8 glass-card border border-emerald-500/25 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-300 text-left">
            <div className="p-6 bg-emerald-50/50 border-b border-emerald-500/20">
              <h3 className="text-lg font-black text-[#17211D]">Full Plan Entitlement & Specification Matrix</h3>
              <p className="text-xs text-slate-600 mt-1">
                Authentic technical capabilities based on server-side model dispatching and storage quota parameters.
              </p>
            </div>

            {/* Desktop View: Full Matrix Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-500/15 bg-white/60 text-slate-600">
                    <th className="py-3.5 px-6 font-bold text-[#17211D] w-1/3">Feature / Entitlement</th>
                    <th className="py-3.5 px-4 font-bold text-slate-700">Fluvia Basic</th>
                    <th className="py-3.5 px-4 font-bold text-emerald-700">Fluvia Pro</th>
                    <th className="py-3.5 px-4 font-bold text-pink-600">Fluvia Max</th>
                    <th className="py-3.5 px-4 font-bold text-teal-700">Fluvia Teams</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {/* Category: AI Models */}
                  <tr className="bg-emerald-50/30">
                    <td colSpan={5} className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-emerald-800">
                      1. AI Models & Generation
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Fluvia Cinematic v1 (Fast Motion)</td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Runway Gen-3 Alpha & Luma Ray</td>
                    <td className="py-3 px-4 text-slate-400"><X className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Flux 1.1 Pro Vision Image Generator</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">~100 img</td>
                    <td className="py-3 px-4 text-emerald-700 font-mono font-bold">~320 img</td>
                    <td className="py-3 px-4 text-pink-600 font-mono font-bold">~800 img</td>
                    <td className="py-3 px-4 text-teal-700 font-mono font-bold">~2,000 img</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Google Gemini 2.0 Flash Storyboard & Script Engine</td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">Basic Scripts</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">Full Access</td>
                    <td className="py-3 px-4 text-pink-600 font-bold">Director Mode</td>
                    <td className="py-3 px-4 text-teal-700 font-bold">Enterprise API</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">ElevenLabs Neural Voice Synthesis</td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                  </tr>

                  {/* Category: Video & Editing */}
                  <tr className="bg-emerald-50/30">
                    <td colSpan={5} className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-emerald-800">
                      2. Export & Canvas Studio
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Max Render Resolution</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">1080p Full HD</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">4K Ultra HD</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">4K 60fps Cinema</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">4K 60fps Master</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Multi-track Timeline Video Editor</td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">2 Tracks</td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Custom Aspect Ratios (21:9, 16:9, 9:16, 1:1)</td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Export Watermark</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">None (Clean)</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">None (Clean)</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">None (Clean)</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">None (Clean)</td>
                  </tr>

                  {/* Category: Workspaces & Collaboration */}
                  <tr className="bg-emerald-50/30">
                    <td colSpan={5} className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-emerald-800">
                      3. Storage, Collaboration & Support
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">High-Speed Cloud Storage</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">10 GB</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">50 GB</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">150 GB</td>
                    <td className="py-3 px-4 text-[#17211D] font-mono font-bold">500 GB</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Team Seats Allowed</td>
                    <td className="py-3 px-4 text-slate-500">1 Seat</td>
                    <td className="py-3 px-4 text-slate-500">1 Seat</td>
                    <td className="py-3 px-4 text-slate-500">1 Seat</td>
                    <td className="py-3 px-4 text-teal-700 font-bold">Up to 10 Seats</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">GPU Queue Priority</td>
                    <td className="py-3 px-4 text-slate-500">Standard</td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">Priority Slot</td>
                    <td className="py-3 px-4 text-pink-600 font-semibold">Dedicated Lane</td>
                    <td className="py-3 px-4 text-teal-700 font-semibold">Concurrent Nodes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 text-slate-700 font-medium">Official GST Invoices & B2B ITC</td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-600"><Check className="w-4 h-4" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile View: Stacked Accordion Sections (No Horizontal Scroll Struggle) */}
            <div className="md:hidden p-4 space-y-3">
              {/* Category Tab Selector on Mobile */}
              <div className="flex rounded-xl bg-emerald-50/80 p-1 border border-emerald-500/20 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMobileMatrixSection('models')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mobileMatrixSection === 'models'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Models
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMatrixSection('canvas')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mobileMatrixSection === 'canvas'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Canvas & 4K
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMatrixSection('collab')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mobileMatrixSection === 'collab'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600'
                  }`}
                >
                  Storage & Team
                </button>
              </div>

              {/* Mobile Content Display */}
              {mobileMatrixSection === 'models' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Runway Gen-3 & Luma Ray</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-500">Basic: <strong className="text-slate-400">None</strong></span>
                      <span className="text-emerald-700">Pro: <strong>Included</strong></span>
                      <span className="text-pink-600">Max: <strong>Included</strong></span>
                      <span className="text-teal-700">Teams: <strong>Uncapped</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Gemini 2.0 Storyboard Engine</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-500">Basic: <strong>Basic</strong></span>
                      <span className="text-emerald-700">Pro: <strong>Full Copilot</strong></span>
                      <span className="text-pink-600">Max: <strong>Director Mode</strong></span>
                      <span className="text-teal-700">Teams: <strong>API Access</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Flux 1.1 Pro Vision Photos</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-600">Basic: <strong>~100 img</strong></span>
                      <span className="text-emerald-700">Pro: <strong>~320 img</strong></span>
                      <span className="text-pink-600">Max: <strong>~800 img</strong></span>
                      <span className="text-teal-700">Teams: <strong>~2,000 img</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {mobileMatrixSection === 'canvas' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Max Video Resolution</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-600">Basic: <strong>1080p Full HD</strong></span>
                      <span className="text-emerald-700">Pro: <strong>4K Ultra HD</strong></span>
                      <span className="text-pink-600">Max: <strong>4K 60fps Cinema</strong></span>
                      <span className="text-teal-700">Teams: <strong>4K 60fps Master</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Timeline Tracks</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-600">Basic: <strong>2 Tracks</strong></span>
                      <span className="text-emerald-700">Pro: <strong>Unlimited</strong></span>
                      <span className="text-pink-600">Max: <strong>Unlimited</strong></span>
                      <span className="text-teal-700">Teams: <strong>Unlimited</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Watermark Policy</span>
                    <p className="mt-1 text-xs text-emerald-800 font-semibold">
                      Zero watermarks across all paid plans. All exported videos and images are completely clean with commercial rights.
                    </p>
                  </div>
                </div>
              )}

              {mobileMatrixSection === 'collab' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Cloud Storage Allocation</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-600">Basic: <strong>10 GB</strong></span>
                      <span className="text-emerald-700">Pro: <strong>50 GB</strong></span>
                      <span className="text-pink-600">Max: <strong>150 GB</strong></span>
                      <span className="text-teal-700">Teams: <strong>500 GB Shared</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">Team Seats & Roles</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-600">Basic: <strong>1 User</strong></span>
                      <span className="text-emerald-700">Pro: <strong>1 User</strong></span>
                      <span className="text-pink-600">Max: <strong>1 User</strong></span>
                      <span className="text-teal-700">Teams: <strong>Up to 10 Seats</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/80 border border-emerald-500/15">
                    <span className="font-bold text-xs text-[#17211D] block">GPU Queue Priority</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-600">Basic: <strong>Standard</strong></span>
                      <span className="text-emerald-700">Pro: <strong>Priority Slot</strong></span>
                      <span className="text-pink-600">Max: <strong>VIP Lane</strong></span>
                      <span className="text-teal-700">Teams: <strong>Concurrent Nodes</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREDIT TOP-UP PACKS SECTION */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-emerald-500/15">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 shadow-2xs">
              One-Time Creative Boost
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] mt-3">
              Need extra credits? Top up on-demand.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Purchased credits never expire. Instant wallet fulfillment upon PayU India payment clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                className={`relative rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between glass-card shadow-sm hover:shadow-lg text-left ${
                  pack.popular
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
                    : 'border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2.5 right-4 text-[9px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                    Best Value
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#17211D]">{pack.name}</h4>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">{pack.perCredit} / cred</span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-xs text-slate-500 font-medium">INR</span>
                    <span className="text-2xl font-black text-[#17211D]">₹{pack.priceInr.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">+ 18% GST</span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Total: <strong className="text-slate-800">₹{pack.totalInr.toFixed(2)}</strong> (incl. taxes)
                  </p>

                  <div className="mt-4 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Wallet Credits:</span>
                    <strong className="text-emerald-800 font-mono font-black">
                      +{pack.credits.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyCreditPack(pack.id)}
                  className={`mt-6 w-full py-3 min-h-[44px] px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    pack.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-white hover:bg-emerald-50 text-[#17211D] border border-emerald-500/25'
                  }`}
                >
                  <span>Buy Pack</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BILLING SECURITY & FAQS */}
        {/* ========================================================================= */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-emerald-500/15 text-left">
          <div className="p-5 rounded-3xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="text-sm font-bold text-[#17211D]">Official Tax Invoices & B2B ITC</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Every settled transaction generates a downloadable PDF Tax Invoice (SAC 998314) and official payment receipt. GSTIN input tax credits are fully supported.
            </p>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center mb-3">
              <CreditCard className="w-4 h-4 text-pink-600" />
            </div>
            <h4 className="text-sm font-bold text-[#17211D]">Encrypted PayU India Gateway</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Payments are processed via PayU with 128-bit SHA-512 cryptographic verification. UPI, RuPay, Visa, Mastercard, and Net Banking are supported natively.
            </p>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-teal-700" />
            </div>
            <h4 className="text-sm font-bold text-[#17211D]">Rollover & Zero Hidden Fees</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Unused subscription credits roll over across active billing cycles. Upgrade or downgrade anytime; credit balances are preserved safely in your wallet.
            </p>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* INTERACTIVE PLAN RECOMMENDER MODAL */}
      {/* ========================================================================= */}
      {showRecommenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-modal max-w-lg w-full p-6 sm:p-7 rounded-3xl shadow-2xl relative space-y-6 text-left border border-emerald-500/30 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowRecommenderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 px-2.5 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                Plan Matchmaker
              </span>
              <h3 className="text-xl font-bold text-[#17211D] mt-2">Find your optimal Fluvia Flow plan</h3>
              <p className="text-xs text-slate-600 mt-1">
                Answer 3 quick questions to get an algorithmic recommendation tailored to your production volume.
              </p>
            </div>

            <div className="space-y-4">
              {/* Question 1: Monthly Video Volume */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  1. How many videos or visuals do you render each month?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQVolume('low')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qVolume === 'low'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">Under 20 clips</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Occasional testing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQVolume('medium')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qVolume === 'medium'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">20 - 70 clips</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Regular creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQVolume('high')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qVolume === 'high'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">70 - 180 clips</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Advertisers & Pro VFX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQVolume('agency')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qVolume === 'agency'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">200+ clips</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Agency production</span>
                  </button>
                </div>
              </div>

              {/* Question 2: Export Resolution */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  2. What is your primary delivery resolution?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQQuality('1080p')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qQuality === '1080p'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">1080p Full HD</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Reels, Shorts, TikTok</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQQuality('4k')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qQuality === '4k'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">4K Ultra HD Cinema</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Commercials & YouTube</span>
                  </button>
                </div>
              </div>

              {/* Question 3: Team Collaboration */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  3. Are you working solo or as a collaborative team?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQTeam('solo')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qTeam === 'solo'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">Solo Creator</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">1 user seat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQTeam('team')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      qTeam === 'team'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                        : 'border-emerald-500/20 bg-white/70 text-slate-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <strong className="block text-[#17211D]">Agency / Team</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">Multi-seat shared wallet</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendation Result */}
            {(() => {
              const rec = getRecommendedPlan();
              return (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">Recommended for You:</span>
                    <strong className="text-base font-extrabold text-[#17211D]">{rec.name}</strong>
                  </div>
                  <p className="text-xs text-slate-600">{rec.desc}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-emerald-200">
                    <span>
                      INR ₹
                      {billingInterval === 'year'
                        ? rec.annualMonthlyPrice.toLocaleString()
                        : rec.monthlyPrice.toLocaleString()}
                      /mo
                    </span>
                    <span className="text-emerald-700 font-bold font-mono">
                      {rec.credits.toLocaleString()} Credits / mo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecommenderModal(false);
                      handleSelectPlan(rec.id);
                    }}
                    className="w-full py-3 px-4 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                  >
                    <span>Proceed with {rec.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
