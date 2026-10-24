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
} from 'lucide-react';

interface GoogleVidsPromoPopupProps {
  onClose?: () => void;
}

export function GoogleVidsPromoPopup({ onClose }: GoogleVidsPromoPopupProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
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

  const handleNavigateToStudio = (targetSource: string) => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('fluvia_hide_google_vids_promo', 'true');
      } catch (e) {}
    }
    setIsOpen(false);
    router.push(`/create?source=${encodeURIComponent(targetSource)}`);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-vids-promo-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-left text-[#17211D] animate-in zoom-in-95 duration-200"
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
        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B1512] via-[#0E2820] to-emerald-950 p-4 flex flex-col justify-between mb-6 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-mono">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              GOOGLE VIDS WORKFLOW
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold">
              15 Credits / Video
            </span>
          </div>

          <div className="flex items-center gap-3 my-auto">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
              <Play className="w-6 h-6 fill-emerald-300 translate-x-0.5" />
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

        {/* Content */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Video className="w-3.5 h-3.5 text-emerald-600" />
            <span>Feature Spotlight</span>
          </div>

          <h2 id="google-vids-promo-title" className="text-xl sm:text-2xl font-black text-[#17211D] tracking-tight">
            Meet Google Vids in Fluvia Flow
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Turn your ideas into videos with a simple prompt. Experience the fastest in-app creation studio powered by Google Gemini Omni Flash with real-time job status and direct MP4 downloads.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 font-medium">
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
        </div>

        {/* Actions */}
        <div className="mt-6 pt-5 border-t border-emerald-500/15 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
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
              onClick={() => handleNavigateToStudio('google-vids-promo-secondary')}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold transition-all cursor-pointer text-center"
            >
              Explore Video Studio
            </button>
          </div>

          {/* Dismissal Preference */}
          <div className="flex items-center justify-between pt-2">
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
