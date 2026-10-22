import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import {
  Video,
  Image as ImageIcon,
  Mic,
  Scissors,
  Wand2,
  Sparkles,
  Layers,
  ArrowRight,
  Sliders,
  Shield,
  Zap,
  Globe2,
  Cpu,
  Subtitles,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

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
          desc: 'Switch between Fluvia Core, Runway Gen-3 Alpha, Luma Dream Machine Ray, and Flux 1.1 Pro without leaving the workspace.',
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
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-xs font-semibold text-violet-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for modern creative velocity
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Discover the full breadth of generative video, voice synthesis, multi-track editing, and export workflows.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((group, gIdx) => (
            <div key={gIdx}>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-8 border-b border-white/[0.08] pb-3 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                <span>{group.category}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.items.map((feat, fIdx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={fIdx}
                      className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 transition-all flex gap-5 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                          {feat.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-sky-950/40 border border-violet-500/30 text-center relative overflow-hidden">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Experience the future of video creation today
          </h3>
          <p className="mt-3 text-slate-300 max-w-lg mx-auto text-sm sm:text-base">
            No credit card required for initial explorer tests. Get 100 free credits upon signup.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-xl shadow-violet-600/30 transition-all"
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
