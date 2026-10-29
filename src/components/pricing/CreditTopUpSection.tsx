'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Coins,
  Clock,
  FileText,
} from 'lucide-react';

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceInr: number;
  taxInr: number;
  totalInr: number;
  perCredit: string;
  featured?: boolean;
  desc: string;
}

interface CreditTopUpSectionProps {
  onBuyPack: (packId: string) => void;
}

export function CreditTopUpSection({ onBuyPack }: CreditTopUpSectionProps) {
  const router = useRouter();

  const creditPacks: CreditPack[] = [
    {
      id: 'pack_5000',
      name: '5,000 Credits Pro Top-Up',
      credits: 5000,
      priceInr: 6500,
      taxInr: 1170,
      totalInr: 7670,
      perCredit: '₹1.30',
      featured: true,
      desc: 'Most popular business top-up for active campaign scaling. Complete with 18% GST invoice.',
    },
    {
      id: 'pack_1000',
      name: '1,000 Credits Starter Pack',
      credits: 1000,
      priceInr: 1400,
      taxInr: 252,
      totalInr: 1652,
      perCredit: '₹1.40',
      featured: false,
      desc: 'Ideal for launching 1–2 test campaigns or generating quick product variations.',
    },
    {
      id: 'pack_2500',
      name: '2,500 Credits Growth Pack',
      credits: 2500,
      priceInr: 3400,
      taxInr: 612,
      totalInr: 4012,
      perCredit: '₹1.36',
      featured: false,
      desc: 'Great for weekly social reel pipelines and consistent digital ad creative refreshes.',
    },
    {
      id: 'pack_10000',
      name: '10,000 Credits Agency Pack',
      credits: 10000,
      priceInr: 12500,
      taxInr: 2250,
      totalInr: 14750,
      perCredit: '₹1.25',
      featured: false,
      desc: 'High-volume production tier for agencies managing multiple brand creative accounts.',
    },
    {
      id: 'pack_25000',
      name: '25,000 Credits Enterprise Pack',
      credits: 25000,
      priceInr: 29000,
      taxInr: 5220,
      totalInr: 34220,
      perCredit: '₹1.16',
      featured: false,
      desc: 'Enterprise tier volume for scaled production houses and high-frequency ad creative testing.',
    },
    {
      id: 'pack_500',
      name: '500 Credits Boost',
      credits: 500,
      priceInr: 499,
      taxInr: 89.82,
      totalInr: 588.82,
      perCredit: '₹0.99',
      featured: false,
      desc: 'Quick generation top-up to finalize an in-progress creative campaign.',
    },
  ];

  const featuredPack = creditPacks.find((p) => p.id === 'pack_5000') || creditPacks[0];
  const standardPacks = creditPacks.filter((p) => p.id !== 'pack_5000');

  return (
    <div id="credit-topups" className="w-full mt-20 pt-16 border-t border-[#E5E7EB] text-left">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#C7D2FE]">
          One-Time Credit Top-Ups
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight mt-3">
          Purchase Credits on Demand
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#667085]">
          Need additional credits without changing your subscription plan? Purchase one-time top-ups that never expire.
        </p>

        {/* Top-up Rules Trust Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-[#667085]">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Credits never expire</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Coins className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Fixed consumption rates (15 cr/video)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Full 18% GST tax invoice included</span>
          </span>
        </div>
      </div>

      {/* Featured 5,000 Credits Pack Highlight Banner */}
      <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#EEF2FF] via-white to-[#EEF2FF] border-2 border-[#5145CD] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5145CD] text-white text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Featured Business Pack</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#17191D]">
            5,000 Credits Pro Top-Up Pack
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] max-w-xl leading-relaxed">
            {featuredPack.desc}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-[#17191D]">
            <span className="bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-lg font-mono">
              Base Price: <strong>₹6,500</strong>
            </span>
            <span className="bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-lg font-mono">
              18% GST: <strong>₹1,170</strong>
            </span>
            <span className="bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] px-2.5 py-1 rounded-lg font-mono font-bold">
              Total: ₹7,670
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
          <div className="text-center sm:text-right">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#5145CD] font-mono">
              ₹6,500
            </p>
            <p className="text-[11px] text-[#667085] font-mono">
              + 18% GST (₹7,670 Total)
            </p>
            <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">
              Effective: ₹1.30 per credit
            </p>
          </div>
          <button
            type="button"
            onClick={() => onBuyPack(featuredPack.id)}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Purchase 5,000 Credits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Additional Configured Credit Packs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {standardPacks.map((pack) => (
          <div
            key={pack.id}
            className="p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all flex flex-col justify-between text-left shadow-2xs group"
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-bold text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-[#E0E7FF]">
                  {pack.credits.toLocaleString()} CR
                </span>
                <span className="text-[10px] text-[#667085] font-mono">
                  {pack.perCredit}/cr
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#17191D] mt-2 group-hover:text-[#5145CD] transition-colors">
                {pack.name}
              </h4>
              <p className="text-[11px] text-[#667085] mt-1 line-clamp-2 leading-relaxed">
                {pack.desc}
              </p>

              <div className="mt-4 pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#17191D] font-mono">
                    ₹{pack.priceInr.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#667085]">+ 18% GST</span>
                </div>
                <p className="text-[10px] text-[#667085] font-mono mt-0.5">
                  ₹{Math.round(pack.totalInr).toLocaleString()} total incl. taxes
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onBuyPack(pack.id)}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-[#F7F8FA] hover:bg-[#5145CD] text-[#17191D] hover:text-white border border-[#E5E7EB] hover:border-[#5145CD] text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Buy Pack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
