'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TEMPLATES_DATA, VideoTemplate } from '@/lib/templates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { VideoPreviewModal } from '@/components/templates/VideoPreviewModal';
import { Sparkles, ArrowRight, Layers, Flame } from 'lucide-react';

export function FeaturedTemplateCarousel() {
  const router = useRouter();
  const [previewTemplate, setPreviewTemplate] = useState<VideoTemplate | null>(null);

  // Curate top trending and new featured templates including vegetable video demo
  const featured = [
    TEMPLATES_DATA.find((t) => t.id === 'tmpl_19'),
    TEMPLATES_DATA.find((t) => t.id === 'tmpl_01'),
    TEMPLATES_DATA.find((t) => t.id === 'tmpl_20'),
    TEMPLATES_DATA.find((t) => t.id === 'tmpl_02'),
    TEMPLATES_DATA.find((t) => t.id === 'tmpl_23'),
    TEMPLATES_DATA.find((t) => t.id === 'tmpl_03'),
  ].filter((t): t is VideoTemplate => Boolean(t));

  const handleUseTemplate = async (template: VideoTemplate) => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push(`/login?returnUrl=${encodeURIComponent(`/templates/${template.slug}`)}&useTemplate=true`);
        return;
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${template.title} (Project)`,
          mediaType: 'video',
          thumbnailUrl: template.thumbnail,
          timeline: {
            durationSec: template.durationSec,
            aspectRatio: template.aspect,
            resolution: '1080p',
            tracks: [
              { id: 'trk_v1', type: 'video', name: 'Video Track' },
              { id: 'trk_t1', type: 'text', name: 'Subtitles Track' },
              { id: 'trk_a1', type: 'audio', name: 'Audio Track' },
            ],
            clips: [
              {
                id: `clp_feat_${Date.now()}`,
                trackId: 'trk_v1',
                type: 'video',
                title: template.scenes[0]?.title || 'Opening Hook',
                sourceUrl: template.videoPreview,
                startTimeSec: 0,
                durationSec: template.durationSec,
                volume: 1,
              },
            ],
          },
        }),
      });

      if (!res.ok) throw new Error('Could not create project');
      const data = await res.json();
      router.push(`/editor/${data.project.id}`);
    } catch (e: any) {
      alert(`Error initializing template: ${e.message}`);
    }
  };

  return (
    <section className="py-20 border-t border-emerald-500/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 font-bold text-xs uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-pink-500" />
              <span>Trending Templates</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#17211D] tracking-tight">
              Pre-built timelines.{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-pink-600 bg-clip-text text-transparent">
                Ready for instant remix.
              </span>
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-xl">
              Hover over any card to preview the pacing, audio synchronicity, and scene composition.
            </p>
          </div>

          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20 shrink-0"
          >
            <span>Explore All 18 Cinematic Templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Grid of Cards with hover-to-play */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={(t) => setPreviewTemplate(t)}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      </div>

      {previewTemplate && (
        <VideoPreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={handleUseTemplate}
          onSelectRelated={(t) => setPreviewTemplate(t)}
        />
      )}
    </section>
  );
}
