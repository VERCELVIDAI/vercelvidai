'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  Combine,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  CheckCircle2,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { mergePdfs, inspectPdf, formatBytes } from '@/lib/pdf/engine';

interface FileItem {
  id: string;
  file: File;
  data: ArrayBuffer;
  pageCount: number;
}

export function PdfMergeTool() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedPageCount, setMergedPageCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
    };
  }, [mergedBlobUrl]);

  const handleFiles = async (files: FileList | File[]) => {
    const validPdfs = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (validPdfs.length === 0) {
      alert('Please select valid PDF files.');
      return;
    }

    const newItems: FileItem[] = [];
    for (const f of validPdfs) {
      const buffer = await f.arrayBuffer();
      let count = 1;
      try {
        const info = await inspectPdf(buffer);
        count = info.pageCount;
      } catch (e) {
        console.error(e);
      }
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file: f,
        data: buffer,
        pageCount: count,
      });
    }

    setItems((prev) => [...prev, ...newItems]);
    if (mergedBlobUrl) {
      URL.revokeObjectURL(mergedBlobUrl);
      setMergedBlobUrl(null);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === items.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setItems(newItems);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMerge = async () => {
    if (items.length < 2) {
      alert('Please add at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsMerging(true);
      await new Promise((r) => setTimeout(r, 400));
      const res = await mergePdfs(
        items.map((i) => ({ data: i.data, name: i.file.name }))
      );

      setMergedPageCount(res.totalPages);
      const blob = new Blob([res.pdfBytes], { type: 'application/pdf' });
      if (mergedBlobUrl) URL.revokeObjectURL(mergedBlobUrl);
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to merge PDFs: ' + (err.message || 'Unknown error'));
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = `Merged-Document-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-purple-50/40 via-white to-purple-50/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-2xs">
            <Combine className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Merge PDF Studio
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold uppercase tracking-wider">
                Multi-Doc
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Combine multiple documents, contracts, reports, and invoices into one unified master PDF.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Upload Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50/50 hover:bg-purple-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Click to upload multiple PDFs or drag them here
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            You can reorder the documents before finalizing the merge.
          </p>
        </div>

        {/* Selected Documents List */}
        {items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Documents to Combine ({items.length}) • Total Pages:{' '}
                {items.reduce((sum, i) => sum + i.pageCount, 0)}
              </span>
              <button
                onClick={() => setItems([])}
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center text-[10px] shrink-0">
                      {index + 1}
                    </span>
                    <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{item.file.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatBytes(item.file.size)} • {item.pageCount} Pages
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={() => moveItem(index, 'up')}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(index, 'down')}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 ml-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleMerge}
                disabled={isMerging || items.length < 2}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isMerging ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Merging Documents...</span>
                  </>
                ) : (
                  <>
                    <Combine className="w-4 h-4" />
                    <span>Merge {items.length} Files Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Banner */}
        {mergedBlobUrl && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-white to-purple-500/5 border border-purple-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    PDFs Successfully Merged!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Created a single master document containing {mergedPageCount} pages.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </button>
            </div>

            <iframe
              src={mergedBlobUrl}
              className="w-full h-80 rounded-xl border border-slate-300 shadow-inner bg-white"
              title="Merged Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
