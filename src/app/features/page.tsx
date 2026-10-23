import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BRAND } from '@/lib/brand';
import {
  Video,
  Image as ImageIcon,
  Scissors,
  Wand2,
  Sparkles,
  Layers,
  ArrowRight,
  Cpu,
  Subtitles,
  Smartphone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Creative Features & Generation Tools',
  description:
    'Discover Fluvia Flow powerful features: Cinema Studio camera controls, Marketing Studio briefs, Storyboard AI copilot, and 4K cloud rendering.',
  alternates: {
    canonical: `${BRAND.siteUrl}/features`,
  },
  openGraph: {
    title: 'Fluvia Flow Features — Powerful AI Video & Content Studio',
    description:
      'Discover Fluvia Flow powerful features: Cinema Studio camera controls, Marketing Studio briefs, and Storyboard AI copilot.',
    url: `${BRAND.siteUrl}/features`,
    images: [
      {
        url: BRAND.ogImageAbsolute,
        width: 1200,
        height: 630,
        alt: 'Fluvia Flow Features',
      },
    ],
  },
};

export default function FeaturesPage() {
  const features = [
    {
      category: 'Generative AI Media',
      items: [
        {
          icon: Video,
          title: 'Text-to-Video Engine',
          desc: 'Synthesize full high-definition video clips with realistic motion, continuous camera tracking, and physically-accurate lighting directly from text prompts.',
        },
        {
          icon: ImageIcon,
          title: 'Image-to-Video Dynamics',
          desc: 'Animate any still photo, 3D character render, or product shot with smooth zooms, 360-degree orbital pans, and dynamic physics.',
        },
        {
          icon: Wand2,
          title: 'Script-to-Video Storyboards',
          desc: 'Input scripts or articles to instantly generate timed scene breakdowns, storyboard visuals, audio narration, and title overlays.',
        },
        {
          icon: Cpu,
          title: 'Multi-Model Provider Architecture',
          desc: 'Switch between Fluvia Core, Runway Gen-3 Alpha, Luma Dream Machine Ray, and Google Gemini Flash copilot without leaving the workspace.',
        },
      ],
    },
    {
      category: 'Professional Creative Studio',
      items: [
        {
          icon: Scissors,
          title: 'Nonlinear Timeline Editor',
          desc: 'Precise multi-track video, overlay, subtitle, and audio arrangement. Split, trim, reorder, adjust volume, and preview in real time.',
        },
        {
          icon: Subtitles,
          title: 'Auto Subtitles & Caption Styles',
          desc: 'Neural speech transcription with animated karaoke-style text highlight presets for viral social retention.',
        },
        {
          icon: Smartphone,
          title: 'Instant Multi-Format Aspect Switching',
          desc: 'Dynamically reformat timelines between 16:9 Landscape (YouTube), 9:16 Vertical (Reels/Shorts), and 1:1 Square (Instagram/LinkedIn).',
        },
        {
          icon: Layers,
          title: 'Integrated Brand Kits',
          desc: 'Store enterprise typography, brand colors, watermarks, and tone-of-voice directives for consistent organizational output.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen text-[#17211D] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/20 text-xs font-semibold text-emerald-700 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#17211D] tracking-tight">
            Built for modern creative velocity
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Discover the full breadth of generative video, voice synthesis, multi-track editing, and export workflows.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((group, gIdx) => (
            <div key={gIdx}>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17211D] mb-8 border-b border-emerald-500/10 pb-3 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>{group.category}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map((feat, fIdx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={fIdx}
                      className="p-6 rounded-3xl glass-card hover:border-emerald-500/40 transition-all flex gap-5 group shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-emerald-500/20">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#17211D] group-hover:text-emerald-700 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl glass-card border-emerald-500/30 text-center relative overflow-hidden shadow-xl bg-gradient-to-r from-emerald-50/80 via-white/80 to-pink-50/50">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#17211D]">
            Experience the future of video creation today
          </h3>
          <p className="mt-3 text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
            No credit card required for initial explorer tests. Get 100 free credits upon signup.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl shadow-emerald-500/25 transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
