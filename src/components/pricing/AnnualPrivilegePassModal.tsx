'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown,
  Sparkles,
  Gift,
  Zap,
  CheckCircle2,
  ArrowRight,
  X,
  Flame,
  Clock,
  ShieldCheck,
  Award,
  Coins,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';

interface AnnualPrivilegePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToAnnual: () => void;
  currency?: 'inr' | 'usd';
}

export function AnnualPrivilegePassModal({
  isOpen,
  onClose,
  onSwitchToAnnual,
  currency = 'inr',
}: AnnualPrivilegePassModalProps) {
  const router = useRouter();

  // Selected plan inside modal: 'openhiggs' | 'pro' | 'max'
  const [selectedPlan, setSelectedPlan] = useState<'openhiggs' | 'pro' | 'max'>('openhiggs');
  // Interactive mystery perk state
  const [isPerkRevealed, setIsPerkRevealed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  // Live 10-minute session countdown timer
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: 9,
    seconds: 54,
  });

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // Plan comparison details for dynamic engagement
  const plans = {
    openhiggs: {
      id: 'plan_openhiggs',
      name: 'OpenHiggs Studio Pro',
      subtitle: 'All 38 Foundation Models (Soul Cinema 4K, Seedance 2.5, Kling 3.0)',
      badge: '20% OFF ANNUAL',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      monthlyPrice: currency === 'usd' ? 59 : 5100,
      annualPriceMonthly: currency === 'usd' ? 47 : 4080,
      annualTotal: currency === 'usd' ? 564 : 48960,
      savingsAmount: currency === 'usd' ? 144 : 12240,
      freeMonthsEquivalent: '2.4 Months FREE',
      perkSummary: 'Zero GPU Queue + Unrestricted 38 AI Models',
    },
    pro: {
      id: 'plan_creator',
      name: 'Fluvia Pro Plan',
      subtitle: 'Everyday AI creation with 600–900 credits/mo',
      badge: '21% OFF ANNUAL',
      badgeColor: 'bg-lime-100 text-lime-900 border-lime-300',
      monthlyPrice: currency === 'usd' ? 29 : 2499,
      annualPriceMonthly: currency === 'usd' ? 23 : 1999,
      annualTotal: currency === 'usd' ? 276 : 23988,
      savingsAmount: currency === 'usd' ? 72 : 6000,
      freeMonthsEquivalent: '2.5 Months FREE',
      perkSummary: '1080p Unlimited Free Gens + Seedance 2.5',
    },
    max: {
      id: 'plan_max',
      name: 'Fluvia Max / Ultra Plan',
      subtitle: 'Power AI studio with 1,800 credits & cluster lanes',
      badge: '25% OFF ANNUAL',
      badgeColor: 'bg-pink-100 text-pink-900 border-pink-300',
      monthlyPrice: currency === 'usd' ? 79 : 4999,
      annualPriceMonthly: currency === 'usd' ? 59 : 3999,
      annualTotal: currency === 'usd' ? 708 : 47988,
      savingsAmount: currency === 'usd' ? 240 : 12000,
      freeMonthsEquivalent: '3 Months FREE',
      perkSummary: 'VIP Cluster Rendering + Commercial 4K 60fps',
    },
  };

  const currentPlan = plans[selectedPlan];
  const currencySymbol = currency === 'usd' ? '$' : '₹';

  const handleClaim = () => {
    setIsClaiming(true);
    onSwitchToAnnual();

    setTimeout(() => {
      router.push(
        `/checkout?type=subscription&id=${currentPlan.id}&interval=year`
      );
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Interactive Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-left">
        {/* Top Promotional Announcement Glow */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-0.5">
          <div className="bg-amber-50/90 px-4 py-2 flex items-center justify-between text-xs font-bold text-amber-950 border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="flex items-center gap-1.5 font-extrabold text-[11px] sm:text-xs">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>EXCLUSIVE CREATOR PRIVILEGE PASS • SAVE 20%</span>
              </span>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-1 text-[11px] font-mono font-black text-rose-700 bg-white/80 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
              <Clock className="w-3 h-3 text-rose-500" />
              <span>
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-7 max-h-[85vh] overflow-y-auto">
          {/* Header Title with VIP Trophy */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 shrink-0">
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse text-white drop-shadow-md" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Limited Annual Pass</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                Unlock 20% OFF + 2 Months Free on Annual
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Why pay monthly? Switch to the Annual Creator Pass to instantly save cash, lock in grandfathered pricing, and skip all GPU queues.
              </p>
            </div>
          </div>

          {/* Interactive Plan Selector Switcher */}
          <div className="mt-5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setSelectedPlan('openhiggs')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                selectedPlan === 'openhiggs'
                  ? 'bg-white text-emerald-950 shadow-md border border-emerald-300 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="truncate w-full">OpenHiggs Pro</span>
              <span className="text-[10px] text-emerald-700 font-extrabold">20% OFF</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('pro')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                selectedPlan === 'pro'
                  ? 'bg-white text-lime-950 shadow-md border border-lime-400 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="truncate w-full">Fluvia Pro</span>
              <span className="text-[10px] text-lime-700 font-extrabold">21% OFF</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPlan('max')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                selectedPlan === 'max'
                  ? 'bg-white text-pink-950 shadow-md border border-pink-400 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="truncate w-full">Fluvia Max</span>
              <span className="text-[10px] text-pink-700 font-extrabold">25% OFF</span>
            </button>
          </div>

          {/* Golden Ticket / Live Savings Breakdown Card */}
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-indigo-50/50 border-2 border-amber-300/80 shadow-sm relative overflow-hidden">
            {/* Ambient Watermark */}
            <Crown className="absolute -right-6 -bottom-6 w-32 h-32 text-amber-200/30 pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-3.5">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${currentPlan.badgeColor}`}>
                  {currentPlan.badge}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {currentPlan.name}
                </h3>
                <p className="text-xs text-slate-600">{currentPlan.subtitle}</p>
              </div>

              {/* Price comparison */}
              <div className="text-left sm:text-right shrink-0">
                <div className="flex items-baseline sm:justify-end gap-1.5">
                  <span className="text-xs line-through text-rose-500 font-bold font-mono">
                    {currencySymbol}{currentPlan.monthlyPrice.toLocaleString()}/mo
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                    {currencySymbol}{currentPlan.annualPriceMonthly.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-slate-600">/mo</span>
                </div>
                <div className="text-[11px] font-extrabold text-emerald-700 flex items-center sm:justify-end gap-1 mt-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>
                    You Save {currencySymbol}{currentPlan.savingsAmount.toLocaleString()} per year
                  </span>
                </div>
              </div>
            </div>

            {/* Included Annual Perks Grid */}
            <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                <Gift className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="font-bold text-slate-800">
                  {currentPlan.freeMonthsEquivalent} (~10 months billed)
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold text-slate-800">
                  Instant VIP Zero-Queue Lane
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">
                  +500 Bonus Welcome Credits
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-amber-200/60 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold text-slate-800">
                  100% Commercial Rights & 4K
                </span>
              </div>
            </div>

            {/* Interactive "Tap to Unlock Surprise Mystery Perk" */}
            <div className="mt-3 pt-3 border-t border-amber-200/60">
              {!isPerkRevealed ? (
                <button
                  type="button"
                  onClick={() => setIsPerkRevealed(true)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-100/50 border border-dashed border-amber-400 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <span>🎁 Tap to reveal your session surprise perk</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 rounded font-black">
                    CLICK ME
                  </span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center gap-2.5 animate-in slide-in-from-top-2">
                  <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-left">
                    <p className="font-black text-emerald-900 flex items-center gap-1">
                      <span>🎉 VIP SURPRISE GRANTED!</span>
                      <span className="text-[10px] bg-emerald-200 px-1 rounded font-black">
                        APPLIED
                      </span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      You unlocked <strong>Free Priority LoRA Tuning Sandbox</strong> + instant grandfathered renewal pricing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Proof Live Ticker */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>18 creators switched to Annual in the last hour</span>
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Activation</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 space-y-2.5">
            <button
              type="button"
              disabled={isClaiming}
              onClick={handleClaim}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{isClaiming ? 'Applying Annual Pass...' : `Claim ${currentPlan.badge} & Activate Annual Pass`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSwitchToAnnual();
                onClose();
              }}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
            >
              Switch pricing page to Annual view (Save 20%)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
