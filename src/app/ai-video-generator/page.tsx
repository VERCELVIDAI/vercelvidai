import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { Video, Sparkles, Play, CheckCircle2, ArrowRight, Wand2, Sliders, Film } from 'lucide-react';

export default function AIVideoGeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col text-[#17211D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 mb-4 shadow-xs">
            <Video className="w-3.5 h-3.5 text-emerald-600" />
            <span>State-of-the-Art Diffusion & Transformers</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#17211D] tracking-tight">
            AI Video Generator
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-600">
            Produce cinema-grade footage, advertisements, and social reels from text descriptions or reference images.
          </p>
        </div>

        {/* Embedded Interactive Composer */}
        <div className="mb-20">
          <HeroComposer />
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center mb-4">
              <Film className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-[#17211D]">Cinematic Lighting & Depth</h3>
            <p className="mt-2 text-sm text-slate-600">
              Photorealistic volumetric rays, subsurface light scattering, and shallow depth of field engineered for film production.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 border border-pink-300 flex items-center justify-center mb-4">
              <Wand2 className="w-5 h-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-[#17211D]">Physics-Aware Motion</h3>
            <p className="mt-2 text-sm text-slate-600">
              Coherent fluid dynamics, realistic cloth physics, organic character gestures, and natural momentum across camera angles.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 border border-teal-300 flex items-center justify-center mb-4">
              <Sliders className="w-5 h-5 text-teal-700" />
            </div>
            <h3 className="text-lg font-bold text-[#17211D]">Multi-Camera Trajectories</h3>
            <p className="mt-2 text-sm text-slate-600">
              Execute drone tracking shots, 360-degree orbital loops, slow-motion zooms, and first-person POV fly-throughs.
            </p>
          </div>
        </div>

        {/* Sample Showcase Gallery */}
        <div className="my-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17211D] mb-8 text-center">
            Recent Generations from the Community
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Urban Runner in Emerald Rain',
                model: 'Fluvia Cinematic HD',
                video: '/media/login/login-hero-preview.mp4',
                prompt: 'Slow motion athlete running through Tokyo crosswalk, neon reflection in puddles.',
              },
              {
                title: 'Ocean Sunset Drone Sweep',
                model: 'Runway Gen-3',
                video: '/media/templates/tmpl-06-travel-reel.mp4',
                prompt: 'Golden hour drone shot descending toward breaking waves in Big Sur.',
              },
              {
                title: 'Minimalist Perfume Reveal',
                model: 'Luma Dream Machine Ray',
                video: '/media/templates/tmpl-02-luxury-perfume.mp4',
                prompt: 'Luxury glass fragrance bottle surrounded by botanical orchids and soft mist.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl glass-card border border-emerald-500/20 overflow-hidden group shadow-md hover:shadow-xl transition-all">
                <div className="aspect-video relative bg-slate-900">
                  <video
                    src={item.video}
                    playsInline
                    loop
                    autoPlay
                    muted
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[11px] font-mono text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/30">
                    {item.model}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#17211D] text-base">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-600 italic line-clamp-2">&ldquo;{item.prompt}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
