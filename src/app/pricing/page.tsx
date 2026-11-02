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
  }[];
}

export default function PricingPage() {
  const router = useRouter();

  // Toolbar state
  const [activeTab, setActiveTab] = useState<'individual' | 'openhiggs' | 'business'>('individual');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year'); // Annual by default with savings
  const [currency, setCurrency] = useState<'inr' | 'usd'>('inr'); // INR default, toggleable to USD
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

  // Ultra Tier definitions matching < 3,000 • 6,000 • 9,000 >
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

  // All Plans Definition
  const plansData: PlanCardData[] = [
    {
      id: 'plan_starter',
      title: 'STARTER',
      subtitle: 'For first-time AI creators and testing video ad concepts',
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
      fixedCreditsNote: currency === 'usd' ? 'Fixed 200 credits/mo' : 'Fixed 500 credits/mo',
      ctaText: 'Get Starter',
      freeGensBox: {
        header: 'MODELS & CAPABILITIES',
        items: [
          { name: 'Seedance 2.0 Fast', resBadge: '1080p', gensBadge: 'Included', included: true },
          { name: 'Genjutsu Lite', resBadge: '720p', gensBadge: 'Included', included: true },
          { name: 'Higgsfield Ads Studio', gensBadge: '10 free gens', included: true },
          { name: 'ElevenLabs Voice Sync', gensBadge: 'Standard', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'PERKS & SPECS',
        items: [
          { name: 'Nano Banana 2', unlimitedBadge: 'Standard speed', included: true },
          { name: 'Fluvia Cinematic HD', resBadge: '1080p', unlimitedBadge: 'Included', included: true },
          { name: 'Runway Gen-3 Alpha', unlimitedBadge: 'Priority Queue', included: false },
        ],
        extraCount: 3,
        extraItems: [
          { name: 'Seedream 5.0 Pro', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Luma Ray Motion', unlimitedBadge: 'No unlimited', included: false },
          { name: 'Director Storyboard Mode', unlimitedBadge: 'Pro only', included: false },
        ],
      },
      bottomChecklist: [
        { text: 'Parallel generations: up to 2 Videos, 4 Images', included: true },
        { text: 'Access to Seedance 2.0 Fast & 2.0 Mini', included: true },
        { text: '1080p Full HD video exports with no watermark', included: true },
        { text: 'Full commercial advertising rights', included: true },
        { text: 'Early access to advanced AI features', included: false },
        { text: 'Lowest cost per credit', included: false },
      ],
    },
    {
      id: 'plan_creator',
      title: 'PLUS',
      subtitle: 'For everyday AI creation and scaling social video campaigns',
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
      fixedCreditsNote: currency === 'usd' ? 'Fixed 1,000 credits/mo' : 'Fixed 1,600 credits/mo',
      ctaText: 'Get Plus',
      freeGensBox: {
        header: 'MODELS & CAPABILITIES',
        items: [
          { name: 'Seedance 2.5 Cinema', resBadge: '4K Ultra', gensBadge: 'Included', included: true },
          { name: 'Kling 3.0 Turbo', resBadge: '2K', gensBadge: 'Included', included: true },
          { name: 'Higgsfield AI Influencer', gensBadge: '30 free gens', included: true },
          { name: 'Higgsfield Ads Studio', gensBadge: 'Unlimited', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'PERKS & SPECS',
        items: [
          { name: 'Nano Banana 2', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Seedream 5.0 Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
        ],
        extraCount: 4,
        extraItems: [
          { name: 'Luma Ray Motion', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Runway Gen-3 Alpha', resBadge: '1080p', unlimitedBadge: 'Priority Queue', included: true },
          { name: 'ElevenLabs Voice Sync', unlimitedBadge: 'Multilingual', included: true },
          { name: 'Ad Studio Templates', unlimitedBadge: 'Full Library', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Unlimited paid parallel generations', included: true, badge: 'NEW' },
        { text: 'Access to all Seedance models & features', included: true },
        { text: '4K Ultra HD video exports with priority rendering', included: true },
        { text: 'Multi-scene timeline storyboard editor', included: true },
        { text: '10% discount on credit top-ups', included: true },
        { text: 'Full commercial advertising rights', included: true },
      ],
    },
    {
      id: 'plan_max',
      title: 'ULTRA',
      subtitle: 'For performance marketing agencies and high-output teams',
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
        header: 'VIP MODELS & CAPABILITIES',
        items: [
          { name: 'Fluvia Cinema Master', resBadge: '4K 60fps', gensBadge: 'VIP Lane', included: true },
          { name: 'Seedance 2.5 Director', resBadge: '4K', gensBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0 Pro Studio', resBadge: '4K', gensBadge: '7-day unlimited', included: true },
          { name: 'Gemini Omni Storyboard', resBadge: '4K', gensBadge: 'VIP Dedicated', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'VIP CLUSTER PERKS',
        items: [
          { name: 'Nano Banana Pro', resBadge: '2K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Runway Gen-3 Alpha GPU', resBadge: '4K', unlimitedBadge: 'VIP Lane', included: true },
          { name: 'ElevenLabs Voice Design', unlimitedBadge: 'Multilingual VIP', included: true },
        ],
        extraCount: 4,
        extraItems: [
          { name: 'Seedream 5.0 Pro', resBadge: '4K', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'Cinema Master 60fps', resBadge: '4K 60fps', unlimitedBadge: 'VIP Queue', included: true },
          { name: 'Custom Brand Kit Engine', unlimitedBadge: '15 Kits', included: true },
          { name: 'Expedited 2-hour SLA Support', unlimitedBadge: 'Priority', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'Unlimited paid parallel generations', included: true, badge: 'NEW' },
        { text: 'Dedicated VIP priority GPU rendering lane', included: true },
        { text: '4K 60fps Cinema Master exports & Gemini Storyboard', included: true },
        { text: '15% discount on credit top-ups', included: true, badge: '15% OFF' },
        { text: 'Lowest cost per credit across all models', included: true, badge: '60% CHEAPER' },
        { text: 'Full commercial advertising rights & dedicated SLA', included: true },
      ],
    },
    {
      id: 'plan_openhiggs_lite',
      title: 'OPENHIGGS LITE',
      subtitle: 'Starter open-source engine for creator video & image generation',
      category: 'openhiggs',
      discountBadge: '35% OFF',
      bestValueBadge: '15 MODELS',
      usdPriceAnnual: 19,
      usdPriceMonthly: 29,
      usdStrikethrough: 29,
      inrPriceAnnual: 1624,
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
          { name: 'Flux 3 Schnell', gensBadge: 'Included', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'MODEL ACCESS',
        items: [
          { name: 'Happy Horse 1.1', resBadge: '1080p', unlimitedBadge: 'Standard', included: true },
          { name: 'LTX 2.5 Fast', unlimitedBadge: 'Standard', included: true },
          { name: 'Recraft 4.1', unlimitedBadge: 'Included', included: true },
        ],
        extraCount: 4,
        extraItems: [
          { name: 'Wan 3 Standard', unlimitedBadge: 'Standard queue', included: true },
          { name: 'PixVerse 6 Lite', unlimitedBadge: 'Standard', included: true },
          { name: 'Qwen Image 3', unlimitedBadge: 'Included', included: true },
          { name: 'Z-Image Turbo', unlimitedBadge: 'Included', included: true },
        ],
      },
      bottomChecklist: [
        { text: 'One unified composer prompt bar for Image & Video', included: true, badge: 'UNIFIED' },
        { text: 'Access to 15 Core open models in catalog', included: true },
        { text: 'Parallel generations: up to 2 concurrent runs', included: true },
        { text: '1080p Full HD video exports with zero watermarks', included: true },
        { text: 'Full commercial rights & instant setup', included: true },
        { text: 'Access to all 38 foundation models', included: false },
      ],
    },
    {
      id: 'plan_openhiggs',
      title: 'OPENHIGGS STUDIO PRO',
      subtitle: 'The complete flagship open-source AI studio engine with all 38 models',
      category: 'openhiggs',
      discountBadge: '35% OFF',
      bestValueBadge: 'ALL 38 MODELS',
      isRecommended: true,
      usdPriceAnnual: 39,
      usdPriceMonthly: 61,
      usdStrikethrough: 61,
      inrPriceAnnual: 3315,
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
        subtitle: 'Soul Cinema 4K, Seedance 2.5, Kling 3.0, Wan 3 Prime, Flux 3 Schnell',
      },
      freeGensBox: {
        header: 'FLAGSHIP OPEN ENGINES',
        items: [
          { name: 'Soul Cinema 4K', resBadge: '4K Ultra', gensBadge: 'Included', included: true },
          { name: 'Seedance 2.5 Director', resBadge: '4K', gensBadge: '7-day unlimited', included: true },
          { name: 'Kling 3.0 Motion Pro', resBadge: '2K', gensBadge: '7-day unlimited', included: true },
          { name: 'Wan 3 Prime & Flux 3', gensBadge: 'Unlimited', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'UNLIMITED & EXPANDED ACCESS',
        items: [
          { name: 'Minimax Hailuo 2.3 & H3', unlimitedBadge: '7-day unlimited', included: true },
          { name: 'LTX 2.5 Pro & Fast', unlimitedBadge: '7-day unlimited', included: true },
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
        { text: 'One unified composer prompt bar for Image & Video', included: true, badge: 'UNIFIED' },
        { text: 'Full access to all 38 OpenHiggs models in catalog', included: true },
        { text: 'BYOK (Your own platform key) + Cloud fallback', included: true },
        { text: 'Parallel generations: up to 4 concurrent runs', included: true },
        { text: 'Per-model settings (aspect ratio, duration, audio)', included: true },
        { text: '100 GB Cloud Storage & Priority VIP processing lane', included: true },
      ],
    },
    {
      id: 'plan_openhiggs_max',
      title: 'OPENHIGGS GPU MAX',
      subtitle: 'Dedicated A100 GPU cluster acceleration for high-volume studio production',
      category: 'openhiggs',
      discountBadge: '35% OFF',
      bestValueBadge: 'DEDICATED A100',
      usdPriceAnnual: 77,
      usdPriceMonthly: 119,
      usdStrikethrough: 119,
      inrPriceAnnual: 6499,
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
          { name: 'Kling 3.0 Pro Studio Lane', resBadge: 'VIP Lane', gensBadge: 'Instant', included: true },
        ],
      },
      unlimitedGensBox: {
        header: 'ENTERPRISE CAPABILITIES',
        items: [
          { name: 'Full 38 Model Unrestricted Access', unlimitedBadge: 'Unlimited', included: true },
          { name: 'Automated REST & WebSocket API', unlimitedBadge: 'Direct Key', included: true },
          { name: 'Team Multi-User Concurrency', unlimitedBadge: '10 Seats', included: true },
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
        { text: 'Dedicated A100 GPU cluster acceleration lane', included: true, badge: 'A100 CLUSTER' },
        { text: 'Full access to all 38 OpenHiggs foundation models', included: true },
        { text: 'Zero queue rendering & highest concurrency (8 concurrent)', included: true },
        { text: 'ProRes 4K 60fps Cinema Master exports', included: true },
        { text: 'Direct REST API & programmatic webhooks', included: true },
        { text: '24/7 dedicated support & 99.9% uptime SLA', included: true },
      ],
    },
    {
      id: 'plan_business',
      title: 'FOR TEAMS',
      subtitle: 'For agencies and marketing teams to create campaigns faster together',
      category: 'business',
      discountBadge: 'UP TO 30% OFF',
      bestValueBadge: 'ENTERPRISE',
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
        { text: 'Access to all features & models', included: true },
        { text: 'Dedicated capacity (SLA)', included: true },
        { text: 'Shared workspace & credit pool', included: true },
        { text: 'Detailed analytics & priority support', included: true },
        { text: 'Admin spend control & delegated access', included: true },
        { text: 'Priority queue for faster task processing', included: true },
      ],
    },
  ];

  const visiblePlans = plansData.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#17191D] selection:bg-[#EEF2FF] selection:text-[#5145CD]">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* TOP CONTROLS & NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E5E7EB]">
          {/* Left: Category Segmented Switcher + Promotional Pill */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex p-1 rounded-xl border bg-[#F7F8FA] border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'individual'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Individual Plans
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('openhiggs')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'openhiggs'
                    ? 'bg-white text-[#5145CD] shadow-xs font-extrabold'
                    : 'text-[#667085] hover:text-[#5145CD]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>OpenHiggs Studio</span>
                <span className="text-[10px] bg-[#EEF2FF] text-[#5145CD] px-1.5 py-0.2 rounded font-extrabold border border-[#C7D2FE]">
                  38 Models • 35% OFF
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-white text-[#17191D] shadow-xs'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                Business & Teams
              </button>
            </div>

            {/* Promotional Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-[#EEF2FF] border-[#C7D2FE] text-[#5145CD]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD] animate-pulse" />
              <span>⚡ 30-DAY UNLIMITED SEEDANCE 2.5</span>
            </div>
          </div>

          {/* Right: Recommender + Currency Switch + Monthly/Annual Toggle */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap self-start md:self-auto">
            {/* Recommender link */}
            <button
              type="button"
              onClick={() => setIsRecommenderOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer text-[#5145CD] hover:text-[#4338CA]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Not sure which plan?</span>
            </button>

            {/* Currency Switcher */}
            <div className="inline-flex p-0.5 rounded-lg border text-[11px] font-bold bg-[#F1F3F5] border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setCurrency('inr')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  currency === 'inr'
                    ? 'bg-white text-[#17191D] shadow-xs font-black'
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
                    ? 'bg-white text-[#17191D] shadow-xs font-black'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Minimalist Switch Toggle for Monthly / Annual */}
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
                  billingInterval === 'year' ? 'bg-[#5145CD]' : 'bg-[#D1D5DB]'
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
                  billingInterval === 'year' ? 'text-[#5145CD]' : 'text-[#667085]'
                }`}
                onClick={() => setBillingInterval('year')}
              >
                <span>Annual</span>
                {billingInterval === 'year' && (
                  <span className="text-[10px] font-extrabold bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] px-2 py-0.5 rounded-full shadow-xs">
                    35% OFF
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
          onApplyCoupon={(code) => handleSelectPlan('plan_max')}
        />

        {/* ========================================================================= */}
        {/* PRICING CARDS GRID (LUXURY FINTECH LIQUID GLASS DESIGN) */}
        {/* ========================================================================= */}
        <div
          className={`grid gap-6 lg:gap-8 items-stretch ${
            visiblePlans.length === 3
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
              : visiblePlans.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto'
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

            const isUltra = plan.id === 'plan_max';
            const isTeams = plan.id === 'plan_business';
            const isOpenHiggs = plan.id === 'plan_openhiggs';
            const isHighlighted = plan.isRecommended;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 text-left bg-white border ${
                  isHighlighted
                    ? 'border-2 border-[#5145CD] shadow-xl shadow-indigo-500/10 ring-2 ring-[#5145CD]/10 relative lg:-translate-y-2'
                    : 'border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-xl hover:shadow-[#5145CD]/5 hover:-translate-y-1'
                }`}
              >
                {/* Floating "Most Popular" / "Best Value" Ribbon for Highlighted Cards */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#5145CD] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-indigo-500/25 flex items-center gap-1.5 z-10">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{plan.bestValueBadge || 'MOST POPULAR'}</span>
                  </div>
                )}

                <div>
                  {/* Card Header: Title + Discount Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold tracking-tight text-[#17191D]">
                        {plan.title}
                      </h3>
                      {plan.discountBadge && isAnnual && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                          {plan.discountBadge}
                        </span>
                      )}
                    </div>

                    {!isHighlighted && plan.bestValueBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F1F3F5] text-[#4B5563] border border-[#E5E7EB]">
                        {plan.bestValueBadge}
                      </span>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs mt-1.5 min-h-[36px] leading-relaxed text-[#667085]">
                    {plan.subtitle}
                  </p>

                  {/* Credit & Resource Allowance Box */}
                  <div className="mt-4 p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F8F9FA] space-y-2">
                    <div className="flex items-center gap-2 font-extrabold text-xs text-[#17191D]">
                      {isTeams ? (
                        <Users className="w-4 h-4 text-[#5145CD] shrink-0" />
                      ) : isOpenHiggs ? (
                        <Cpu className="w-4 h-4 text-[#5145CD] shrink-0" />
                      ) : (
                        <Coins className="w-4 h-4 text-[#5145CD] shrink-0" />
                      )}
                      <span>{plan.creditsLabel}</span>
                    </div>

                    <ul className="space-y-1 text-[11px] pl-1 text-[#667085]">
                      {plan.creditsLines.map((line, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#5145CD] font-bold">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Interactive Ultra Tier Selector if Ultra */}
                    {isUltra ? (
                      <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setUltraTierIndex((prev) => (prev > 0 ? prev - 1 : 2))}
                          className="p-1 rounded hover:bg-slate-200 text-[#5145CD] cursor-pointer"
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
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-all ${
                                ultraTierIndex === idx
                                  ? 'bg-[#5145CD] text-white shadow-xs'
                                  : 'text-[#667085] hover:text-[#17191D] hover:bg-slate-200'
                              }`}
                            >
                              {tier.credits.toLocaleString()}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setUltraTierIndex((prev) => (prev < 2 ? prev + 1 : 0))}
                          className="p-1 rounded hover:bg-slate-200 text-[#5145CD] cursor-pointer"
                          title="Next credit tier"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#E5E7EB] flex items-center gap-1.5 text-[10px] font-medium text-[#667085]">
                        <Check className="w-3.5 h-3.5 shrink-0 text-[#10B981]" />
                        <span>{plan.fixedCreditsNote}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Display */}
                  <div className="mt-4 pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {isAnnual && strikethroughPrice && (
                        <span className="text-sm line-through font-mono text-[#9CA3AF] font-bold">
                          {currencySymbol}{strikethroughPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#17191D]">
                        {isTeams ? 'From ' : ''}{currencySymbol}{price.toLocaleString()}
                      </span>
                      <span className="text-xs font-medium text-[#667085]">
                        {isTeams ? 'per seat/mo' : `per month, ${isAnnual ? 'billed annually' : 'billed monthly'}`}
                      </span>
                    </div>

                    {/* FIRST20 Coupon Tag Callout on Ultra */}
                    {plan.couponTag && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-[11px] text-[#5145CD] font-bold font-mono">
                        <Tag className="w-3.5 h-3.5 text-[#5145CD] shrink-0" />
                        <span>{plan.couponTag}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Call to Action Button */}
                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-98 ${
                        isHighlighted
                          ? 'bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-md shadow-indigo-500/25'
                          : 'bg-[#17191D] hover:bg-black text-white shadow-xs'
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <p className="text-[11px] text-center text-[#667085]">
                      {isTeams
                        ? 'Save up to 30% with annual billing'
                        : isAnnual
                        ? `Save ${currencySymbol}${annualSavings.toLocaleString()} compared to monthly`
                        : 'No difference compared to monthly'}
                    </p>
                  </div>

                  {/* Special Banner for Teams & OpenHiggs */}
                  {plan.specialBanner && (
                    <div className="mt-4 p-3 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-center">
                      <p className="text-[11px] font-extrabold text-[#5145CD] uppercase tracking-wider flex items-center justify-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                        <span>{plan.specialBanner.title}</span>
                      </p>
                      <p className="text-[10px] text-[#5145CD]/80 mt-0.5 font-medium">
                        {plan.specialBanner.subtitle}
                      </p>
                    </div>
                  )}

                  {/* Models & Capabilities List */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#667085]">
                      <span>{plan.freeGensBox.header}</span>
                      <button
                        type="button"
                        onClick={scrollToMatrix}
                        className="text-[#5145CD] hover:underline normal-case font-medium text-[10px]"
                      >
                        Compare all
                      </button>
                    </div>

                    <div className="space-y-2">
                      {plan.freeGensBox.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs gap-2">
                          <div className="flex items-center gap-2 truncate">
                            {item.included ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            )}
                            <span
                              className={`truncate text-xs ${
                                item.included ? 'text-[#17191D] font-medium' : 'text-slate-400'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border bg-white border-[#E5E7EB] text-[#667085]">
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                item.included
                                  ? 'bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]'
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

                  {/* Unlimited Perks / Extended Features Section */}
                  <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#667085]">
                      <span>{plan.unlimitedGensBox.header}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {plan.unlimitedGensBox.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            {item.included ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            )}
                            <span
                              className={`truncate text-xs ${
                                item.included ? 'text-[#17191D] font-medium' : 'text-slate-400'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.resBadge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono border bg-white border-[#E5E7EB] text-[#667085]">
                                {item.resBadge}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                item.included
                                  ? 'bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]'
                                  : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
                              }`}
                            >
                              {item.unlimitedBadge}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Extra Items */}
                    {plan.unlimitedGensBox.extraCount > 0 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(plan.id)}
                          className="w-full py-1.5 px-2 rounded-lg text-[10px] font-bold text-[#5145CD] hover:bg-[#EEF2FF] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>
                            {isAccordionExpanded
                              ? 'Hide extra models'
                              : `+ ${plan.unlimitedGensBox.extraCount} more models & perks`}
                          </span>
                          {isAccordionExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        {isAccordionExpanded && (
                          <div className="mt-2 space-y-1.5 pl-1 animate-in fade-in duration-200">
                            {plan.unlimitedGensBox.extraItems.map((extra, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] gap-2 py-0.5"
                              >
                                <span className="text-[#667085] truncate">
                                  {extra.name}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#F7F8FA] border border-[#E5E7EB] text-[#5145CD] font-bold">
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

                {/* Bottom Checklist */}
                <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
                  <ul className="space-y-2.5 text-xs text-[#667085]">
                    {plan.bottomChecklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {item.included ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`leading-relaxed ${
                            item.included ? 'text-[#17191D]' : 'text-slate-400'
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.badge && (
                          <span className="ml-auto text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ONE-TIME CREDIT TOP-UP SECTION */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-24">
          <CreditTopUpSection onBuyPack={handleBuyCreditPack} />
        </div>

        {/* ========================================================================= */}
        {/* COMPREHENSIVE FEATURE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <div id="feature-matrix-section" className="mt-16 sm:mt-24">
          <FeatureComparisonMatrix
            billingInterval={billingInterval}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        {/* ========================================================================= */}
        {/* ENTERPRISE & SECURITY ASSURANCE */}
        {/* ========================================================================= */}
        <div className="mt-16 sm:mt-20 p-8 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5145CD]">
              Security & Compliance
            </span>
            <h4 className="text-xl font-extrabold text-[#17191D]">
              Enterprise-Grade Privacy & Transparent Pricing
            </h4>
            <p className="text-xs text-[#667085] max-w-xl leading-relaxed">
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
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#5145CD]">
              Got Questions?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17191D] mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is the OpenHiggs Studio plan and how does it work?',
                a: 'OpenHiggs is our flagship studio engine featuring 38 top open-source video and image foundation models (Soul Cinema 4K, Seedance 2.5 Director, Kling 3.0 Pro, Wan 3, Flux 3 Schnell, and more). It supports BYOK (Bring Your Own Key) plus dedicated GPU cloud acceleration for ₹5,100/mo (or ₹3,315/mo on annual billing with 35% savings).',
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
                className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F8FA] transition-colors"
                >
                  <span className="text-sm font-extrabold text-[#17191D]">{faq.q}</span>
                  {openFaqs[idx] ? (
                    <ChevronUp className="w-4 h-4 text-[#5145CD] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#667085] shrink-0" />
                  )}
                </button>
                {openFaqs[idx] && (
                  <div className="px-5 pb-5 text-xs text-[#667085] leading-relaxed border-t border-[#E5E7EB] pt-3">
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

      <Footer />
    </div>
  );
}
