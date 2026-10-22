'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [selectedPack, setSelectedPack] = useState<string>('pack_1200');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseModal, setPurchaseModal] = useState<{
    open: boolean;
    type: 'plan' | 'pack';
    id: string;
    name: string;
    price: number;
    credits: number;
  } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const plans = [
    {
      id: 'plan_free',
      name: 'Free Explorer',
      monthlyPrice: 0,
      annualPrice: 0,
      credits: 60,
      badge: null,
      desc: 'Ideal for testing AI video generation workflows.',
      features: [
        '60 Credits every month',
        '720p HD Exports',
        'Watermarked exports',
        '30 seconds max clip duration',
        'Vidai Core & Flux AI models',
        '1 GB Cloud Storage',
        'Standard Community Support',
      ],
      cta: 'Current Plan',
      buttonVariant: 'secondary',
    },
    {
      id: 'plan_starter',
      name: 'Starter Creator',
      monthlyPrice: 999,
      annualPrice: 799,
      credits: 500,
      badge: null,
      desc: 'Perfect for content creators & YouTubers.',
      features: [
        '500 Credits every month',
        '1080p Full HD Exports',
        'No watermark on any export',
        '60 seconds clip duration',
        'Runway Gen-2 & Vidai Core',
        'ElevenLabs Voice synthesis',
        '10 GB Cloud Storage',
        'Priority email assistance',
      ],
      cta: 'Upgrade to Starter',
      buttonVariant: 'primary',
    },
    {
      id: 'plan_creator',
      name: 'Pro Creator',
      monthlyPrice: 2499,
      annualPrice: 1999,
      credits: 1600,
      badge: 'Most Popular',
      desc: 'For professional marketers, agencies & power creators.',
      features: [
        '1,600 Credits every month',
        '4K Ultra HD Exports',
        'Runway Gen-3 Alpha & Luma Ray',
        'Priority GPU generation queue',
        'Multi-track timeline video editor',
        '5 Brand Kits (Logos, Fonts, Colors)',
        '50 GB Cloud Storage',
        'Expedited VIP Support',
      ],
      cta: 'Upgrade to Pro',
      buttonVariant: 'gradient',
    },
    {
      id: 'plan_business',
      name: 'Studio Agency',
      monthlyPrice: 6999,
      annualPrice: 5599,
      credits: 5000,
      badge: 'Ultimate Power',
      desc: 'Designed for production agencies and scaling teams.',
      features: [
        '5,000 Credits every month',
        '4K 60fps Cinema Master exports',
        'Uncapped generation duration (10 min)',
        'All current & future AI models',
        'Dedicated GPU priority slot',
        '20 Team Brand Kits & Workspace',
        '250 GB High-Speed Storage',
        'Dedicated Account Manager & SLA',
      ],
      cta: 'Get Studio Agency',
      buttonVariant: 'primary',
    },
  ];

  const creditPacks = [
    { id: 'pack_500', name: '500 Credits Boost', priceInr: 499, credits: 500 },
    { id: 'pack_1200', name: '1,200 Credits Studio', priceInr: 999, credits: 1200, popular: true },
    { id: 'pack_3500', name: '3,500 Credits Scale', priceInr: 2499, credits: 3500 },
    { id: 'pack_10000', name: '10,000 Credits Agency', priceInr: 5999, credits: 10000 },
  ];

  const handleInitiatePayment = (type: 'plan' | 'pack', item: any) => {
    router.push(`/checkout?type=${type}&id=${item.id}`);
  };

  const handleConfirmOrder = async () => {
    if (!purchaseModal) return;
    router.push(`/checkout?type=${purchaseModal.type}&id=${purchaseModal.id}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-xs font-semibold text-violet-400 mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>India-Focused INR Pricing • PayU Hosted Checkout & GST Invoices</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Predictable plans. Uncapped creativity.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Choose a plan that fits your production volume. Upgrade, downgrade, or buy credit packs at any time.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-white/[0.05] rounded-xl border border-white/10">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                billingInterval === 'month' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingInterval === 'year' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingInterval === 'month' ? p.monthlyPrice : p.annualPrice;
            const isZero = price === 0;

            return (
              <div
                key={p.id}
                className={`p-6 rounded-2xl glass-panel border flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                  p.badge
                    ? 'border-violet-500 shadow-2xl shadow-violet-600/20 bg-gradient-to-b from-[#131522] to-[#0E1017]'
                    : 'border-white/[0.08]'
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                    {p.badge}
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-white text-xl">{p.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 h-8">{p.desc}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">₹{price}</span>
                    <span className="text-xs text-slate-400">/{billingInterval === 'month' ? 'mo' : 'mo (billed yearly)'}</span>
                  </div>

                  <div className="mt-3 text-xs font-semibold text-violet-300 bg-violet-950/60 p-2.5 rounded-xl border border-violet-800/40 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{p.credits} credits every month</span>
                  </div>

                  <div className="mt-6 border-t border-white/[0.08] pt-6">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
                      Includes:
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  {isZero ? (
                    <Link
                      href="/signup"
                      className="w-full block py-3 rounded-xl text-center text-sm font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
                    >
                      Start Free with 100 Credits
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleInitiatePayment('plan', p)}
                      className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-all shadow-lg ${
                        p.buttonVariant === 'gradient'
                          ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white shadow-violet-600/30'
                          : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20'
                      }`}
                    >
                      {p.cta}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Credit Packs Section */}
        <section className="mt-24 p-8 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Need extra generations?</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                One-Time Top-Up Credit Packs
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Top up your wallet anytime. Purchased credit packs never expire and stack with your monthly allowance.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Instant credit crediting via PayU India</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack) => (
              <div
                key={pack.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  pack.popular
                    ? 'bg-violet-600/10 border-violet-500/50 shadow-lg shadow-violet-600/10'
                    : 'bg-[#0E1017] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-base">{pack.name}</h3>
                    {pack.popular && (
                      <span className="text-[10px] bg-violet-600 text-white px-2 py-0.5 rounded font-bold">
                        Best Value
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">₹{pack.priceInr}</span>
                    <span className="text-xs text-slate-400">one-time</span>
                  </div>
                  <p className="mt-2 text-xs text-violet-300 font-semibold">
                    +{pack.credits} Generative Credits
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleInitiatePayment('pack', pack)}
                  className="mt-5 w-full py-2.5 rounded-lg text-xs font-bold text-white bg-white/10 hover:bg-violet-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Buy Credits Now</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Matrix */}
        <section className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Detailed Plan Comparison</h2>
            <p className="mt-2 text-sm text-slate-400">Everything you need to select the right tier.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl glass-panel border border-white/10">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 font-bold text-white">Feature & Capability</th>
                  <th className="p-4 font-bold text-slate-300">Free</th>
                  <th className="p-4 font-bold text-slate-300">Starter</th>
                  <th className="p-4 font-bold text-violet-400">Pro Creator</th>
                  <th className="p-4 font-bold text-slate-300">Studio Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                <tr>
                  <td className="p-4 font-medium text-white">Monthly Credits</td>
                  <td className="p-4">60 cr</td>
                  <td className="p-4">500 cr</td>
                  <td className="p-4 font-semibold text-violet-300">1,600 cr</td>
                  <td className="p-4 font-semibold text-white">5,000 cr</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Maximum Export Resolution</td>
                  <td className="p-4">720p HD</td>
                  <td className="p-4">1080p FHD</td>
                  <td className="p-4 font-semibold text-emerald-400">4K Ultra HD</td>
                  <td className="p-4 font-semibold text-emerald-400">4K 60fps Master</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Watermark Free</td>
                  <td className="p-4 text-rose-400">No (Watermarked)</td>
                  <td className="p-4 text-emerald-400">Yes</td>
                  <td className="p-4 text-emerald-400">Yes</td>
                  <td className="p-4 text-emerald-400">Yes</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Supported AI Video Models</td>
                  <td className="p-4">Vidai Core</td>
                  <td className="p-4">Vidai Core & Gen-2</td>
                  <td className="p-4">Runway Gen-3 & Luma Ray</td>
                  <td className="p-4">All Current & Future Models</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Timeline Editor & Multi-track</td>
                  <td className="p-4">Basic</td>
                  <td className="p-4">Standard</td>
                  <td className="p-4 text-emerald-400">Full Studio Suite</td>
                  <td className="p-4 text-emerald-400">Full Studio Suite</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Cloud Storage Quota</td>
                  <td className="p-4">1 GB</td>
                  <td className="p-4">10 GB</td>
                  <td className="p-4">50 GB</td>
                  <td className="p-4">250 GB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Razorpay Checkout Simulator Modal */}
        {purchaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#12141A] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                    ₹
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Razorpay INR Checkout</h3>
                    <p className="text-xs text-slate-400">Secure Payment Gateway</p>
                  </div>
                </div>
                {!isProcessing && (
                  <button
                    onClick={() => setPurchaseModal(null)}
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="py-5 space-y-4">
                <div className="bg-[#0E1017] p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Item:</span>
                    <span className="font-semibold text-white">{purchaseModal.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Credits Credited:</span>
                    <span className="font-semibold text-violet-400">+{purchaseModal.credits} cr</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/5 pt-2">
                    <span className="text-slate-400">Total Payable:</span>
                    <span className="text-xl font-bold text-emerald-400">₹{purchaseModal.price}</span>
                  </div>
                </div>

                {statusMessage && (
                  <div className="p-3 bg-violet-950/60 border border-violet-700/50 rounded-xl text-xs text-violet-200 flex items-center gap-2">
                    {isProcessing && <div className="w-3.5 h-3.5 border-2 border-violet-300 border-t-transparent rounded-full animate-spin shrink-0" />}
                    <span>{statusMessage}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPurchaseModal(null)}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 flex items-center justify-center gap-1.5"
                >
                  <span>Pay ₹{purchaseModal.price} (UPI/Card)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
