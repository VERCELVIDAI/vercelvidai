'use client';

import React, { useState } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
  Video,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { MythProject, ExportedVideoRecord } from '@/lib/mythology/types';

interface Step7ExportProps {
  project: MythProject;
  onPrev: () => void;
  onRestart: () => void;
}

export function Step7Export({ project, onPrev, onRestart }: Step7ExportProps) {
  const [selectedRatios, setSelectedRatios] = useState<Array<'9:16' | '4:5' | '1:1' | '16:9'>>(['9:16']);
  const [isExporting, setIsExporting] = useState(false);
  const [exportedVideos, setExportedVideos] = useState<ExportedVideoRecord[]>(project.exportedVideos || []);
  const [viralPack, setViralPack] = useState(project.viralPack);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const toggleRatio = (ratio: '9:16' | '4:5' | '1:1' | '16:9') => {
    if (selectedRatios.includes(ratio)) {
      if (selectedRatios.length === 1) return;
      setSelectedRatios(selectedRatios.filter((r) => r !== ratio));
    } else {
      setSelectedRatios([...selectedRatios, ratio]);
    }
  };

  const handleRenderExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/mythology/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          aspectRatios: selectedRatios,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to render video.');
      }

      setExportedVideos(data.exportedVideos || []);
      setViralPack(data.viralPack);
    } catch (err: any) {
      alert(`Export error: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent p-5 rounded-2xl border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Step 7: Master Export & Viral Publishing Pack
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Export ready-to-post MP4 videos for Reels, Shorts & YouTube
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose your target aspect ratios and download the viral metadata pack with titles, hashtags & thumbnail.
          </p>
        </div>

        {exportedVideos.length === 0 && (
          <button
            type="button"
            onClick={handleRenderExport}
            disabled={isExporting}
            className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.02]"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering High-Res Video...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Render & Export MP4</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Aspect Ratio Selector */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Video className="w-4 h-4 text-indigo-500" />
          Select Target Social Media Formats
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: '9:16', name: '9:16 Vertical', desc: 'Reels, Shorts, TikTok' },
            { id: '4:5', name: '4:5 Portrait', desc: 'Instagram Feed Posts' },
            { id: '1:1', name: '1:1 Square', desc: 'Facebook & Twitter' },
            { id: '16:9', name: '16:9 Horizontal', desc: 'YouTube Full Videos' },
          ].map((ratio) => {
            const isSelected = selectedRatios.includes(ratio.id as any);
            return (
              <button
                key={ratio.id}
                type="button"
                onClick={() => toggleRatio(ratio.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {ratio.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {ratio.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exported Video Cards */}
      {exportedVideos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-500" />
            Your Rendered Videos (Ready for Download)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exportedVideos.map((vid, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 flex items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {vid.aspectRatio} MP4 Video
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase">
                      {vid.resolution}
                    </span>
                    {vid.hasWatermark ? (
                      <span className="text-[10px] text-slate-500 font-medium">Watermarked</span>
                    ) : (
                      <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> No Watermark
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Duration: {project.targetDurationSec}s • Stereo Audio • H.264 MP4
                  </span>
                </div>

                <a
                  href={vid.videoUrl}
                  download={`mythology-${project.id}-${vid.aspectRatio}.mp4`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP4</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Viral Social Media Publishing Pack */}
      {viralPack && (
        <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-white dark:bg-slate-900 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Viral Social Media Publishing Pack
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              High CTR Optimization
            </span>
          </div>

          {/* Titles */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Suggested Viral YouTube/Reels Titles:
            </span>
            <div className="space-y-2">
              {viralPack.suggestedTitles.map((title, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white"
                >
                  <span className="font-medium pr-2 line-clamp-1">{title}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(title, `title_${i}`)}
                    className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer shrink-0"
                    title="Copy Title"
                  >
                    {copiedField === `title_${i}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                25+ High-Engagement Hashtags:
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(viralPack.hashtags.join(' '), 'hashtags')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'hashtags' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy All Hashtags</span>
              </button>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              {viralPack.hashtags.join(' ')}
            </div>
          </div>
        </div>
      )}

      {/* Final Action Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Timeline</span>
        </button>

        <div className="flex items-center gap-3">
          <a
            href="/mythology/dashboard"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View in Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onRestart}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Another Epic</span>
          </button>
        </div>
      </div>
    </div>
  );
}
