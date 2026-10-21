'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import {
  Sparkles,
  Layers,
  ArrowRight,
  Play,
  Film,
  Music,
  Clock,
  Ratio,
  CheckCircle2,
} from 'lucide-react';

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [isCloning, setIsCloning] = useState(false);

  const templateMap: Record<string, any> = {
    'instagram-reels-ecommerce': {
      title: 'Viral Luxury Product Reel',
      category: 'Instagram Reels',
      aspect: '9:16 Vertical',
      durationSec: 15,
      videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-tying-his-running-shoes-42352-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      description: 'Engineered specifically for Instagram Reels & TikTok e-commerce brands looking for rapid 3-second hook conversion rates.',
      scenes: [
        { time: '0:00 - 0:05', title: 'Macro Hook', desc: 'Dramatic close-up of shoe laces tightening with bass drop' },
        { time: '0:05 - 0:10', title: 'Action Sprint', desc: 'Urban dynamic glide through city street at sunset' },
        { time: '0:10 - 0:15', title: 'Brand CTA', desc: 'Logo lockup with 30% discount offer code' },
      ],
    },
    'youtube-shorts-tech': {
      title: 'Daily AI & Tech Breakdown',
      category: 'YouTube Shorts',
      aspect: '9:16 Vertical',
      durationSec: 20,
      videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-keyboard-41589-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      description: 'Ideal format for faceless AI news channels, software tutorials, and rapid daily tech discoveries.',
      scenes: [
        { time: '0:00 - 0:06', title: 'Question Hook', desc: 'High-contrast typography asking the central curiosity question' },
        { time: '0:06 - 0:13', title: 'Evidence & Screen', desc: 'Code typing and architecture breakdown diagram' },
        { time: '0:13 - 0:20', title: 'Subscribe CTA', desc: 'Animated YouTube subscribe badge and comment question' },
      ],
    },
    'cinematic-luxury-perfume': {
      title: 'Luxury Fragrance Cinematic Ad',
      category: 'Product Commercials',
      aspect: '16:9 Landscape',
      durationSec: 18,
      videoPreview: 'https://assets.mixkit.co/videos/preview/mixkit-perfume-bottle-and-flowers-42354-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      description: 'Broadcast-quality 4K perfume commercial with soft botanical lighting, mist simulations, and orchestral music.',
      scenes: [
        { time: '0:00 - 0:06', title: 'Opening Mist', desc: 'Glass bottle emerging from atmospheric morning fog' },
        { time: '0:06 - 0:12', title: 'Ingredients', desc: 'Artisanal jasmine flowers floating in pure mountain water' },
        { time: '0:12 - 0:18', title: 'Signature Reveal', desc: 'Golden sunlight hitting the flacon cap with brand title' },
      ],
    },
  };

  const tmpl = templateMap[params.slug] || templateMap['instagram-reels-ecommerce'];

  const handleUseTemplate = async () => {
    setIsCloning(true);
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push(`/signup?returnUrl=${encodeURIComponent(`/templates/${params.slug}`)}`);
        return;
      }

      // Create project from template
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${tmpl.title} (From Template)`,
          mediaType: 'video',
          thumbnailUrl: tmpl.thumbnail,
          timeline: {
            durationSec: tmpl.durationSec,
            aspectRatio: tmpl.aspect.startsWith('9:16') ? '9:16' : '16:9',
            resolution: '1080p',
            tracks: [
              { id: 'trk_v1', type: 'video', name: 'Scene Video Track' },
              { id: 'trk_t1', type: 'text', name: 'Kinetic Subtitles' },
              { id: 'trk_a1', type: 'audio', name: 'Background Track' },
            ],
            clips: [
              {
                id: 'clp_t1_1',
                trackId: 'trk_v1',
                type: 'video',
                title: 'Scene 1 Hook',
                sourceUrl: tmpl.videoPreview,
                startTimeSec: 0,
                durationSec: tmpl.durationSec,
                volume: 1,
              },
            ],
          },
        }),
      });

      if (!res.ok) throw new Error('Could not instantiate template');
      const data = await res.json();
      router.push(`/editor/${data.project.id}`);
    } catch (err: any) {
      alert(`Error cloning template: ${err.message}`);
      setIsCloning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Preview */}
          <div className="rounded-2xl glass-panel p-3 border border-white/10 shadow-2xl overflow-hidden relative">
            <div className={`${tmpl.aspect.startsWith('9:16') ? 'aspect-[9/16] max-w-xs mx-auto' : 'aspect-video'} rounded-xl overflow-hidden bg-black relative`}>
              <video
                src={tmpl.videoPreview}
                playsInline
                loop
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs text-violet-300 font-mono border border-violet-500/30">
                {tmpl.aspect}
              </div>
            </div>
          </div>

          {/* Details & Action */}
          <div>
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{tmpl.category}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {tmpl.title}
            </h1>
            <p className="mt-4 text-base text-slate-300 leading-relaxed">
              {tmpl.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>{tmpl.durationSec} seconds</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Ratio className="w-4 h-4 text-sky-400" />
                <span>{tmpl.aspect}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <Music className="w-4 h-4 text-emerald-400" />
                <span>Royalty Free Master Audio</span>
              </div>
            </div>

            {/* Scenes Breakdown */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Scene Structure & Timing
              </h3>
              <div className="space-y-2.5">
                {tmpl.scenes.map((scene: any, i: number) => (
                  <div key={i} className="p-3 bg-[#0E1017] rounded-xl border border-white/5 flex items-start gap-3">
                    <span className="text-xs font-mono text-violet-400 shrink-0 mt-0.5">{scene.time}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{scene.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{scene.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex items-center gap-4">
              <button
                type="button"
                onClick={handleUseTemplate}
                disabled={isCloning}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold rounded-xl shadow-xl shadow-violet-600/30 flex items-center gap-2 text-base transition-all disabled:opacity-50"
              >
                {isCloning ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>Remake in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/templates"
                className="px-5 py-4 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Back to Templates
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
