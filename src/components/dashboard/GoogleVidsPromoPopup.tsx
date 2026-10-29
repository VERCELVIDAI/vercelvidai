'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Sparkles,
  ArrowRight,
  Play,
  Video,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Flame,
} from 'lucide-react';

export interface CoolVidsTemplate {
  id: string;
  title: string;
  category: string;
  badge: string;
  aspect: string;
  emoji: string;
  prompt: string;
  thumbnail: string;
  duration: string;
}

export const COOL_GOOGLE_VIDS_TEMPLATES: CoolVidsTemplate[] = [
  {
    id: 'tmpl_05',
    title: 'AeroGT Hypercar Launch Film',
    category: 'Cinematic Automotive',
    badge: 'Trending Auto',
    aspect: '16:9',
    emoji: '🏎️',
    thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80',
    duration: '15s',
    prompt: 'Hyper-realistic commercial launch film of an aerodynamic concept hypercar in a wind tunnel, laser grid reflections, smoke trails over carbon fiber bodywork, glowing carbon-ceramic brakes, anamorphic lens flares, ultra-smooth tracking shot, photorealistic 8k 60fps.',
  },
  {
    id: 'tmpl_01',
    title: 'Ultra-Luxury Midnight Chronograph',
    category: 'Luxury Commercial',
    badge: '4K Commercial',
    aspect: '9:16',
    emoji: '⌚',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    duration: '15s',
    prompt: 'Ultra-luxury watch commercial, seamless macro camera sweep across a brushed titanium bezel and obsidian skeleton dial. Floating chronograph hands, sapphire crystal reflection, dramatic volumetric rim lighting, micro mechanical gear movement, photorealistic 8k render.',
  },
  {
    id: 'tmpl_14',
    title: 'Neon Shibuya Cyberpunk Night Drive',
    category: 'Social Media Reel',
    badge: 'Viral Reel',
    aspect: '9:16',
    emoji: '⚡',
    thumbnail: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80',
    duration: '15s',
    prompt: 'Cinematic first-person perspective night drive through rain-slicked neon Shibuya streets. Hyper-reflective puddles, towering holographic billboards, purple-teal neon trails, ultra-smooth motion blur, cinematic color grade, 4k 60fps.',
  },
  {
    id: 'tmpl_20',
    title: 'AI Agent Swarm & Autonomous Orchestrator',
    category: 'Technology & SaaS',
    badge: 'SaaS Explainer',
    aspect: '16:9',
    emoji: '🤖',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    duration: '15s',
    prompt: 'Futuristic corporate visual of multi-agent autonomous AI swarm executing coordinated data operations. Glowing holographic network nodes pulsing with emerald-teal light, data pipelines morphing into animated bar charts, executive control dashboard floating in dark glass workspace, photorealistic UI 8k.',
  },
  {
    id: 'tmpl_03',
    title: 'Bio-Cellular Micro-Hydration Serum',
    category: 'Skincare & Beauty',
    badge: 'Beauty Glow',
    aspect: '9:16',
    emoji: '🧴',
    thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    duration: '15s',
    prompt: 'High-end skincare beauty commercial, macro slow-motion droplet of golden hydration serum falling onto a frosted glass podium. Floating water molecules, iridescent botanical refraction, soft natural sunlight, luxury cosmetic aesthetic, 4k 60fps.',
  },
  {
    id: 'tmpl_07',
    title: 'Torched Wagyu A5 Culinary Mastery',
    category: 'Food & Beverage',
    badge: 'Gourmet 4K',
    aspect: '9:16',
    emoji: '🥩',
    thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    duration: '15s',
    prompt: 'Gourmet culinary commercial, macro close-up of an A5 Japanese Wagyu steak being torched with an intense blue-orange blowtorch flame. Sizzling rendered marbling, rising aromatic smoke, sea salt crystals catching ambient warm candlelight, golden-brown crust sear, 4k 60fps.',
  },
];

