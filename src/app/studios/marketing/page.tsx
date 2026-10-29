'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { BRAND } from '@/lib/brand';
import {
  Megaphone,
  Sparkles,
  ShoppingBag,
  Target,
  Share2,
  Layers,
  ArrowRight,
  Zap,
  Play,
  CheckCircle2,
  TrendingUp,
  FileText,
  Copy,
  Sliders,
} from 'lucide-react';

const MARKETING_PRESETS = [
  { id: 'commercial', title: 'Product Commercial', desc: 'High-polish luxury cinematic reveal with macro close-ups' },
  { id: 'ugc', title: 'UGC-Style Ad', desc: 'Authentic creator problem-solution hook and real testimonial tone' },
  { id: 'showcase', title: 'Feature Showcase', desc: 'Fast kinetic breakdown of top 3 product benefits' },
  { id: 'unboxing', title: 'Unboxing Teaser', desc: 'Tactile packaging reveal, tactile textures and first impression' },
  { id: 'social_promo', title: 'Viral Social Promo', desc: 'High-energy hook within first 2 seconds, punchy rhythm' },
  { id: 'brand_story', title: 'Founder & Brand Story', desc: 'Emotional narrative explaining origin and mission' },
];

export default function MarketingStudioPage() {
  const router = useRouter();
  const [authData, setAuthData] = useState<any>(null);

  // Form State
  const [productName, setProductName] = useState('Aura Lumina');
  const [productDescription, setProductDescription] = useState('An intelligent ambient light therapy lamp with circadian rhythm syncing, crafted from brushed titanium and hand-blown glass.');
  const [productUrl, setProductUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState('Design-conscious remote workers, wellness enthusiasts, high-income professionals');
  const [platform, setPlatform] = useState<'reels' | 'youtube' | 'commercial'>('reels');
  const [selectedPreset, setSelectedPreset] = useState('commercial');
  const [brandColor, setBrandColor] = useState('#10B981');

  // Copilot Result
  const [isLoading, setIsLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState<any>(null);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login?returnUrl=/studios/marketing');
        else setAuthData(d);
      });
  }, [router]);

  // Generate with Gemini Marketing Copilot
  const handleGenerateCampaign = async () => {
    if (!productName.trim() || !productDescription.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'marketing-copilot',
          productName,
          productDescription,
          platform,
          targetAudience,
          tone: selectedPreset,
        }),
      });

      const data = await res.json();
      if (data.campaign) {
        setCampaignResult(data.campaign);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchProduction = () => {
    const activeHook = campaignResult?.hookAngles?.[selectedHookIndex] || `Meet ${productName}`;
    try {
      localStorage.setItem(
        'fluvia_pending_prompt',
        JSON.stringify({
          prompt: `Commercial for ${productName}: ${activeHook}. ${productDescription}. High production luxury aesthetic, 35mm anamorphic, studio lighting.`,
          mode: 'video',
          aspectRatio: platform === 'reels' ? '9:16' : '16:9',
          modelId: 'fluvia-cinematic-v1',
        })
      );
    } catch (e) {}

    router.push(`/create?mode=video&aspectRatio=${platform === 'reels' ? '9:16' : '16:9'}`);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#F7F8FA] text-[#17191D]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F8FA]">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-[#5145CD]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#17191D] uppercase">Marketing Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] font-bold font-mono">
                  Brand & Ecommerce
                </span>
              </div>
              <p className="text-[11px] text-[#667085]">High-converting video ads, UGC hooks & multi-platform briefs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#5145CD] bg-[#EEF2FF] px-3 py-1.5 rounded-lg border border-[#E0E7FF] font-bold">
              Gemini Marketing Copilot Active
            </span>
          </div>
        </div>

        {/* Studio Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Controls Column (Left) */}
          <div className="w-[480px] border-r border-[#E5E7EB] flex flex-col bg-white overflow-y-auto p-6 space-y-5 text-left">
            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D]">Campaign Workflow Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {MARKETING_PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EEF2FF] border-[#5145CD] text-[#5145CD] font-bold shadow-2xs'
                          : 'bg-[#F7F8FA] border-[#E5E7EB] text-[#667085] hover:bg-[#F1F3F5] hover:text-[#17191D]'
                      }`}
                    >
                      <span className="text-xs font-bold block text-[#17191D]">{preset.title}</span>
                      <span className="text-[10px] text-[#667085] mt-0.5 line-clamp-1 block font-medium">{preset.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Details Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#5145CD]" />
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#17191D] placeholder-[#667085]/60 focus:outline-none focus:border-[#5145CD] focus:bg-white"
                  placeholder="e.g. Lumina Wireless Earbuds"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#17191D]">Key Features & Value Proposition</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-3 text-xs text-[#17191D] placeholder-[#667085]/60 focus:outline-none focus:border-[#5145CD] focus:bg-white resize-none font-mono leading-relaxed"
                  placeholder="What makes this product exceptional? Key benefits, materials, emotional appeal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-[#5145CD]" />
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#17191D] focus:outline-none focus:border-[#5145CD] cursor-pointer"
                  >
                    <option value="reels">TikTok / IG Reels (9:16)</option>
                    <option value="youtube">YouTube / Web (16:9)</option>
                    <option value="commercial">Broadcast Commercial (16:9)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#5145CD]" />
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3 py-1.5 shadow-2xs">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-6 h-6 rounded bg-transparent cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono text-[#17191D] font-bold">{brandColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#17191D]">Target Audience Profile</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs text-[#17191D] placeholder-[#667085]/60 focus:outline-none focus:border-[#5145CD] focus:bg-white"
                />
              </div>
            </div>

            {/* Launch Copilot Generation */}
            <div className="pt-2">
              <button
                onClick={handleGenerateCampaign}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Synthesizing Campaign Strategy...' : 'Generate Campaign Brief with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Campaign Strategy Output (Right) */}
          <div className="flex-1 bg-[#F7F8FA] p-8 overflow-y-auto text-left">
            {campaignResult ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5145CD] tracking-wider font-mono">AI Marketing Brief</span>
                    <h2 className="text-xl font-bold text-[#17191D] mt-1">{campaignResult.campaignTitle || `${productName} Campaign`}</h2>
                    <p className="text-xs text-[#667085] mt-1 max-w-xl">{campaignResult.targetAudienceAnalysis}</p>
                  </div>
                  <button
                    onClick={handleLaunchProduction}
                    className="px-5 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Launch AI Video Production</span>
                  </button>
                </div>

                {/* 3 High-Converting Hook Angles */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#5145CD]" />
                    Tested Hook Angles (Select to Apply)
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(campaignResult.hookAngles || [
                      `Tired of ordinary lighting? Meet ${productName}.`,
                      `The 2-minute upgrade top creators swear by.`,
                      `Why everyone is ditching standard lamps this year.`,
                    ]).map((hook: string, idx: number) => {
                      const isSelected = selectedHookIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedHookIndex(idx)}
                          className={`p-4 rounded-xl border text-left transition-all relative cursor-pointer ${
                            isSelected
                              ? 'bg-[#EEF2FF] border-[#5145CD] text-[#17191D] ring-1 ring-[#5145CD]/30 shadow-xs'
                              : 'bg-white border-[#E5E7EB] text-[#667085] hover:bg-[#F1F3F5]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-[#5145CD] font-bold">HOOK #{idx + 1}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#5145CD]" />}
                          </div>
                          <p className="text-xs font-bold leading-relaxed text-[#17191D]">&quot;{hook}&quot;</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Script & Voiceover Direction */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#5145CD]" />
                      Narration & Voiceover Script
                    </h3>
                    <span className="text-[11px] font-mono text-[#667085] font-medium">Duration: ~15 seconds</span>
                  </div>
                  <p className="text-sm text-[#17191D] leading-relaxed font-mono bg-[#F7F8FA] p-4 rounded-xl border border-[#E5E7EB]">
                    {campaignResult.primaryScript}
                  </p>
                </div>

                {/* Storyboard Visual Breakdown */}
                {campaignResult.storyboard && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#5145CD]" />
                      Commercial Storyboard Breakdown
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {campaignResult.storyboard.scenes.map((scene: any, sIdx: number) => (
                        <div key={sIdx} className="p-4 rounded-xl bg-white border border-[#E5E7EB] space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#667085] font-semibold">
                            <span className="font-bold text-[#5145CD]">SHOT {scene.sceneNumber || sIdx + 1}</span>
                            <span>{scene.cameraDirection}</span>
                          </div>
                          <p className="text-xs text-[#17191D] font-bold line-clamp-3">{scene.visualPrompt}</p>
                          <div className="pt-2 border-t border-[#E5E7EB] text-[10px] text-[#667085] italic">
                            &quot;{scene.narration}&quot;
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty / Getting Started State */
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center shadow-2xs">
                  <Megaphone className="w-8 h-8 text-[#5145CD]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#17191D]">Turn Products into High-Converting Video Ads</h3>
                  <p className="text-xs text-[#667085] mt-2 leading-relaxed">
                    Fill in your product details on the left and click Generate. Fluvia Flow's Gemini Copilot will instantly produce viral hooks, campaign scripts, and visual storyboards.
                  </p>
                </div>
                <button
                  onClick={handleGenerateCampaign}
                  className="px-5 py-2.5 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] hover:bg-[#E0E7FF] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  Generate Sample Campaign for {productName}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
