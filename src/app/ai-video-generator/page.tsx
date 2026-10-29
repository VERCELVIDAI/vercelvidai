import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { Video, Sparkles, Play, CheckCircle2, ArrowRight, Wand2, Sliders, Film } from 'lucide-react';

export default function AIVideoGeneratorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-xs font-bold text-[#5145CD] mb-4 shadow-2xs font-mono">
            <Video className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Google Gemini Omni & Neural Video</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#17191D] tracking-tight">
            AI Video Generator
          </h1>
          <p className="mt-4 text-base sm:text-xl text-[#667085]">
            Produce cinema-grade footage, advertisements, and social reels from text descriptions or reference images.
          </p>
        </div>

        {/* Embedded Interactive Composer */}
        <div className="mb-20">
          <HeroComposer />
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] flex items-center justify-center mb-4">
              <Film className="w-5 h-5 text-[#5145CD]" />
            </div>
            <h3 className="text-lg font-bold text-[#17191D]">Cinematic Lighting & Depth</h3>
            <p className="mt-2 text-sm text-[#667085]">
              Photorealistic volumetric rays, subsurface light scattering, and shallow depth of field engineered for advertising production.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] flex items-center justify-center mb-4">
              <Wand2 className="w-5 h-5 text-[#5145CD]" />
            </div>
            <h3 className="text-lg font-bold text-[#17191D]">Physics-Aware Motion</h3>
            <p className="mt-2 text-sm text-[#667085]">
              Coherent fluid dynamics, realistic cloth physics, organic character gestures, and natural momentum across camera angles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] flex items-center justify-center mb-4">
              <Sliders className="w-5 h-5 text-[#5145CD]" />
            </div>
            <h3 className="text-lg font-bold text-[#17191D]">Multi-Camera Trajectories</h3>
            <p className="mt-2 text-sm text-[#667085]">
              Execute drone tracking shots, 360-degree orbital loops, slow-motion zooms, and first-person POV fly-throughs.
            </p>
          </div>
        </div>

        {/* Sample Showcase Gallery */}
        <div className="my-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
                Production Ad Presets
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] mt-1">
                Featured 9:16 Viral Reels & Commercials
              </h2>
            </div>
            <Link
              href="/templates?type=video"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5145CD] hover:text-[#4338CA] transition-colors"
            >
              <span>Explore all video templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Empire Drop — Viral Cash UGC Hook',
                model: 'Gemini Omni 1.1 Flash',
                video: '/media/templates/tmpl-ugc-wealth-hook.mp4',
                poster: '/media/templates/poster-vid-ugc-wealth.jpg',
                badge: 'Viral Hook',
                duration: '15s',
                aspect: '9:16',
                prompt: 'High-energy viral social media hook of young creator in modern penthouse cascading thick brick stacks of hundred-dollar bills, dynamic handheld camera motion, luxury lifestyle aesthetic, natural bedroom window light, photorealistic 4k.',
              },
              {
                title: 'Matchday Celebration — Football Star Reel',
                model: 'Gemini Omni 1.1 Flash',
                video: '/media/templates/tmpl-sports-celebrity-reel.mp4',
                poster: '/media/templates/poster-vid-sports-celebrity.jpg',
                badge: 'Trending Reel',
                duration: '6s',
                aspect: '9:16',
                prompt: 'Cinematic celebration reel of football legend in red and green #7 national kit dancing with charismatic motion at gala banquet, studio softbox ambient fill light, sharp depth of field, 4k 60fps.',
              },
              {
                title: 'Costa Privée — Mediterranean Resort',
                model: 'Gemini Omni 1.1 Flash',
                video: '/media/templates/tmpl-mediterranean-resort.mp4',
                poster: '/media/templates/poster-vid-mediterranean-resort.jpg',
                badge: 'Featured Travel',
                duration: '11s',
                aspect: '9:16',
                prompt: 'Cinematic luxury travel commercial featuring distinguished silver-haired gentleman in crisp white linen shirt relaxing at seaside Mediterranean beach club terrace, warm sunlight, gentle bokeh, luxury vacation vibe, 4k ultra-hd.',
              },
              {
                title: 'Veloce Apex — Cyber Hyperkart Reveal',
                model: 'Gemini Omni 1.1 Flash',
                video: '/media/templates/tmpl-cyber-hyperkart.mp4',
                poster: '/media/templates/poster-vid-cyber-hyperkart.jpg',
                badge: 'Hot Automotive',
                duration: '16s',
                aspect: '9:16',
                prompt: 'Dramatic low-angle commercial reveal of futuristic custom twin-seat electric racing hyperkart in industrial concrete hangar, glossy black aero bodywork, wide track tires, atmospheric volumetric lighting, photorealistic automotive cinematography.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden group shadow-xs hover:border-[#5145CD]/40 hover:shadow-md transition-all flex flex-col justify-between">
                <div className="aspect-[9/16] relative bg-[#17191D] overflow-hidden">
                  <video
                    src={item.video}
                    poster={item.poster}
                    playsInline
                    loop
                    autoPlay
                    muted
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="bg-white/90 backdrop-blur-md text-[10px] font-mono text-[#5145CD] px-2 py-0.5 rounded border border-[#E0E7FF] font-semibold">
                      {item.badge}
                    </span>
                    <span className="bg-black/60 backdrop-blur-md text-[10px] font-mono text-white px-2 py-0.5 rounded border border-white/20">
                      {item.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                    <span className="bg-white/95 text-[#17191D] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs">
                      15 cr
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#17191D] text-sm line-clamp-1">{item.title}</h4>
                    <p className="mt-1 text-xs text-[#667085] italic line-clamp-2">&ldquo;{item.prompt}&rdquo;</p>
                  </div>
                  <Link
                    href={`/create?prompt=${encodeURIComponent(item.prompt)}&aspect=9:16&mode=video`}
                    className="w-full py-2 px-3 rounded-lg bg-[#F7F8FA] hover:bg-[#5145CD] text-[#17191D] hover:text-white border border-[#E5E7EB] hover:border-[#5145CD] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#5145CD] group-hover:text-white" />
                    <span>Create with Preset</span>
                  </Link>
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
