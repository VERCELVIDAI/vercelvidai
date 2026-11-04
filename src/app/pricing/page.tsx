'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { PlanRecommenderModal } from '@/components/pricing/PlanRecommenderModal';
import { FeatureComparisonMatrix } from '@/components/pricing/FeatureComparisonMatrix';
import { CreditTopUpSection } from '@/components/pricing/CreditTopUpSection';
import { AnimatedDiscountGiftBox } from '@/components/pricing/AnimatedDiscountGiftBox';
import { AnnualPrivilegePassModal } from '@/components/pricing/AnnualPrivilegePassModal';
import {
  Check,
  X,
  Sparkles,
  Zap,
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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Moon,
  Sun,
  Flame,
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
  category: 'individual' | 'business' | 'openhiggs';
  discountBadge?: string;
  bestValueBadge?: string;
  isRecommended?: boolean;
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

interface PlanColorTheme {
  cardBg: string;
  headerGlow: string;
  cardBorder: string;
  titleColor: string;
  subtitleColor?: string;
  discountBadge: string;
  bestValueBadge?: string;
  creditBoxBg: string;
  creditIconColor: string;
  creditHeaderColor: string;
  creditTextColor?: string;
  priceColor?: string;
  strikethroughColor?: string;
  periodColor?: string;
  ctaButton: string;
  freeGensBoxBg: string;
  freeGensHeaderColor: string;
  freeGensBadge: string;
  unlimitedBoxBg: string;
  unlimitedHeaderColor: string;
  unlimitedBadge: string;
  checklistText?: string;
  checkIconColor?: string;
}

export default function PricingPage() {
  const router = useRouter();

  // Dark / Light Theme state: default to 'light' matching website UI
  const [pricingTheme, setPricingTheme] = useState<'dark' | 'light'>('light');
  const isDark = pricingTheme === 'dark';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluvia_pricing_theme');
      if (saved === 'dark') {
        setPricingTheme('dark');
      } else {
        setPricingTheme('light');
      }
    } catch {}
  }, []);

  const togglePricingTheme = () => {
    const next = pricingTheme === 'dark' ? 'light' : 'dark';
    setPricingTheme(next);
    try {
      localStorage.setItem('fluvia_pricing_theme', next);
    } catch {}
  };

  // Toolbar state: 'individual' (4 sample plans) or 'openhiggs' (3 OpenHiggs studio tiers) or 'business'
  const [activeTab, setActiveTab] = useState<'individual' | 'openhiggs' | 'business'>('individual');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year'); // Annual by default with savings
  const [currency, setCurrency] = useState<'inr' | 'usd'>('inr'); // INR default, toggleable to USD
  const [isRecommenderOpen, setIsRecommenderOpen] = useState(false);
  const [isAnnualPassModalOpen, setIsAnnualPassModalOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({});

  // Auto-engage after 7 seconds for visitors who haven't seen the Annual Pass modal
  useEffect(() => {
    try {
      const alreadyShown = sessionStorage.getItem('fluvia_annual_modal_shown');
      if (!alreadyShown) {
        const timer = setTimeout(() => {
          setIsAnnualPassModalOpen(true);
          sessionStorage.setItem('fluvia_annual_modal_shown', 'true');
        }, 7000);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // Pro tier selector: 600 or 900
  const [proTierIndex, setProTierIndex] = useState<number>(0);
  // Ultra/Max Tier selector: 0 = 1,800 / 3,000, 1 = 3,600 / 6,000, 2 = 5,400 / 9,000
  const [maxTierIndex, setMaxTierIndex] = useState<number>(0);

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
    const tierParam = planId === 'plan_max' ? `&tier=${maxTierIndex}` : '';
    const currencyParam = `&currency=${currency}`;
    router.push(
      `/checkout?type=subscription&id=${planId}&interval=${billingInterval}${tierParam}${currencyParam}${couponParam}`
    );
  };

  const handleBuyCreditPack = (packId: string) => {
    router.push(`/checkout?type=pack&id=${packId}`);
  };

  const scrollToMatrix = () => {
    const el = document.getElementById('feature-matrix-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Max / Ultra Tier definitions matching sample image < 1,800 • 3,600 • 5,400 > (or INR 3,000 • 6,000 • 9,000)
  const maxTiers = [
    {
      credits: 1800,
      inrCredits: 3000,
      gens: 900,
      videos: 120,
      usdAnnual: 59,
      usdMonthly: 79,
      usdStrikethrough: 79,
      inrAnnual: 3999,
      inrMonthly: 4999,
      inrStrikethrough: 4999,
    },
    {
      credits: 3600,
      inrCredits: 6000,
      gens: 1800,
      videos: 240,
      usdAnnual: 119,
      usdMonthly: 149,
      usdStrikethrough: 149,
      inrAnnual: 7499,
      inrMonthly: 9499,
      inrStrikethrough: 9499,
    },
    {
      credits: 5400,
      inrCredits: 9000,
      gens: 2700,
      videos: 360,
      usdAnnual: 179,
      usdMonthly: 219,
      usdStrikethrough: 219,
      inrAnnual: 10999,
      inrMonthly: 13999,
      inrStrikethrough: 13999,
    },
  ];

  const currentMaxTier = maxTiers[maxTierIndex];

  // -------------------------------------------------------------------------
  // HIGGSFIELD OBSIDIAN DARK STUDIO THEMES (1:1 EXACT MATCH TO USER SCREENSHOT)
  // -------------------------------------------------------------------------
  const darkPlanColorThemes: Record<string, PlanColorTheme> = {
    plan_starter: {
      cardBg: 'bg-[#0E121B]/95',
      headerGlow: 'bg-gradient-to-b from-slate-700/25 to-transparent',
      cardBorder: 'border-2 border-slate-800 hover:border-slate-700 shadow-2xl shadow-black/60',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: '',
      creditBoxBg: 'bg-[#141A26] border border-slate-800',
      creditIconColor: 'text-slate-400',
      creditHeaderColor: 'text-slate-200 font-bold',
      creditTextColor: 'text-slate-400',
      priceColor: 'text-white',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-white hover:bg-slate-200 text-black font-black shadow-lg shadow-white/10',
      freeGensBoxBg: 'bg-[#141A26]/70 border border-slate-800/80',
      freeGensHeaderColor: 'text-slate-300 font-extrabold',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#141A26]/70 border border-slate-800/80',
      unlimitedHeaderColor: 'text-slate-300 font-extrabold',
      unlimitedBadge: 'bg-slate-800/80 text-slate-400 font-bold border border-slate-700',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-slate-400',
    },
    plan_creator: {
      cardBg: 'bg-[#0E180B]/95',
      headerGlow: 'bg-gradient-to-b from-[#d4ff00]/20 via-[#d4ff00]/5 to-transparent',
      cardBorder: 'border-2 border-[#a3e635] shadow-[0_0_35px_rgba(163,230,53,0.18)] hover:shadow-[0_0_55px_rgba(163,230,53,0.28)]',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: 'bg-[#ff1f66] text-white font-black shadow-[0_0_12px_rgba(255,31,102,0.5)]',
      creditBoxBg: 'bg-[#14230E] border border-[#a3e635]/40',
      creditIconColor: 'text-[#d4ff00]',
      creditHeaderColor: 'text-white font-black',
      creditTextColor: 'text-slate-300',
      priceColor: 'text-white',
      strikethroughColor: 'text-[#ff1f66]',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-black shadow-[0_0_30px_rgba(212,255,0,0.45)] hover:scale-[1.02] active:scale-[0.98]',
      freeGensBoxBg: 'bg-[#14230E]/70 border border-[#a3e635]/30',
      freeGensHeaderColor: 'text-lime-300 font-extrabold',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#14230E]/70 border border-[#a3e635]/30',
      unlimitedHeaderColor: 'text-lime-300 font-extrabold',
      unlimitedBadge: 'bg-[#d4ff00] text-black font-extrabold shadow-xs',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-[#a3e635]',
    },
    plan_max: {
      cardBg: 'bg-[#1B0B18]/95',
      headerGlow: 'bg-gradient-to-b from-[#ff1f66]/25 via-[#ff1f66]/5 to-transparent',
      cardBorder: 'border-2 border-[#ff1f66] shadow-[0_0_40px_rgba(255,31,102,0.25)] hover:shadow-[0_0_60px_rgba(255,31,102,0.38)] ring-1 ring-[#ff1f66]/40 lg:-translate-y-2',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: 'bg-[#ff1f66] text-white font-black shadow-[0_0_12px_rgba(255,31,102,0.6)]',
      bestValueBadge: 'bg-[#0284c7] text-white font-black shadow-[0_0_12px_rgba(2,132,199,0.6)]',
      creditBoxBg: 'bg-[#270E21] border border-[#ff1f66]/40',
      creditIconColor: 'text-[#ff1f66]',
      creditHeaderColor: 'text-white font-black',
      creditTextColor: 'text-slate-300',
      priceColor: 'text-white',
      strikethroughColor: 'text-[#ff1f66]',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-gradient-to-r from-[#ff007a] via-[#ff1f66] to-[#e11d48] text-white font-black shadow-[0_0_35px_rgba(255,0,122,0.5)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]',
      freeGensBoxBg: 'bg-[#270E21]/70 border border-[#ff1f66]/30',
      freeGensHeaderColor: 'text-pink-300 font-extrabold',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#270E21]/70 border border-[#ff1f66]/30',
      unlimitedHeaderColor: 'text-pink-300 font-extrabold',
      unlimitedBadge: 'bg-[#d4ff00] text-black font-extrabold shadow-xs',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-[#ff1f66]',
    },
    plan_business: {
      cardBg: 'bg-[#0B1022]/95',
      headerGlow: 'bg-gradient-to-b from-blue-600/25 via-blue-600/5 to-transparent',
      cardBorder: 'border-2 border-blue-500 shadow-[0_0_35px_rgba(37,99,235,0.22)] hover:shadow-[0_0_50px_rgba(37,99,235,0.32)]',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: 'bg-[#ff1f66] text-white font-black shadow-[0_0_12px_rgba(255,31,102,0.6)]',
      creditBoxBg: 'bg-[#101935] border border-blue-500/40',
      creditIconColor: 'text-blue-400',
      creditHeaderColor: 'text-white font-black',
      creditTextColor: 'text-slate-300',
      priceColor: 'text-white',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black shadow-[0_0_30px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.98]',
      freeGensBoxBg: 'bg-[#101935]/70 border border-blue-500/30',
      freeGensHeaderColor: 'text-blue-300 font-extrabold',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#101935]/70 border border-blue-500/30',
      unlimitedHeaderColor: 'text-blue-300 font-extrabold',
      unlimitedBadge: 'bg-[#d4ff00] text-black font-extrabold shadow-xs',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-blue-400',
    },
    plan_openhiggs_lite: {
      cardBg: 'bg-[#0B151C]/95',
      headerGlow: 'bg-gradient-to-b from-cyan-500/20 to-transparent',
      cardBorder: 'border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.18)] hover:shadow-[0_0_45px_rgba(6,182,212,0.28)]',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: 'bg-[#ff1f66] text-white font-black',
      bestValueBadge: 'bg-cyan-600 text-white font-black',
      creditBoxBg: 'bg-[#0E202B] border border-cyan-400/40',
      creditIconColor: 'text-cyan-400',
      creditHeaderColor: 'text-white font-black',
      creditTextColor: 'text-slate-300',
      priceColor: 'text-white',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-black shadow-[0_0_25px_rgba(6,182,212,0.4)]',
      freeGensBoxBg: 'bg-[#0E202B]/70 border border-cyan-400/30',
      freeGensHeaderColor: 'text-cyan-300 font-extrabold',
      freeGensBadge: 'bg-cyan-300 text-cyan-950 font-extrabold',
      unlimitedBoxBg: 'bg-[#0E202B]/70 border border-cyan-400/30',
      unlimitedHeaderColor: 'text-cyan-300 font-extrabold',
      unlimitedBadge: 'bg-cyan-300 text-cyan-950 font-extrabold',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-cyan-400',
    },
    plan_openhiggs: {
      cardBg: 'bg-[#081811]/95',
      headerGlow: 'bg-gradient-to-b from-emerald-500/25 to-transparent',
      cardBorder: 'border-2 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.22)] hover:shadow-[0_0_55px_rgba(16,185,129,0.32)] ring-1 ring-emerald-500/30 lg:-translate-y-2',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: 'bg-[#ff1f66] text-white font-black',
      bestValueBadge: 'bg-emerald-600 text-white font-black',
      creditBoxBg: 'bg-[#0E261A] border border-emerald-400/40',
      creditIconColor: 'text-emerald-400',
      creditHeaderColor: 'text-white font-black',
      creditTextColor: 'text-slate-300',
      priceColor: 'text-white',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-[0_0_30px_rgba(16,185,129,0.45)]',
      freeGensBoxBg: 'bg-[#0E261A]/70 border border-emerald-400/30',
      freeGensHeaderColor: 'text-emerald-300 font-extrabold',
      freeGensBadge: 'bg-[#CCFF00] text-black font-extrabold',
      unlimitedBoxBg: 'bg-[#0E261A]/70 border border-emerald-400/30',
      unlimitedHeaderColor: 'text-emerald-300 font-extrabold',
      unlimitedBadge: 'bg-[#CCFF00] text-black font-extrabold',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-emerald-400',
    },
    plan_openhiggs_max: {
      cardBg: 'bg-[#150B20]/95',
      headerGlow: 'bg-gradient-to-b from-purple-600/25 to-transparent',
      cardBorder: 'border-2 border-purple-500 shadow-[0_0_35px_rgba(168,85,247,0.2)] hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]',
      titleColor: 'text-white font-black',
      subtitleColor: 'text-slate-400',
      discountBadge: 'bg-[#ff1f66] text-white font-black',
      bestValueBadge: 'bg-purple-600 text-white font-black',
      creditBoxBg: 'bg-[#201032] border border-purple-400/40',
      creditIconColor: 'text-purple-400',
      creditHeaderColor: 'text-white font-black',
      creditTextColor: 'text-slate-300',
      priceColor: 'text-white',
      periodColor: 'text-slate-400',
      ctaButton: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-black shadow-[0_0_30px_rgba(168,85,247,0.45)]',
      freeGensBoxBg: 'bg-[#201032]/70 border border-purple-400/30',
      freeGensHeaderColor: 'text-purple-300 font-extrabold',
      freeGensBadge: 'bg-[#CCFF00] text-black font-extrabold',
      unlimitedBoxBg: 'bg-[#201032]/70 border border-purple-400/30',
      unlimitedHeaderColor: 'text-purple-300 font-extrabold',
      unlimitedBadge: 'bg-[#CCFF00] text-black font-extrabold',
      checklistText: 'text-slate-300',
      checkIconColor: 'text-purple-400',
    },
  };

  // -------------------------------------------------------------------------
  // CLEAN LIGHT SAAS THEMES (FALLBACK)
  // -------------------------------------------------------------------------
  const lightPlanColorThemes: Record<string, PlanColorTheme> = {
    plan_starter: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-slate-100/90 via-slate-50/40 to-transparent',
      cardBorder: 'border-2 border-slate-200 hover:border-slate-400 shadow-sm hover:shadow-md',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: '',
      creditBoxBg: 'bg-slate-50/90 border border-slate-200',
      creditIconColor: 'text-slate-600',
      creditHeaderColor: 'text-slate-900',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-white hover:bg-slate-100 text-slate-900 font-black border-2 border-slate-900 shadow-sm',
      freeGensBoxBg: 'bg-slate-50/90 border border-slate-200',
      freeGensHeaderColor: 'text-slate-800',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-slate-50/90 border border-slate-200',
      unlimitedHeaderColor: 'text-slate-800',
      unlimitedBadge: 'bg-slate-100 text-slate-500 border border-slate-200 font-bold',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
    plan_creator: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-[#d4ff00]/25 via-lime-50/40 to-transparent',
      cardBorder: 'border-2 border-[#84cc16] hover:border-[#65a30d] shadow-md shadow-lime-500/10 hover:shadow-xl',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: 'bg-[#ff1f66] text-white font-black',
      creditBoxBg: 'bg-[#f7fee7] border border-[#bef264]',
      creditIconColor: 'text-lime-700',
      creditHeaderColor: 'text-lime-950',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      strikethroughColor: 'text-[#ff1f66]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-[#d4ff00] hover:bg-[#c2eb00] text-black font-black shadow-md shadow-lime-500/30',
      freeGensBoxBg: 'bg-[#f7fee7] border border-[#d9f99d]',
      freeGensHeaderColor: 'text-emerald-950',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#f7fee7] border border-[#d9f99d]',
      unlimitedHeaderColor: 'text-lime-950',
      unlimitedBadge: 'bg-[#d4ff00] text-black font-extrabold shadow-xs',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
    plan_max: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-pink-200/60 via-rose-50/40 to-transparent',
      cardBorder: 'border-2 border-[#ff1f66] shadow-xl shadow-pink-500/20 ring-2 ring-pink-400/25 lg:-translate-y-2',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: 'bg-[#ff1f66] text-white font-black',
      bestValueBadge: 'bg-[#0284c7] text-white font-black',
      creditBoxBg: 'bg-[#fff1f2] border border-[#fecdd3]',
      creditIconColor: 'text-pink-600',
      creditHeaderColor: 'text-pink-950',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      strikethroughColor: 'text-[#ff1f66]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-gradient-to-r from-[#ff007a] via-[#ff1f66] to-[#e11d48] hover:opacity-95 text-white font-black shadow-lg shadow-pink-500/35',
      freeGensBoxBg: 'bg-[#fff1f2] border border-[#fecdd3]',
      freeGensHeaderColor: 'text-pink-950',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#fff1f2] border border-[#fecdd3]',
      unlimitedHeaderColor: 'text-pink-950',
      unlimitedBadge: 'bg-[#d4ff00] text-black font-extrabold shadow-xs',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
    plan_business: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-blue-200/60 via-blue-50/40 to-transparent',
      cardBorder: 'border-2 border-blue-500 hover:border-blue-600 shadow-md shadow-blue-500/15',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: 'bg-[#ff1f66] text-white font-black',
      creditBoxBg: 'bg-[#eff6ff] border border-[#bfdbfe]',
      creditIconColor: 'text-blue-700',
      creditHeaderColor: 'text-blue-950',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black shadow-md shadow-blue-500/30',
      freeGensBoxBg: 'bg-[#eff6ff] border border-[#bfdbfe]',
      freeGensHeaderColor: 'text-blue-900',
      freeGensBadge: 'bg-[#d4ff00] text-black font-extrabold border border-lime-300 shadow-xs',
      unlimitedBoxBg: 'bg-[#eff6ff] border border-[#bfdbfe]',
      unlimitedHeaderColor: 'text-blue-900',
      unlimitedBadge: 'bg-[#d4ff00] text-black font-extrabold shadow-xs',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
    plan_openhiggs_lite: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-cyan-100/90 via-cyan-50/30 to-white',
      cardBorder: 'border-2 border-cyan-400 hover:border-cyan-500 shadow-md shadow-cyan-500/10',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: 'bg-[#FF1F66] text-white font-black',
      bestValueBadge: 'bg-cyan-600 text-white font-black',
      creditBoxBg: 'bg-cyan-50/70 border border-cyan-200',
      creditIconColor: 'text-cyan-700',
      creditHeaderColor: 'text-cyan-950',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:opacity-95 text-white font-black shadow-md shadow-cyan-500/25',
      freeGensBoxBg: 'bg-cyan-50/50 border border-cyan-200',
      freeGensHeaderColor: 'text-cyan-950',
      freeGensBadge: 'bg-cyan-100 text-cyan-900 font-extrabold border border-cyan-300',
      unlimitedBoxBg: 'bg-cyan-50/50 border border-cyan-200',
      unlimitedHeaderColor: 'text-cyan-950',
      unlimitedBadge: 'bg-cyan-100 text-cyan-900 font-extrabold',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
    plan_openhiggs: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-emerald-100/95 via-emerald-50/40 to-white',
      cardBorder: 'border-2 border-[#059669] shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/20 lg:-translate-y-2',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: 'bg-[#FF1F66] text-white font-black',
      bestValueBadge: 'bg-emerald-600 text-white font-black',
      creditBoxBg: 'bg-emerald-50/80 border border-emerald-300',
      creditIconColor: 'text-emerald-700',
      creditHeaderColor: 'text-emerald-950',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-[#059669] hover:bg-[#047857] text-white font-black shadow-lg shadow-emerald-600/30',
      freeGensBoxBg: 'bg-emerald-50/60 border border-emerald-200',
      freeGensHeaderColor: 'text-emerald-950',
      freeGensBadge: 'bg-[#CCFF00] text-black font-extrabold border border-lime-300',
      unlimitedBoxBg: 'bg-emerald-50/60 border border-emerald-200',
      unlimitedHeaderColor: 'text-emerald-950',
      unlimitedBadge: 'bg-[#CCFF00] text-black font-extrabold',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
    plan_openhiggs_max: {
      cardBg: 'bg-white',
      headerGlow: 'bg-gradient-to-b from-purple-100/90 via-purple-50/30 to-white',
      cardBorder: 'border-2 border-purple-500 hover:border-purple-600 shadow-lg shadow-purple-500/15',
      titleColor: 'text-[#17191D]',
      subtitleColor: 'text-[#667085]',
      discountBadge: 'bg-[#FF1F66] text-white font-black',
      bestValueBadge: 'bg-purple-700 text-white font-black',
      creditBoxBg: 'bg-purple-50/70 border border-purple-200',
      creditIconColor: 'text-purple-700',
      creditHeaderColor: 'text-purple-950',
      creditTextColor: 'text-[#667085]',
      priceColor: 'text-[#17191D]',
      periodColor: 'text-[#667085]',
      ctaButton: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 text-white font-black shadow-md shadow-purple-500/25',
      freeGensBoxBg: 'bg-purple-50/50 border border-purple-200',
      freeGensHeaderColor: 'text-purple-950',
      freeGensBadge: 'bg-[#CCFF00] text-black font-extrabold border border-lime-300',
      unlimitedBoxBg: 'bg-purple-50/50 border border-purple-200',
      unlimitedHeaderColor: 'text-purple-950',
      unlimitedBadge: 'bg-[#CCFF00] text-black font-extrabold',
      checklistText: 'text-[#17191D]',
      checkIconColor: 'text-[#10B981]',
    },
  };

  const planColorThemes = isDark ? darkPlanColorThemes : lightPlanColorThemes;

  // All Plans Data
  const plansData: PlanCardData[] = [
    // 1. BASIC / STARTER
    {
      id: 'plan_starter',
      title: 'BASIC',
      subtitle: 'For first-time AI creators',
      category: 'individual',
      usdPriceAnnual: 9,
      usdPriceMonthly: 9,
      inrPriceAnnual: 799,
      inrPriceMonthly: 999,
      creditsMonthly: currency === 'usd' ? 120 : 500,
      creditsLabel: currency === 'usd' ? '120 credits/mo.' : '500 credits/mo.',
      creditsLines: [
        currency === 'usd' ? '= 60 Nano Banana Pro Generations' : '= 100 Nano Banana Pro Generations',
        currency === 'usd' ? '~ 7 Seedance 2.0 Fast videos' : '~ 11 Seedance 2.0 Fast videos',
      ],
      fixedCreditsNote: currency === 'usd' ? 'Fixed amount of 120 credits/mo' : 'Fixed amount of 500 credits/mo',
      ctaText: 'Get Basic',
      freeGensBox: {
        header: 'FREE GENERATIONS',
        items: [
          { name: 'Vox AI Motion Graphics', resBadge: '720p', gensBadge: '2 free tries', included: true },
          { name: 'Genjutsu Lite', resBadge: '1080p', gensBadge: '5 free gens', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '10 free gens', included: true },
          { name: 'Higgsfield Genjutsu', gensBadge: 'No free gens', included: false },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & FREE GENS',
        items: [
          { name: 'Nano Banana Pro', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Seedream 5.0 Pro', unlimitedBadge: 'No unlimited', included: false },
          { name: 'GPT Image 2.5', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Seedance 2.5', unlimitedBadge: 'No unlimited', included: false },
        ],
        extraCount: 2,
        extraItems: [
          { name: 'Luma Ray Motion', unlimitedBadge: 'Standard', included: false },
          { name: 'ElevenLabs Voice Sync', unlimitedBadge: 'Standard', included: false },
        ],
      },
      bottomChecklist: [
        { text: 'Vox AI Motion Graphics (2 free tries included)', included: true, badge: '2 FREE', badgeColor: 'bg-violet-100 text-violet-900 font-bold' },
        { text: 'Parallel generations: up to 2 Videos, 2 Images', included: true },
        { text: 'Access to Seedance 2.0 Fast & 2.0 Mini', included: true },
        { text: 'Access to selected models & features', included: false },
        { text: 'Early access to advanced AI features', included: false },
        { text: 'Access to unlimited marketplace', included: false },
        { text: 'Lowest cost per credit', included: false },
      ],
    },
    // 2. PRO / PLUS
    {
      id: 'plan_creator',
      title: 'PRO',
      subtitle: 'For everyday AI creation',
      category: 'individual',
      discountBadge: '21% OFF',
      usdPriceAnnual: 23,
      usdPriceMonthly: 29,
      usdStrikethrough: 29,
      inrPriceAnnual: 1999,
      inrPriceMonthly: 2499,
      inrStrikethrough: 2499,
      creditsMonthly: currency === 'usd' ? (proTierIndex === 0 ? 600 : 900) : 1600,
      creditsLabel: currency === 'usd' ? `${proTierIndex === 0 ? '600' : '900'} credits/mo.` : '1,600 credits/mo.',
      creditsLines: [
        currency === 'usd' ? '= 300 Nano Banana Pro Generations' : '= 500 Nano Banana Pro Generations',
        currency === 'usd' ? '~ 40 Seedance 2.5 videos' : '~ 67 Seedance 2.5 videos',
      ],
      fixedCreditsNote: currency === 'usd' ? `Selected allowance: ${proTierIndex === 0 ? '600' : '900'} credits/mo` : 'Fixed amount of 1,600 credits/mo',
      ctaText: 'Get Pro',
      freeGensBox: {
        header: 'FREE GENERATIONS',
        items: [
          { name: 'Vox AI Motion Graphics', resBadge: '1080p', gensBadge: '50 gens/mo', included: true },
          { name: 'Genjutsu Lite', resBadge: '1080p', gensBadge: '5 free gens', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '30 free gens', included: true },
          { name: 'Higgsfield Genjutsu', resBadge: '720p', gensBadge: '3 free gens', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & FREE GENS',
        items: [
          { name: 'Nano Banana Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedream 5.0 Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'GPT Image 2.5', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedance 2.5', resBadge: '720p', unlimitedBadge: '7-day unlimited', included: true },
        ],
        extraCount: 7,
        extraItems: [
          { name: 'Kling 3.0', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedance 2.0 Fast', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Luma Ray Motion Engine', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'ElevenLabs Voice Sync', unlimitedBadge: 'Multilingual', included: true },
          { name: 'Higgsfield Ads Studio', unlimitedBadge: 'Full Library', included: true },
          { name: 'Fast Media Processing Engine', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Priority Generation Queue', unlimitedBadge: 'VIP Fast', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Vox Motion Graphics Studio (50 gens/mo, 1080p)', included: true, badge: 'VOX AI', badgeColor: 'bg-violet-600 text-white font-black' },
        { text: 'Unlimited paid parallel generations', included: true, badge: 'NEW', badgeColor: 'bg-[#CCFF00] text-black font-black' },
        { text: 'Access to all Seedance models', included: true },
        { text: 'Access to all models & features', included: true },
        { text: 'Early access to advanced AI features', included: true },
        { text: 'Access to unlimited marketplace', included: true },
        { text: 'Lowest cost per credit', included: false },
      ],
    },
    // 3. MAX / ULTRA
    {
      id: 'plan_max',
      title: 'MAX',
      subtitle: 'For ambitious AI projects',
      category: 'individual',
      discountBadge: '25% OFF',
      bestValueBadge: 'BEST VALUE',
      isRecommended: true,
      usdPriceAnnual: currentMaxTier.usdAnnual,
      usdPriceMonthly: currentMaxTier.usdMonthly,
      usdStrikethrough: currentMaxTier.usdStrikethrough,
      inrPriceAnnual: currentMaxTier.inrAnnual,
      inrPriceMonthly: currentMaxTier.inrMonthly,
      inrStrikethrough: currentMaxTier.inrStrikethrough,
      creditsMonthly: currency === 'usd' ? currentMaxTier.credits : currentMaxTier.inrCredits,
      creditsLabel: currency === 'usd' ? `${currentMaxTier.credits.toLocaleString()} credits/mo.` : `${currentMaxTier.inrCredits.toLocaleString()} credits/mo.`,
      creditsLines: [
        `= ${currentMaxTier.gens.toLocaleString()} Nano Banana Pro Generations`,
        `~ ${currentMaxTier.videos} Seedance 2.5 videos`,
      ],
      fixedCreditsNote: `Selected allowance: ${(currency === 'usd' ? currentMaxTier.credits : currentMaxTier.inrCredits).toLocaleString()} credits/mo`,
      ctaText: 'Get Max',
      couponTag: isEligibleForFirst20 ? (currency === 'usd' ? 'Use FIRST20 for $7 OFF' : 'Use FIRST20 for ₹570 OFF') : undefined,
      freeGensBox: {
        header: 'FREE GENERATIONS',
        items: [
          { name: 'Vox Living Posters 4K', resBadge: '4K 60fps', gensBadge: 'Unlimited', included: true },
          { name: 'Genjutsu Lite', resBadge: '1080p', gensBadge: '5 free gens', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '30 free gens', included: true },
          { name: 'Higgsfield Genjutsu', resBadge: '720p', gensBadge: '3 free gens', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & FREE GENS',
        items: [
          { name: 'Nano Banana Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedream 5.0 Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'GPT Image 2.5', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedance 2.5', resBadge: '720p', unlimitedBadge: '7-day unlimited', included: true },
        ],
        extraCount: 6,
        extraItems: [
          { name: 'Kling 3.0 Pro Studio', resBadge: '4K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Fluvia Cinema Master 60fps', resBadge: '4K 60fps', unlimitedBadge: 'VIP Dedicated', included: true },
          { name: 'Gemini Omni Storyboard Director', resBadge: '4K', unlimitedBadge: 'VIP Lane', included: true },
          { name: 'Runway Gen-3 Alpha Dedicated GPU', resBadge: '4K', unlimitedBadge: 'Dedicated GPU', included: true },
          { name: 'ElevenLabs Voice Design', unlimitedBadge: 'Multilingual VIP', included: true },
          { name: 'Full Commercial Ad Rights', unlimitedBadge: 'Unrestricted', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Vox Living Posters & Explainer Videos (Unlimited 4K)', included: true, badge: 'UNLIMITED', badgeColor: 'bg-[#d4ff00] text-black font-black' },
        { text: 'Unlimited paid parallel generations', included: true, badge: 'NEW', badgeColor: 'bg-[#CCFF00] text-black font-black' },
        { text: 'Access to all Seedance models', included: true },
        { text: 'Access to all models & features', included: true },
        { text: 'Early access to advanced AI features', included: true },
        { text: 'Access to unlimited marketplace', included: true },
        { text: 'Lowest cost per credit', included: true, badge: '60% CHEAPER', badgeColor: 'bg-[#CCFF00] text-black font-black' },
      ],
    },
    // 4. FOR TEAMS (BUSINESS)
    {
      id: 'plan_business',
      title: 'FOR TEAMS',
      subtitle: 'For agencies and small teams to create faster',
      category: 'individual', // shown in 4-col view on individual tab matching screenshot
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
          { name: 'Vox Team Motion Studio', resBadge: '4K Commercial', gensBadge: 'Multi-Seat', included: true },
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
          { name: 'Gemini Storyboard Director', resBadge: '4K', unlimitedBadge: 'Team Library', included: true },
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
        { text: 'Vox Motion for Teams (Multi-seat shared collage assets)', included: true, badge: 'TEAMS', badgeColor: 'bg-blue-600 text-white font-black' },
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

    // 5. OPENHIGGS LITE
    {
      id: 'plan_openhiggs_lite',
      title: 'OPENHIGGS LITE',
      subtitle: 'Starter open-source engine for creator video & image generation',
      category: 'openhiggs',
      discountBadge: '20% OFF',
      bestValueBadge: '15 MODELS',
      usdPriceAnnual: 23,
      usdPriceMonthly: 29,
      usdStrikethrough: 29,
      inrPriceAnnual: 1999,
      inrPriceMonthly: 2499,
      inrStrikethrough: 2499,
      creditsMonthly: currency === 'usd' ? 1200 : 1500,
      creditsLabel: currency === 'usd' ? '1,200 credits/mo.' : '1,500 credits/mo.',
      creditsLines: [
        '= Access to 15 Core Open-Source Models',
        '~ 100 Seedance 2.0 Fast & Kling Turbo Videos',
      ],
      fixedCreditsNote: 'BYOK + Standard Cloud Compute',
      ctaText: 'Get OpenHiggs Lite',
      freeGensBox: {
        header: 'OPEN LITE ENGINE',
        items: [
          { name: 'Seedance 2.0 Fast', resBadge: '1080p', gensBadge: 'Included', included: true },
          { name: 'Kling 3.0 Turbo', resBadge: '720p', gensBadge: 'Included', included: true },
          { name: 'Ideogram 4', gensBadge: 'Included', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'MODEL ACCESS',
        items: [
          { name: 'Happy Horse 1.1', resBadge: '1080p', unlimitedBadge: 'Standard', included: true },
          { name: 'LTX 2.5 Fast', unlimitedBadge: 'Standard', included: true },
          { name: 'Recraft 4.1', unlimitedBadge: 'Included', included: true },
          { name: 'Flux 3 Schnell', unlimitedBadge: 'Fast queue', included: true },
        ],
        extraCount: 3,
        extraItems: [
          { name: 'Wan 3 Standard', unlimitedBadge: 'Standard queue', included: true },
          { name: 'PixVerse 6 Lite', unlimitedBadge: 'Standard', included: true },
          { name: 'Qwen Image 3', unlimitedBadge: 'Included', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Vox AI Motion Graphics (2 free tries included)', included: true, badge: '2 FREE', badgeColor: 'bg-cyan-100 text-cyan-900 font-bold' },
        { text: 'One unified composer prompt bar for Image & Video', included: true, badge: 'UNIFIED', badgeColor: 'bg-cyan-100 text-cyan-900 font-bold' },
        { text: 'Access to 15 Core open models in catalog', included: true },
        { text: 'Parallel generations: up to 2 concurrent runs', included: true },
        { text: '1080p Full HD video exports with zero watermarks', included: true },
        { text: 'Full commercial rights & instant setup', included: true },
        { text: 'Access to all 38 foundation models', included: false },
      ],
    },
    // 6. OPENHIGGS STUDIO PRO (FLAGSHIP ₹5,100 / mo with 20% Annual Discount)
    {
      id: 'plan_openhiggs',
      title: 'OPENHIGGS STUDIO PRO',
      subtitle: 'The complete flagship open-source AI studio engine with all 38 foundation models',
      category: 'openhiggs',
      discountBadge: '20% OFF',
      bestValueBadge: 'ALL 38 MODELS',
      isRecommended: true,
      usdPriceAnnual: 47,
      usdPriceMonthly: 59,
      usdStrikethrough: 59,
      inrPriceAnnual: 4080,
      inrPriceMonthly: 5100,
      inrStrikethrough: 5100,
      creditsMonthly: currency === 'usd' ? 3000 : 3500,
      creditsLabel: currency === 'usd' ? '3,000 credits/mo.' : '3,500 credits/mo.',
      creditsLines: [
        '= Full unrestricted access to all 38 OpenHiggs Models',
        '~ 235 Seedance 2.5 & Kling 3.0 Pro Videos',
      ],
      fixedCreditsNote: 'BYOK (Bring Your Own Key) + Cloud GPU acceleration',
      ctaText: 'Get OpenHiggs Studio',
      specialBanner: {
        title: 'ALL 38 FOUNDATION MODELS UNLOCKED',
        subtitle: 'Soul Cinema 4K, Seedance 2.5, Kling 3.0, Wan 3 Prime, Flux 3',
      },
      freeGensBox: {
        header: 'FLAGSHIP OPEN ENGINES',
        items: [
          { name: 'Soul Cinema 4K', resBadge: '4K Ultra', gensBadge: 'Included', included: true },
          { name: 'Seedance 2.5 Director', resBadge: '4K', gensBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0 Motion Pro', resBadge: '2K', gensBadge: '7-day unlimited', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & EXPANDED ACCESS',
        items: [
          { name: 'Minimax Hailuo 2.3 & H3', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'LTX 2.5 Pro & Fast', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Wan 3 Prime & Flux 3', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Ideogram 4 & Recraft 4.1', unlimitedBadge: 'Unlimited', included: true },
        ],
        extraCount: 5,
        extraItems: [
          { name: 'Happy Horse 1.0 & 1.1', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Grok Imagine Video 1.5', unlimitedBadge: 'Priority Queue', included: true },
          { name: 'PixVerse 6', unlimitedBadge: 'Included', included: true },
          { name: 'Qwen Image 3 & Z-Image Turbo', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Soul 2 & DOP Model', unlimitedBadge: 'Included', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Vox Motion Graphics Studio (Unlimited living posters)', included: true, badge: 'VOX AI', badgeColor: 'bg-emerald-600 text-white font-black' },
        { text: 'One unified composer prompt bar for Image & Video', included: true, badge: 'UNIFIED', badgeColor: 'bg-emerald-100 text-emerald-900 font-bold' },
        { text: 'Full access to all 38 OpenHiggs models in catalog', included: true },
        { text: 'BYOK (Your own platform key) + Cloud fallback', included: true },
        { text: 'Parallel generations: up to 4 concurrent runs', included: true },
        { text: 'Per-model settings (aspect ratio, duration, audio)', included: true },
        { text: '100 GB Cloud Storage & Priority VIP processing lane', included: true },
      ],
    },
    // 7. OPENHIGGS GPU MAX
    {
      id: 'plan_openhiggs_max',
      title: 'OPENHIGGS GPU MAX',
      subtitle: 'Dedicated A100 GPU cluster acceleration for high-volume studio production',
      category: 'openhiggs',
      discountBadge: '20% OFF',
      bestValueBadge: 'DEDICATED A100',
      usdPriceAnnual: 95,
      usdPriceMonthly: 119,
      usdStrikethrough: 119,
      inrPriceAnnual: 7999,
      inrPriceMonthly: 9999,
      inrStrikethrough: 9999,
      creditsMonthly: currency === 'usd' ? 7000 : 8000,
      creditsLabel: currency === 'usd' ? '7,000 credits/mo.' : '8,000 credits/mo.',
      creditsLines: [
        '= Dedicated A100 GPU Cluster Acceleration',
        '~ 530 Ultra HD 4K 60fps Cinema Videos',
      ],
      fixedCreditsNote: 'Instant zero-queue cluster GPU processing',
      ctaText: 'Get OpenHiggs Max',
      specialBanner: {
        title: 'DEDICATED A100 COMPUTE CLUSTER',
        subtitle: 'Zero-wait rendering & direct automated API access',
      },
      freeGensBox: {
        header: 'CLUSTER PIPELINE',
        items: [
          { name: 'Dedicated A100 Pool', resBadge: '8x A100', gensBadge: 'Zero Queue', included: true },
          { name: 'Soul Cinema 4K 60fps', resBadge: '4K 60fps', gensBadge: 'Unlimited', included: true },
          { name: 'Seedance 2.5 RAW ProRes', resBadge: 'ProRes', gensBadge: 'Unlimited', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'ENTERPRISE CAPABILITIES',
        items: [
          { name: 'Full 38 Model Unrestricted Access', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Automated REST & WebSocket API', unlimitedBadge: 'Direct Key', included: true },
          { name: 'Team Multi-User Concurrency', unlimitedBadge: '10 Seats', included: true },
          { name: 'Kling 3.0 Pro Studio Lane', resBadge: 'VIP Lane', unlimitedBadge: 'Instant', included: true },
        ],
        extraCount: 4,
        extraItems: [
          { name: 'Custom LoRA fine-tuning sandbox', unlimitedBadge: 'Included', included: true },
          { name: 'Dedicated Account Engineer', unlimitedBadge: '24/7 SLA', included: true },
          { name: 'Custom SSO & SAML Authentication', unlimitedBadge: 'Included', included: true },
          { name: 'Shared Team Assets & Presets', unlimitedBadge: 'Unlimited', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Vox Motion Graphics Studio (Dedicated GPU 4K living posters)', included: true, badge: 'DEDICATED', badgeColor: 'bg-purple-600 text-white font-black' },
        { text: 'Dedicated A100 GPU cluster acceleration lane', included: true, badge: 'A100 CLUSTER', badgeColor: 'bg-purple-100 text-purple-900 font-bold' },
        { text: 'Full access to all 38 OpenHiggs foundation models', included: true },
        { text: 'Zero queue rendering & highest concurrency (8 concurrent)', included: true },
        { text: 'ProRes 4K 60fps Cinema Master exports', included: true },
        { text: 'Direct REST API & programmatic webhooks', included: true },
        { text: '24/7 dedicated support & 99.9% uptime SLA', included: true },
      ],
    },
  ];

  const visiblePlans = plansData.filter((p) => {
    if (activeTab === 'openhiggs') return p.category === 'openhiggs';
    if (activeTab === 'business') return p.id === 'plan_business';
    return p.category === 'individual'; // 4 sample plans
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-hidden ${
      isDark ? 'bg-[#070A0F] text-white selection:bg-[#CCFF00] selection:text-black' : 'bg-[#FFFFFF] text-[#17191D] selection:bg-[#CCFF00] selection:text-black'
    }`}>
      {/* Ambient Moving Aurora Lights in Dark Studio Mode */}
      {isDark && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-[520px] h-[520px] bg-[#d4ff00]/8 rounded-full blur-[140px] animate-pulse-glass" />
          <div className="absolute top-1/4 -right-28 w-[600px] h-[600px] bg-[#ff1f66]/10 rounded-full blur-[160px] animate-pulse-glass" style={{ animationDelay: '2.5s' }} />
          <div className="absolute bottom-1/4 -left-28 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse-glass" style={{ animationDelay: '5s' }} />
        </div>
      )}

      <Header />

      <main className="flex-1 w-full max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* ========================================================================= */}
        {/* TOP CONTROLS & NAVIGATION BAR (MATCHING SCREENSHOT) */}
        {/* ========================================================================= */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b ${
          isDark ? 'border-slate-800' : 'border-[#E5E7EB]'
        }`}>
          {/* Left: Category Segmented Switcher + Promotional Pill */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className={`inline-flex p-1 rounded-xl border ${
              isDark ? 'bg-[#101522] border-slate-800' : 'bg-[#F7F8FA] border-[#E5E7EB]'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'individual'
                    ? isDark
                      ? 'bg-[#1C2538] text-white shadow-sm border border-slate-700'
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
                onClick={() => setActiveTab('openhiggs')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'openhiggs'
                    ? isDark
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-black shadow-sm'
                      : 'bg-white text-emerald-700 shadow-xs font-black'
                    : isDark
                    ? 'text-emerald-400 hover:text-emerald-200 font-bold'
                    : 'text-emerald-700 hover:text-emerald-950 font-bold'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>OpenHiggs Studio (3 Plans)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black border ${
                  isDark ? 'bg-emerald-900/60 text-emerald-200 border-emerald-600/50' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  20% OFF
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'business'
                    ? isDark
                      ? 'bg-[#1C2538] text-white shadow-sm border border-slate-700'
                      : 'bg-white text-[#17191D] shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Business plans
              </button>
            </div>

            {/* Promotional Pill Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${
              isDark
                ? 'bg-blue-950/70 border-blue-500/40 text-blue-300'
                : 'bg-[#EEF2FF] border-[#C7D2FE] text-[#5145CD]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>⚡ 30-DAY UNLIMITED SEEDANCE 2.5</span>
            </div>
          </div>

          {/* Right: Theme Switcher + Recommender + Currency Switch + Monthly/Annual Toggle */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap self-start md:self-auto">
            {/* Theme Toggle Button (Dark Studio vs Light SaaS) */}
            <button
              type="button"
              onClick={togglePricingTheme}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#121824] hover:bg-[#1A2234] border-slate-700 text-yellow-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
              title="Toggle between Dark Cyber Studio and Light SaaS Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-yellow-300" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
              <span>{isDark ? 'Dark Studio' : 'Light SaaS'}</span>
            </button>

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

            {/* Currency Switcher */}
            <div className={`inline-flex p-0.5 rounded-lg border text-[11px] font-bold ${
              isDark ? 'bg-[#101522] border-slate-800' : 'bg-[#F1F3F5] border-[#E5E7EB]'
            }`}>
              <button
                type="button"
                onClick={() => setCurrency('inr')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'inr'
                    ? isDark
                      ? 'bg-[#1C2538] text-white shadow-xs font-black'
                      : 'bg-white text-[#17191D] shadow-xs font-black'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                INR (₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('usd')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'usd'
                    ? isDark
                      ? 'bg-[#1C2538] text-white shadow-xs font-black'
                      : 'bg-white text-[#17191D] shadow-xs font-black'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Minimalist Switch Toggle for Monthly / Annual with Smart Intercept */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold cursor-pointer ${
                  billingInterval === 'month'
                    ? isDark ? 'text-white font-bold' : 'text-[#17191D]'
                    : isDark ? 'text-slate-400' : 'text-[#667085]'
                }`}
                onClick={() => {
                  if (billingInterval === 'year') {
                    setIsAnnualPassModalOpen(true);
                  }
                  setBillingInterval('month');
                }}
              >
                Monthly
              </span>

              {/* Physical Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={billingInterval === 'year'}
                onClick={() => {
                  if (billingInterval === 'year') {
                    setIsAnnualPassModalOpen(true);
                    setBillingInterval('month');
                  } else {
                    try {
                      confetti({
                        particleCount: 50,
                        spread: 70,
                        origin: { y: 0.25 },
                        colors: ['#d4ff00', '#ff1f66', '#2563eb', '#10b981'],
                      });
                    } catch {}
                    setBillingInterval('year');
                  }
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  billingInterval === 'year' ? 'bg-[#22c55e]' : isDark ? 'bg-slate-700' : 'bg-[#D1D5DB]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    billingInterval === 'year' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              <span
                className={`text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
                  billingInterval === 'year'
                    ? isDark ? 'text-[#d4ff00] font-black' : 'text-[#5145CD] font-black'
                    : isDark ? 'text-slate-400' : 'text-[#667085]'
                }`}
                onClick={() => {
                  try {
                    confetti({
                      particleCount: 50,
                      spread: 70,
                      origin: { y: 0.25 },
                      colors: ['#d4ff00', '#ff1f66', '#2563eb', '#10b981'],
                    });
                  } catch {}
                  setBillingInterval('year');
                }}
              >
                <span>Annual</span>
                {billingInterval === 'year' && (
                  <span className="text-[10px] font-black bg-[#EF4444] text-white px-2 py-0.5 rounded shadow-xs animate-bounce">
                    SAVE UP TO 30%
                  </span>
                )}
              </span>
            </div>
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
          className={`grid gap-4 sm:gap-5 lg:gap-6 items-stretch ${
            visiblePlans.length === 4
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : visiblePlans.length === 3
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
              : 'grid-cols-1 max-w-md mx-auto'
          }`}
        >
          {visiblePlans.map((plan, planIdx) => {
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

            const isStarter = plan.id === 'plan_starter';
            const isPro = plan.id === 'plan_creator';
            const isMax = plan.id === 'plan_max';
            const isTeams = plan.id === 'plan_business';

            const theme = planColorThemes[plan.id] || planColorThemes.plan_starter;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: planIdx * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.22 } }}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 text-left relative overflow-hidden backdrop-blur-xl ${theme.cardBorder} ${theme.cardBg}`}
              >
                {/* Colored Ambient Glow at Top matching screenshot glow tint */}
                <div className={`absolute top-0 left-0 right-0 h-32 pointer-events-none ${theme.headerGlow}`} />

                <div className="relative z-10">
                  {/* Card Header: Title + Discount / Value Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${theme.titleColor}`}>
                        {plan.title}
                      </h3>
                      {plan.discountBadge && isAnnual && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-xs ${theme.discountBadge}`}>
                          {plan.discountBadge}
                        </span>
                      )}
                    </div>

                    {plan.bestValueBadge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs ${theme.bestValueBadge}`}>
                        <span>◆</span>
                        <span>{plan.bestValueBadge}</span>
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className={`text-xs mt-1.5 min-h-[32px] leading-relaxed ${theme.subtitleColor || (isDark ? 'text-slate-400' : 'text-[#667085]')}`}>
                    {plan.subtitle}
                  </p>

                  {/* 1. Credit Allowance Box (Matching Screenshot Pattern) */}
                  <div className={`mt-3.5 p-3.5 rounded-2xl border space-y-2 ${theme.creditBoxBg}`}>
                    <div className={`flex items-center gap-1.5 font-black text-xs ${theme.creditHeaderColor}`}>
                      {isTeams ? (
                        <Users className={`w-3.5 h-3.5 shrink-0 ${theme.creditIconColor}`} />
                      ) : (
                        <Coins className={`w-3.5 h-3.5 shrink-0 ${theme.creditIconColor}`} />
                      )}
                      <span>{plan.creditsLabel}</span>
                    </div>

                    <ul className={`space-y-1 text-[11px] pl-1 ${theme.creditTextColor || (isDark ? 'text-slate-300' : 'text-[#667085]')}`}>
                      {plan.creditsLines.map((line, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="opacity-60">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Pro Slider if Pro and in USD */}
                    {isPro && currency === 'usd' ? (
                      <div className={`pt-2 border-t flex items-center justify-between gap-1 text-[10px] ${
                        isDark ? 'border-lime-500/30' : 'border-lime-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => setProTierIndex((prev) => (prev === 0 ? 1 : 0))}
                          className="p-0.5 rounded hover:bg-lime-500/20 text-[#d4ff00] cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 font-mono">
                          <button
                            type="button"
                            onClick={() => setProTierIndex(0)}
                            className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                              proTierIndex === 0
                                ? 'bg-[#d4ff00] text-black shadow-xs font-black scale-105'
                                : isDark ? 'text-lime-300 hover:text-white' : 'text-lime-800'
                            }`}
                          >
                            600
                          </button>
                          <span className="text-slate-500">•</span>
                          <button
                            type="button"
                            onClick={() => setProTierIndex(1)}
                            className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                              proTierIndex === 1
                                ? 'bg-[#d4ff00] text-black shadow-xs font-black scale-105'
                                : isDark ? 'text-lime-300 hover:text-white' : 'text-lime-800'
                            }`}
                          >
                            900
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProTierIndex((prev) => (prev === 1 ? 0 : 1))}
                          className="p-0.5 rounded hover:bg-lime-500/20 text-[#d4ff00] cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : isMax ? (
                      /* Interactive Max Tier Slider */
                      <div className={`pt-2 border-t flex items-center justify-between gap-1 text-[10px] ${
                        isDark ? 'border-pink-500/30' : 'border-pink-200'
                      }`}>
                        <button
                          type="button"
                          onClick={() => setMaxTierIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                          className="p-0.5 rounded hover:bg-pink-500/20 text-[#ff1f66] cursor-pointer"
                          title="Previous credit tier"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-1.5 font-mono">
                          {maxTiers.map((tier, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setMaxTierIndex(idx)}
                              className={`px-2 py-0.5 rounded-md font-bold cursor-pointer transition-all ${
                                maxTierIndex === idx
                                  ? 'bg-[#ff1f66] text-white shadow-xs font-black scale-105'
                                  : isDark ? 'text-pink-300 hover:text-white hover:bg-pink-950/40' : 'text-pink-800 hover:bg-pink-100'
                              }`}
                            >
                              {(currency === 'usd' ? tier.credits : tier.inrCredits).toLocaleString()}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setMaxTierIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                          className="p-0.5 rounded hover:bg-pink-500/20 text-[#ff1f66] cursor-pointer"
                          title="Next credit tier"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className={`pt-2 border-t flex items-center gap-1.5 text-[10px] font-semibold ${
                        isDark ? 'border-slate-800 text-slate-400' : 'border-[#E5E7EB] text-[#667085]'
                      }`}>
                        <Check className="w-3 h-3 shrink-0 text-[#10B981]" />
                        <span>{plan.fixedCreditsNote}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Price Section */}
                  <div className={`mt-4 pb-4 border-b ${isDark ? 'border-slate-800' : 'border-[#E5E7EB]'}`}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {isAnnual && strikethroughPrice && (
                        <span className={`text-base line-through font-mono font-bold ${
                          theme.strikethroughColor || 'text-[#FF1F66]'
                        }`}>
                          {currencySymbol}{strikethroughPrice.toLocaleString()}
                        </span>
                      )}
                      <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                        theme.priceColor || (isDark ? 'text-white' : 'text-[#17191D]')
                      }`}>
                        {isTeams ? 'From ' : ''}{currencySymbol}{price.toLocaleString()}
                      </span>
                      <span className={`text-xs font-medium ${
                        theme.periodColor || (isDark ? 'text-slate-400' : 'text-[#667085]')
                      }`}>
                        {isTeams ? 'per seat/month' : `per month, ${isAnnual ? 'billed annually' : 'billed monthly'}`}
                      </span>
                    </div>

                    {/* FIRST20 Coupon Tag Callout on Max */}
                    {plan.couponTag && (
                      <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border ${
                        isDark
                          ? 'bg-pink-950/70 border-pink-500/40 text-pink-300'
                          : 'bg-pink-50 border-pink-200 text-pink-700'
                      }`}>
                        <Tag className="w-3 h-3 text-pink-400 shrink-0" />
                        <span>{plan.couponTag}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Primary CTA Button (Screenshot Colors with Shimmer Animation) */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`relative overflow-hidden group w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 transform hover:scale-[1.01] active:scale-98 ${theme.ctaButton}`}
                    >
                      {/* Animated Shimmer sweep */}
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>

                    <p className={`text-[11px] text-center ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
                      {isTeams
                        ? 'Save up to 30% with annual billing'
                        : isAnnual
                        ? `Save ${currencySymbol}${annualSavings.toLocaleString()} compared to monthly`
                        : 'No difference compared to monthly'}
                    </p>
                  </div>

                  {/* Special Banner for Teams & OpenHiggs */}
                  {plan.specialBanner && (
                    <div className={`mt-4 p-3 rounded-xl border text-center ${
                      isDark
                        ? 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                        : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-blue-200'
                    }`}>
                      <p className={`text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 ${
                        isDark ? 'text-blue-300' : 'text-blue-800'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>{plan.specialBanner.title}</span>
                      </p>
                      <p className={`text-[10px] mt-0.5 font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {plan.specialBanner.subtitle}
                      </p>
                    </div>
                  )}

                  {/* 4. Feature Box 1: FREE GENERATIONS / UNLIMITED MODELS */}
                  <div className={`mt-4 p-3.5 rounded-2xl border space-y-2.5 ${theme.freeGensBoxBg}`}>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400">🎁</span>
                        <span className={theme.freeGensHeaderColor}>{plan.freeGensBox.header}</span>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className={`hover:underline normal-case font-semibold text-[10px] cursor-pointer ${
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
                              <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            ) : (
                              <X className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            )}
                            <span
                              className={`truncate ${
                                item.included
                                  ? isDark ? 'text-slate-200 font-medium' : 'text-[#17191D] font-medium'
                                  : isDark ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                                isDark ? 'bg-black/50 border-white/10 text-slate-400' : 'bg-white border-[#E5E7EB] text-[#667085]'
                              }`}>
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                item.included
                                  ? theme.freeGensBadge
                                  : isDark
                                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                                  : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                              }`}
                            >
                              {item.gensBadge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Feature Box 2: UNLIMITED & FREE GENS */}
                  <div className={`mt-3.5 p-3.5 rounded-2xl border space-y-2.5 ${theme.unlimitedBoxBg}`}>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-400 font-bold">∞</span>
                        <span className={theme.unlimitedHeaderColor}>{plan.unlimitedGensBox.header}</span>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className={`hover:underline normal-case font-semibold text-[10px] cursor-pointer ${
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
                              <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            ) : (
                              <X className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            )}
                            <span
                              className={`truncate ${
                                item.included
                                  ? isDark ? 'text-slate-200 font-medium' : 'text-[#17191D] font-medium'
                                  : isDark ? 'text-slate-500' : 'text-slate-400'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                                isDark ? 'bg-black/50 border-white/10 text-slate-400' : 'bg-white border-[#E5E7EB] text-[#667085]'
                              }`}>
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                item.included
                                  ? theme.unlimitedBadge
                                  : isDark
                                  ? 'bg-slate-800 text-slate-500 border border-slate-700'
                                  : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                              }`}
                            >
                              {item.unlimitedBadge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Extra Models */}
                    {plan.unlimitedGensBox.extraCount > 0 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(plan.id)}
                          className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-between transition-colors cursor-pointer ${
                            isDark
                              ? 'text-lime-300 hover:bg-white/10'
                              : 'text-[#5145CD] hover:bg-slate-100/70'
                          }`}
                        >
                          <span>
                            {isAccordionExpanded
                              ? 'Hide extra models'
                              : `+ ${plan.unlimitedGensBox.extraCount} unlimited & free generation models`}
                          </span>
                          {isAccordionExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isAccordionExpanded && (
                          <div className="mt-2 space-y-1.5 pl-1 animate-in fade-in duration-200">
                            {plan.unlimitedGensBox.extraItems.map((extra, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] gap-2 py-0.5"
                              >
                                <span className={`truncate ${isDark ? 'text-slate-300' : 'text-[#667085]'}`}>
                                  {extra.name}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border font-bold ${
                                  isDark
                                    ? 'bg-white/10 border-white/15 text-[#d4ff00]'
                                    : 'bg-white border-[#E5E7EB] text-[#5145CD]'
                                }`}>
                                  {extra.unlimitedBadge}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Bottom Checklist */}
                <div className={`mt-5 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-[#E5E7EB]'}`}>
                  <ul className="space-y-2 text-[11px]">
                    {plan.bottomChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {item.included ? (
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${theme.checkIconColor || 'text-[#10B981]'}`} />
                        ) : (
                          <X className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        )}
                        <span
                          className={`leading-relaxed ${
                            item.included
                              ? theme.checklistText || (isDark ? 'text-slate-200 font-medium' : 'text-[#17191D]')
                              : isDark ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.badge && (
                          <span
                            className={`ml-auto text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0 shadow-xs ${
                              item.badgeColor || (isDark ? 'bg-[#d4ff00] text-black' : 'bg-[#FEF08A] text-[#854D0E]')
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SCREENSHOT MATCHING DISCLAIMER FOOTER BAR */}
        {/* ========================================================================= */}
        <div className={`mt-8 pt-5 pb-2 text-center text-[11px] max-w-4xl mx-auto leading-relaxed border-t ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-[#E5E7EB] text-[#667085]'
        }`}>
          <p>
            Unlimited models and Free Generations on plans are accessible only via higgsfield.ai and are not accessible on MCP/CLI, Canvas or Supercomputer.
            Prices exclude VAT and local taxes, calculated at checkout. Unlimited usage may be subject to dynamic speed adjustments during high-traffic periods.{' '}
            <button
              type="button"
              onClick={scrollToMatrix}
              className={`hover:underline font-semibold cursor-pointer ${
                isDark ? 'text-lime-400' : 'text-[#5145CD]'
              }`}
            >
              Learn more
            </button>
            . Access to new models and advanced features may be done on a rolling basis and not available to all users at launch.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ONE-TIME CREDIT TOP-UP SECTION */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-24">
          <CreditTopUpSection onBuyPack={handleBuyCreditPack} isDark={isDark} />
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE FEATURE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <div id="feature-matrix-section" className="mt-16 sm:mt-24">
          <FeatureComparisonMatrix
            billingInterval={billingInterval}
            onSelectPlan={handleSelectPlan}
            isDark={isDark}
          />
        </div>

        {/* ========================================================================= */}
        {/* ENTERPRISE & SECURITY ASSURANCE */}
        {/* ========================================================================= */}
        <div className={`mt-16 sm:mt-20 p-8 rounded-2xl border max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${
          isDark
            ? 'bg-[#0E131E] border-slate-800 text-white shadow-xl'
            : 'bg-[#F7F8FA] border-[#E5E7EB] text-[#17191D]'
        }`}>
          <div className="space-y-2 text-center md:text-left">
            <span className={`text-[11px] font-extrabold uppercase tracking-widest ${
              isDark ? 'text-indigo-400' : 'text-[#5145CD]'
            }`}>
              Security & Compliance
            </span>
            <h4 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
              Enterprise-Grade Privacy & Transparent Pricing
            </h4>
            <p className={`text-xs max-w-xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
              All subscription tiers include 18% GST tax invoices, immediate Razorpay/PayU digital receipts, and end-to-end data encryption. Your prompts and media assets are never used to train public foundation models without explicit consent.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/checkout?plan=plan_business"
              className="px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-xs"
            >
              Contact Enterprise
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-24 max-w-4xl mx-auto text-left">
          <div className="text-center mb-10">
            <span className={`text-xs font-extrabold uppercase tracking-widest ${
              isDark ? 'text-indigo-400' : 'text-[#5145CD]'
            }`}>
              Got Questions?
            </span>
            <h3 className={`text-2xl sm:text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is the OpenHiggs Studio plan and how does it work?',
                a: 'OpenHiggs is our flagship studio engine featuring 38 top open-source video and image foundation models (Soul Cinema 4K, Seedance 2.5 Director, Kling 3.0 Pro, Wan 3, Flux 3 Schnell, and more). It supports BYOK (Bring Your Own Key) plus dedicated GPU cloud acceleration for ₹5,100/mo (or ₹4,080/mo on annual billing with 20% savings).',
              },
              {
                q: 'How does the FIRST20 coupon voucher work?',
                a: 'The FIRST20 welcome reward provides an instant ₹570 discount on the FLUVIA MAX (Ultra) Plan. You can unwrap it from the animated gift box above and claim it instantly at checkout. It is verified server-side and applies directly to both monthly and annual billing.',
              },
              {
                q: 'Do unused generation credits expire at the end of the month?',
                a: 'On active subscription plans (Plus, Ultra, Teams, and OpenHiggs), unused monthly credits roll over to the following month as long as your subscription remains active. One-time credit top-up packs never expire.',
              },
              {
                q: 'Can I switch between monthly and annual plans or upgrade at any time?',
                a: 'Yes. You can switch your billing frequency or upgrade to a higher tier at any time directly in your billing settings. Your unused balance will be prorated automatically towards your new plan.',
              },
              {
                q: 'Are digital tax receipts and GST invoices provided for business expenses?',
                a: 'Yes. A formal, print-ready GST tax invoice with legal company details, GSTIN breakup, and transaction reference is automatically generated and downloadable in PDF format from your dashboard.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isDark
                    ? 'border-slate-800 bg-[#0E131E] shadow-lg'
                    : 'border-[#E5E7EB] bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-[#F7F8FA]'
                  }`}
                >
                  <span className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
                    {faq.q}
                  </span>
                  {openFaqs[idx] ? (
                    <ChevronUp className={`w-4 h-4 shrink-0 ${isDark ? 'text-indigo-400' : 'text-[#5145CD]'}`} />
                  ) : (
                    <ChevronDown className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-500' : 'text-[#667085]'}`} />
                  )}
                </button>
                {openFaqs[idx] && (
                  <div className={`px-5 pb-5 text-xs leading-relaxed border-t pt-3 ${
                    isDark
                      ? 'border-slate-800/80 text-slate-400'
                      : 'border-[#E5E7EB] text-[#667085]'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Plan Recommender Interactive Modal */}
      <PlanRecommenderModal
        isOpen={isRecommenderOpen}
        onClose={() => setIsRecommenderOpen(false)}
        billingInterval={billingInterval}
      />

      {/* Annual Privilege Pass Interactive Engagement Modal */}
      <AnnualPrivilegePassModal
        isOpen={isAnnualPassModalOpen}
        onClose={() => setIsAnnualPassModalOpen(false)}
        onSwitchToAnnual={() => {
          setBillingInterval('year');
          setIsAnnualPassModalOpen(false);
        }}
        currency={currency}
      />

      {/* Floating High-Converting Annual Pass Engagement Pill */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsAnnualPassModalOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white shadow-xl shadow-rose-500/30 border-2 border-white/90 cursor-pointer transform hover:scale-105 active:scale-95 transition-all text-xs font-black"
          title="Click to unlock exclusive Annual Creator Pass perks & save 20%"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
          <span className="flex items-center gap-1.5">
            <span>👑 Annual Pass • Save 20% + 2 Mo Free</span>
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold group-hover:bg-white/30 transition-colors">
            CLAIM
          </span>
        </button>
      </div>

      <Footer />
    </div>
  );
}
