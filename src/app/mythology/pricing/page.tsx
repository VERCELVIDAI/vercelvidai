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
} from 'lucide-react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { MYTHOS_PLANS, MYTHOS_ADDON_PACKS } from '@/lib/mythology/mythosPlansConfig';

export default function MythologyPricingPage() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Fluvia Mythos Subscription & Credits
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Honest, Transparent Pricing for Mythology Storytellers
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Indian Rupee pricing with 18% GST invoicing. Pay-as-you-go credit packs and full commercial monetization rights.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="pt-2 flex items-center justify-center">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setBillingInterval('month')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    billingInterval === 'month'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval('year')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    billingInterval === 'year'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] bg-white text-amber-600 font-extrabold px-1.5 py-0.2 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {MYTHOS_PLANS.map((plan) => {
              const price =
                billingInterval === 'year' && plan.priceAnnualInr !== undefined
                  ? plan.priceAnnualInr
                  : plan.priceInr;
              const isCreator = plan.id === 'plan_mythos_creator';

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border relative transition-all ${
                    isCreator
                      ? 'border-amber-500 bg-amber-500/5 shadow-2xl ring-2 ring-amber-500 scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
                  }`}
                >
                  {plan.badge && (
                    <span
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md ${
                        isCreator ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          / month
                        </span>
                      </div>
                      {plan.priceInr > 0 && (
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          + 18% GST (Includes automated Tax Invoice)
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                      <Coins className="w-4 h-4 shrink-0 text-amber-500" />
                      <span>{plan.creditsPerPeriod} Mythos Credits per month</span>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Included Entitlements:
                      </span>
                      {plan.features?.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-8">
                    {plan.priceInr === 0 ? (
                      <Link
                        href="/mythology/studio"
                        className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span>Start Free Trial</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/checkout?plan=${plan.id}&interval=${billingInterval}`}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                          isCreator
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                        }`}
                      >
                        <span>Upgrade to {plan.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-on Credit Packs */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Flexible Top-ups
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  Mythos Add-on Credit Packs (Never Expire)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Need more videos without changing your subscription? Top up credits instantly into your unified wallet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MYTHOS_ADDON_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/70 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900 dark:text-white">
                        {pack.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {pack.badge}
                      </span>
                    </div>
                    <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      ₹{pack.priceInr.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-slate-400 font-normal">({pack.credits} Credits)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {pack.description}
                    </p>
                  </div>

                  <Link
                    href={`/checkout?pack=${pack.id}`}
                    className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
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
            <h2 className="text-2xl font-black text-center text-slate-900 dark:text-white">
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
                  a: 'Yes. The Mythos Creator and Mythos Pro plans grant a full commercial monetization license. The background music and sound effects are licensed for commercial online distribution.',
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
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
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
