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
  const [brandColor, setBrandColor] = useState('#8B5CF6');

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
    <div className="flex h-screen bg-[#07080C] text-zinc-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-white/[0.08] bg-[#0A0C13]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
              <div className="w-full h-full bg-[#090A10] rounded-[7px] flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white uppercase">Marketing Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                  Brand & Ecommerce
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">High-converting video ads, UGC hooks & multi-platform briefs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
              Gemini Marketing Copilot Active
            </span>
          </div>
        </div>

        {/* Studio Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Controls Column (Left) */}
          <div className="w-[480px] border-r border-white/[0.08] flex flex-col bg-[#0A0C13]/50 overflow-y-auto p-6 space-y-5">
            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">Campaign Workflow Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {MARKETING_PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                          : 'bg-[#11131C] border-white/[0.06] text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-bold block">{preset.title}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1 block">{preset.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Details Form */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                  placeholder="e.g. Lumina Wireless Earbuds"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Key Features & Value Proposition</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 resize-none font-mono leading-relaxed"
                  placeholder="What makes this product exceptional? Key benefits, materials, emotional appeal..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-violet-400" />
                    Target Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="reels">TikTok / IG Reels (9:16)</option>
                    <option value="youtube">YouTube / Web (16:9)</option>
                    <option value="commercial">Broadcast Commercial (16:9)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1">
                    <Target className="w-3 h-3 text-cyan-400" />
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2 bg-[#11131C] border border-white/[0.1] rounded-xl px-3 py-1.5">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-6 h-6 rounded bg-transparent cursor-pointer border-0"
                    />
                    <span className="text-xs font-mono text-zinc-300">{brandColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Target Audience Profile</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Launch Copilot Generation */}
            <div className="pt-2">
              <button
                onClick={handleGenerateCampaign}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Synthesizing Campaign Strategy...' : 'Generate Campaign Brief with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Campaign Strategy Output (Right) */}
          <div className="flex-1 bg-[#06070A] p-8 overflow-y-auto">
            {campaignResult ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-violet-950/20 to-transparent border border-indigo-500/20">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">AI Marketing Brief</span>
                    <h2 className="text-xl font-bold text-white mt-1">{campaignResult.campaignTitle || `${productName} Campaign`}</h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">{campaignResult.targetAudienceAnalysis}</p>
                  </div>
                  <button
                    onClick={handleLaunchProduction}
                    className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <Zap className="w-4 h-4 fill-black" />
                    <span>Launch AI Video Production</span>
                  </button>
                </div>

                {/* 3 High-Converting Hook Angles */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
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
                          className={`p-4 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                              : 'bg-[#0E101A] border-white/[0.08] text-zinc-300 hover:border-white/[0.2]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">HOOK #{idx + 1}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <p className="text-xs font-semibold leading-relaxed">"{hook}"</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Script & Voiceover Direction */}
                <div className="p-6 rounded-2xl bg-[#0E101A] border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-violet-400" />
                      Narration & Voiceover Script
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-500">Duration: ~15 seconds</span>
                  </div>
                  <p className="text-sm text-zinc-200 leading-relaxed font-mono bg-black/40 p-4 rounded-xl border border-white/[0.04]">
                    {campaignResult.primaryScript}
                  </p>
                </div>

                {/* Storyboard Visual Breakdown */}
                {campaignResult.storyboard && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      Commercial Storyboard Breakdown
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {campaignResult.storyboard.scenes.map((scene: any, sIdx: number) => (
                        <div key={sIdx} className="p-4 rounded-xl bg-[#0E101A] border border-white/[0.08] space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                            <span className="font-bold text-violet-400">SHOT {scene.sceneNumber || sIdx + 1}</span>
                            <span>{scene.cameraDirection}</span>
                          </div>
                          <p className="text-xs text-zinc-200 font-medium line-clamp-3">{scene.visualPrompt}</p>
                          <div className="pt-2 border-t border-white/[0.05] text-[10px] text-zinc-500 italic">
                            "{scene.narration}"
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
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Megaphone className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Turn Products into High-Converting Video Ads</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Fill in your product details on the left and click Generate. Fluvia Flow's Gemini Copilot will instantly produce viral hooks, campaign scripts, and visual storyboards.
                  </p>
                </div>
                <button
                  onClick={handleGenerateCampaign}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all"
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
