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
  Zap,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Flame,
  Film,
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

interface GoogleVidsPromoPopupProps {
  onClose?: () => void;
}

export function GoogleVidsPromoPopup({ onClose }: GoogleVidsPromoPopupProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CoolVidsTemplate>(COOL_GOOGLE_VIDS_TEMPLATES[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if dismissed before
    try {
      const isDismissed = localStorage.getItem('fluvia_hide_google_vids_promo') === 'true';
      const sessionShown = sessionStorage.getItem('fluvia_vids_promo_session_shown') === 'true';

      if (!isDismissed && !sessionShown) {
        // Small delay so dashboard finishes initial render smoothly
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('fluvia_vids_promo_session_shown', 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Fallback for private mode without localStorage
    }
  }, []);

  // Listen for custom trigger to open popup on demand (e.g., from Dashboard Google Vids Card)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-google-vids-popup', handleOpen);
    return () => window.removeEventListener('open-google-vids-popup', handleOpen);
  }, []);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowAgain]);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('fluvia_hide_google_vids_promo', 'true');
      } catch (e) {}
    }
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleNavigateToStudio = (targetSource: string, templateId?: string) => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('fluvia_hide_google_vids_promo', 'true');
      } catch (e) {}
    }
    setIsOpen(false);
    const dest = templateId
      ? `/create?template=${encodeURIComponent(templateId)}&source=${encodeURIComponent(targetSource)}`
      : `/create?source=${encodeURIComponent(targetSource)}`;
    router.push(dest);
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleLaunchGoogleVids = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => {
      setCopiedPrompt(false);
      window.open(
        'https://workspace.google.com/intl/en_in/products/vids/?from=gafb-drive_6806271-def-en_in',
        '_blank'
      );
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-vids-promo-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm overscroll-contain animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-emerald-500/30 p-5 sm:p-7 shadow-2xl text-left text-[#17211D] animate-in zoom-in-95 duration-200 scrollbar-thin"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close promotion dialog"
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-emerald-50 transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Artwork Banner */}
        <div className="relative aspect-[24/9] sm:aspect-[28/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B1512] via-[#0E2820] to-emerald-950 p-4 sm:p-5 flex flex-col justify-between mb-5 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-mono">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              GOOGLE VIDS WORKFLOW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold">
              15 Credits / Video
            </span>
          </div>

          <div className="flex items-center gap-3 my-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-300 translate-x-0.5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm sm:text-base">AI Video Creative Engine</div>
              <div className="text-emerald-300/80 text-xs font-mono">Powered by Google Gemini Omni Flash</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-emerald-500/20 pt-2">
            <span>Direct In-App Creation</span>
            <span className="text-emerald-400 font-semibold">1080p & 4K Export Ready</span>
          </div>
        </div>

        {/* Main Header Copy */}
        <div className="space-y-2 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-emerald-600" />
            <span>Feature Spotlight</span>
          </div>

          <h2 id="google-vids-promo-title" className="text-xl sm:text-2xl font-black text-[#17211D] tracking-tight">
            Meet Google Vids in Fluvia Flow
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Turn your ideas into videos with a simple prompt. Choose from cool production templates below or craft your own prompt to create right here or in Google Vids Workspace.
          </p>
        </div>

        {/* 🌟 COOL TEMPLATES SHOWCASE SECTION */}
        <div className="mb-5 rounded-2xl bg-slate-50 border border-emerald-500/20 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs sm:text-sm text-[#17211D] uppercase tracking-wider">
                Cool Video Templates for Google Vids
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
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
                      ? 'bg-emerald-950 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/40'
                      : 'bg-white hover:bg-emerald-50/60 text-[#17211D] border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{tmpl.emoji}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tmpl.aspect}
                    </span>
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold line-clamp-1 leading-snug ${
                        isSelected ? 'text-white' : 'text-[#17211D]'
                      }`}
                    >
                      {tmpl.title}
                    </h4>
                    <p
                      className={`text-[10px] line-clamp-1 mt-0.5 ${
                        isSelected ? 'text-emerald-300/80 font-mono' : 'text-slate-500'
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
          <div className="p-3.5 rounded-xl bg-white border border-emerald-500/25 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedTemplate.emoji}</span>
                <div>
                  <h4 className="font-bold text-[#17211D] text-xs sm:text-sm">
                    {selectedTemplate.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {selectedTemplate.category} • {selectedTemplate.aspect} • {selectedTemplate.duration}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {selectedTemplate.badge}
              </span>
            </div>

            {/* Prompt preview */}
            <div className="relative p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono leading-relaxed select-all">
              {selectedTemplate.prompt}
            </div>

            {/* Template specific action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleNavigateToStudio('google-vids-cool-template', selectedTemplate.id)}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Use Template in Studio (15 cr)</span>
              </button>

              <button
                type="button"
                onClick={() => handleLaunchGoogleVids(selectedTemplate.prompt)}
                className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                title="Copy prompt & open Google Vids workspace (0 credits)"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
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
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-300 cursor-pointer"
                title="Copy prompt to clipboard"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium pb-4 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Prompt to Video</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fixed 15 Credits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Image-to-Video</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>26 Curated Templates</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleNavigateToStudio('google-vids-promo-primary')}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Browse All 26 Templates</span>
            </button>
          </div>

          {/* Dismissal Preference */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Don't show again</span>
            </label>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
