'use client';

import React from 'react';
import { ColorTheme, ResolvedMode } from '@/lib/themes';
import {
  Sparkles,
  Zap,
  Play,
  Film,
  Music,
  Video,
  Layers,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface MiniStudioPreviewProps {
  theme: ColorTheme;
  mode: ResolvedMode;
}

export function MiniStudioPreview({ theme }: MiniStudioPreviewProps) {
  const palette = theme.light;

  return (
    <div
      className="w-full rounded-3xl p-4 sm:p-6 shadow-2xl transition-all duration-300 border select-none overflow-hidden"
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.cardBorder,
        boxShadow: `0 20px 50px -15px ${palette.glow}`,
      }}
    >
      {/* Top Window Bar Mockup */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: palette.cardBorder }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[10px]" style={{ color: palette.textMuted }}>
            Fluvia Flow Studio • {theme.name} (Light Glassmorphism)
          </span>
        </div>
        <div
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: palette.badgeBg,
            color: palette.badgeText,
            border: `1px solid ${palette.badgeBorder}`,
          }}
        >
          Live Preview
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Miniature Left Sidebar (3 cols) */}
        <div
          className="col-span-3 rounded-2xl p-3 space-y-2 border"
          style={{
            backgroundColor: palette.sidebar,
            borderColor: palette.cardBorder,
          }}
        >
          <div className="flex items-center gap-1.5 pb-2 border-b" style={{ borderColor: palette.cardBorder }}>
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundImage: palette.gradientPrimary }}
            >
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-extrabold text-xs tracking-wider uppercase" style={{ color: palette.textPrimary }}>
              Fluvia
            </span>
          </div>

          <div className="space-y-1">
            {[
              { label: 'Create', icon: Video, active: true },
              { label: 'Templates', icon: Layers, active: false },
              { label: 'Timeline', icon: Sliders, active: false },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold"
                style={{
                  backgroundColor: item.active ? palette.badgeBg : 'transparent',
                  color: item.active ? palette.primary : palette.textSecondary,
                }}
              >
                <item.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Credits Chip */}
          <div
            className="p-2 rounded-xl border mt-3"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.cardBorder,
            }}
          >
            <div className="flex items-center justify-between text-[9px]" style={{ color: palette.textMuted }}>
              <span>Credits</span>
              <Zap className="w-2.5 h-2.5 text-amber-400" />
            </div>
            <div className="font-black text-xs" style={{ color: palette.textPrimary }}>
              1,300
            </div>
          </div>
        </div>

        {/* Miniature Workspace Main Area (9 cols) */}
        <div className="col-span-9 space-y-3">
          {/* Top Banner Card */}
          <div
            className="rounded-2xl p-3 sm:p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{
              backgroundColor: palette.card,
              borderColor: palette.cardBorder,
            }}
          >
            <div>
              <div className="text-xs font-bold" style={{ color: palette.textPrimary }}>
                Generate Cinematic Video
              </div>
              <div className="text-[10px]" style={{ color: palette.textSecondary }}>
                Runway Gen-3 Alpha • 4K UHD Master File
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl font-bold text-[10px] text-white shadow-sm flex items-center gap-1"
                style={{ backgroundImage: palette.gradientPrimary }}
              >
                <Play className="w-2.5 h-2.5 fill-white" />
                <span>Render</span>
              </button>
              <button
                type="button"
                className="px-2.5 py-1.5 rounded-xl font-semibold text-[10px] border"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.cardBorder,
                  color: palette.textSecondary,
                }}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Miniature Timeline & Canvas Mockup */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Mock Video Canvas */}
            <div
              className="aspect-video rounded-xl overflow-hidden relative border flex items-center justify-center"
              style={{
                backgroundColor: '#F1F5F9',
                borderColor: palette.cardBorder,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
                alt="Mini Canvas"
                className="w-full h-full object-cover opacity-80"
              />
              <div
                className="absolute w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: palette.primary }}
              >
                <Play className="w-3 h-3 fill-white ml-0.5" />
              </div>
              <div
                className="absolute bottom-1.5 left-1.5 text-[8px] font-mono px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              >
                00:15 / 4K
              </div>
            </div>

            {/* Mock Multi-track Timeline */}
            <div
              className="rounded-xl p-2 border flex flex-col justify-between"
              style={{
                backgroundColor: palette.card,
                borderColor: palette.cardBorder,
              }}
            >
              <div className="text-[10px] font-bold" style={{ color: palette.textPrimary }}>
                Timeline Tracks
              </div>

              <div className="space-y-1 my-1">
                <div className="h-2 rounded w-full" style={{ backgroundColor: palette.primary, opacity: 0.8 }} />
                <div className="h-2 rounded w-4/5" style={{ backgroundColor: palette.secondary, opacity: 0.7 }} />
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: '#F59E0B', opacity: 0.7 }} />
              </div>

              <div className="flex items-center justify-between text-[8px] font-mono" style={{ color: palette.textMuted }}>
                <span>0.00s</span>
                <span>7.50s</span>
                <span>15.00s</span>
              </div>
            </div>
          </div>

          {/* Mock Interactive Input Bar */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
            style={{
              backgroundColor: palette.inputBg,
              borderColor: palette.inputBorder,
            }}
          >
            <Sparkles className="w-3 h-3 shrink-0" style={{ color: palette.primary }} />
            <span className="text-[10px] truncate" style={{ color: palette.textMuted }}>
              Describe scene lighting, lens and subject action...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
