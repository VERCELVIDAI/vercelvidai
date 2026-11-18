'use client';

import React, { useState } from 'react';
import {
  FileText,
  Zap,
  Combine,
  Scissors,
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  HardDrive,
  Eye,
} from 'lucide-react';
import { PdfEditorTool } from './PdfEditorTool';
import { PdfCompressorTool } from './PdfCompressorTool';
import { PdfMergeTool } from './PdfMergeTool';
import { PdfSplitTool } from './PdfSplitTool';
import { ImageToPdfTool } from './ImageToPdfTool';

export type PdfToolId = 'editor' | 'compressor' | 'merge' | 'split' | 'image-to-pdf';

interface Props {
  initialTool?: PdfToolId;
}

export function PdfToolsHub({ initialTool = 'editor' }: Props) {
  const [activeTool, setActiveTool] = useState<PdfToolId>(initialTool);

  const tools = [
    {
      id: 'editor' as const,
      name: 'PDF Editor',
      shortDesc: 'Text, Watermark & Pages',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      badge: 'Flagship',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'compressor' as const,
      name: 'Compressor',
      shortDesc: 'Reduce size by 40-70%',
      icon: Zap,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badge: 'Smart',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'merge' as const,
      name: 'Merge PDF',
      shortDesc: 'Combine multiple files',
      icon: Combine,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      badge: 'Multi-doc',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'split' as const,
      name: 'Split & Extract',
      shortDesc: 'Extract pages & ranges',
      icon: Scissors,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badge: 'Fast',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'image-to-pdf' as const,
      name: 'Image to PDF',
      shortDesc: 'Convert JPG/PNG to PDF',
      icon: ImageIcon,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badge: 'Photo Book',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Privacy Guarantee Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-slate-50 to-blue-50/60 border border-slate-200 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 block">
              100% In-Browser Client Privacy
            </span>
            <span className="text-slate-500 text-[11px]">
              Unlike external cloud services, your PDFs are processed locally using WebAssembly & vector engines. Files never leave your device.
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-slate-600 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No File Size Limits
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Instant Processing
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Zero Upload Wait
          </span>
        </div>
      </div>

      {/* Tool Selector Tab Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md ring-2 ring-slate-900/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-white/10 text-white' : `${t.bgColor} ${t.color}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isActive ? 'bg-white/20 text-white' : t.badgeColor
                  }`}
                >
                  {t.badge}
                </span>
              </div>

              <div>
                <span className="text-xs sm:text-sm font-extrabold block truncate">
                  {t.name}
                </span>
                <span
                  className={`text-[10px] block truncate ${
                    isActive ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {t.shortDesc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tool Viewport */}
      <div className="w-full">
        {activeTool === 'editor' && <PdfEditorTool />}
        {activeTool === 'compressor' && <PdfCompressorTool />}
        {activeTool === 'merge' && <PdfMergeTool />}
        {activeTool === 'split' && <PdfSplitTool />}
        {activeTool === 'image-to-pdf' && <ImageToPdfTool />}
      </div>

      {/* Features & Security Matrix */}
      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-center text-lg sm:text-xl font-extrabold text-slate-900 mb-6">
          Why Professionals Trust Fluvia Flow PDF Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              Zero Cloud Uploads
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Legal documents, medical records, financial statements, and contracts stay on your computer. All processing happens in your browser RAM.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              Lightning Fast Vector Engine
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by pure WebAssembly vector operations. Merge hundreds of pages or compress 50MB PDFs in seconds without buffering.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <HardDrive className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1">
              No Daily File Limits
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Free to use with zero annoying 2-file per hour caps or watermarks forced on your output. Work continuously without interruptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
