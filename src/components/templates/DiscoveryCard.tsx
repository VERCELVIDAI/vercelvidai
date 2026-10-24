'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Play,
  Sparkles,
  Zap,
  UserPlus,
  UserCheck,
  Maximize2,
  AlertCircle,
  Clock,
  Film,
} from 'lucide-react';
import { VideoTemplate } from '@/lib/templates';

interface DiscoveryCardProps {
  template: VideoTemplate;
  isActivePlaying: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
  onSelect: (template: VideoTemplate) => void;
  onUseTemplate: (template: VideoTemplate) => void;
  onToggleLike: (templateId: string) => void;
  onToggleFollow: (creatorId: string) => void;
  isLiked?: boolean;
  isFollowing?: boolean;
}

export function DiscoveryCard({
  template,
  isActivePlaying,
  onHoverStart,
  onHoverEnd,
  onSelect,
  onUseTemplate,
  onToggleLike,
  onToggleFollow,
  isLiked = false,
  isFollowing = false,
}: DiscoveryCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(template.likesCount || 0);

  useEffect(() => {
    setOptimisticLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setLikeCount(template.likesCount || 0);
  }, [template.likesCount]);

  // Handle active video playback
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActivePlaying) {
      videoRef.current
        .play()
        .then(() => setVideoLoaded(true))
        .catch(() => {
          // Browser prevented autoplay or video issue
        });
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isActivePlaying]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !optimisticLiked;
    setOptimisticLiked(nextState);
    setLikeCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    onToggleLike(template.id);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFollow(template.creatorId);
  };

  const handleUseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUseTemplate(template);
  };

  // Determine aspect ratio class to enforce varied height in masonry columns
  const getAspectClass = () => {
    switch (template.aspect) {
      case '9:16':
        return 'aspect-[9/16] min-h-[360px] sm:min-h-[420px]';
      case '4:5':
        return 'aspect-[4/5] min-h-[300px] sm:min-h-[350px]';
      case '1:1':
        return 'aspect-square min-h-[260px] sm:min-h-[300px]';
      case '2.39:1':
        return 'aspect-[2.39/1] min-h-[170px] sm:min-h-[200px]';
      case '16:9':
      default:
        return 'aspect-video min-h-[200px] sm:min-h-[240px]';
    }
  };

  return (
    <div
      onClick={() => onSelect(template)}
      onMouseEnter={() => onHoverStart(template.id)}
      onMouseLeave={onHoverEnd}
      className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden bg-[#131917] border border-white/10 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 cursor-pointer select-none"
    >
      <div className={`relative w-full ${getAspectClass()} overflow-hidden bg-[#0c100f]`}>
        {/* Poster Image */}
        <img
          src={template.thumbnail}
          alt={template.title}
          loading="lazy"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isActivePlaying && videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Real Hover Video Preview */}
        {isActivePlaying && !hasError && (
          <video
            ref={videoRef}
            src={template.videoPreview}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
          />
        )}

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-20" />

        {/* Top Badges & Creator Info */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30 pointer-events-auto">
          {/* Creator Chip */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-xs max-w-[70%]">
            <img
              src={template.creatorAvatar}
              alt={template.creatorName}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/50 shrink-0"
            />
            <span className="text-[11px] font-medium text-white/90 truncate">
              {template.creatorName}
            </span>
            <button
              type="button"
              onClick={handleFollowClick}
              title={isFollowing ? 'Following creator' : 'Follow creator'}
              className="ml-0.5 text-white/60 hover:text-emerald-400 transition-colors p-0.5"
            >
              {isFollowing ? (
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <UserPlus className="w-3.5 h-3.5 hover:text-emerald-400" />
              )}
            </button>
          </div>

          {/* Aspect & Duration Badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
              {template.aspect}
            </span>
          </div>
        </div>

        {/* Center Play Indicator (fades out on active preview) */}
        {!isActivePlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white/80 ml-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Content & Prompt Snippet */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex flex-col gap-2 pointer-events-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                {template.category}
              </span>
              {template.badge && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
                  {template.badge}
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-emerald-300 transition-colors">
              {template.title}
            </h4>
            <p className="text-[11px] text-white/70 line-clamp-2 mt-0.5 font-normal leading-relaxed">
              {template.prompt || template.description}
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            {/* Quick "Use Template" CTA */}
            <button
              type="button"
              onClick={handleUseClick}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Template</span>
            </button>

            {/* Like Button */}
            <button
              type="button"
              onClick={handleLikeClick}
              className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1.5 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/90 hover:text-rose-400 transition-colors"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  optimisticLiked
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-white/80 group-hover:text-rose-400'
                } transition-colors`}
              />
              <span>{likeCount.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
