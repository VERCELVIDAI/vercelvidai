'use client';

import React, { useState } from 'react';
import { X, Play, Pause, Download, Share2, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface MythologyPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
  source?: string;
  culture?: string;
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
}

export function MythologyPlayerModal({
  isOpen,
  onClose,
  title,
  videoUrl,
  source,
  culture = 'Hindu Epic',
  aspectRatio = '9:16',
}: MythologyPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[90vh]">
        {/* Top Floating Controls */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between text-white">
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-500/40 text-[10px] font-bold text-amber-400">
            {culture} • {aspectRatio}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video / Visual Viewport */}
        <div className="relative w-full aspect-[9/16] bg-black flex items-center justify-center overflow-hidden">
          {videoUrl.endsWith('.mp4') ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={videoUrl} alt={title} className="w-full h-full object-cover" />
          )}

          {/* Bottom Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

          {/* Title & Attribution Overlay */}
          <div className="absolute bottom-4 inset-x-4 z-20 text-white space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              {source || 'Sacred Scripture'}
            </span>
            <h3 className="text-base font-black leading-tight line-clamp-2">
              {title}
            </h3>
            <div className="pt-2 flex items-center gap-2">
              <a
                href={videoUrl}
                download
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </a>

              <a
                href="/mythology/studio"
                className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Create Video</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
