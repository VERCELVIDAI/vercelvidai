'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { imagesToPdf, formatBytes } from '@/lib/pdf/engine';

interface ImageItem {
  id: string;
  file: File;
  data: ArrayBuffer;
  previewUrl: string;
}

export function ImageToPdfTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Fit'>('A4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [pdfBlobUrl, images]);

  const handleFiles = async (files: FileList | File[]) => {
    const validImages = Array.from(files).filter(
      (f) =>
        f.type.startsWith('image/jpeg') ||
        f.type.startsWith('image/png') ||
        f.name.toLowerCase().endsWith('.jpg') ||
        f.name.toLowerCase().endsWith('.jpeg') ||
        f.name.toLowerCase().endsWith('.png')
    );

    if (validImages.length === 0) {
      alert('Please upload JPEG or PNG images.');
      return;
    }

    const newItems: ImageItem[] = [];
    for (const img of validImages) {
      const buffer = await img.arrayBuffer();
      const preview = URL.createObjectURL(img);
      newItems.push({
        id: Math.random().toString(36).substring(7),
        file: img,
        data: buffer,
        previewUrl: preview,
      });
    }

    setImages((prev) => [...prev, ...newItems]);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...images];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setImages(newItems);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    try {
      setIsConverting(true);
      await new Promise((r) => setTimeout(r, 400));
      const res = await imagesToPdf(
        images.map((i) => ({
          data: i.data,
          type: i.file.type,
          name: i.file.name,
        })),
        { pageSize, margin, orientation }
      );

      const blob = new Blob([res.pdfBytes], { type: 'application/pdf' });
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to convert images to PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = `Images-Compilation-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-rose-50/40 via-white to-rose-50/40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Image to PDF Converter
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold uppercase tracking-wider">
                Photo Book
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Transform scans, receipts, photos, and mockups (JPG, PNG) into a high-resolution, print-ready PDF.
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
          className="border-2 border-dashed border-slate-300 hover:border-rose-500 bg-slate-50/50 hover:bg-rose-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            Click to upload photos or drag them here
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Select multiple JPG or PNG images to assemble into pages.
          </p>
        </div>

        {images.length > 0 && (
          <div className="space-y-6">
            {/* Conversion Options Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Page Dimensions
                </label>
                <select
                  value={pageSize}
                  onChange={(e: any) => setPageSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="A4">A4 (Standard Document)</option>
                  <option value="Letter">US Letter</option>
                  <option value="Fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Orientation
                </label>
                <select
                  disabled={pageSize === 'Fit'}
                  value={orientation}
                  onChange={(e: any) => setOrientation(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white disabled:opacity-40"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Margin ({margin}px)
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value={0}>No Margin (Edge-to-Edge)</option>
                  <option value={10}>Small (10px)</option>
                  <option value={20}>Standard (20px)</option>
                  <option value={40}>Wide (40px)</option>
                </select>
              </div>
            </div>

            {/* Images Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Selected Images ({images.length}) • Rearrange order:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group shadow-2xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] font-bold">
                      #{index + 1}
                    </div>

                    <div className="p-1.5 bg-white flex items-center justify-between border-t border-slate-200">
                      <div className="flex items-center gap-0.5">
                        <button
                          disabled={index === 0}
                          onClick={() => moveImage(index, 'up')}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3 h-3 text-slate-600" />
                        </button>
                        <button
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, 'down')}
                          className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3 h-3 text-slate-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeImage(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Convert Trigger */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compiling PDF Document...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Convert {images.length} Images to PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Banner */}
        {pdfBlobUrl && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/10 via-white to-rose-500/5 border border-rose-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    PDF Document Generated!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Compiled {images.length} image(s) into a clean vector-aligned PDF.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Assembled PDF</span>
              </button>
            </div>

            <iframe
              src={pdfBlobUrl}
              className="w-full h-80 rounded-xl border border-slate-300 shadow-inner bg-white"
              title="Image PDF Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
