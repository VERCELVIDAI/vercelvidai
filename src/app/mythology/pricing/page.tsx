'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Coins,
  ArrowRight,
  HelpCircle,
  Zap,
  Building2,
  Lock,
  Flame,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { DevotionalParticles } from '@/components/mythology/DevotionalParticles';
import { MYTHOS_ADDON_PACKS } from '@/lib/mythology/mythosPlansConfig';

export default function MythologyPricingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const MYTHOS_SUBSCRIPTION_PLANS = [
    {
      id: 'plan_mythos_10',
      name: 'Mythos Starter (10 Videos)',
      tagline: 'Ideal for devotional channels & creators posting weekly stories',
      badge: '10 VIDEOS PACK',
      badgeClass: 'bg-amber-500 text-white',
      priceMonthly: 5100,
      priceAnnual: 4080,
      credits: 220,
      creditsLabel: '220 Credits (~10 Full Videos)',
      isRecommended: false,
      ctaText: 'Get Mythos Starter (10 Videos)',
      features: [
        '10 Full Mythology Videos per month (220 credits)',
        '1080p Full HD Watermark-Free MP4 Exports',
        'All 7 Mythology Art Styles & Custom Prompts',
        'ElevenLabs Multilingual Neural Voices (Hindi + English)',
        'Word-by-word Synced Karaoke Captions in Devanagari',
        'Licensed Temple Shankh, Flute & War Drums BGM',
        'Full Commercial Rights for YouTube & Instagram Reels',
        'Automated GST Tax Invoicing (18% ITC Included)',
      ],
      highlights: [
        '1080p HD Watermark-Free',
        'Hindi & English Narration',
        'Commercial License',
      ],
    },
    {
      id: 'plan_mythos_20',
      name: 'Mythos Special Creator (20 Videos)',
      tagline: 'Special creator plan with 4K AI upscale, character lock & hero video animations',
      badge: '🔥 SPECIAL PLAN • 20 VIDEOS',
      badgeClass: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-black font-black shadow-md',
      priceMonthly: 7999,
      priceAnnual: 6399,
      credits: 450,
      creditsLabel: '450 Credits (~20 Videos + Hero Anim)',
      isRecommended: true,
      ctaText: 'Get Mythos Special (20 Videos)',
      features: [
        '20 Full Mythology Videos per month (450 credits)',
        '1080p Full HD Watermark-Free + 4K AI Upscale',
        'Hero Scene Video Animations (Image-to-Video Engine)',
        'Character Bible Lock (Rama, Krishna, Shiva, Hanuman)',
        'All 7 Art Styles + Custom Deity Prompt Engine',
        'ElevenLabs HD Voices with Emotion Pacing',
        'Word-by-word Synced Karaoke in Noto Sans Devanagari',
        '1-Click Viral Social Metadata Pack (Hooks & Hashtags)',
        'Priority GPU Cloud Render Queue (Fast Lane)',
        'Automated GST Tax Invoicing (18% ITC Included)',
      ],
      highlights: [
        '20 Full Videos / mo',
        '4K AI Upscale Included',
        'Hero Scene Video Animation',
        'Character Bible Consistency',
      ],
    },
    {
      id: 'plan_mythos_50',
      name: 'Mythos Studio Scale (50 Videos)',
      tagline: 'High-volume production tier for media houses, daily channels & agencies',
      badge: '50 VIDEOS • STUDIO SCALE',
      badgeClass: 'bg-indigo-600 text-white',
      priceMonthly: 16999,
      priceAnnual: 13599,
      credits: 1150,
      creditsLabel: '1,150 Credits (~50 Full Videos)',
      isRecommended: false,
      ctaText: 'Get Mythos Studio Scale (50 Videos)',
      features: [
        '50 Full Mythology Videos per month (1,150 credits)',
        'Up to 60s per video with multi-character dialogues',
        'Multi-Episode Epic Series Manager (Ramayan/Mahabharat)',
        'Unlimited Character Bible with Reference Image Anchoring',
        'Dedicated High-Speed Cloud Render Cluster',
        'Full Commercial Agency & Broadcast Monetization License',
        'VIP Priority WhatsApp & Direct Video Architect Support',
        'Automated GST Tax Invoicing (18% ITC Included)',
      ],
      highlights: [
        '50 Full Videos / mo',
        'Epic Series Manager',
        'Dedicated GPU Cluster',
        'VIP WhatsApp SLA',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B12] text-slate-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-black">
      {/* Devotional Floating Embers / Particles */}
      <DevotionalParticles count={14} />

      <Header />

      {/* Radiant Background Aura */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none" />

      <main className="flex-1 py-12 sm:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/50 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>🕉️ Fluvia Mythos • Sacred Video Plans</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Turn Sacred Stories into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFA500] to-[#FF8400]">
                High-Converting Vertical Videos
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transparent Indian Rupee pricing with 18% GST tax invoicing. Get full commercial rights, ElevenLabs Hindi narration, and watermark-free 1080p/4K MP4 exports.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="pt-3 flex items-center justify-center">
              <div className="flex items-center bg-[#131326] p-1 rounded-xl border border-[#2B274F] shadow-sm">
                <button
                  type="button"
                  onClick={() => setBillingInterval('month')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    billingInterval === 'month'
                      ? 'bg-[#FFB800] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('year')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingInterval === 'year'
                      ? 'bg-[#FFB800] text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full">
                    20% OFF
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid (3 Core Plans: 10, 20, 50 Videos) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-2">
            {MYTHOS_SUBSCRIPTION_PLANS.map((plan) => {
              const price = billingInterval === 'year' ? plan.priceAnnual : plan.priceMonthly;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 ${
                    plan.isRecommended
                      ? 'border-2 border-amber-400 bg-gradient-to-b from-[#1C160B] via-[#141021] to-[#121124] shadow-[0_0_50px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/40 lg:-translate-y-2'
                      : 'border border-[#262347] bg-[#121124] hover:border-slate-500 shadow-md'
                  }`}
                >
                  {/* Floating Top Badge */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md ${plan.badgeClass}`}>
                      {plan.badge}
                    </span>
                  </div>

                  <div className="space-y-5 pt-2">
                    <div>
                      <h3 className="text-xl font-black text-white">{plan.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div className="p-4 rounded-2xl bg-[#0B0A14] border border-[#231F3D] space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          / month
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-300/90 font-mono font-medium">
                        {billingInterval === 'year' ? 'Billed annually (20% discount applied)' : 'Billed monthly'} + 18% GST
                      </p>
                    </div>

                    {/* Credits Badge Box */}
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-400/30 flex items-center justify-between text-xs font-bold text-amber-300">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{plan.creditsLabel}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-400 text-black px-2 py-0.5 rounded font-black">
                        Instant Delivery
                      </span>
                    </div>

                    {/* Key Highlights Pill Row */}
                    <div className="flex flex-wrap gap-1.5">
                      {plan.highlights.map((h, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-[#1C1A35] border border-[#2D2A54] text-slate-200 px-2 py-0.5 rounded-md"
                        >
                          ✓ {h}
                        </span>
                      ))}
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-2 pt-2 border-t border-[#231F3D]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Included in this Plan:
                      </span>
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <Link
                      href={`/checkout?plan=${plan.id}&interval=${billingInterval}`}
                      className={`w-full py-3.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-98 ${
                        plan.isRecommended
                          ? 'bg-gradient-to-r from-[#FFB800] via-[#FFA500] to-[#FF8400] text-black shadow-lg shadow-amber-500/30 hover:opacity-95'
                          : 'bg-[#1C1A35] hover:bg-[#27244D] text-white border border-[#2D2A54]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Free Trial Callout Banner */}
          <div className="p-6 rounded-2xl border border-[#242142] bg-[#111022] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Free Evaluation
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Want to test before subscribing?
              </h3>
              <p className="text-xs text-slate-400">
                Generate in-browser JSON scripts, test Indian voices, and export trial videos right now.
              </p>
            </div>

            <Link
              href="/mythology/studio"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shrink-0 transition-colors flex items-center gap-1.5"
            >
              <span>Open Free Mythology Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Add-on Credit Packs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#111022] border border-[#242142] space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Flexible Top-ups
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Mythos Add-on Credit Packs (Never Expire)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Need more videos without changing your subscription? Top up credits instantly into your unified wallet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MYTHOS_ADDON_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="p-5 rounded-2xl border border-[#231F3D] bg-[#0E0D1C] flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {pack.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {pack.badge}
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-white font-mono">
                      ₹{pack.priceInr.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-slate-400 font-normal">({pack.credits} Credits)</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {pack.description}
                    </p>
                  </div>

                  <Link
                    href={`/checkout?pack=${pack.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Buy Credits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing FAQ */}
          <div className="max-w-3xl mx-auto space-y-6 pt-6">
            <h2 className="text-2xl font-black text-center text-white">
              Billing & Commercial Usage FAQs
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Do I get an official GST Tax Invoice?',
                  a: 'Yes, absolutely. Fluvia Flow Technologies issues 18% GST invoices for all Indian transactions. You can enter your company GSTIN at checkout to claim Input Tax Credit (ITC).',
                },
                {
                  q: 'Can I monetize mythology videos on YouTube Shorts and Instagram Reels?',
                  a: 'Yes. All Mythos plans grant a full commercial monetization license. The background music and sound effects are licensed for commercial online distribution without copyright strikes.',
                },
                {
                  q: 'What happens if an AI provider call fails during generation?',
                  a: 'Our two-phase transaction ledger automatically refunds 100% of reserved credits back into your account immediately if an image or voice synthesis times out.',
                },
                {
                  q: 'Can I switch or cancel plans anytime?',
                  a: 'Yes, you can upgrade, downgrade, or cancel your subscription at any time from your Creator Dashboard with one click.',
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-4 sm:p-5 rounded-2xl border border-[#231F3D] bg-[#121124] space-y-1.5"
                >
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
