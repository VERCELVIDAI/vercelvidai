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
      className="inline-block w-full break-inside-avoid mb-5 group relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-xl transition-all duration-300 cursor-pointer select-none"
    >
      {/* 100% CLEAN MEDIA CONTAINER — NO TEXT, NO BADGES, NO GRADIENTS OVER MEDIA */}
      <div className={`relative w-full ${getAspectClass()} overflow-hidden bg-[#17191D]`}>
        {/* Clean Poster Image */}
        <img
          src={template.thumbnail}
          alt={template.title}
          loading="lazy"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isVideo && isActivePlaying && videoLoaded && Boolean(template.videoPreview) ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Clean Video Preview (Zero Text Overlays) */}
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
      </div>

      {/* CLEAN METADATA BODY BELOW MEDIA (ZERO TEXT ON THE VIDEO/IMAGE) */}
      <div className="p-4 bg-white flex flex-col justify-between gap-3 border-t border-[#F1F3F5]">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-semibold text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded-md truncate max-w-[75%] border border-[#E0E7FF]">
              {template.category}
            </span>
            <span className="text-[10px] font-mono font-medium text-[#667085] bg-[#F1F3F5] px-1.5 py-0.5 rounded shrink-0">
              {template.aspect}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-[#17191D] line-clamp-1 group-hover:text-[#5145CD] transition-colors">
            {template.title}
          </h4>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F1F3F5]">
          <button
            type="button"
            onClick={handleUseClick}
            className="flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use Template</span>
          </button>

          <button
            type="button"
            onClick={handleLikeClick}
            className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#667085] hover:text-[#17191D] bg-[#F7F8FA] hover:bg-white text-xs font-mono transition-colors cursor-pointer"
            title="Like template"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                optimisticLiked ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
            <span className="text-[11px]">{likeCount.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
