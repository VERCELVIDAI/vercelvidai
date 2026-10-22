'use client';

import React from 'react';
import { ColorTheme, ResolvedMode } from '@/lib/themes';
import { Check, Sparkles } from 'lucide-react';

interface ThemeCardProps {
  theme: ColorTheme;
  isSelected: boolean;
  activeMode: ResolvedMode;
  onSelect: (theme: ColorTheme) => void;
  onPreviewHover?: (theme: ColorTheme) => void;
}

export function ThemeCard({
  theme,
  isSelected,
  activeMode,
  onSelect,
  onPreviewHover,
}: ThemeCardProps) {
  const palette = activeMode === 'dark' ? theme.dark : theme.light;

  return (
    <div
      onClick={() => onSelect(theme)}
      onMouseEnter={() => onPreviewHover?.(theme)}
      className={`group relative rounded-2xl p-4 sm:p-5 cursor-pointer border transition-all duration-300 transform hover:-translate-y-1 ${
        isSelected
          ? 'ring-2 ring-offset-2 ring-offset-[#090A0F] shadow-xl'
          : 'hover:shadow-lg'
      }`}
      style={{
        backgroundColor: palette.card,
        borderColor: isSelected ? palette.primary : palette.cardBorder,
        boxShadow: isSelected ? `0 10px 30px -10px ${palette.glow}` : undefined,
      }}
    >
      {/* Selected Indicator Badge */}
      {isSelected && (
        <div
          className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in-50 duration-200 z-10"
          style={{ backgroundColor: palette.primary }}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {/* Mini Color Swatches Ribbon */}
      <div className="flex items-center gap-1.5 mb-3">
        {/* Primary Accent Circle */}
        <div
          className="w-4 h-4 rounded-full shadow-sm"
          style={{ backgroundColor: theme.previewColors.primary }}
          title={`Primary Accent: ${theme.previewColors.primary}`}
        />
        {/* Secondary Accent Circle */}
        <div
          className="w-4 h-4 rounded-full shadow-sm"
          style={{ backgroundColor: theme.previewColors.secondary }}
          title={`Secondary Accent: ${theme.previewColors.secondary}`}
        />
        {/* Dark Bg Preview */}
        <div
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: theme.previewColors.darkBg }}
          title="Dark Surface"
        />
        {/* Light Bg Preview */}
        <div
          className="w-4 h-4 rounded-full border border-black/20"
          style={{ backgroundColor: theme.previewColors.lightBg }}
          title="Light Surface"
        />

        <span
          className="ml-auto text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: palette.badgeBg,
            color: palette.badgeText,
          }}
        >
          {theme.tone}
        </span>
      </div>

      {/* Visual Palette Representation Strip */}
      <div
        className="h-10 w-full rounded-xl mb-3 overflow-hidden p-1.5 flex items-center justify-between border"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
        }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-lg text-white flex items-center justify-center text-[10px] font-bold shadow-sm"
            style={{ backgroundImage: palette.gradientPrimary }}
          >
            V
          </div>
          <div className="h-2 w-12 rounded-full" style={{ backgroundColor: palette.textPrimary, opacity: 0.7 }} />
        </div>
        <div
          className="px-2 py-0.5 rounded text-[9px] font-bold text-white shadow-sm"
          style={{ backgroundColor: palette.primary }}
        >
          Action
        </div>
      </div>

      {/* Theme Title & Description */}
      <div>
        <h4 className="font-extrabold text-sm sm:text-base leading-tight" style={{ color: palette.textPrimary }}>
          {theme.name}
        </h4>
        <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: palette.textSecondary }}>
          {theme.description}
        </p>
      </div>

      {/* Bottom Live Selection Button */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: palette.cardBorder }}>
        <span className="font-semibold text-[11px]" style={{ color: palette.primary }}>
          {isSelected ? 'Active Workspace Theme' : 'Click to Apply & Preview'}
        </span>
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: isSelected ? palette.primary : palette.textMuted,
            boxShadow: isSelected ? `0 0 8px ${palette.primary}` : undefined,
          }}
        />
      </div>
    </div>
  );
}
