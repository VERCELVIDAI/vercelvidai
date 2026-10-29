'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Sparkles, Copy, Check, ArrowRight, X, ShieldCheck, Tag } from 'lucide-react';

interface FirstCampaignModalProps {
  forceOpen?: boolean;
  onDismiss?: () => void;
}

export function FirstCampaignModal({ forceOpen = false, onDismiss }: FirstCampaignModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [copied, setCopied] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      triggerConfetti();
      return;
    }

    // Check backend eligibility on mount
    fetch('/api/user/first-coupon')
      .then((res) => (res.ok ? res.json() : { eligible: false }))
      .then((data) => {
        if (data?.eligible) {
          setIsOpen(true);
          triggerConfetti();
        }
      })
      .catch(() => {});
  }, [forceOpen]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#5145CD', '#4F46E5', '#818CF8', '#10B981'],
        disableForReducedMotion: true,
      });
    } catch {
      // Graceful fallback if canvas-confetti is unavailable
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('FIRST20');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
    }
  };

  const handleDismiss = async () => {
    setIsDismissing(true);
    try {
      await fetch('/api/user/first-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      });
    } catch {}
    setIsOpen(false);
    setIsDismissing(false);
    onDismiss?.();
  };

  const handleExplorePlan = () => {
    handleDismiss();
    router.push('/checkout?plan=plan_max&coupon=FIRST20');
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17191D]/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#FFFFFF] border border-[#E5E7EB] shadow-2xl p-6 sm:p-7 text-[#17191D] space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close / Dismiss Icon Button */}
        <button
          type="button"
          onClick={handleDismiss}
          disabled={isDismissing}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] transition-colors focus-indigo"
          aria-label="Close promotion modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] text-[11px] font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>New Creator Welcome Gift</span>
          </div>

          <h3
            id="promo-modal-title"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#17191D] leading-snug"
          >
            A little something for your first campaign.
          </h3>
          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Kickstart your AI advertising workflow with an exclusive introductory discount on our flagship creative tier.
          </p>
        </div>

        {/* Coupon Card Container */}
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F8FA] p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                Exclusive Voucher
              </span>
              <div className="text-2xl font-black text-[#5145CD] tracking-tight">
                ₹570 OFF
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#17191D] px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#E5E7EB] shadow-xs">
              <Tag className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Valid on FLUVIA MAX only</span>
            </span>
          </div>

          {/* Copy Code Interactive Pill */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FFFFFF] border border-[#E5E7EB]">
            <div className="flex items-center gap-2 pl-2">
              <span className="text-xs text-[#667085] font-mono">Code:</span>
              <code className="text-sm font-mono font-bold tracking-widest text-[#17191D] select-all">
                FIRST20
              </code>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-[#5145CD] text-white hover:bg-[#4338CA]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#667085]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Automatic pre-tax deduction verified server-side at checkout.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExplorePlan}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer focus-indigo"
          >
            <span>Explore FLUVIA MAX</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-transparent hover:bg-[#F7F8FA] text-[#667085] hover:text-[#17191D] font-medium text-xs transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
