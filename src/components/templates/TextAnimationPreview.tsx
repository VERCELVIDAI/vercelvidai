'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Download,
  Sliders,
  Type,
  Palette,
  Eye,
  Film,
  Zap,
} from 'lucide-react';
import { CreativeTemplate } from '@/lib/templates';

interface TextAnimationPreviewProps {
  template: CreativeTemplate;
  initialHeadline?: string;
  initialSubtitle?: string;
  onOpenInEditor?: (textConfig: any) => void;
  className?: string;
}

export function TextAnimationPreview({
  template,
  initialHeadline,
  initialSubtitle,
  onOpenInEditor,
  className = '',
}: TextAnimationPreviewProps) {
  const defaultHeadline =
    initialHeadline ||
    template.textFields?.find((f) => f.key === 'headline')?.defaultValue ||
    template.title;

  const defaultSubtitle =
    initialSubtitle ||
    template.textFields?.find((f) => f.key === 'subtitle')?.defaultValue ||
    template.description;

  const [headline, setHeadline] = useState(defaultHeadline);
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [accentColor, setAccentColor] = useState(
    template.animationSettings?.accentColor || '#10b981'
  );
  const [textColor, setTextColor] = useState(
    template.animationSettings?.textColor || '#ffffff'
  );
  const [speed, setSpeed] = useState(template.animationSettings?.speed || 1.0);
  const [animationKey, setAnimationKey] = useState(0);
  const [copiedCss, setCopiedCss] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'customize' | 'code'>('preview');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync state if template changes
  useEffect(() => {
    const h =
      initialHeadline ||
      template.textFields?.find((f) => f.key === 'headline')?.defaultValue ||
      template.title;
    const s =
      initialSubtitle ||
      template.textFields?.find((f) => f.key === 'subtitle')?.defaultValue ||
      template.description;
    setHeadline(h);
    setSubtitle(s);
    setAccentColor(template.animationSettings?.accentColor || '#10b981');
    setTextColor(template.animationSettings?.textColor || '#ffffff');
    setSpeed(template.animationSettings?.speed || 1.0);
    setAnimationKey((k) => k + 1);
  }, [template, initialHeadline, initialSubtitle]);

  const preset = template.animationSettings?.preset || 'chrome-3d';

  const handleReplay = () => {
    setAnimationKey((k) => k + 1);
  };

  // Particle Swarm Canvas Simulation for txt_tmpl_10
  useEffect(() => {
    if (preset !== 'particle-swarm' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 640);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 360);

    const particles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    // Off-screen canvas to sample text pixels
    const offCanvas = document.createElement('canvas');
    offCanvas.width = width;
    offCanvas.height = height;
    const offCtx = offCanvas.getContext('2d');
    if (offCtx) {
      offCtx.fillStyle = '#000';
      offCtx.fillRect(0, 0, width, height);
      offCtx.fillStyle = '#fff';
      offCtx.font = `900 ${Math.min(width * 0.12, 72)}px Cinzel, Georgia, serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(headline.slice(0, 16), width / 2, height / 2 - 20);

      const imgData = offCtx.getImageData(0, 0, width, height);
      const step = 6;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          if (imgData.data[idx] > 180) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              targetX: x,
              targetY: y,
              vx: 0,
              vy: 0,
              size: Math.random() * 2.5 + 1.2,
              color: Math.random() > 0.3 ? accentColor : '#fef3c7',
              alpha: Math.random() * 0.7 + 0.3,
            });
          }
        }
      }
    }

    let progress = 0;
    const render = () => {
      progress += 0.015 * speed;
      ctx.fillStyle = 'rgba(10, 15, 12, 0.25)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        const ease = Math.min(1, Math.max(0, progress));
        const currentTargetX = p.x + (p.targetX - p.x) * 0.08 * speed;
        const currentTargetY = p.y + (p.targetY - p.y) * 0.08 * speed;
        p.x = currentTargetX;
        p.y = currentTargetY;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * ease;
        ctx.shadowBlur = 8;
        ctx.shadowColor = accentColor;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Render subtitle below text
      if (progress > 0.6) {
        ctx.font = `bold 14px Arial, sans-serif`;
        ctx.fillStyle = accentColor;
        ctx.textAlign = 'center';
        ctx.globalAlpha = Math.min(1, (progress - 0.6) * 2.5);
        ctx.fillText(subtitle.toUpperCase(), width / 2, height / 2 + 50);
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [preset, headline, subtitle, accentColor, speed, animationKey]);

  // Generate copyable CSS snippet
  const generateCssCode = () => {
    return `/* Fluvia Flow Deterministic Typography: ${template.title} */
.fluvia-text-animation {
  font-family: ${template.animationSettings?.fontFamily || 'Inter, sans-serif'};
  color: ${textColor};
  font-weight: 900;
  letter-spacing: 0.05em;
  animation: ${preset}-reveal ${4 / speed}s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

@keyframes ${preset}-reveal {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
    filter: blur(8px);
  }
  20%, 80% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0px);
  }
  100% {
    opacity: 0;
    transform: scale(1.05) translateY(-10px);
    filter: blur(4px);
  }
}`;
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(generateCssCode());
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className={`flex flex-col rounded-2xl bg-white border border-[#E5E7EB] text-[#17191D] overflow-hidden shadow-xs ${className}`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#F7F8FA] border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5145CD] animate-pulse" />
          <h3 className="font-bold text-sm tracking-tight text-[#17191D] flex items-center gap-1.5">
            <span>{template.title}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#5145CD]/20">
              Live Motion Engine
            </span>
          </h3>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E7EB] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#5145CD] text-white shadow-2xs'
                : 'text-[#667085] hover:text-[#17191D]'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customize')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'customize'
                ? 'bg-[#5145CD] text-white shadow-2xs'
                : 'text-[#667085] hover:text-[#17191D]'
            }`}
          >
            Customize
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#5145CD] text-white shadow-2xs'
                : 'text-[#667085] hover:text-[#17191D]'
            }`}
          >
            CSS/SVG
          </button>
        </div>
      </div>

      {/* Main Animation Stage / Workspace */}
      <div className="relative min-h-[300px] sm:min-h-[380px] bg-gradient-to-b from-[#090d0b] to-[#040806] flex items-center justify-center p-6 overflow-hidden select-none">
        {/* Ambient Radial Backlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 60%)`,
          }}
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Stage Content Renderers based on Preset */}
        {activeTab !== 'code' ? (
          <div key={animationKey} className="relative z-10 w-full text-center max-w-xl mx-auto px-4">
            {preset === 'particle-swarm' ? (
              <canvas ref={canvasRef} className="w-full h-[280px] mx-auto block" />
            ) : preset === 'chrome-3d' ? (
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <h1
                  className="text-4xl sm:text-6xl font-black uppercase tracking-widest transition-all drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 35%, #ffffff 50%, #475569 70%, #cbd5e1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: 'perspective(600px) rotateX(12deg)',
                  }}
                >
                  {headline}
                </h1>
                <p
                  className="mt-3 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase opacity-90 transition-all"
                  style={{ color: accentColor }}
                >
                  {subtitle}
                </p>
              </div>
            ) : preset === 'emerald-glass' ? (
              <div className="animate-in fade-in zoom-in-90 duration-800">
                <div className="inline-block p-6 sm:p-8 rounded-3xl bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)]">
                  <h1
                    className="text-3xl sm:text-5xl font-black uppercase tracking-wider text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {headline}
                  </h1>
                  <p className="mt-2 text-xs sm:text-sm font-semibold tracking-widest text-emerald-200/80 uppercase">
                    {subtitle}
                  </p>
                </div>
              </div>
            ) : preset === 'liquid-metal' ? (
              <div className="animate-in fade-in duration-1000">
                <h1
                  className="text-4xl sm:text-6xl font-bold italic tracking-tight"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    background: 'linear-gradient(90deg, #e2e8f0, #94a3b8, #f8fafc, #64748b, #e2e8f0)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `shine ${3 / speed}s linear infinite`,
                  }}
                >
                  {headline}
                </h1>
                <p className="mt-3 text-xs font-mono tracking-widest text-slate-300 uppercase">
                  {subtitle}
                </p>
              </div>
            ) : preset === 'kinetic-spring' ? (
              <div className="space-y-2 animate-in slide-in-from-bottom-8 duration-500">
                <div className="inline-block px-4 py-2 bg-rose-600 text-white font-black text-3xl sm:text-5xl uppercase tracking-tighter rounded-xl transform -rotate-1 shadow-xl">
                  {headline}
                </div>
                <div>
                  <span className="inline-block px-4 py-1.5 bg-white text-black font-black text-2xl sm:text-4xl uppercase tracking-tighter rounded-xl transform rotate-1 shadow-xl">
                    {subtitle}
                  </span>
                </div>
              </div>
            ) : preset === 'neon-flicker' ? (
              <div className="animate-pulse">
                <h1
                  className="text-4xl sm:text-6xl font-black uppercase tracking-wider drop-shadow-[0_0_25px_rgba(232,121,249,0.8)]"
                  style={{
                    color: '#fdf4ff',
                    textShadow: `0 0 10px ${accentColor}, 0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
                  }}
                >
                  {headline}
                </h1>
                <p
                  className="mt-3 text-xs sm:text-sm font-bold tracking-widest uppercase"
                  style={{ color: accentColor }}
                >
                  {subtitle}
                </p>
              </div>
            ) : preset === 'luxury-tracking' ? (
              <div className="animate-in fade-in duration-1000">
                <h1
                  className="text-3xl sm:text-5xl font-light uppercase text-white transition-all"
                  style={{
                    fontFamily: 'Cinzel, Garamond, serif',
                    letterSpacing: '0.35em',
                  }}
                >
                  {headline}
                </h1>
                <div className="w-16 h-px bg-white/40 mx-auto my-4" />
                <p className="text-[11px] font-mono tracking-[0.4em] uppercase text-slate-400">
                  {subtitle}
                </p>
              </div>
            ) : preset === 'digital-glitch' ? (
              <div className="relative font-mono">
                <h1 className="text-4xl sm:text-6xl font-black tracking-widest text-cyan-400 drop-shadow-[2px_0_0_#f43f5e]">
                  {headline}
                </h1>
                <p className="mt-2 text-xs font-mono tracking-widest text-emerald-400">
                  {`> ${subtitle}`}
                </p>
              </div>
            ) : preset === 'typewriter-cadence' ? (
              <div className="font-mono text-left inline-block p-5 rounded-2xl bg-black/60 border border-emerald-500/30">
                <p className="text-emerald-400 text-sm sm:text-lg font-bold">
                  {headline}
                  <span className="inline-block w-2.5 h-4 ml-1 bg-emerald-400 animate-pulse" />
                </p>
                <p className="text-xs text-white/50 mt-1">{subtitle}</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                <h1
                  className="text-4xl sm:text-6xl font-black tracking-tight"
                  style={{ color: textColor }}
                >
                  {headline}
                </h1>
                <p
                  className="mt-2 text-sm font-bold tracking-widest uppercase"
                  style={{ color: accentColor }}
                >
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Code View Tab */
          <div className="relative z-10 w-full max-w-lg p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto text-left">
            <pre className="leading-relaxed select-all">{generateCssCode()}</pre>
          </div>
        )}

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-3 inset-x-4 flex items-center justify-between z-20 pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReplay}
              className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#667085] hover:text-[#17191D] border border-[#E5E7EB] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Replay Animation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Replay</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCss}
              className="p-2 rounded-xl bg-white/90 hover:bg-white text-[#667085] hover:text-[#17191D] border border-[#E5E7EB] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Copy CSS Snippet"
            >
              {copiedCss ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span className="text-[#5145CD]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy CSS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Customizer Panel (when customize tab active) */}
      {activeTab === 'customize' && (
        <div className="p-5 bg-[#F7F8FA] border-t border-[#E5E7EB] space-y-4 text-xs animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#667085]">Main Title / Brand Name</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={40}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#17191D] focus:outline-none focus:border-[#5145CD] font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#667085]">Subtitle / Tagline</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                maxLength={60}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#17191D] focus:outline-none focus:border-[#5145CD] font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#667085]">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[#17191D]">{accentColor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#667085]">Animation Speed</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#5145CD]"
                />
                <span className="font-mono text-[#17191D] w-10 text-right">{speed}x</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-end">
              <button
                type="button"
                onClick={handleReplay}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Apply & Replay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="px-5 py-3.5 bg-white border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#667085]">
          <Zap className="w-4 h-4 text-[#5145CD]" />
          <span>Instant Client-Side Rendering • 100% Deterministic Text Precision</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onOpenInEditor && (
            <button
              type="button"
              onClick={() => onOpenInEditor({ headline, subtitle, accentColor, preset, speed })}
              className="flex-1 sm:flex-initial py-2 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Use in Video Project (0 cr)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
