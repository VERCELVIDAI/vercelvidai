'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Scissors,
  CheckCircle2,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';
import { splitPdf, inspectPdf, formatBytes, PdfDocumentInfo } from '@/lib/pdf/engine';

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [docInfo, setDocInfo] = useState<PdfDocumentInfo | null>(null);
  const [rangeExpr, setRangeExpr] = useState<string>('1');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set([1]));
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [extractedCount, setExtractedCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
    };
  }, [splitBlobUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        alert('Please choose a valid PDF file.');
        return;
      }
      loadFile(selected);
    }
  };

  const loadFile = async (pdfFile: File) => {
    try {
      setFile(pdfFile);
      const buffer = await pdfFile.arrayBuffer();
      setFileBuffer(buffer);
      const info = await inspectPdf(buffer);
      setDocInfo(info);

      // Default range: first page or 1-2
      const defaultRange = info.pageCount > 1 ? `1-${Math.min(3, info.pageCount)}` : '1';
      setRangeExpr(defaultRange);
      setSelectedPages(new Set([1]));

      if (splitBlobUrl) {
        URL.revokeObjectURL(splitBlobUrl);
        setSplitBlobUrl(null);
      }
    } catch (err: any) {
      console.error(err);
      alert('Error reading PDF: ' + (err.message || 'Unknown error'));
    }
  };

  const togglePageSelection = (pageNum: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNum)) {
        if (next.size > 1) next.delete(pageNum);
      } else {
        next.add(pageNum);
      }
      // Update range expression string
      const sorted = Array.from(next).sort((a, b) => a - b);
      setRangeExpr(sorted.join(', '));
      return next;
    });
  };

  const handleSplit = async () => {
    if (!fileBuffer || !file) return;
    try {
      setIsSplitting(true);
      await new Promise((r) => setTimeout(r, 400));
      const res = await splitPdf(fileBuffer, rangeExpr);
      setExtractedCount(res.extractedCount);

      const blob = new Blob([res.pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      if (splitBlobUrl) URL.revokeObjectURL(splitBlobUrl);
      const url = URL.createObjectURL(blob);
      setSplitBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to split PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = () => {
    if (!splitBlobUrl || !file) return;
    const link = document.createElement('a');
    link.href = splitBlobUrl;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}-extracted.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Split & Extract PDF
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">
                Range Extractor
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Extract individual pages, chapters, or custom ranges from large PDF books and documents.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/20 rounded-2xl p-12 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Select or Drop your PDF here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Extract exact pages or ranges with pixel-perfect vector quality.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <FileText className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatBytes(file.size)} • {docInfo?.pageCount || 1} Total Pages
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setFileBuffer(null);
                  setSplitBlobUrl(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded hover:bg-slate-200 transition-colors"
              >
                Change File
              </button>
            </div>

            {/* Range Expression Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Page Range to Extract:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={rangeExpr}
                  onChange={(e) => setRangeExpr(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  placeholder="e.g. 1-3, 5, 8-10"
                />
                <span className="text-xs text-slate-400 font-mono">
                  (Max: {docInfo?.pageCount || 1})
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Tip: Enter ranges like <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">1-3, 5</code> or click page chips below.
              </p>
            </div>

            {/* Interactive Page Chips (Quick Click) */}
            {docInfo && docInfo.pageCount > 0 && docInfo.pageCount <= 60 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Quick Page Selector:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {Array.from({ length: docInfo.pageCount }, (_, i) => i + 1).map((pageNum) => {
                    const isSelected = selectedPages.has(pageNum);
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => togglePageSelection(pageNum)}
                        className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Split Trigger Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleSplit}
                disabled={isSplitting || !rangeExpr.trim()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isSplitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Selected Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Extract Pages Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Preview */}
            {splitBlobUrl && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 border border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900">
                        Pages Successfully Extracted!
                      </h4>
                      <p className="text-xs text-slate-600">
                        Generated a new standalone PDF containing {extractedCount} extracted page(s).
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Extracted PDF</span>
                  </button>
                </div>

                <iframe
                  src={splitBlobUrl}
                  className="w-full h-80 rounded-xl border border-slate-300 shadow-inner bg-white"
                  title="Extracted PDF Preview"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
