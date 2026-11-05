'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  X,
  ShieldCheck,
  Tag,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Gift,
  Flame,
  Zap,
} from 'lucide-react';

interface FirstCampaignModalProps {
  forceOpen?: boolean;
  onDismiss?: () => void;
}

export function FirstCampaignModal({ forceOpen = false, onDismiss }: FirstCampaignModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [copied, setCopied] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  // Video playback states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Scratch card states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCounterRef = useRef(0);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  // Dynamic randomized scratch discount between ₹500 and ₹1,000 (steps of 10)
  const [discountAmount, setDiscountAmount] = useState<number>(750);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('fluvia_scratch_discount_amount');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 500 && val <= 1000) {
          setDiscountAmount(val);
          return;
        }
      }
      const step = Math.floor(Math.random() * 51); // 0 to 50
      const generated = 500 + step * 10;
      sessionStorage.setItem('fluvia_scratch_discount_amount', generated.toString());
      setDiscountAmount(generated);
    }
  }, []);

  // Listen for global custom trigger event so user or header button can open anytime
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
      setIsRevealed(false);
      setScratchProgress(0);
    };
    window.addEventListener('open-discount-modal', handleOpenModal);
    return () => window.removeEventListener('open-discount-modal', handleOpenModal);
  }, []);

  // Check eligibility on mount or show welcome modal
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Check if dismissed previously in localStorage
    const dismissedSession = typeof window !== 'undefined'
      ? sessionStorage.getItem('fluvia_first_coupon_dismissed')
      : null;

    if (!dismissedSession) {
      // Automatic gentle popup after 2.2 seconds for new visitors
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2200);

      // Also check backend eligibility if authenticated
      fetch('/api/user/first-coupon')
        .then((res) => (res.ok ? res.json() : { eligible: false }))
        .then((data) => {
          if (data?.eligible) {
            setIsOpen(true);
          }
        })
        .catch(() => {});

      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5145CD', '#818CF8', '#d1fe17', '#10B981', '#F59E0B'],
        disableForReducedMotion: true,
      });
    } catch {}
  }, []);

  // Initialize or re-draw metallic scratch card canvas
  const initScratchCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = cardContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 380;
    const height = rect.height || 180;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // 1. Shimmering metallic titanium-silver gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#CBD5E1');
    gradient.addColorStop(0.2, '#F1F5F9');
    gradient.addColorStop(0.4, '#94A3B8');
    gradient.addColorStop(0.6, '#E2E8F0');
    gradient.addColorStop(0.8, '#CBD5E1');
    gradient.addColorStop(1, '#64748B');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Add subtle sparkling metallic speckles
    for (let i = 0; i < 50; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const ry = (Math.cos(i * 33) * 0.5 + 0.5) * height;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.12)';
      ctx.beginPath();
      ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Crisp luxury inner dash border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 5]);
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.setLineDash([]);

    // 4. Center High-Contrast Engraved Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Sparkle Icon & "SCRATCH TO REVEAL"
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 17px Inter, system-ui, -apple-system, sans-serif';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', width / 2, height / 2 - 14);

    // Subtext instruction
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#334155';
    ctx.font = '600 11.5px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillText('Rub with mouse or finger to uncover discount', width / 2, height / 2 + 12);

    // Coin badge
    ctx.fillStyle = '#5145CD';
    ctx.font = 'bold 10px Inter, system-ui, -apple-system, sans-serif';
    ctx.fillText('🪙 100% Guaranteed Flat Off', width / 2, height / 2 + 34);
  }, []);

  // When modal opens or reveal resets, re-init canvas
  useEffect(() => {
    if (isOpen && !isRevealed) {
      // Allow DOM layout to complete before measuring
      const t = setTimeout(() => {
        initScratchCanvas();
      }, 60);
      return () => clearTimeout(t);
    }
  }, [isOpen, isRevealed, initScratchCanvas]);

  // Scratch action handler
  const handleScratchMove = (clientX: number, clientY: number) => {
    if (isRevealed || !isScratchingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 42 * dpr;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 21 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    lastPointRef.current = { x, y };

    strokeCounterRef.current += 1;
    if (strokeCounterRef.current % 4 === 0) {
      calculateScratchPercent(ctx, canvas.width, canvas.height);
    }
  };

  const calculateScratchPercent = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparent = 0;
      const step = 24; // Performance sampling
      const totalSampled = data.length / (4 * step);

      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] === 0) {
          transparent++;
        }
      }

      const percent = Math.min(100, Math.round((transparent / totalSampled) * 100));
      setScratchProgress(percent);

      if (percent >= 38 && !isRevealed) {
        setIsRevealed(true);
        triggerCelebration();
      }
    } catch {}
  };

  // Quick 1-click reveal button
  const handleInstantReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
    triggerCelebration();
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
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fluvia_first_coupon_dismissed', 'true');
    }
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

  const handleClaimOffer = () => {
    handleDismiss();
    router.push(`/checkout?plan=plan_max&coupon=FIRST20&discount=${discountAmount}`);
  };

  const toggleVideoPlayback = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsVideoPlaying(true);
    } else {
      v.pause();
      setIsVideoPlaying(false);
    }
  };

  const toggleVideoSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsVideoMuted(v.muted);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
    >
      {/* 2-COLUMN LUXURY SPLIT MODAL */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-[#E5E7EB] shadow-[0_25px_60px_-15px_rgba(81,69,205,0.3)] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          disabled={isDismissing}
          className="absolute top-3.5 right-3.5 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-[#667085] hover:text-[#17191D] border border-[#E5E7EB] shadow-md transition-all cursor-pointer hover:scale-105"
          aria-label="Close promotion modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================================= */}
        {/* LEFT COLUMN: HIGH-DEFINITION CINEMATIC PROMO VIDEO */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[46%] bg-[#0B0D14] relative overflow-hidden flex flex-col justify-between p-4 sm:p-5 min-h-[250px] sm:min-h-[300px] md:min-h-[480px] group">
          {/* Ambient Colored Backing Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-[#5145CD]/40 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#d1fe17]/25 blur-3xl pointer-events-none" />

          {/* Autoplaying High-Resolution Video */}
          <video
            ref={videoRef}
            src="/media/promotions/discount-reveal.mp4"
            poster="/media/promotions/discount-poster.jpg"
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            preload="auto"
            onClick={toggleVideoPlayback}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
          />

          {/* Cinematic Vignette Overlay */}
          <div
            onClick={toggleVideoPlayback}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/60 cursor-pointer pointer-events-auto"
          />

          {/* Top Video Header Tag & Sound Switcher */}
          <div className="relative z-10 flex items-center justify-between gap-2 pointer-events-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#d1fe17] text-[10px] font-mono font-bold tracking-wider uppercase shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d1fe17] animate-ping" />
              FLUVIA 4K DROP
            </span>

            <div className="flex items-center gap-1.5">
              {/* Play/Pause indicator */}
              <button
                type="button"
                onClick={toggleVideoPlayback}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-[#d1fe17] hover:bg-black/80 transition-colors cursor-pointer"
                title={isVideoPlaying ? 'Pause video' : 'Play video'}
              >
                {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>

              {/* Mute/Unmute toggle */}
              <button
                type="button"
                onClick={toggleVideoSound}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-[#d1fe17] hover:bg-black/80 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
                title={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isVideoMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                    <span>Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#d1fe17]" />
                    <span>Sound On</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Floating Center Play Icon when Paused */}
          {!isVideoPlaying && (
            <div
              onClick={toggleVideoPlayback}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer pointer-events-auto"
            >
              <div className="p-3.5 rounded-full bg-black/70 backdrop-blur-md border border-white/30 text-[#d1fe17] shadow-xl hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-[#d1fe17]" />
              </div>
            </div>
          )}

          {/* Bottom Story Tagline */}
          <div className="relative z-10 space-y-1 text-left pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
              Commercial Video Engine
            </span>
            <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug drop-shadow-md">
              Unlock broadcast-quality ads with your instant welcome discount.
            </h4>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: REALISTIC INTERACTIVE CANVAS SCRATCH CARD */}
        {/* ========================================================================= */}
        <div className="w-full md:w-[54%] p-5 sm:p-7 flex flex-col justify-between bg-white space-y-4 text-left">
          {/* Header Badge & Title */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] text-[11px] font-bold tracking-wide">
              <Gift className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Secret Creator Welcome Gift</span>
            </div>

            <h3
              id="promo-modal-title"
              className="text-xl sm:text-2xl font-black tracking-tight text-[#17191D] leading-tight"
            >
              Scratch & Claim Your VIP Discount
            </h3>
            <p className="text-xs text-[#667085] leading-relaxed">
              Rub the metallic card below with your mouse or finger to scratch off the foil and uncover your exclusive discount voucher!
            </p>
          </div>

          {/* ======================================================================= */}
          {/* SCRATCH CARD VIEWPORT WITH FOIL CANVAS OVERLAY */}
          {/* ======================================================================= */}
          <div
            ref={cardContainerRef}
            className="relative w-full h-[175px] sm:h-[190px] rounded-2xl overflow-hidden border-2 border-dashed border-[#5145CD]/40 bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F1F5F9] shadow-inner select-none"
          >
            {/* UNDERNEATH LAYER: THE HIDDEN VOUCHER PRIZE */}
            <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#EEF2FF]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#10B981]/10 text-[#059669] border border-[#10B981]/30">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>Unlocked VIP Voucher</span>
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#5145CD] tracking-tight mt-1">
                    ₹{discountAmount} FLAT OFF
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#667085] px-2 py-0.5 rounded bg-white border border-[#E5E7EB] shadow-2xs">
                  Valid on FLUVIA MAX
                </span>
              </div>

              {/* Code Pill & One-Click Copy */}
              <div className="flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-xl bg-white border border-[#C7D2FE] shadow-xs">
                <div className="flex items-center gap-2 pl-2">
                  <Tag className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span className="text-xs font-mono text-[#667085]">CODE:</span>
                  <code className="text-sm sm:text-base font-mono font-black tracking-widest text-[#17191D] select-all">
                    FIRST20
                  </code>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    copied
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#5145CD] hover:bg-[#4338CA] text-white'
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
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Verification & Perks */}
              <div className="flex items-center justify-between text-[10.5px] text-[#667085]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Instant checkout discount</span>
                </span>
                <span className="font-semibold text-[#5145CD]">
                  ⚡ 20% Extra Bonus Credits
                </span>
              </div>
            </div>

            {/* OVERLAY LAYER: THE REAL SCRATCHABLE CANVAS FOIL */}
            <canvas
              ref={canvasRef}
              onMouseDown={(e) => {
                isScratchingRef.current = true;
                lastPointRef.current = null;
                handleScratchMove(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => {
                if (isScratchingRef.current) {
                  handleScratchMove(e.clientX, e.clientY);
                }
              }}
              onMouseUp={() => {
                isScratchingRef.current = false;
                lastPointRef.current = null;
              }}
              onMouseLeave={() => {
                isScratchingRef.current = false;
                lastPointRef.current = null;
              }}
              onTouchStart={(e) => {
                isScratchingRef.current = true;
                lastPointRef.current = null;
                if (e.touches[0]) {
                  handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchMove={(e) => {
                if (isScratchingRef.current && e.touches[0]) {
                  handleScratchMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
              onTouchEnd={() => {
                isScratchingRef.current = false;
                lastPointRef.current = null;
              }}
              className={`absolute inset-0 cursor-crosshair transition-opacity duration-700 ${
                isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            />
          </div>

          {/* Scratch Progress Status Bar or Quick Reveal Button */}
          {!isRevealed ? (
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#667085]">
                  <span>Scratch Progress:</span>
                  <span className="font-mono text-[#5145CD] font-bold">{scratchProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5145CD] to-[#10B981] transition-all duration-150 rounded-full"
                    style={{ width: `${scratchProgress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleInstantReveal}
                className="shrink-0 text-[11px] font-bold text-[#5145CD] hover:text-[#4338CA] underline cursor-pointer"
              >
                Auto-Reveal →
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#059669] font-bold bg-[#ECFDF5] border border-[#A7F3D0] p-2 rounded-xl">
              <Check className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>🎉 Congratulations! ₹{discountAmount} Discount Unlocked & Applied!</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={isRevealed ? handleClaimOffer : handleInstantReveal}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer focus-indigo hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-current text-[#d1fe17]" />
              <span>{isRevealed ? `Claim ₹${discountAmount} & Upgrade Now` : 'Scratch & Claim Discount'}</span>
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
    </div>
  );
}
