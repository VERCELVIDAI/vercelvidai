'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VideoTemplate } from '@/lib/templates';
import {
  Play,
  ArrowRight,
  Heart,
  Clock,
  Maximize2,
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
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isHovered, inViewport, hasError]);

  const handleMobileCardTap = () => {
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
      className="group relative rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#5145CD]/40 hover:shadow-lg overflow-hidden transition-all duration-300 flex flex-col justify-between text-left"
    >
      {/* Video & Thumbnail Container */}
      <div
        onClick={handleMobileCardTap}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 select-none cursor-pointer"
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
            (e.target as HTMLImageElement).src = '/media/posters/poster-product.jpg';
          }}
        />

        {/* Real Playable Video Stream */}
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

        {/* Subtle Dark Gradient Overlay for readability on video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges: Category & Aspect Ratio */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-semibold text-[#17191D] border border-white/40 shadow-2xs">
              {template.category}
            </span>
            {template.badge && (
              <span className="px-2 py-0.5 rounded-lg bg-[#5145CD] text-[10px] font-semibold text-white shadow-2xs">
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
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white shadow-2xs'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Badges: Duration & Aspect */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-medium text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
            {template.aspectLabel}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-mono font-medium text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-indigo-300" />
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
            className="pointer-events-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#17191D] font-semibold text-xs shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 border border-[#E5E7EB]"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Watch Preview</span>
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-[#17191D] text-base group-hover:text-[#5145CD] transition-colors line-clamp-1">
              {template.title}
            </h3>
          </div>
          <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 mb-4 font-normal">
            {template.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#5145CD]/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bottom Row */}
        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="text-xs font-medium text-[#667085] hover:text-[#17191D] transition-colors flex items-center gap-1.5 p-1 rounded-lg hover:bg-[#F7F8FA]"
          >
            <Play className="w-3.5 h-3.5 text-[#5145CD] fill-[#5145CD]" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onUseTemplate(template)}
            className="px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <span>Use Template</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
