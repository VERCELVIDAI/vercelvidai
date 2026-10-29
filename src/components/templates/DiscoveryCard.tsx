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
  Image as ImageIcon,
  Type,
} from 'lucide-react';
import { CreativeTemplate, VideoTemplate } from '@/lib/templates';

interface DiscoveryCardProps {
  template: CreativeTemplate;
  isActivePlaying: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
  onSelect: (template: CreativeTemplate) => void;
  onUseTemplate: (template: CreativeTemplate) => void;
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
        .catch(() => {});
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

  const getAspectClass = () => {
    switch (template.aspect) {
      case '9:16':
        return 'aspect-[9/16] min-h-[360px] sm:min-h-[420px]';
      case '4:5':
        return 'aspect-[4/5] min-h-[300px] sm:min-h-[350px]';
      case '1:1':
        return 'aspect-square min-h-[260px] sm:min-h-[300px]';
      case '16:9':
      default:
        return 'aspect-[16/9] min-h-[200px] sm:min-h-[240px]';
    }
  };

  const isVideo = template.type === 'video' || (!template.type && Boolean(template.videoPreview));
  const isImage = template.type === 'image';
  const isText = template.type === 'text-animation';

  return (
    <div
      onClick={() => onSelect(template)}
      onMouseEnter={() => {
        if (isVideo && Boolean(template.videoPreview)) {
          onHoverStart(template.id);
        }
      }}
      onMouseLeave={onHoverEnd}
      className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all duration-300 cursor-pointer select-none"
    >
      <div className={`relative w-full ${getAspectClass()} overflow-hidden bg-slate-900`}>
        {/* Poster Image */}
        <img
          src={template.thumbnail}
          alt={template.title}
          loading="lazy"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isVideo && isActivePlaying && videoLoaded && Boolean(template.videoPreview) ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Real Hover Video Preview */}
        {isVideo && isActivePlaying && Boolean(template.videoPreview) && !hasError && (
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

        {/* Gradient Overlay for Readable Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 opacity-75 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none z-20" />

        {/* Top Badges & Creator Info */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30 pointer-events-auto">
          {/* Creator Chip */}
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-xs max-w-[70%]">
            <img
              src={template.creatorAvatar}
              alt={template.creatorName}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
            <span className="text-[11px] font-medium text-white truncate">
              {template.creatorName}
            </span>
            <button
              type="button"
              onClick={handleFollowClick}
              title={isFollowing ? 'Following creator' : 'Follow creator'}
              className="ml-0.5 text-white/70 hover:text-white transition-colors p-0.5"
            >
              {isFollowing ? (
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <UserPlus className="w-3.5 h-3.5 hover:text-white" />
              )}
            </button>
          </div>

          {/* Format & Credit Badge */}
          <div className="flex items-center gap-1.5">
            {isImage ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5145CD] text-white flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                <span>5 cr</span>
              </span>
            ) : isText ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-white border border-white/10 flex items-center gap-1">
                <Type className="w-3 h-3" />
                <span>Text</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5145CD] text-white flex items-center gap-1 font-semibold">
                <Film className="w-3 h-3" />
                <span>15 cr</span>
              </span>
            )}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
              {template.aspect}
            </span>
          </div>
        </div>

        {/* Center Indicator: Play Icon for video cards when not playing */}
        {isVideo && !isActivePlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Content & Prompt Snippet */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex flex-col gap-2 pointer-events-auto text-left">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md">
                {template.category}
              </span>
              {template.badge && (
                <span className="text-[10px] font-semibold text-amber-200 bg-amber-900/60 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                  {template.badge}
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1 transition-colors">
              {template.title}
            </h4>
            <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5 font-normal leading-relaxed">
              {template.prompt || template.description}
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/15">
            <button
              type="button"
              onClick={handleUseClick}
              className="px-3 py-1.5 rounded-xl font-semibold text-[11px] flex items-center gap-1.5 bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use Template</span>
            </button>

            {/* Like Button */}
            <button
              type="button"
              onClick={handleLikeClick}
              className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white transition-colors"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  optimisticLiked
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-white/80 group-hover:text-white'
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
