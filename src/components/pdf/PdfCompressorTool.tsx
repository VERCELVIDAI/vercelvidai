'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Sliders,
  Target,
  Palette,
  FileCheck,
  Eye,
  Info,
} from 'lucide-react';
import {
  compressPdfAdvanced,
  inspectPdf,
  formatBytes,
  AdvancedCompressOptions,
  AdvancedCompressionResult,
} from '@/lib/pdf/engine';

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);

  // Compression Mode: 'target_size' | 'preset' | 'manual' | 'lossless_vector'
  const [mode, setMode] = useState<'target_size' | 'preset' | 'manual' | 'lossless_vector'>('target_size');

  // Target Size Settings
  const [targetSizeVal, setTargetSizeVal] = useState<number>(200);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');

  // Preset Settings
  const [presetLevel, setPresetLevel] = useState<'extreme' | 'recommended' | 'low'>('recommended');

  // Manual Pro Settings
  const [quality, setQuality] = useState<number>(65); // 10% to 100%
  const [dpi, setDpi] = useState<72 | 100 | 150 | 200 | 300>(150);

  // Additional Optimizations
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);

  // Execution States
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [result, setResult] = useState<AdvancedCompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        alert('Please upload a valid PDF document.');
        return;
      }
      loadFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === 'application/pdf' || dropped.name.toLowerCase().endsWith('.pdf')) {
        loadFile(dropped);
      } else {
        alert('Please drop a valid PDF document.');
      }
    }
  };

  const loadFile = async (pdfFile: File) => {
    try {
      setErrorMsg(null);
      setFile(pdfFile);
      setResult(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);

      const buffer = await pdfFile.arrayBuffer();
      setFileBuffer(buffer);

      try {
        const info = await inspectPdf(buffer);
        setPageCount(info.pageCount);

        // Smart auto-preset for target size based on original size
        const originalKb = Math.round(buffer.byteLength / 1024);
        if (originalKb > 2000) {
          setTargetSizeVal(500);
          setTargetUnit('KB');
        } else if (originalKb > 500) {
          setTargetSizeVal(200);
          setTargetUnit('KB');
        } else {
          setTargetSizeVal(Math.max(50, Math.round(originalKb * 0.5)));
          setTargetUnit('KB');
        }
      } catch (e) {
        setPageCount(1);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to read PDF file. Please try another document.');
    }
  };

  const handleCompress = async () => {
    if (!fileBuffer || !file) return;

    try {
      setIsCompressing(true);
      setErrorMsg(null);
      setProgress(5);
      setProgressStatus('Preparing compression engine...');

      const targetKb = targetUnit === 'MB' ? targetSizeVal * 1024 : targetSizeVal;

      const options: AdvancedCompressOptions = {
        mode,
        targetSizeKb: mode === 'target_size' ? targetKb : undefined,
        presetLevel: mode === 'preset' ? presetLevel : undefined,
        quality: mode === 'manual' ? quality / 100 : undefined,
        dpi: mode === 'manual' ? dpi : undefined,
        grayscale,
        removeMetadata,
        onProgress: (pct, status) => {
          setProgress(Math.round(pct * 100));
          setProgressStatus(status);
        },
      };

      const res = await compressPdfAdvanced(fileBuffer, options);
      setResult(res);

      const blob = new Blob([res.pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Compression failed: ' + (err.message || 'Unknown processing error'));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const blob = new Blob([result.pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const suffix =
      mode === 'target_size'
        ? `-${targetSizeVal}${targetUnit}`
        : mode === 'lossless_vector'
        ? '-vector-optimized'
        : '-compressed';
    link.download = `${baseName}${suffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setFileBuffer(null);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setErrorMsg(null);
    setProgress(0);
    setProgressStatus('');
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Premium Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-white to-teal-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-xs font-bold text-emerald-800 shadow-2xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Size Targeting Engine • 100% In-Browser Private</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Advanced PDF Compressor
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Compress any PDF to exact target file sizes (e.g. 100 KB, 200 KB, 500 KB), reduce DPI resolution, convert to grayscale, or run lossless vector stream compression.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Zero Server Uploads
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Step 1: Upload or Document Display */}
        {!file ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-emerald-50/30 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-400 group-hover:scale-105 shadow-md flex items-center justify-center mx-auto mb-4 text-emerald-600 transition-all">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
              Click to select or drag & drop a PDF document
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
              Supports scanned PDFs, multi-page contracts, invoices, photo portfolios, and heavy reports.
            </p>
            <div className="inline-flex items-center gap-3 text-xs text-slate-400">
              <span>PDF up to 100MB</span>
              <span>•</span>
              <span>Client-Side Processing</span>
              <span>•</span>
              <span>Private & Safe</span>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">
                    Original Size: {formatBytes(file.size)}
                  </span>
                  <span>•</span>
                  <span>{pageCount} {pageCount === 1 ? 'Page' : 'Pages'}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shrink-0"
            >
              Change File
            </button>
          </div>
        )}

        {/* Step 2: Advanced Compression Mode Selection (When file is loaded) */}
        {file && !result && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Choose Compression Strategy</span>
              </label>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    id: 'target_size' as const,
                    title: '🎯 Custom Target Size',
                    desc: 'Set exact size in KB or MB',
                    badge: 'Most Popular',
                  },
                  {
                    id: 'preset' as const,
                    title: '⚡ Smart Presets',
                    desc: 'Extreme, Balanced or High',
                    badge: 'Quick',
                  },
                  {
                    id: 'manual' as const,
                    title: '🛠️ Pro Quality & DPI',
                    desc: 'Custom slider & 72-300 DPI',
                    badge: 'Advanced',
                  },
                  {
                    id: 'lossless_vector' as const,
                    title: '📄 Lossless Vector',
                    desc: 'Keep 100% selectable text',
                    badge: 'Text Safe',
                  },
                ].map((tab) => {
                  const isActive = mode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMode(tab.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isActive ? 'text-emerald-900' : 'text-slate-900'}`}>
                          {tab.title}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                          isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tab.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {tab.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: CUSTOM TARGET SIZE */}
            {mode === 'target_size' && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 border border-emerald-200 space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span>Enter Your Desired Output File Size</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Our adaptive engine automatically adjusts resolution, image streams, and compression to hit your target size.
                    </p>
                  </div>

                  {/* Input Group */}
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={10}
                      max={targetUnit === 'KB' ? 50000 : 50}
                      value={targetSizeVal}
                      onChange={(e) => setTargetSizeVal(Math.max(10, parseInt(e.target.value, 10) || 50))}
                      className="w-28 px-3.5 py-2 rounded-xl border-2 border-emerald-400 focus:border-emerald-600 focus:outline-hidden font-extrabold text-base text-slate-900 bg-white shadow-2xs text-center"
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
                      className="px-3 py-2 rounded-xl border border-slate-300 font-bold text-xs bg-white text-slate-800 shadow-2xs focus:outline-hidden"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                </div>

                {/* 1-Click Target Size Pills */}
                <div>
                  <span className="text-xs font-semibold text-slate-600 block mb-2">
                    Quick One-Click Target Presets:
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: '100 KB', val: 100, unit: 'KB' as const, hint: 'Govt Job / SSC / UPSC Portals' },
                      { label: '200 KB', val: 200, unit: 'KB' as const, hint: 'Job Application & Passport Forms' },
                      { label: '500 KB', val: 500, unit: 'KB' as const, hint: 'Email & WhatsApp Friendly' },
                      { label: '1 MB', val: 1, unit: 'MB' as const, hint: 'Standard Web Sharing' },
                      { label: '2 MB', val: 2, unit: 'MB' as const, hint: 'High-Res Presentation' },
                    ].map((p) => {
                      const isSelected = targetSizeVal === p.val && targetUnit === p.unit;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setTargetSizeVal(p.val);
                            setTargetUnit(p.unit);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
                          }`}
                          title={p.hint}
                        >
                          <span>{p.label}</span>
                          <span className={`text-[10px] font-normal opacity-80 hidden md:inline`}>
                            ({p.hint})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SMART PRESETS */}
            {mode === 'preset' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                {[
                  {
                    id: 'extreme' as const,
                    title: 'Extreme Compression',
                    reduction: '70%–90% reduction',
                    desc: 'Smallest file size. Best for strict portal upload caps where size is paramount.',
                    badge: 'Max Shrink',
                    border: 'hover:border-red-400',
                  },
                  {
                    id: 'recommended' as const,
                    title: 'Recommended (Balanced)',
                    reduction: '40%–70% reduction',
                    desc: 'Ideal balance. Preserves sharp reading typography while heavily reducing bulk.',
                    badge: 'Recommended',
                    border: 'hover:border-emerald-400',
                  },
                  {
                    id: 'low' as const,
                    title: 'High Visual Quality',
                    reduction: '20%–40% reduction',
                    desc: 'Subtle compression. Keeps photos, scans, and graphic colors near-original quality.',
                    badge: 'High Detail',
                    border: 'hover:border-blue-400',
                  },
                ].map((lvl) => {
                  const isSelected = presetLevel === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setPresetLevel(lvl.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-2 ring-emerald-500/20'
                          : `border-slate-200 bg-white ${lvl.border}`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{lvl.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {lvl.badge}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600 block mb-1">
                        {lvl.reduction}
                      </span>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {lvl.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: PRO QUALITY & DPI */}
            {mode === 'manual' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 animate-in fade-in duration-150">
                {/* Quality Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Image Stream Quality ({quality}%)
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {quality < 35 ? 'Aggressive' : quality < 70 ? 'Balanced' : 'High Quality'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={95}
                    step={5}
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>15% (Smallest Size)</span>
                    <span>50% (Standard)</span>
                    <span>95% (Maximum Clarity)</span>
                  </div>
                </div>

                {/* Resolution DPI Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Resolution Scale (DPI):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { dpi: 72 as const, label: '72 DPI', note: 'Web & Email' },
                      { dpi: 100 as const, label: '100 DPI', note: 'Compact Screen' },
                      { dpi: 150 as const, label: '150 DPI', note: 'Balanced Standard' },
                      { dpi: 200 as const, label: '200 DPI', note: 'High Definition' },
                      { dpi: 300 as const, label: '300 DPI', note: 'Print Resolution' },
                    ].map((d) => (
                      <button
                        key={d.dpi}
                        type="button"
                        onClick={() => setDpi(d.dpi)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          dpi === d.dpi
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <span className="text-xs font-bold block">{d.label}</span>
                        <span className={`text-[10px] block opacity-80`}>{d.note}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LOSSLESS VECTOR */}
            {mode === 'lossless_vector' && (
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>100% Selectable Vector Typography Safe</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Best for contracts, resumes, and legal texts. Optimizes cross-reference tables and compresses object streams without converting pages to images. Text remains 100% searchable and copy-pasteable.
                </p>
              </div>
            )}

            {/* Extra Pro Options: Grayscale & Metadata */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={grayscale}
                  onChange={(e) => setGrayscale(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-600" />
                    <span>Convert to Black & White (Grayscale)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Removes color channels. Shrinks scanned forms, receipts, and invoices by up to an additional 80%.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeMetadata}
                  onChange={(e) => setRemoveMetadata(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Remove Document Metadata & History
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Strips author tags, editing timestamps, and unneeded header bloat.
                  </span>
                </div>
              </label>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Progress Bar (When processing) */}
            {isCompressing && (
              <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3 animate-pulse">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>{progressStatus || 'Compressing document...'}</span>
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-emerald-200/70 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-emerald-700 text-center">
                  Processing 100% locally in your browser memory for total privacy...
                </p>
              </div>
            )}

            {/* Action CTA Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={isCompressing}
                onClick={handleCompress}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCompressing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Compressing to Target Size...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>
                      {mode === 'target_size'
                        ? `Compress PDF to ~${targetSizeVal} ${targetUnit}`
                        : mode === 'lossless_vector'
                        ? 'Run Lossless Vector Compression'
                        : 'Compress PDF Now'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Compression Result & Preview View */}
        {result && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Success Summary Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Compression Successful!</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">
                    Saved {result.savingsPercent}% of file size!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100">
                    Reduced by {formatBytes(result.savedBytes)} with vector fidelity and optimized image streams.
                  </p>
                </div>

                {/* Metrics Comparison */}
                <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/10 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-300 block uppercase">Before</span>
                    <span className="text-sm sm:text-base font-extrabold line-through text-slate-300">
                      {formatBytes(result.originalSize)}
                    </span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-emerald-300" />

                  <div className="text-center">
                    <span className="text-[10px] font-bold text-emerald-200 block uppercase">After</span>
                    <span className="text-base sm:text-xl font-black text-white">
                      {formatBytes(result.compressedSize)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Download & Re-compress */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 text-emerald-400" />
                <span>Download Compressed PDF ({formatBytes(result.compressedSize)})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-2xs transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-slate-600" />
                <span>Adjust Target & Re-compress</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-2xs transition-all cursor-pointer"
              >
                <span>Compress Another PDF</span>
              </button>
            </div>

            {/* Live Interactive Preview */}
            {previewUrl && (
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>Live Output Preview</span>
                  </span>
                  <span className="text-slate-400">
                    Verify visual sharpness before saving
                  </span>
                </div>
                <div className="w-full h-[520px] rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 shadow-inner">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full border-none"
                    title="Compressed PDF Preview"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
