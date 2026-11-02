'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Gift,
  Sparkles,
  Check,
  Copy,
  ArrowRight,
  X,
  Zap,
  Tag,
  Star,
} from 'lucide-react';

interface AnimatedDiscountGiftBoxProps {
  onApplyCoupon?: (code: string) => void;
  billingInterval?: 'month' | 'year';
  isDark?: boolean;
}

export function AnimatedDiscountGiftBox({
  onApplyCoupon,
  billingInterval = 'year',
}: AnimatedDiscountGiftBoxProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const couponCode = 'FIRST20';
  const discountAmount = '₹570';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  const handleClaimDiscount = () => {
    if (onApplyCoupon) {
      onApplyCoupon(couponCode);
    }
    setIsOpen(false);
    router.push(
      `/checkout?type=subscription&id=plan_max&interval=${billingInterval}&coupon=${couponCode}`
    );
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. INTERACTIVE ANIMATED GIFT BOX BANNER (ABOVE PRICING CARDS) */}
      {/* ========================================================================= */}
      <div className="relative mx-auto max-w-4xl mb-8 group">
        {/* Subtle Ambient Indigo/Violet Glow behind the banner */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5145CD]/20 via-[#7C3AED]/20 to-[#5145CD]/20 rounded-2xl blur-sm opacity-50 group-hover:opacity-80 transition duration-500" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl transition-all shadow-sm bg-white/95 backdrop-blur-md border border-[#E5E7EB] hover:border-[#5145CD]/40 text-[#17191D]">
          {/* Left: Animated 3D/SVG Gift Icon with Particles */}
          <div className="flex items-center gap-3.5 text-left">
            {/* Animated Bouncy Gift Container */}
            <div
              onClick={() => setIsOpen(true)}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5145CD] via-[#6366F1] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-indigo-500/25 cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 group/gift"
              title="Click to unwrap your welcome gift!"
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover/gift:opacity-100 transition-opacity" />

              {/* Bouncing Gift Icon */}
              <Gift className="w-6 h-6 animate-bounce text-white drop-shadow-sm" />

              {/* Floating Sparkle Particles */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]">
                  🎁 Unlocked Welcome Gift
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>Instant ₹570 Discount</span>
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold mt-0.5 text-[#17191D]">
                New Creator Special Voucher: <span className="text-[#5145CD] font-mono font-black">FIRST20</span>
              </h4>
              <p className="text-xs text-[#667085]">
                Get a flat ₹570 off exclusively on the <strong className="text-[#17191D]">Ultra Plan</strong>. Tap the gift box to reveal and claim.
              </p>
            </div>
          </div>

          {/* Right Action: Open Gift / Copy Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-98 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Unwrap Gift Box</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CELEBRATION UNBOXING MODAL (WHEN GIFT IS CLICKED) */}
      {/* ========================================================================= */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white shadow-2xl p-6 sm:p-8 text-center overflow-hidden animate-in zoom-in-95 duration-200 text-[#17191D]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient background soft glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-100/60 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-100/60 blur-2xl pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#667085] hover:text-[#17191D] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Floating Animated 3D Gift Box Graphic */}
            <div className="relative mx-auto w-20 h-20 mb-4 flex items-center justify-center">
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#5145CD] to-[#7C3AED] blur-md opacity-30 animate-pulse" />

              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#5145CD] via-[#6366F1] to-[#7C3AED] flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                <Gift className="w-10 h-10 animate-bounce text-white drop-shadow-md" />
              </div>

              {/* Floating Stars / Sparkles */}
              <span className="absolute -top-2 -left-2 text-amber-400 animate-spin">
                <Star className="w-5 h-5 fill-current" />
              </span>
              <span className="absolute -bottom-1 -right-2 text-indigo-400 animate-ping">
                <Sparkles className="w-4 h-4" />
              </span>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider inline-block mb-2 bg-[#EEF2FF] text-[#5145CD] border border-[#C7D2FE]">
              🎉 Congratulations! Welcome Reward
            </span>

            <h3 className="text-2xl font-black tracking-tight text-[#17191D]">
              You Unlocked <span className="text-[#5145CD]">₹570 Instant Discount</span>!
            </h3>

            <p className="text-xs mt-2 leading-relaxed max-w-sm mx-auto text-[#667085]">
              Your welcome voucher gives you a verified flat <strong>₹570 OFF</strong> on the flagship <strong>FLUVIA MAX (Ultra) Plan</strong>.
            </p>

            {/* Voucher Coupon Box */}
            <div className="mt-5 p-4 rounded-2xl border-2 border-dashed border-[#C7D2FE] bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-indigo-50/70 flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-[#667085]">
                  Promo Voucher Code
                </span>
                <span className="text-xl font-black font-mono tracking-wider text-[#17191D]">
                  {couponCode}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 bg-white hover:bg-slate-50 border border-[#C7D2FE] text-[#5145CD]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Key Benefits */}
            <div className="mt-4 text-left p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] text-xs space-y-2 text-[#17191D]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Applies immediately at checkout on Ultra Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Combines with 20% annual billing savings</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Instant 4,000 monthly generation credits + VIP GPU lane</span>
              </div>
            </div>

            {/* Direct Claim Button */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={handleClaimDiscount}
                className="w-full py-3 px-5 rounded-2xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-sm font-extrabold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Claim ₹570 OFF & Get Ultra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-[#667085]">
                Verified server-side via PayU India gateway. Valid for eligible new creators.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
