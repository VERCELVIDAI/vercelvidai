'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Upload,
  Download,
  RotateCw,
  Trash2,
  Type,
  Stamp,
  Hash,
  Eye,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react';
import {
  applyPdfEdits,
  inspectPdf,
  formatBytes,
  TextAnnotation,
  WatermarkConfig,
  PageNumberConfig,
  PageTransform,
  PdfDocumentInfo,
} from '@/lib/pdf/engine';

export function PdfEditorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [docInfo, setDocInfo] = useState<PdfDocumentInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'text' | 'watermark' | 'pages' | 'numbers'>('text');

  // Text Annotation State
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [newText, setNewText] = useState<string>('Approved by Fluvia Flow');
  const [textColor, setTextColor] = useState<string>('#111827');
  const [textSize, setTextSize] = useState<number>(14);
  const [textOpacity, setTextOpacity] = useState<number>(1);
  const [textFont, setTextFont] = useState<'Helvetica' | 'Helvetica-Bold' | 'Times-Roman' | 'Courier'>('Helvetica-Bold');
  const [textX, setTextX] = useState<number>(50);
  const [textY, setTextY] = useState<number>(50);

  // Watermark State
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    text: 'CONFIDENTIAL',
    size: 48,
    color: '#EF4444',
    opacity: 0.25,
    rotation: 45,
    applyToAll: true,
  });
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);

  // Page Numbers State
  const [pageNumbers, setPageNumbers] = useState<PageNumberConfig>({
    enabled: false,
    format: 'page_n_of_total',
    position: 'bottom-center',
    size: 10,
    color: '#6B7280',
    startFrom: 1,
  });

  // Page Transforms (Rotations / Deletions)
  const [pageTransforms, setPageTransforms] = useState<Record<number, PageTransform>>({});

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a valid PDF file.');
        return;
      }
      loadPdf(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === 'application/pdf' || dropped.name.toLowerCase().endsWith('.pdf')) {
        loadPdf(dropped);
      } else {
        alert('Please drop a valid PDF file.');
      }
    }
  };

  const loadPdf = async (pdfFile: File) => {
    try {
      setIsProcessing(true);
      setFile(pdfFile);
      const buffer = await pdfFile.arrayBuffer();
      setFileBuffer(buffer);

      const info = await inspectPdf(buffer);
      setDocInfo(info);
      setCurrentPage(0);
      setAnnotations([]);
      setPageTransforms({});

      // Create initial preview
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setStatusMessage('PDF loaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to read PDF file: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Add Annotation
  const handleAddAnnotation = () => {
    if (!newText.trim()) return;
    const newAnn: TextAnnotation = {
      id: Math.random().toString(36).substring(7),
      pageIndex: currentPage,
      text: newText,
      x: textX,
      y: textY,
      size: textSize,
      color: textColor,
      fontFamily: textFont,
      opacity: textOpacity,
    };
    setAnnotations((prev) => [...prev, newAnn]);
    setStatusMessage(`Text added to Page ${currentPage + 1}. Click "Render Preview" to apply.`);
  };

  // Remove Annotation
  const handleRemoveAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  // Page Rotate
  const handleRotateCurrentPage = () => {
    setPageTransforms((prev) => {
      const current = prev[currentPage] || { pageIndex: currentPage, rotationDelta: 0 };
      return {
        ...prev,
        [currentPage]: {
          ...current,
          rotationDelta: (current.rotationDelta + 90) % 360,
        },
      };
    });
    setStatusMessage(`Page ${currentPage + 1} rotated 90°. Click "Render Preview" to apply.`);
  };

  // Page Delete
  const handleDeleteCurrentPage = () => {
    if (!docInfo || docInfo.pageCount <= 1) {
      alert('Cannot delete the only page in the document.');
      return;
    }
    setPageTransforms((prev) => ({
      ...prev,
      [currentPage]: {
        pageIndex: currentPage,
        rotationDelta: prev[currentPage]?.rotationDelta || 0,
        deleted: !prev[currentPage]?.deleted,
      },
    }));
  };

  // Re-render Edited PDF Preview
  const handleRenderPreview = async () => {
    if (!fileBuffer) return;
    try {
      setIsProcessing(true);
      setStatusMessage('Applying edits & rendering preview...');
      const editedBytes = await applyPdfEdits(fileBuffer, {
        annotations,
        watermark: watermarkEnabled ? watermark : undefined,
        pageNumbers: pageNumbers.enabled ? pageNumbers : undefined,
        pageTransforms,
      });

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const blob = new Blob([editedBytes], { type: 'application/pdf' });
      const newUrl = URL.createObjectURL(blob);
      setPreviewUrl(newUrl);
      setStatusMessage('Preview updated with all changes!');
    } catch (err: any) {
      console.error(err);
      alert('Error updating preview: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Export / Download Edited PDF
  const handleDownload = async () => {
    if (!fileBuffer || !file) return;
    try {
      setIsProcessing(true);
      const editedBytes = await applyPdfEdits(fileBuffer, {
        annotations,
        watermark: watermarkEnabled ? watermark : undefined,
        pageNumbers: pageNumbers.enabled ? pageNumbers : undefined,
        pageTransforms,
      });

      const blob = new Blob([editedBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      link.download = `${baseName}-edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage('PDF downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate final PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Tool Header */}
      <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 via-white to-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                PDF Editor Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-wider">
                  Pro Client
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Add vector text, stamps, confidential watermarks, rotate, reorder, and stamp page numbers with zero server uploads.
              </p>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRenderPreview}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                title="Refresh preview with recent changes"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Render Preview</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-6 sm:p-8">
        {!file ? (
          /* Drag and Drop Zone */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-12 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Drop your PDF here, or <span className="text-blue-600 underline">browse computer</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Supports any multi-page PDF document. 100% private and processed on-device.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls Panel */}
            <div className="lg:col-span-5 space-y-5">
              {/* File Info Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="truncate pr-2">
                  <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatBytes(file.size)} • {docInfo?.pageCount || 1} Pages
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setFileBuffer(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Change
                </button>
              </div>

              {/* Tool Category Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'text' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-slate-900'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => setActiveTab('watermark')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'watermark' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-slate-900'
                  }`}
                >
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Watermark</span>
                </button>
                <button
                  onClick={() => setActiveTab('pages')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'pages' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Pages</span>
                </button>
                <button
                  onClick={() => setActiveTab('numbers')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    activeTab === 'numbers' ? 'bg-white text-blue-600 shadow-2xs font-extrabold' : 'hover:text-slate-900'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Numbers</span>
                </button>
              </div>

              {/* Tab 1: Text Annotations */}
              {activeTab === 'text' && (
                <div className="p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Add Text to Page {currentPage + 1}</span>
                    <span className="text-[11px] text-slate-400 font-mono">X:{textX} Y:{textY}</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Text Content</label>
                    <input
                      type="text"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter text..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Font Family</label>
                      <select
                        value={textFont}
                        onChange={(e: any) => setTextFont(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      >
                        <option value="Helvetica">Helvetica</option>
                        <option value="Helvetica-Bold">Helvetica Bold</option>
                        <option value="Times-Roman">Times New Roman</option>
                        <option value="Courier">Courier Mono</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Font Size ({textSize}pt)</label>
                      <input
                        type="range"
                        min="8"
                        max="72"
                        value={textSize}
                        onChange={(e) => setTextSize(parseInt(e.target.value, 10))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                        />
                        <span className="text-xs font-mono text-slate-600">{textColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Position (X, Y)</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={textX}
                          onChange={(e) => setTextX(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-2 py-1 text-xs border border-slate-300 rounded"
                          placeholder="X"
                        />
                        <span className="text-slate-400 text-xs">/</span>
                        <input
                          type="number"
                          value={textY}
                          onChange={(e) => setTextY(parseInt(e.target.value, 10) || 0)}
                          className="w-16 px-2 py-1 text-xs border border-slate-300 rounded"
                          placeholder="Y"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddAnnotation}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    + Place Text on Page {currentPage + 1}
                  </button>

                  {/* List of Current Annotations */}
                  {annotations.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-600 block mb-2">
                        Staged Annotations ({annotations.length})
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {annotations.map((ann) => (
                          <div
                            key={ann.id}
                            className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="truncate pr-2 font-medium text-slate-700">
                              P{ann.pageIndex + 1}: &quot;{ann.text}&quot;
                            </span>
                            <button
                              onClick={() => handleRemoveAnnotation(ann.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Watermark */}
              {activeTab === 'watermark' && (
                <div className="p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Watermark Configuration</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watermarkEnabled}
                        onChange={(e) => setWatermarkEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Watermark Stamp Text</label>
                    <input
                      type="text"
                      value={watermark.text}
                      onChange={(e) => setWatermark((prev) => ({ ...prev, text: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                      placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Rotation ({watermark.rotation}°)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="90"
                        value={watermark.rotation}
                        onChange={(e) => setWatermark((prev) => ({ ...prev, rotation: parseInt(e.target.value, 10) }))}
                        className="w-full accent-blue-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Opacity ({Math.round(watermark.opacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={watermark.opacity}
                        onChange={(e) => setWatermark((prev) => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={watermark.color}
                          onChange={(e) => setWatermark((prev) => ({ ...prev, color: e.target.value }))}
                          className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0"
                        />
                        <span className="text-xs font-mono text-slate-600">{watermark.color}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Pages</label>
                      <select
                        value={watermark.applyToAll ? 'all' : 'current'}
                        onChange={(e) =>
                          setWatermark((prev) => ({
                            ...prev,
                            applyToAll: e.target.value === 'all',
                            pageIndex: currentPage,
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                      >
                        <option value="all">All Pages</option>
                        <option value="current">Current Page Only ({currentPage + 1})</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Pages Management */}
              {activeTab === 'pages' && (
                <div className="p-4 rounded-xl border border-slate-200 space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">
                    Manage Page {currentPage + 1} of {docInfo?.pageCount || 1}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleRotateCurrentPage}
                      className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCw className="w-4 h-4 text-blue-600" />
                      <span>Rotate 90°</span>
                    </button>

                    <button
                      onClick={handleDeleteCurrentPage}
                      className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                        pageTransforms[currentPage]?.deleted
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                          : 'bg-red-50 hover:bg-red-100 text-red-600'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>
                        {pageTransforms[currentPage]?.deleted ? 'Restore Page' : 'Mark to Delete'}
                      </span>
                    </button>
                  </div>

                  {pageTransforms[currentPage]?.deleted && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>This page is scheduled to be removed upon export.</span>
                    </div>
                  )}

                  {/* Page Navigation Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-slate-600">
                      Page {currentPage + 1} of {docInfo?.pageCount || 1}
                    </span>
                    <button
                      disabled={!docInfo || currentPage >= docInfo.pageCount - 1}
                      onClick={() => setCurrentPage((p) => Math.min((docInfo?.pageCount || 1) - 1, p + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Page Numbers */}
              {activeTab === 'numbers' && (
                <div className="p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Automatic Page Numbering</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pageNumbers.enabled}
                        onChange={(e) =>
                          setPageNumbers((prev) => ({ ...prev, enabled: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Number Format</label>
                    <select
                      value={pageNumbers.format}
                      onChange={(e: any) =>
                        setPageNumbers((prev) => ({ ...prev, format: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    >
                      <option value="page_n_of_total">Page 1 of 10</option>
                      <option value="page_n">Page 1</option>
                      <option value="number">1 (Bare digit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Position</label>
                    <select
                      value={pageNumbers.position}
                      onChange={(e: any) =>
                        setPageNumbers((prev) => ({ ...prev, position: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                    >
                      <option value="bottom-center">Bottom Center (Standard)</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right (Header)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Status Banner */}
              {statusMessage && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>

            {/* Right Live PDF Viewer Panel */}
            <div className="lg:col-span-7 bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center min-h-[500px]">
              {previewUrl ? (
                <div className="w-full h-full flex flex-col">
                  <div className="w-full flex items-center justify-between pb-3 text-xs text-slate-500 font-mono">
                    <span>Active Preview: Vector PDF Stream</span>
                    <span>100% Client Protected</span>
                  </div>
                  <iframe
                    src={previewUrl}
                    className="w-full h-[580px] rounded-xl border border-slate-300 shadow-inner bg-white"
                    title="PDF Live Preview"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400 p-8">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Preview will appear here once loaded</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
