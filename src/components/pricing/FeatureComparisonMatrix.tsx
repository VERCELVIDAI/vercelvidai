'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Minus,
  Sparkles,
  Zap,
  Film,
  Video,
  Camera,
  Mic,
  Layers,
  ShieldCheck,
  Users,
  HardDrive,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface FeatureComparisonMatrixProps {
  billingInterval: 'month' | 'year';
  onSelectPlan: (planId: string) => void;
}

interface MatrixRow {
  name: string;
  tooltip?: string;
  starter: string | boolean;
  plus: string | boolean;
  ultra: string | boolean;
  teams: string | boolean;
}

interface MatrixCategory {
  title: string;
  icon: React.ReactNode;
  rows: MatrixRow[];
}

export function FeatureComparisonMatrix({
  billingInterval,
  onSelectPlan,
}: FeatureComparisonMatrixProps) {
  const router = useRouter();

  const categories: MatrixCategory[] = [
    {
      title: 'Credit Allowance & Output Capacity',
      icon: <Sparkles className="w-4 h-4 text-[#5145CD]" />,
      rows: [
        {
          name: 'Monthly Credits Included',
          tooltip: 'Credits used to generate videos, photos, and voice-overs.',
          starter: '500 Credits / mo',
          plus: '1,600 Credits / mo',
          ultra: '4,000 Credits / mo',
          teams: '10,000 Credits / mo (Pooled)',
        },
        {
          name: 'Unused Credit Rollover',
          tooltip: 'Unused credits roll over while your subscription remains active.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Estimated Video Ads (15 cr/ad)',
          tooltip: 'Calculated as monthly credits divided by 15 credits per standard video generation.',
          starter: '≈ 33 video ads / mo',
          plus: '≈ 106 video ads / mo',
          ultra: '≈ 266 video ads / mo',
          teams: '≈ 666 video ads / mo',
        },
        {
          name: 'Estimated Product Photos (5 cr/photo)',
          tooltip: 'Calculated as monthly credits divided by 5 credits per high-res product photo.',
          starter: '100 photos / mo',
          plus: '320 photos / mo',
          ultra: '800 photos / mo',
          teams: '2,000 photos / mo',
        },
        {
          name: 'Estimated Voiceovers (2 cr/audio)',
          tooltip: 'Calculated as monthly credits divided by 2 credits per voiceover synthesis.',
          starter: '250 voiceovers / mo',
          plus: '800 voiceovers / mo',
          ultra: '2,000 voiceovers / mo',
          teams: '5,000 voiceovers / mo',
        },
        {
          name: 'Top-Up Credit Pack Discount',
          tooltip: 'Discount applied when purchasing extra one-time credit packs.',
          starter: 'Standard rates',
          plus: '10% discount',
          ultra: '15% discount',
          teams: '20% discount',
        },
      ],
    },
    {
      title: 'Video Generation & Storyboarding',
      icon: <Film className="w-4 h-4 text-[#5145CD]" />,
      rows: [
        {
          name: 'Maximum Video Clip Duration',
          tooltip: 'The maximum duration of a single rendered scene before sequencing.',
          starter: '60 seconds',
          plus: '180 seconds (3 min)',
          ultra: '360 seconds (6 min)',
          teams: '600 seconds (10 min)',
        },
        {
          name: 'Export Resolution',
          tooltip: 'Highest supported rendering and export video resolution.',
          starter: '1080p Full HD',
          plus: '4K Ultra HD',
          ultra: '4K 60fps Cinema Master',
          teams: '4K 60fps Cinema Master',
        },
        {
          name: 'Watermark-Free Exports',
          tooltip: 'Clean exports without any Fluvia Flow branding or logos.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Multi-Scene Storyboard Editor',
          tooltip: 'Assemble multiple scenes sequentially in a unified visual timeline.',
          starter: '2 timeline tracks',
          plus: 'Unlimited tracks',
          ultra: 'Unlimited tracks + Director Mode',
          teams: 'Unlimited tracks + Team Sharing',
        },
        {
          name: 'Aspect Ratios (9:16, 16:9, 1:1, 4:5)',
          tooltip: 'Directly render reels, widescreen YouTube commercials, or feed ads.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
      ],
    },
    {
      title: 'Image & Voice Generation',
      icon: <Camera className="w-4 h-4 text-[#5145CD]" />,
      rows: [
        {
          name: 'High-Resolution Product Photography',
          tooltip: 'Render realistic studio product scenes from text or image reference.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Fal.ai Fast Media Generation',
          tooltip: 'Ultra-fast sub-second image synthesis engine.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'ElevenLabs Neural Multilingual Voice',
          tooltip: 'Professional AI narration synthesized directly into video timelines.',
          starter: 'Standard voices',
          plus: 'Multilingual neural',
          ultra: 'Multilingual neural + voice design',
          teams: 'Multilingual neural + voice design',
        },
        {
          name: 'Script-to-Timeline Voiceover Sync',
          tooltip: 'Automatically aligns generated voice clips with scene transitions.',
          starter: false,
          plus: true,
          ultra: true,
          teams: true,
        },
      ],
    },
    {
      title: 'Available AI Models & Engines',
      icon: <Zap className="w-4 h-4 text-[#5145CD]" />,
      rows: [
        {
          name: 'Fluvia Cinematic HD Video Engine',
          tooltip: 'Proprietary commercial ad video synthesis pipeline.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Runway Gen-3 Alpha & Luma Ray',
          tooltip: 'Advanced high-motion cinematic video models.',
          starter: false,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Gemini Omni Multi-Scene Storyboard',
          tooltip: 'Multi-scene creative storyboard engine with consistent product identities.',
          starter: false,
          plus: 'Standard access',
          ultra: 'Flagship + Beta early access',
          teams: 'Flagship + Beta early access',
        },
        {
          name: 'Curated Commercial Presets Library',
          tooltip: 'Full access to viral reels, product commercials and ad templates.',
          starter: 'Standard library',
          plus: 'Full library',
          ultra: 'Full library + VIP presets',
          teams: 'Full library + Agency presets',
        },
      ],
    },
    {
      title: 'Performance, Queue & Collaboration',
      icon: <Users className="w-4 h-4 text-[#5145CD]" />,
      rows: [
        {
          name: 'Parallel Generation Queue',
          tooltip: 'Number of creative render jobs that can process concurrently.',
          starter: '1 job at a time',
          plus: '2 concurrent jobs',
          ultra: '4 concurrent jobs',
          teams: '8 concurrent cluster jobs',
        },
        {
          name: 'GPU Queue Priority',
          tooltip: 'Speed and position in the hardware rendering cluster.',
          starter: 'Standard queue',
          plus: 'Priority queue',
          ultra: 'Dedicated VIP render lane',
          teams: 'Cluster priority lane',
        },
        {
          name: 'User Seats Included',
          tooltip: 'Separate team logins under a single billing subscription.',
          starter: '1 seat',
          plus: '1 seat',
          ultra: '1 seat',
          teams: 'Up to 10 seats included',
        },
        {
          name: 'Shared Team Workspace & Pooled Credits',
          tooltip: 'Share brand assets, storyboards, and credit pool across teammates.',
          starter: false,
          plus: false,
          ultra: false,
          teams: true,
        },
      ],
    },
    {
      title: 'Storage, Brand Kits & Licensing',
      icon: <HardDrive className="w-4 h-4 text-[#5145CD]" />,
      rows: [
        {
          name: 'Cloud Asset Storage',
          tooltip: 'Secure high-speed storage for uploaded assets and rendered media.',
          starter: '10 GB',
          plus: '50 GB',
          ultra: '150 GB',
          teams: '500 GB Shared',
        },
        {
          name: 'Brand Kits (Logos, Fonts, Colors)',
          tooltip: 'Saved brand guidelines automatically applied to ad creations.',
          starter: '2 Brand Kits',
          plus: '5 Brand Kits',
          ultra: '15 Brand Kits',
          teams: 'Unlimited Brand Kits',
        },
        {
          name: 'Full Commercial Usage Rights',
          tooltip: 'Full commercial rights to monetize, publish, or run paid ad campaigns.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Official GST Compliant Invoices',
          tooltip: 'Downloadable PDF tax invoices with full 18% GST itemization.',
          starter: true,
          plus: true,
          ultra: true,
          teams: true,
        },
        {
          name: 'Customer Support Level',
          tooltip: 'Direct access to technical assistance and creative production support.',
          starter: 'Community & standard email',
          plus: 'Priority email & chat',
          ultra: 'Expedited 2-hour SLA support',
          teams: 'Dedicated Account Director & 99.9% SLA',
        },
      ],
    },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <Check className="w-4 h-4 text-[#10B981] mx-auto" />
      ) : (
        <Minus className="w-4 h-4 text-[#667085]/40 mx-auto" />
      );
    }
    return <span className="text-xs font-semibold text-[#17191D]">{val}</span>;
  };

  return (
    <div className="w-full mt-16 sm:mt-24 pt-12 border-t border-[#E5E7EB] text-left">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD] bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#C7D2FE]">
          Detailed Plan Matrix
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] tracking-tight mt-3">
          Compare plans side-by-side.
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#667085]">
          A complete, transparent feature-by-feature breakdown of all four FLUVIA FLOW tiers.
        </p>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
        <table className="w-full min-w-[760px] border-collapse text-left">
          {/* Table Header: Sticky Plan Names & Quick CTAs */}
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F7F8FA]">
              <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-[#667085] w-2/5">
                Features & Entitlements
              </th>
              <th className="p-4 text-center w-[15%]">
                <span className="text-sm font-bold text-[#17191D] block">Starter</span>
                <span className="text-[11px] font-mono text-[#667085]">
                  {billingInterval === 'year' ? '₹799/mo' : '₹999/mo'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPlan('plan_starter')}
                  className="mt-2 w-full py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Choose Starter
                </button>
              </th>
              <th className="p-4 text-center w-[15%]">
                <span className="text-sm font-bold text-[#17191D] block">Plus</span>
                <span className="text-[11px] font-mono text-[#667085]">
                  {billingInterval === 'year' ? '₹1,999/mo' : '₹2,499/mo'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPlan('plan_creator')}
                  className="mt-2 w-full py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Choose Plus
                </button>
              </th>
              <th className="p-4 text-center w-[15%] bg-[#EEF2FF]/40 border-x border-[#5145CD]/20">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-bold text-[#5145CD] block">Ultra</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#5145CD] text-white">
                    Popular
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#5145CD] font-bold">
                  {billingInterval === 'year' ? '₹3,999/mo' : '₹4,999/mo'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPlan('plan_max')}
                  className="mt-2 w-full py-1.5 px-2 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white text-[11px] font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  Choose Ultra
                </button>
              </th>
              <th className="p-4 text-center w-[15%]">
                <span className="text-sm font-bold text-[#17191D] block">For Teams</span>
                <span className="text-[11px] font-mono text-[#667085]">
                  {billingInterval === 'year' ? '₹7,999/mo' : '₹9,999/mo'}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPlan('plan_business')}
                  className="mt-2 w-full py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Explore Teams
                </button>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {categories.map((cat, catIdx) => (
              <React.Fragment key={catIdx}>
                {/* Category Header Row */}
                <tr className="bg-[#F7F8FA] border-t border-b border-[#E5E7EB]">
                  <td
                    colSpan={5}
                    className="py-3 px-4 sm:px-5 text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-2"
                  >
                    {cat.icon}
                    <span>{cat.title}</span>
                  </td>
                </tr>

                {/* Rows inside Category */}
                {cat.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b border-[#F1F3F5] hover:bg-[#F7F8FA]/60 transition-colors"
                  >
                    <td className="p-3.5 sm:p-4 text-xs font-medium text-[#17191D]">
                      <div className="flex items-center gap-1.5">
                        <span>{row.name}</span>
                        {row.tooltip && (
                          <span
                            className="text-[#667085] hover:text-[#5145CD] cursor-help"
                            title={row.tooltip}
                          >
                            <HelpCircle className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-center">{renderValue(row.starter)}</td>
                    <td className="p-3.5 text-center">{renderValue(row.plus)}</td>
                    <td className="p-3.5 text-center bg-[#EEF2FF]/20 border-x border-[#5145CD]/10">
                      {renderValue(row.ultra)}
                    </td>
                    <td className="p-3.5 text-center">{renderValue(row.teams)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
