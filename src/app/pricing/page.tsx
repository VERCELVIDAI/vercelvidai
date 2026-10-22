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
} from 'lucide-react';

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
  exportResolution: '1080p' | '4K' | '4K 60fps';
  storageGb: number;
  models: string[];
  features: string[];
  ctaText: string;
}

export default function PricingPage() {
  const router = useRouter();
  const [planCategory, setPlanCategory] = useState<'individual' | 'business'>('individual');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [showRecommenderModal, setShowRecommenderModal] = useState(false);
  const [showDetailedMatrix, setShowDetailedMatrix] = useState(false);

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

  // Four authentic Fluvia Flow plans
  const allPlans: PlanConfig[] = [
    {
      id: 'plan_starter',
      name: 'Fluvia Basic',
      tier: 'basic',
      category: 'individual',
      monthlyPrice: 999,
      annualMonthlyPrice: 799,
      credits: 500,
      desc: 'For beginners and occasional creators getting started with cinematic AI.',
      videoGenerationsEstimate: 20, // 500 / 25
      imageGenerationsEstimate: 100, // 500 / 5
      exportResolution: '1080p',
      storageGb: 10,
      models: ['Fluvia Cinematic v1', 'Flux 1.1 Pro Vision'],
      features: [
        '500 Credits refilled every month',
        '1080p Full HD video exports',
        'Standard generation speed',
        'Multi-track timeline editor (2 tracks)',
        '10 GB High-Speed cloud storage',
        'Standard prompt enhancement',
        'Commercial usage rights',
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
      badge: 'Most Popular',
      desc: 'For content creators, indie filmmakers and social media power users.',
      highlight: true,
      videoGenerationsEstimate: 64, // 1600 / 25
      imageGenerationsEstimate: 320, // 1600 / 5
      exportResolution: '4K',
      storageGb: 50,
      models: ['Runway Gen-3 Alpha', 'Luma Ray', 'Fluvia Cinematic HD', 'Flux Pro Vision'],
      features: [
        '1,600 Credits refilled every month',
        '4K Ultra HD video exports',
        'Priority GPU generation queue',
        'Full Multi-Track Creative Canvas',
        'Gemini Storyboard Copilot',
        '50 GB High-Speed cloud storage',
        'Camera Motion & Lens Studio',
        'Instant credit top-up discounts (10%)',
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
        '4,000 Credits refilled every month',
        '4K 60fps Cinema Master exports',
        'Dedicated VIP GPU render lane',
        'Unlimited Canvas timeline tracks',
        'Full Gemini Script & Storyboard Studio',
        '150 GB High-Speed cloud storage',
        'Audio Stem & Voiceover Generator',
        'Instant credit top-up discounts (20%)',
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
      exportResolution: '4K 60fps',
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
      ctaText: 'Get Fluvia Teams',
    },
  ];

  // Display 4 cards side by side on desktop (or filter when tab selected)
  const displayedPlans =
    planCategory === 'business'
      ? [allPlans[1], allPlans[2], allPlans[3]]
      : allPlans;

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
    <div className="min-h-screen flex flex-col transition-colors duration-200 text-[#17211D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        {/* ========================================================================= */}
        {/* HEADER CONTROLS SECTION */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 mb-4 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>PayU India Verified • 18% GST Compliant • Instant Creative GPU Provisioning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17211D] tracking-tight">
            Plans built for creators who move fast.
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-normal">
            Every plan includes genuine server-grade AI rendering, multi-track timeline editing, and zero export watermarks.
          </p>

          {/* Navigation Controls: Tabs & Billing Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Individual vs Business Tabs */}
            <div className="inline-flex p-1 rounded-xl glass-panel border border-emerald-500/20 shadow-sm">
              <button
                type="button"
                onClick={() => setPlanCategory('individual')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
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
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
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
            <div className="inline-flex items-center p-1 rounded-xl glass-panel border border-emerald-500/20 shadow-sm">
              <button
                type="button"
                onClick={() => handleIntervalChange('month')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
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
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  billingInterval === 'year'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#17211D]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] font-extrabold bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200 shadow-xs">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Not sure which plan? */}
            <button
              type="button"
              onClick={() => setShowRecommenderModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 glass-card border border-emerald-500/20 shadow-xs transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Not sure which plan?</span>
            </button>
          </div>

          {/* Transparent Credit Consumption Note */}
          <div className="mt-6 text-xs text-slate-600 max-w-2xl mx-auto flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              <strong>Credit consumption:</strong> 1 second of Fluvia Cinematic Video = 5 credits (25 credits per 5s clip). Flux Image = 5 credits. Unused credits roll over while your subscription remains active.
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUR PREMIUM COMPARISON CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {displayedPlans.map((plan) => {
            const isAnnual = billingInterval === 'year';
            const price = isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
            const fullAnnualCharged = plan.annualMonthlyPrice * 12;
            const savingsPercent = Math.round(
              ((plan.monthlyPrice - plan.annualMonthlyPrice) / plan.monthlyPrice) * 100
            );

            // Refined White + Emerald Green + Soft Pink Glassmorphism Tier Styles
            const tierStyles = {
              basic: {
                border: 'border-slate-300 hover:border-slate-400',
                glow: 'hover:shadow-[0_10px_30px_rgba(100,116,139,0.12)]',
                accentText: 'text-slate-800',
                badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
                buttonClass: 'bg-slate-800 hover:bg-slate-900 text-white font-bold',
                checkColor: 'text-slate-600',
                creditBadge: 'bg-slate-100 text-slate-800 border-slate-200',
              },
              pro: {
                border: 'border-emerald-500/60 shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:border-emerald-500 ring-2 ring-emerald-500/20',
                glow: 'hover:shadow-[0_15px_40px_rgba(16,185,129,0.22)]',
                accentText: 'text-emerald-700',
                badgeBg: 'bg-emerald-600 text-white font-extrabold border-emerald-500',
                buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/25',
                checkColor: 'text-emerald-600',
                creditBadge: 'bg-emerald-50 text-emerald-900 border-emerald-300',
              },
              max: {
                border: 'border-pink-400/60 shadow-[0_10px_30px_rgba(236,72,153,0.12)] hover:border-pink-500',
                glow: 'hover:shadow-[0_15px_40px_rgba(236,72,153,0.22)]',
                accentText: 'text-pink-600',
                badgeBg: 'bg-pink-500 text-white font-extrabold border-pink-400',
                buttonClass: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-500/25',
                checkColor: 'text-pink-600',
                creditBadge: 'bg-pink-50 text-pink-900 border-pink-300',
              },
              teams: {
                border: 'border-teal-500/60 shadow-[0_10px_30px_rgba(20,184,166,0.12)] hover:border-teal-500',
                glow: 'hover:shadow-[0_15px_40px_rgba(20,184,166,0.22)]',
                accentText: 'text-teal-700',
                badgeBg: 'bg-teal-700 text-white font-extrabold border-teal-600',
                buttonClass: 'bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold shadow-lg shadow-teal-500/25',
                checkColor: 'text-teal-700',
                creditBadge: 'bg-teal-50 text-teal-900 border-teal-300',
              },
            }[plan.tier];

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between glass-card transition-all duration-300 ${tierStyles.border} ${tierStyles.glow} text-left shadow-lg`}
              >
                {/* Badge if present */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm ${tierStyles.badgeBg}`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-bold text-[#17211D] tracking-tight">{plan.name}</h3>
                    <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
                      {plan.category}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {plan.desc}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-5 pb-5 border-b border-emerald-500/15">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-slate-500 font-semibold">INR</span>
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#17211D] tracking-tight">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
                    </div>

                    {isAnnual ? (
                      <div className="mt-1 text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                        <span>Billed annually (₹{fullAnnualCharged.toLocaleString()} / yr)</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold border border-emerald-200">
                          SAVE {savingsPercent}%
                        </span>
                      </div>
                    ) : (
                      <div className="mt-1 text-[11px] text-slate-500 font-medium">
                        Billed monthly • Cancel anytime
                      </div>
                    )}
                  </div>

                  {/* Credits & Production Entitlement Summary */}
                  <div className="mt-5 space-y-3">
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between shadow-xs ${tierStyles.creditBadge}`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold">Monthly Credits:</span>
                      </div>
                      <span className="text-sm font-extrabold font-mono">
                        {plan.credits.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                      <div className="p-2 rounded-lg bg-white/70 border border-emerald-500/15">
                        <span className="text-slate-500 block text-[10px]">Estimated Videos</span>
                        <strong className="text-[#17211D] font-mono">~{plan.videoGenerationsEstimate} clips (5s)</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white/70 border border-emerald-500/15">
                        <span className="text-slate-500 block text-[10px]">Max Resolution</span>
                        <strong className="text-[#17211D] font-mono">{plan.exportResolution}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Feature List */}
                  <div className="mt-6 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Included Capabilities:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tierStyles.checkColor}`}
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="mt-8 pt-4 border-t border-emerald-500/15">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${tierStyles.buttonClass}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-emerald-500/20 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-800 transition-all shadow-sm"
          >
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>{showDetailedMatrix ? 'Hide Detailed Feature Matrix' : 'Compare All Plan Entitlements & Models'}</span>
            {showDetailedMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* DETAILED ENTITLEMENT MATRIX */}
        {/* ========================================================================= */}
        {showDetailedMatrix && (
          <div className="mt-8 glass-card border border-emerald-500/25 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-300 text-left">
            <div className="p-6 bg-emerald-50/40 border-b border-emerald-500/20">
              <h3 className="text-lg font-bold text-[#17211D]">Full Feature & Model Comparison</h3>
              <p className="text-xs text-slate-600 mt-1">
                Authentic comparison based on server-side model dispatching and storage parameters.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-emerald-500/15 bg-white/50 text-slate-600">
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREDIT TOP-UP PACKS SECTION */}
        {/* ========================================================================= */}
        <div className="mt-20 pt-16 border-t border-emerald-500/15">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300">
              One-Time Creative Boost
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211D] mt-3">
              Need extra credits? Top up on-demand.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Credits never expire. Purchased credits are added instantly to your wallet upon PayU clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                className={`relative rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between glass-card shadow-sm hover:shadow-lg text-left ${
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
                    <span className="text-2xl font-extrabold text-[#17211D]">₹{pack.priceInr.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500">+ 18% GST</span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Total: <strong className="text-slate-800">₹{pack.totalInr.toFixed(2)}</strong> (incl. taxes)
                  </p>

                  <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium">Wallet Credits:</span>
                    <strong className="text-emerald-800 font-mono font-bold">
                      +{pack.credits.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuyCreditPack(pack.id)}
                  className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
          <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="text-sm font-bold text-[#17211D]">Official Tax Invoices & B2B ITC</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Every settled transaction generates a downloadable PDF Tax Invoice (SAC 998314) and official payment receipt. GSTIN input tax credits are fully supported.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center mb-3">
              <CreditCard className="w-4 h-4 text-pink-600" />
            </div>
            <h4 className="text-sm font-bold text-[#17211D]">Encrypted PayU India Gateway</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Payments are processed via PayU with 128-bit SHA-512 cryptographic verification. UPI, RuPay, Visa, Mastercard, and Net Banking are supported natively.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4 text-teal-700" />
            </div>
            <h4 className="text-sm font-bold text-[#17211D]">Rollover & No Surprise Fees</h4>
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
          <div className="glass-modal max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-6 text-left border border-emerald-500/30">
            <button
              type="button"
              onClick={() => setShowRecommenderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors"
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
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3">
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
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
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
