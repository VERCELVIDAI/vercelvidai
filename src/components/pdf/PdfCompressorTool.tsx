'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Gauge,
  Sliders,
} from 'lucide-react';
import { compressPdf, formatBytes, CompressionResult } from '@/lib/pdf/engine';

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [level, setLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
      setFile(pdfFile);
      setResult(null);
      const buffer = await pdfFile.arrayBuffer();
      setFileBuffer(buffer);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error(err);
      alert('Failed to read PDF file.');
    }
  };

  const handleCompress = async () => {
    if (!fileBuffer || !file) return;
    try {
      setIsCompressing(true);
      // Small artificial delay for smooth UI transition
      await new Promise((r) => setTimeout(r, 600));

      const res = await compressPdf(fileBuffer, level);
      setResult(res);

      const blob = new Blob([res.pdfBytes], { type: 'application/pdf' });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to compress PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const blob = new Blob([result.pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}-compressed.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tool Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50/40 via-white to-emerald-50/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                PDF Compressor
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold uppercase tracking-wider">
                  Smart Optimizer
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Shrink bulky PDF files by stripping redundant stream tables while retaining sharp vector text & images.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% In-Browser Privacy</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {!file ? (
          /* Dropzone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20 rounded-2xl p-12 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Select or Drop your PDF here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Reduce file size for emails, government portals, and faster sharing. No file upload limits.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active File Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-500">Original Size: {formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setFileBuffer(null);
                  setResult(null);
                  setPreviewUrl(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded hover:bg-slate-200 transition-colors"
              >
                Choose Different File
              </button>
            </div>

            {/* Compression Presets */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2.5">
                Select Compression Strength:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'extreme' as const,
                    title: 'Extreme Compression',
                    desc: 'Lowest file size. Perfect for email attachments & job portals.',
                    badge: 'Max Savings',
                    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
                  },
                  {
                    id: 'recommended' as const,
                    title: 'Recommended (Balanced)',
                    desc: 'Standard optimization. Crisp typography with 40-70% size drop.',
                    badge: 'Popular',
                    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  },
                  {
                    id: 'low' as const,
                    title: 'Light Compression',
                    desc: 'High print quality. Strips unneeded metadata and redundant fonts.',
                    badge: 'High Res',
                    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
                  },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setLevel(preset.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      level === preset.id
                        ? 'border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-slate-900">{preset.title}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${preset.badgeColor}`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleCompress}
                disabled={isCompressing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isCompressing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compressing Vector Streams...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Compress PDF Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Section */}
            {result && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 border border-emerald-200 mt-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">
                        Compression Complete!
                      </h4>
                      <p className="text-xs text-slate-600">
                        Your optimized PDF is ready with all {result.pageCount} pages preserved.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Compressed PDF</span>
                  </button>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Original
                    </span>
                    <span className="text-sm font-extrabold text-slate-700">
                      {formatBytes(result.originalSize)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Compressed
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      {formatBytes(result.compressedSize)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Saved
                    </span>
                    <span className="text-sm font-extrabold text-slate-800">
                      {formatBytes(result.savedBytes)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-600 text-white text-center shadow-xs">
                    <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
                      Reduction
                    </span>
                    <span className="text-sm font-extrabold">
                      {result.savingsPercent > 0 ? `-${result.savingsPercent}%` : 'Optimized'}
                    </span>
                  </div>
                </div>

                {/* Preview Frame */}
                {previewUrl && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Live Result Verification:
                    </span>
                    <iframe
                      src={previewUrl}
                      className="w-full h-80 rounded-xl border border-slate-300 shadow-inner bg-white"
                      title="Compressed PDF Preview"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
