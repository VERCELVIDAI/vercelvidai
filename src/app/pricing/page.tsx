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
        'Official downloadable invoices',
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
            'Full commercial usage license',
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
            'Commercial rights & official invoices',
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
            'Commercial rights & official invoices',
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
        'Custom B2B Invoicing & SLA',
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
            'Custom B2B Invoicing & 99.9% SLA',
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
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#090A0D] text-white relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* CINEMATIC OBSIDIAN STUDIO BACKGROUND (DARK GRID & LENS FLARES) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* ========================================================================= */}
        {/* HEADER CONTROLS SECTION */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-cyan-300 mb-4 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">PayU India Verified • Instant Token Delivery • 256-bit Secure Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Plans built for creators who move fast.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-400 font-normal max-w-2xl mx-auto">
            Every plan includes authentic server-grade AI rendering, multi-track timeline editing, and zero export watermarks.
          </p>

          {/* Navigation Controls: Tabs & Billing Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Individual vs Business Tabs */}
            <div className="inline-flex p-1 rounded-xl bg-[#0E1015] border border-white/10 shadow-xs w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => setPlanCategory('individual')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  planCategory === 'individual'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Individual Creators
              </button>
              <button
                type="button"
                onClick={() => setPlanCategory('business')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  planCategory === 'business'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Business & Teams</span>
              </button>
            </div>

            {/* Monthly / Annual Billing Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-[#0E1015] border border-white/10 shadow-xs w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={() => handleIntervalChange('month')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  billingInterval === 'month'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => handleIntervalChange('year')}
                className={`flex-1 sm:flex-initial px-4 py-2 min-h-[44px] rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                  billingInterval === 'year'
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 shadow-2xs font-mono">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Not sure which plan? */}
            <button
              type="button"
              onClick={() => setShowRecommenderModal(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-[#0E1015] border border-white/10 hover:border-white/20 shadow-xs transition-all w-full sm:w-auto"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Not sure which plan?</span>
            </button>
          </div>

          {/* Transparent Credit Consumption Note */}
          <div className="mt-5 text-xs text-slate-400 max-w-2xl mx-auto flex items-center justify-center gap-2 px-2 text-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <span>
              <strong className="text-white">Credit consumption:</strong> 1s Fluvia Cinematic Video = 5 credits (15 credits / video on Gemini Omni Flash). Flux Image = 5 credits. ElevenLabs Voiceover = 2 credits.
            </span>
          </div>

          {/* Mobile Plan Tab Switcher (Visible only on small viewports) */}
          <div className="mt-6 sm:hidden flex items-center justify-between p-1 rounded-xl bg-[#0E1015] border border-white/10">
            <button
              type="button"
              onClick={() => setMobileActivePlan('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Plans
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('basic')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'basic'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('pro')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mobileActivePlan === 'pro'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                  : 'text-indigo-400 font-extrabold'
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
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'text-pink-400'
              }`}
            >
              Max
            </button>
            <button
              type="button"
              onClick={() => setMobileActivePlan('teams')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileActivePlan === 'teams'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-cyan-400'
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

            // 4 Distinct Visual Styles per Plan Tier (Kling AI Cinematic Dark Palette)
            const cardTheme = {
              basic: {
                wrapper:
                  'bg-[#11131A]/90 backdrop-blur-xl border border-white/8 hover:border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all',
                accentBg: 'bg-white/5',
                badgeText: 'text-slate-300',
                badgeBorder: 'border-white/10',
                badgeBg: 'bg-white/10 text-white border-white/15',
                creditBox: 'bg-[#0B0C10] text-white border-white/8',
                creditNumber: 'text-cyan-400',
                ctaButton:
                  'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/12 hover:border-white/25 font-bold shadow-xs',
                checkColor: 'text-cyan-400',
                tag: 'Essential Starter',
              },
              pro: {
                wrapper:
                  'bg-gradient-to-b from-[#151822] via-[#11131A] to-[#151822] backdrop-blur-2xl border-2 border-indigo-500/70 ring-2 ring-indigo-500/25 shadow-[0_20px_50px_rgba(99,102,241,0.22)] hover:shadow-[0_25px_60px_rgba(99,102,241,0.32)] lg:-translate-y-2 lg:scale-[1.02] relative z-10',
                accentBg: 'bg-gradient-to-r from-indigo-600 to-violet-600',
                badgeText: 'text-white',
                badgeBorder: 'border-indigo-400/50',
                badgeBg: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black border-indigo-400/40 shadow-md shadow-indigo-500/30',
                creditBox: 'bg-[#0B0C10] text-white border-indigo-500/30',
                creditNumber: 'text-indigo-400',
                ctaButton:
                  'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-600/35 hover:scale-[1.01]',
                checkColor: 'text-indigo-400',
                tag: 'Creator Choice',
              },
              max: {
                wrapper:
                  'bg-[#11131A]/90 backdrop-blur-2xl border border-pink-500/30 hover:border-pink-500/50 ring-1 ring-pink-500/15 shadow-[0_16px_45px_rgba(236,72,153,0.12)]',
                accentBg: 'bg-pink-950/40',
                badgeText: 'text-pink-300',
                badgeBorder: 'border-pink-500/40',
                badgeBg: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black border-pink-400/40 shadow-md shadow-pink-500/25',
                creditBox: 'bg-[#0B0C10] text-white border-pink-500/20',
                creditNumber: 'text-pink-400',
                ctaButton:
                  'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-lg shadow-pink-600/30',
                checkColor: 'text-pink-400',
                tag: 'Director VFX',
              },
              teams: {
                wrapper:
                  'bg-[#11131A]/90 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-500/50 ring-1 ring-cyan-500/15 shadow-[0_12px_40px_rgba(6,182,212,0.12)]',
                accentBg: 'bg-cyan-950/40',
                badgeText: 'text-cyan-300',
                badgeBorder: 'border-cyan-500/40',
                badgeBg: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-black border-cyan-400/40 shadow-md shadow-cyan-600/25',
                creditBox: 'bg-[#0B0C10] text-white border-cyan-500/20',
                creditNumber: 'text-cyan-400',
                ctaButton:
                  'bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-cyan-600/30',
                checkColor: 'text-cyan-400',
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
                      {plan.tier === 'teams' && <Users className="w-3.5 h-3.5 text-cyan-100" />}
                      <span>{plan.badge}</span>
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Category Tag */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{plan.name}</h3>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold px-2 py-0.5 rounded bg-white/[0.06] border border-white/8">
                      {cardTheme.tag}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed min-h-[38px]">
                    {plan.desc}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-5 pb-5 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-400 font-bold">INR</span>
                      <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">/ month</span>
                    </div>

                    {isAnnual ? (
                      <div className="mt-1.5 text-[11px] text-indigo-300 flex items-center gap-1.5 font-semibold">
                        <span>Billed annually (₹{fullAnnualCharged.toLocaleString()} / yr)</span>
                        <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-extrabold border border-indigo-500/30 font-mono">
                          SAVE {savingsPercent}%
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1.5 text-[11px] text-slate-400 font-medium">
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
                        <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <span className="text-xs font-bold block leading-tight text-white">Monthly Wallet Credits:</span>
                          <span className="text-[10px] text-slate-400">Unused credits roll over</span>
                        </div>
                      </div>
                      <span className={`text-base sm:text-lg font-black font-mono ${cardTheme.creditNumber}`}>
                        {plan.credits.toLocaleString()}
                      </span>
                    </div>

                    {/* Visual Clear Credit Usage Breakdown Summary */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-[#0E1015] border border-white/8 shadow-2xs">
                        <span className="text-slate-400 block text-[10px] font-semibold flex items-center gap-1">
                          <Video className="w-3 h-3 text-indigo-400" />
                          <span>Video Output</span>
                        </span>
                        <strong className="text-white font-mono text-xs block mt-0.5">
                          ~{plan.videoGenerationsEstimate} clips (5s)
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0E1015] border border-white/8 shadow-2xs">
                        <span className="text-slate-400 block text-[10px] font-semibold flex items-center gap-1">
                          <Film className="w-3 h-3 text-cyan-400" />
                          <span>Max Quality</span>
                        </span>
                        <strong className="text-white font-mono text-xs block mt-0.5">
                          {plan.exportResolution}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0E1015] border border-white/8 shadow-2xs">
                        <span className="text-slate-400 block text-[10px] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-pink-400" />
                          <span>Photoreal Images</span>
                        </span>
                        <strong className="text-white font-mono text-xs block mt-0.5">
                          ~{plan.imageGenerationsEstimate} images
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#0E1015] border border-white/8 shadow-2xs">
                        <span className="text-slate-400 block text-[10px] font-semibold flex items-center gap-1">
                          <Database className="w-3 h-3 text-slate-400" />
                          <span>Cloud Storage</span>
                        </span>
                        <strong className="text-white font-mono text-xs block mt-0.5">
                          {plan.storageGb} GB Storage
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Core Features:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 5).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-snug">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${cardTheme.checkColor}`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expandable Grouped Features (Models, Studio, Support) */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => toggleCardExpansion(plan.id)}
                      className="w-full py-1.5 flex items-center justify-between text-xs font-bold text-slate-400 hover:text-white transition-colors"
                    >
                      <span>{isExpanded ? 'Hide detailed groups' : 'View full feature groups'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-3 pt-2 text-xs border-t border-white/8 animate-in fade-in duration-200">
                        {plan.featureGroups.map((group, gIdx) => (
                          <div key={gIdx} className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              {group.category}
                            </span>
                            <ul className="space-y-1 pl-1">
                              {group.items.map((item, iIdx) => (
                                <li key={iIdx} className="flex items-start gap-2 text-[11px] text-slate-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
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
                <div className="mt-6 pt-4 border-t border-white/10">
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
            className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#0E1015] border border-white/10 hover:border-white/20 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{showDetailedMatrix ? 'Hide Detailed Feature Matrix' : 'Compare All Plan Entitlements & Models'}</span>
            {showDetailedMatrix ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DETAILED ENTITLEMENT MATRIX (DESKTOP TABLE + MOBILE STACKED ACCORDION) */}
        {/* ========================================================================= */}
        {showDetailedMatrix && (
          <div className="mt-8 bg-[#0E1015] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-300 text-left">
            <div className="p-6 bg-[#151822] border-b border-white/10">
              <h3 className="text-lg font-black text-white">Full Plan Entitlement & Specification Matrix</h3>
              <p className="text-xs text-slate-400 mt-1">
                Authentic technical capabilities based on server-side model dispatching and storage quota parameters.
              </p>
            </div>

            {/* Desktop View: Full Matrix Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-[#11131A] text-slate-400">
                    <th className="py-3.5 px-6 font-bold text-white w-1/3">Feature / Entitlement</th>
                    <th className="py-3.5 px-4 font-bold text-slate-300">Fluvia Basic</th>
                    <th className="py-3.5 px-4 font-bold text-indigo-400">Fluvia Pro</th>
                    <th className="py-3.5 px-4 font-bold text-pink-400">Fluvia Max</th>
                    <th className="py-3.5 px-4 font-bold text-cyan-400">Fluvia Teams</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6 text-slate-300">
                  {/* Category: AI Models */}
                  <tr className="bg-white/[0.02]">
                    <td colSpan={5} className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-indigo-400">
                      1. AI Models & Generation
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Fluvia Cinematic v1 (Fast Motion)</td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Runway Gen-3 Alpha & Luma Ray</td>
                    <td className="py-3 px-4 text-slate-600"><X className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Flux 1.1 Pro Vision Image Generator</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">~100 img</td>
                    <td className="py-3 px-4 text-indigo-400 font-mono font-bold">~320 img</td>
                    <td className="py-3 px-4 text-pink-400 font-mono font-bold">~800 img</td>
                    <td className="py-3 px-4 text-cyan-400 font-mono font-bold">~2,000 img</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Google Gemini 2.0 Flash Storyboard & Script Engine</td>
                    <td className="py-3 px-4 text-slate-400 font-semibold">Basic Scripts</td>
                    <td className="py-3 px-4 text-indigo-400 font-bold">Full Access</td>
                    <td className="py-3 px-4 text-pink-400 font-bold">Director Mode</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">Enterprise API</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">ElevenLabs Neural Voice Synthesis</td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                  </tr>

                  {/* Category: Video & Editing */}
                  <tr className="bg-white/[0.02]">
                    <td colSpan={5} className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-cyan-400">
                      2. Export & Canvas Studio
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Max Render Resolution</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">1080p Full HD</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">4K Ultra HD</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">4K 60fps Cinema</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">4K 60fps Master</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Multi-track Timeline Video Editor</td>
                    <td className="py-3 px-4 text-slate-400 font-semibold">2 Tracks</td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Custom Aspect Ratios (21:9, 16:9, 9:16, 1:1)</td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Export Watermark</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">None (Clean)</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">None (Clean)</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">None (Clean)</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">None (Clean)</td>
                  </tr>

                  {/* Category: Workspaces & Collaboration */}
                  <tr className="bg-white/[0.02]">
                    <td colSpan={5} className="py-2.5 px-6 font-bold uppercase tracking-wider text-[11px] text-pink-400">
                      3. Storage, Collaboration & Support
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">High-Speed Cloud Storage</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">10 GB</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">50 GB</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">150 GB</td>
                    <td className="py-3 px-4 text-white font-mono font-bold">500 GB</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Team Seats Allowed</td>
                    <td className="py-3 px-4 text-slate-400">1 Seat</td>
                    <td className="py-3 px-4 text-slate-400">1 Seat</td>
                    <td className="py-3 px-4 text-slate-400">1 Seat</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">Up to 10 Seats</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">GPU Queue Priority</td>
                    <td className="py-3 px-4 text-slate-400">Standard</td>
                    <td className="py-3 px-4 text-indigo-400 font-semibold">Priority Slot</td>
                    <td className="py-3 px-4 text-pink-400 font-semibold">Dedicated Lane</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">Concurrent Nodes</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-6 text-white font-medium">Official Invoices & Receipts</td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                    <td className="py-3 px-4 text-emerald-400"><Check className="w-4 h-4" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile View: Stacked Accordion Sections */}
            <div className="md:hidden p-4 space-y-3">
              {/* Category Tab Selector on Mobile */}
              <div className="flex rounded-xl bg-[#11131A] p-1 border border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMobileMatrixSection('models')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mobileMatrixSection === 'models'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                      : 'text-slate-400'
                  }`}
                >
                  Models
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMatrixSection('canvas')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mobileMatrixSection === 'canvas'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                      : 'text-slate-400'
                  }`}
                >
                  Canvas & 4K
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMatrixSection('collab')}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    mobileMatrixSection === 'collab'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                      : 'text-slate-400'
                  }`}
                >
                  Storage & Team
                </button>
              </div>

              {/* Mobile Content Display */}
              {mobileMatrixSection === 'models' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Runway Gen-3 & Luma Ray</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong className="text-slate-600">None</strong></span>
                      <span className="text-indigo-400">Pro: <strong>Included</strong></span>
                      <span className="text-pink-400">Max: <strong>Included</strong></span>
                      <span className="text-cyan-400">Teams: <strong>Uncapped</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Gemini 2.0 Storyboard Engine</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>Basic</strong></span>
                      <span className="text-indigo-400">Pro: <strong>Full Copilot</strong></span>
                      <span className="text-pink-400">Max: <strong>Director Mode</strong></span>
                      <span className="text-cyan-400">Teams: <strong>API Access</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Flux 1.1 Pro Vision Photos</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>~100 img</strong></span>
                      <span className="text-indigo-400">Pro: <strong>~320 img</strong></span>
                      <span className="text-pink-400">Max: <strong>~800 img</strong></span>
                      <span className="text-cyan-400">Teams: <strong>~2,000 img</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {mobileMatrixSection === 'canvas' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Max Video Resolution</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>1080p Full HD</strong></span>
                      <span className="text-indigo-400">Pro: <strong>4K Ultra HD</strong></span>
                      <span className="text-pink-400">Max: <strong>4K 60fps Cinema</strong></span>
                      <span className="text-cyan-400">Teams: <strong>4K 60fps Master</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Timeline Tracks</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>2 Tracks</strong></span>
                      <span className="text-indigo-400">Pro: <strong>Unlimited</strong></span>
                      <span className="text-pink-400">Max: <strong>Unlimited</strong></span>
                      <span className="text-cyan-400">Teams: <strong>Unlimited</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Watermark Policy</span>
                    <p className="mt-1 text-xs text-cyan-300 font-semibold">
                      Zero watermarks across all paid plans. All exported videos and images are completely clean with commercial rights.
                    </p>
                  </div>
                </div>
              )}

              {mobileMatrixSection === 'collab' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Cloud Storage Allocation</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>10 GB</strong></span>
                      <span className="text-indigo-400">Pro: <strong>50 GB</strong></span>
                      <span className="text-pink-400">Max: <strong>150 GB</strong></span>
                      <span className="text-cyan-400">Teams: <strong>500 GB Shared</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">Team Seats & Roles</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>1 User</strong></span>
                      <span className="text-indigo-400">Pro: <strong>1 User</strong></span>
                      <span className="text-pink-400">Max: <strong>1 User</strong></span>
                      <span className="text-cyan-400">Teams: <strong>Up to 10 Seats</strong></span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#11131A] border border-white/8">
                    <span className="font-bold text-xs text-white block">GPU Queue Priority</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <span className="text-slate-400">Basic: <strong>Standard</strong></span>
                      <span className="text-indigo-400">Pro: <strong>Priority Slot</strong></span>
                      <span className="text-pink-400">Max: <strong>VIP Lane</strong></span>
                      <span className="text-cyan-400">Teams: <strong>Concurrent Nodes</strong></span>
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
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-400 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 shadow-2xs font-mono">
              One-Time Creative Boost
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
              Need extra credits? Top up on-demand.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Purchased credits never expire. Instant wallet fulfillment upon PayU India payment clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                className={`relative rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between bg-[#11131A] shadow-sm hover:shadow-lg text-left ${
                  pack.popular
                    ? 'border-indigo-500/70 ring-2 ring-indigo-500/25 shadow-indigo-500/10'
                    : 'border-white/8 hover:border-white/20'
                }`}
              >
                {pack.popular && (
                  <span className="absolute -top-2.5 right-4 text-[9px] uppercase tracking-wider font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-2.5 py-0.5 rounded-full shadow-sm font-mono">
                    Best Value
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">{pack.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">{pack.perCredit} / cred</span>
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 font-medium">INR</span>
                    <span className="text-2xl font-black text-white font-mono">₹{pack.priceInr.toLocaleString()}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Total: <strong className="text-white font-mono">₹{pack.totalInr.toFixed(2)}</strong>
                  </p>

                  <div className="mt-4 p-2.5 rounded-2xl bg-[#0B0C10] border border-white/8 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Wallet Credits:</span>
                    <strong className="text-cyan-400 font-mono font-black">
                      +{pack.credits.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyCreditPack(pack.id)}
                  className={`mt-6 w-full py-3 min-h-[44px] px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    pack.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/12'
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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/10 text-left">
          <div className="p-5 rounded-3xl bg-[#0E1015] border border-white/8 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/20">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Official Invoices & Receipts</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Every settled transaction generates a downloadable PDF invoice and official payment receipt. All purchases are cryptographically confirmed.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0E1015] border border-white/8 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3 border border-pink-500/20">
              <CreditCard className="w-4 h-4 text-pink-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Encrypted PayU India Gateway</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Payments are processed via PayU with 128-bit SHA-512 cryptographic verification. UPI, RuPay, Visa, Mastercard, and Net Banking are supported natively.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#0E1015] border border-white/8 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 border border-cyan-500/20">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Rollover & Zero Hidden Fees</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Unused subscription credits roll over across active billing cycles. Upgrade or downgrade anytime; credit balances are preserved safely in your wallet.
            </p>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* INTERACTIVE PLAN RECOMMENDER MODAL */}
      {/* ========================================================================= */}
      {showRecommenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0E1015] max-w-lg w-full p-6 sm:p-7 rounded-3xl shadow-2xl relative space-y-6 text-left border border-white/12 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowRecommenderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-mono">
                Plan Matchmaker
              </span>
              <h3 className="text-xl font-bold text-white mt-2">Find your optimal Fluvia Flow plan</h3>
              <p className="text-xs text-slate-400 mt-1">
                Answer 3 quick questions to get an algorithmic recommendation tailored to your production volume.
              </p>
            </div>

            <div className="space-y-4">
              {/* Question 1: Monthly Video Volume */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  1. How many videos or visuals do you render each month?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQVolume('low')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qVolume === 'low'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">Under 20 clips</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Occasional testing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQVolume('medium')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qVolume === 'medium'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">20 - 70 clips</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Regular creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQVolume('high')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qVolume === 'high'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">70 - 180 clips</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Advertisers & Pro VFX</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQVolume('agency')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qVolume === 'agency'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">200+ clips</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Agency production</span>
                  </button>
                </div>
              </div>

              {/* Question 2: Export Resolution */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  2. What is your primary delivery resolution?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQQuality('1080p')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qQuality === '1080p'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">1080p Full HD</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Reels, Shorts, TikTok</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQQuality('4k')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qQuality === '4k'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">4K Ultra HD Cinema</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Commercials & YouTube</span>
                  </button>
                </div>
              </div>

              {/* Question 3: Team Collaboration */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  3. Are you working solo or as a collaborative team?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setQTeam('solo')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qTeam === 'solo'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">Solo Creator</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">1 user seat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQTeam('team')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      qTeam === 'team'
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-xs'
                        : 'border-white/10 bg-[#11131A] text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <strong className="block text-white">Agency / Team</strong>
                    <span className="block text-[10px] text-slate-400 mt-0.5">Multi-seat shared wallet</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendation Result */}
            {(() => {
              const rec = getRecommendedPlan();
              return (
                <div className="p-4 rounded-2xl bg-[#11131A] border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">Recommended for You:</span>
                    <strong className="text-base font-extrabold text-white">{rec.name}</strong>
                  </div>
                  <p className="text-xs text-slate-300">{rec.desc}</p>
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/8">
                    <span>
                      INR ₹
                      {billingInterval === 'year'
                        ? rec.annualMonthlyPrice.toLocaleString()
                        : rec.monthlyPrice.toLocaleString()}
                      /mo
                    </span>
                    <span className="text-cyan-400 font-bold font-mono">
                      {rec.credits.toLocaleString()} Credits / mo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecommenderModal(false);
                      handleSelectPlan(rec.id);
                    }}
                    className="w-full py-3 px-4 min-h-[44px] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
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