export function GoogleVidsPromoPopup() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CoolVidsTemplate>(COOL_GOOGLE_VIDS_TEMPLATES[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-google-vids-popup', handleOpen);
    return () => window.removeEventListener('open-google-vids-popup', handleOpen);
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('fluvia_hide_google_vids_promo', 'true');
      } catch (e) {}
    }
    setIsOpen(false);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleLaunchGoogleVids = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => {
      window.open('https://workspace.google.com/products/vids/', '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const handleNavigateToStudio = (_source: string, templateId?: string) => {
    setIsOpen(false);
    if (templateId) {
      router.push(`/create?source=google-vids-promo&templateId=${templateId}`);
    } else {
      router.push('/create?source=google-vids-promo');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-vids-promo-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-[#E5E7EB] p-5 sm:p-7 shadow-2xl text-left text-[#17191D] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close promotion dialog"
          className="absolute right-4 top-4 p-2 rounded-full text-[#667085] hover:text-[#17191D] hover:bg-slate-100 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Artwork Banner */}
        <div className="relative aspect-[24/9] sm:aspect-[28/9] w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] p-4 sm:p-5 flex flex-col justify-between mb-5 border border-[#5145CD]/20 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] text-[#5145CD] font-mono">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
              GOOGLE VIDS WORKFLOW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white text-[#5145CD] border border-[#5145CD]/30 text-[10px] font-bold shadow-2xs">
              15 Credits / Video
            </span>
          </div>

          <div className="flex items-center gap-3 my-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-[#5145CD]/30 flex items-center justify-center text-[#5145CD] shadow-xs">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#5145CD] translate-x-0.5" />
            </div>
            <div>
              <div className="text-[#17191D] font-bold text-sm sm:text-base">AI Video Creative Engine</div>
              <div className="text-[#667085] text-xs font-mono">Powered by Google Gemini Omni Flash</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#667085] font-mono border-t border-[#5145CD]/20 pt-2">
            <span>Direct In-App Creation</span>
            <span className="text-[#5145CD] font-semibold">1080p & 4K Export Ready</span>
          </div>
        </div>

        {/* Main Header Copy */}
        <div className="space-y-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-[#5145CD] text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Feature Spotlight</span>
          </div>

          <h2 id="google-vids-promo-title" className="text-xl sm:text-2xl font-bold text-[#17191D] tracking-tight">
            Meet Google Vids in Fluvia Flow
          </h2>

          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Turn your ideas into videos with a simple prompt. Choose from cool production templates below or craft your own prompt to create right here or in Google Vids Workspace.
          </p>
        </div>

        {/* COOL TEMPLATES SHOWCASE SECTION */}
        <div className="mb-5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#5145CD]" />
              <h3 className="font-bold text-xs sm:text-sm text-[#17191D] uppercase tracking-wider">
                Curated Video Templates
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#5145CD] bg-[#EEF2FF] border border-[#5145CD]/30 px-2 py-0.5 rounded-full font-semibold">
              6 Curated Starters
            </span>
          </div>

          {/* Quick Selectable Template Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {COOL_GOOGLE_VIDS_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate.id === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white text-[#17191D] border-[#5145CD] shadow-xs ring-2 ring-[#5145CD]/20'
                      : 'bg-white hover:bg-slate-50 text-[#667085] border-[#E5E7EB]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{tmpl.emoji}</span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#EEF2FF] text-[#5145CD]'
                          : 'bg-[#F7F8FA] text-[#667085]'
                      }`}
                    >
                      {tmpl.aspect}
                    </span>
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-semibold line-clamp-1 leading-snug ${
                        isSelected ? 'text-[#17191D]' : 'text-slate-700'
                      }`}
                    >
                      {tmpl.title}
                    </h4>
                    <p
                      className={`text-[10px] line-clamp-1 mt-0.5 ${
                        isSelected ? 'text-[#5145CD] font-medium' : 'text-[#667085]'
                      }`}
                    >
                      {tmpl.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Template Details Box */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E5E7EB] space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedTemplate.emoji}</span>
                <div>
                  <h4 className="font-semibold text-[#17191D] text-xs sm:text-sm">
                    {selectedTemplate.title}
                  </h4>
                  <span className="text-[10px] text-[#667085] font-mono">
                    {selectedTemplate.category} • {selectedTemplate.aspect} • {selectedTemplate.duration}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
                {selectedTemplate.badge}
              </span>
            </div>

            {/* Prompt preview */}
            <div className="relative p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-[11px] font-mono leading-relaxed select-all">
              {selectedTemplate.prompt}
            </div>

            {/* Template specific action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleNavigateToStudio('google-vids-cool-template', selectedTemplate.id)}
                className="flex-1 py-2 px-3 rounded-lg bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Use Template in Studio (15 cr)</span>
              </button>

              <button
                type="button"
                onClick={() => handleLaunchGoogleVids(selectedTemplate.prompt)}
                className="py-2 px-3 rounded-lg bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] border border-[#5145CD]/20 font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                title="Copy prompt & open Google Vids workspace (0 credits)"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Opening Vids...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Google Vids (0 cr)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleCopyPrompt(selectedTemplate.prompt)}
                className="py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-[#667085] hover:text-[#17191D] font-medium text-xs flex items-center justify-center gap-1.5 border border-[#E5E7EB] cursor-pointer"
                title="Copy prompt to clipboard"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span className="text-[#5145CD]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#667085]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#667085] font-medium pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD] shrink-0" />
            <span className="text-[#17191D]">Prompt to Video</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD] shrink-0" />
            <span className="text-[#17191D]">Fixed 15 Credits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD] shrink-0" />
            <span className="text-[#17191D]">Image-to-Video</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5145CD] shrink-0" />
            <span className="text-[#17191D]">26 Curated Templates</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleNavigateToStudio('google-vids-promo-primary')}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Video</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (dontShowAgain) {
                  try {
                    localStorage.setItem('fluvia_hide_google_vids_promo', 'true');
                  } catch (e) {}
                }
                setIsOpen(false);
                router.push('/templates?type=video');
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] border border-[#E5E7EB] text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Layers className="w-4 h-4 text-[#5145CD]" />
              <span>Browse All 26 Templates</span>
            </button>
          </div>

          {/* Dismissal Preference */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-[#667085] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#E5E7EB] bg-white text-[#5145CD] focus:ring-[#5145CD] cursor-pointer"
              />
              <span>Don't show again</span>
            </label>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-[#667085] hover:text-[#17191D] underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
