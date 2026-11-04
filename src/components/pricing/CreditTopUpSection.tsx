'use client';

import React from 'react';
import { Sparkles, ArrowRight, Coins, Clock, FileText } from 'lucide-react';

interface CreditTopUpSectionProps {
  onBuyPack: (packId: string) => void;
  isDark?: boolean;
}

export function CreditTopUpSection({ onBuyPack, isDark = false }: CreditTopUpSectionProps) {
  const creditPacks = [
    {
      id: 'pack_1000',
      name: 'Starter Pack',
      credits: 1000,
      priceInr: 1500,
      gstInr: 270,
      totalInr: 1770,
      perCredit: '₹1.50',
      desc: 'Ideal for testing campaigns and quick creative generation tasks.',
    },
    {
      id: 'pack_2500',
      name: 'Growth Pack',
      credits: 2500,
      priceInr: 3500,
      gstInr: 630,
      totalInr: 4130,
      perCredit: '₹1.40',
      desc: 'For regular video ad creators producing weekly social content.',
    },
    {
      id: 'pack_5000',
      name: 'Scale Pack',
      credits: 5000,
      priceInr: 6500,
      gstInr: 1170,
      totalInr: 7670,
      perCredit: '₹1.30',
      desc: 'Most popular top-up for scaling e-commerce brands & agencies.',
      isFeatured: true,
    },
    {
      id: 'pack_10000',
      name: 'Studio Pack',
      credits: 10000,
      priceInr: 12000,
      gstInr: 2160,
      totalInr: 14160,
      perCredit: '₹1.20',
      desc: 'Designed for production studios running high-concurrency 4K jobs.',
    },
    {
      id: 'pack_25000',
      name: 'Enterprise Pack',
      credits: 25000,
      priceInr: 27500,
      gstInr: 4950,
      totalInr: 32450,
      perCredit: '₹1.10',
      desc: 'High-volume commercial pack with dedicated GPU processing queue.',
    },
  ];

  const featuredPack = creditPacks.find((p) => p.id === 'pack_5000') || creditPacks[0];
  const standardPacks = creditPacks.filter((p) => p.id !== 'pack_5000');

  return (
    <div id="credit-topups" className={`w-full mt-20 pt-16 border-t text-left transition-colors ${
      isDark ? 'border-slate-800' : 'border-[#E5E7EB]'
    }`}>
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
          isDark
            ? 'text-indigo-300 bg-indigo-950/80 border-indigo-700/50'
            : 'text-[#5145CD] bg-[#EEF2FF] border-[#C7D2FE]'
        }`}>
          One-Time Credit Top-Ups
        </span>
        <h2 className={`text-2xl sm:text-3xl font-black tracking-tight mt-3 ${
          isDark ? 'text-white' : 'text-[#17191D]'
        }`}>
          Purchase Credits on Demand
        </h2>
        <p className={`mt-2 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
          Need additional credits without changing your subscription plan? Purchase one-time top-ups that never expire.
        </p>

        {/* Top-up Rules Trust Badges */}
        <div className={`mt-4 flex flex-wrap items-center justify-center gap-5 text-xs ${
          isDark ? 'text-slate-400' : 'text-[#667085]'
        }`}>
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Credits never expire</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Coins className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-[#5145CD]'}`} />
            <span>Fixed consumption rates (15 cr/video)</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Full 18% GST tax invoice included</span>
          </span>
        </div>
      </div>

      {/* Featured 5,000 Credits Pack Highlight Banner */}
      <div className={`mb-8 p-6 sm:p-8 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
        isDark
          ? 'bg-gradient-to-r from-[#101426] via-[#161C33] to-[#101426] border-indigo-500/60 shadow-2xl shadow-indigo-950/40 text-white'
          : 'bg-gradient-to-r from-[#EEF2FF] via-white to-[#EEF2FF] border-[#5145CD] shadow-sm text-[#17191D]'
      }`}>
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5145CD] text-white text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Featured Business Pack</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
            5,000 Credits Pro Top-Up Pack
          </h3>
          <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#667085]'}`}>
            {featuredPack.desc}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
            <span className={`px-2.5 py-1 rounded-lg font-mono border ${
              isDark
                ? 'bg-[#0E1322] border-slate-700 text-slate-200'
                : 'bg-white border-[#E5E7EB] text-[#17191D]'
            }`}>
              Base Price: <strong>₹6,500</strong>
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-mono border ${
              isDark
                ? 'bg-[#0E1322] border-slate-700 text-slate-200'
                : 'bg-white border-[#E5E7EB] text-[#17191D]'
            }`}>
              18% GST: <strong>₹1,170</strong>
            </span>
            <span className={`px-2.5 py-1 rounded-lg font-mono font-bold border ${
              isDark
                ? 'bg-indigo-950/70 border-indigo-700/60 text-indigo-300'
                : 'bg-[#EEF2FF] border-[#C7D2FE] text-[#5145CD]'
            }`}>
              Total: ₹7,670
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
          <div className="text-center sm:text-right">
            <p className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              isDark ? 'text-indigo-400' : 'text-[#5145CD]'
            }`}>
              ₹6,500
            </p>
            <p className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
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
            className={`p-5 rounded-xl border transition-all flex flex-col justify-between text-left group ${
              isDark
                ? 'bg-[#0E121B] border-slate-800 hover:border-indigo-500/50 hover:shadow-xl text-white'
                : 'bg-white border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800'
                    : 'bg-[#EEF2FF] text-[#5145CD] border-[#E0E7FF]'
                }`}>
                  {pack.credits.toLocaleString()} CR
                </span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
                  {pack.perCredit}/cr
                </span>
              </div>

              <h4 className={`font-bold text-sm mt-2 transition-colors ${
                isDark
                  ? 'text-white group-hover:text-indigo-400'
                  : 'text-[#17191D] group-hover:text-[#5145CD]'
              }`}>
                {pack.name}
              </h4>
              <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-[#667085]'
              }`}>
                {pack.desc}
              </p>

              <div className={`mt-4 pb-3 border-b ${isDark ? 'border-slate-800' : 'border-[#E5E7EB]'}`}>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-[#17191D]'}`}>
                    ₹{pack.priceInr.toLocaleString()}
                  </span>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>+ 18% GST</span>
                </div>
                <p className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-[#667085]'}`}>
                  ₹{Math.round(pack.totalInr).toLocaleString()} total incl. taxes
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onBuyPack(pack.id)}
              className={`mt-4 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center border ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-indigo-600 text-white border-slate-700 hover:border-indigo-500'
                  : 'bg-[#F7F8FA] hover:bg-[#5145CD] text-[#17191D] hover:text-white border-[#E5E7EB] hover:border-[#5145CD]'
              }`}
            >
              Buy Pack
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
