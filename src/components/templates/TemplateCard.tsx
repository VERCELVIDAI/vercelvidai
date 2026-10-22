'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoTemplate } from '@/lib/templates';
import {
  Play,
  Pause,
  ArrowRight,
  Heart,
  Clock,
  Sparkles,
  Maximize2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface TemplateCardProps {
  template: VideoTemplate;
  onPreview: (template: VideoTemplate) => void;
  onUseTemplate: (template: VideoTemplate) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (templateId: string) => void;
}

export function TemplateCard({
  template,
  onPreview,
  onUseTemplate,
  isFavorited = false,
  onToggleFavorite,
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Viewport detection via IntersectionObserver
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInViewport(entry.isIntersecting);
          if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  // Handle Play/Pause on hover or viewport autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    if (isHovered && inViewport) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay policy prevented playback without interaction
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isHovered, inViewport, hasError]);

  const handleMobileCardTap = () => {
    // On touch devices without hover, tap toggles playback
    const video = videoRef.current;
    if (!video || hasError) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl glass-card border border-emerald-500/20 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between text-left bg-white/80 backdrop-blur-md"
    >
      {/* Video & Thumbnail Container */}
      <div
        onClick={handleMobileCardTap}
        className="relative aspect-[16/10] overflow-hidden bg-slate-900 select-none cursor-pointer"
      >
        {/* Poster Image */}
        <img
          src={template.thumbnail}
          alt={template.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isPlaying && videoLoaded && !hasError ? 'opacity-0' : 'opacity-100'
          }`}
          onError={(e) => {
            // Graceful fallback to local poster
            (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
          }}
        />

        {/* Real Playable Video Stream (Muted on hover / viewport) */}
        {!hasError && (
          <video
            ref={videoRef}
            src={template.videoPreview}
            playsInline
            muted
            loop
            preload="metadata"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setHasError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isPlaying && videoLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges: Category & Aspect Ratio */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-white/10">
              {template.category}
            </span>
            {template.badge && (
              <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 text-[10px] font-bold text-white shadow-xs">
                {template.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(template.id);
                }}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                  isFavorited
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Badges: Duration & Aspect */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            {template.aspectLabel}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{template.duration}</span>
          </div>
        </div>

        {/* Hover Center Overlay: Quick Preview Button */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="pointer-events-auto px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-900 font-bold text-xs shadow-xl flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Watch Preview</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-[#17211D] text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
              {template.title}
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4 font-normal">
            {template.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bottom Row */}
        <div className="pt-4 border-t border-emerald-500/15 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1.5 p-1 rounded-lg hover:bg-emerald-50/50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all active:scale-95"
          >
            <span>Use Template</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
