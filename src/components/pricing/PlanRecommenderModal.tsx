'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Users,
  Video,
  Zap,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface PlanRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  billingInterval: 'month' | 'year';
}

export function PlanRecommenderModal({
  isOpen,
  onClose,
  billingInterval,
}: PlanRecommenderModalProps) {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [teamSize, setTeamSize] = useState<'solo' | 'small' | 'large'>('solo');
  const [volume, setVolume] = useState<'light' | 'medium' | 'heavy' | 'enterprise'>('medium');
  const [priority, setPriority] = useState<'budget' | 'quality' | 'speed' | 'collab'>('quality');

  if (!isOpen) return null;

  // Compute recommendation
  let recommendedPlan = {
    id: 'plan_creator',
    name: 'Plus',
    fullName: 'Fluvia Plus',
    price: billingInterval === 'year' ? 1999 : 2499,
    credits: 1600,
    headline: 'Best match for regular commercial video pipelines.',
    reasons: [
      '1,600 monthly credits (≈ 106 video ads or 320 product photos)',
      '4K Ultra HD video exports with priority GPU queue',
      'Multi-scene timeline storyboard editor & ElevenLabs voiceover sync',
    ],
    couponEligible: false,
  };

  if (teamSize === 'large' || priority === 'collab' || volume === 'enterprise') {
    recommendedPlan = {
      id: 'plan_business',
      name: 'For Teams',
      fullName: 'Fluvia Teams',
      price: billingInterval === 'year' ? 7999 : 9999,
      credits: 10000,
      headline: 'Best match for multi-seat collaboration & pooled agency workflows.',
      reasons: [
        '10,000 monthly pooled credits across up to 10 member seats',
        'Shared credit wallet, brand asset pool & team templates',
        'Concurrent GPU cluster rendering & custom GST billing with SLA',
      ],
      couponEligible: false,
    };
  } else if (volume === 'heavy' || priority === 'speed') {
    recommendedPlan = {
      id: 'plan_max',
      name: 'Ultra',
      fullName: 'Fluvia Ultra (Most Popular)',
      price: billingInterval === 'year' ? 3999 : 4999,
      credits: 4000,
      headline: 'Best match for high-volume commercial production & maximum GPU speed.',
      reasons: [
        '4,000 monthly credits (≈ 266 video ads or 800 product photos)',
        '4K 60fps Cinema Master exports & dedicated VIP priority GPU lane',
        'Eligible for ₹570 OFF with welcome coupon FIRST20',
      ],
      couponEligible: true,
    };
  } else if (volume === 'light' || priority === 'budget') {
    recommendedPlan = {
      id: 'plan_starter',
      name: 'Starter',
      fullName: 'Fluvia Starter',
      price: billingInterval === 'year' ? 799 : 999,
      credits: 500,
      headline: 'Best match for solo creators and low-volume initial campaigns.',
      reasons: [
        '500 monthly credits (≈ 33 video ads or 100 product photos)',
        '1080p Full HD video exports with commercial advertising rights',
        'Economical entry tier with full rollover on active subscriptions',
      ],
      couponEligible: false,
    };
  }

  const handleChoosePlan = () => {
    const couponParam = recommendedPlan.id === 'plan_max' ? '&coupon=FIRST20' : '';
    onClose();
    router.push(
      `/checkout?type=subscription&id=${recommendedPlan.id}&interval=${billingInterval}${couponParam}`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 text-[#17191D] text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#17191D]">Plan Recommender</h3>
              <p className="text-xs text-[#667085]">
                Answer 3 quick questions to discover the ideal plan for your creative volume.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#667085] hover:text-[#17191D] hover:bg-[#F7F8FA] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Steps */}
        <div className="py-6 space-y-6">
          {/* Question 1: Team Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#17191D] mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>1. Who will be using the workspace?</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'solo', label: 'Solo Creator', desc: '1 individual' },
                { id: 'small', label: 'Small Team', desc: '2–5 members' },
                { id: 'large', label: 'Agency / Brand', desc: '6+ members' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTeamSize(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    teamSize === opt.id
                      ? 'border-[#5145CD] bg-[#EEF2FF] ring-1 ring-[#5145CD]'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-[#17191D]">{opt.label}</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Monthly Output */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#17191D] mb-2 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>2. Estimated monthly ad volume</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'light', label: '< 25 ads', sub: 'Starter scope' },
                { id: 'medium', label: '25–100 ads', sub: 'Plus scope' },
                { id: 'heavy', label: '100–250 ads', sub: 'Ultra scope' },
                { id: 'enterprise', label: '250+ ads', sub: 'Team scope' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setVolume(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    volume === opt.id
                      ? 'border-[#5145CD] bg-[#EEF2FF] ring-1 ring-[#5145CD]'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-[#17191D]">{opt.label}</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Priority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#17191D] mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>3. Primary workflow priority</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'budget', label: 'Cost Efficiency', sub: 'Lowest price entry point' },
                { id: 'quality', label: '4K Quality & Storyboard', sub: 'Balance of power and price' },
                { id: 'speed', label: 'VIP GPU Render Speed', sub: 'Fastest turnarounds in 4K 60fps' },
                { id: 'collab', label: 'Team Seats & Shared Wallet', sub: 'Multi-user collaborative billing' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriority(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    priority === opt.id
                      ? 'border-[#5145CD] bg-[#EEF2FF] ring-1 ring-[#5145CD]'
                      : 'border-[#E5E7EB] hover:border-[#D1D5DB] bg-white'
                  }`}
                >
                  <p className="text-xs font-bold text-[#17191D]">{opt.label}</p>
                  <p className="text-[10px] text-[#667085] mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculated Recommendation Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded-full border border-[#C7D2FE]">
              Recommended Plan
            </span>
            <div className="text-right">
              <span className="text-lg font-extrabold text-[#17191D] font-mono">
                ₹{recommendedPlan.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#667085]">
                /mo {billingInterval === 'year' ? '(annual billing)' : '(monthly)'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold text-[#17191D]">{recommendedPlan.fullName}</h4>
            <p className="text-xs text-[#667085] mt-0.5">{recommendedPlan.headline}</p>
          </div>

          <ul className="space-y-1.5 text-xs text-[#17191D] pt-1">
            {recommendedPlan.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#17191D] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleChoosePlan}
            className="px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Proceed with {recommendedPlan.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
