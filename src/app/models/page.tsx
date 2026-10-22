import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Cpu, Sparkles, CheckCircle2, ArrowRight, Zap, Shield, Video, Image as ImageIcon, Mic } from 'lucide-react';

export default function ModelsPage() {
  const models = [
    {
      id: 'fluvia-cinematic-v1',
      name: 'Fluvia Cinematic HD',
      provider: 'Fluvia Core Neural Architecture',
      type: 'video',
      resolutions: ['720p', '1080p'],
      durations: '5s, 10s',
      aspectRatios: ['16:9', '9:16', '1:1'],
      costCredits: 25,
      badge: 'Ultra Fast',
      desc: 'Optimized for high-speed video inference with physically accurate illumination and zero queue wait times.',
    },
    {
      id: 'runway-gen3',
      name: 'Runway Gen-3 Alpha Turbo',
      provider: 'Runway Research Engine',
      type: 'video',
      resolutions: ['1080p', '4k'],
      durations: '5s, 10s, 15s',
      aspectRatios: ['16:9', '9:16'],
      costCredits: 50,
      badge: 'Cinema Quality',
      desc: 'Industry benchmark for dramatic human motion, realistic camera kinetics, and complex narrative choreography.',
    },
    {
      id: 'luma-ray',
      name: 'Luma Dream Machine Ray',
      provider: 'Luma AI',
      type: 'video',
      resolutions: ['1080p'],
      durations: '5s, 10s',
      aspectRatios: ['16:9', '9:16', '1:1'],
      costCredits: 40,
      badge: 'Fluid Physics',
      desc: 'Excels at rapid action sports, fluid dynamics, car commercials, and 3D environment fly-throughs.',
    },
    {
      id: 'fal-flux-pro',
      name: 'Flux 1.1 Pro Vision',
      provider: 'Black Forest Labs & Fal.ai',
      type: 'image',
      resolutions: ['1024x1024', '1920x1080', '1080x1920'],
      durations: 'Instant',
      aspectRatios: ['1:1', '16:9', '9:16'],
      costCredits: 5,
      badge: 'Photoreal Images',
      desc: 'State-of-the-art prompt fidelity and typographic rendering for hyper-detailed commercial product photos.',
    },
    {
      id: 'eleven-multilingual',
      name: 'ElevenLabs Neural Voice HD',
      provider: 'ElevenLabs Audio AI',
      type: 'voice',
      resolutions: ['48kHz Lossless'],
      durations: 'Up to 30 min',
      aspectRatios: ['Audio Master'],
      costCredits: 10,
      badge: '29 Languages',
      desc: 'Human emotional resonance, natural conversational breathing, and pitch dynamics in 29+ world languages.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-xs font-semibold text-violet-400 mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Multi-Provider Model Registry</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Foundation AI Models
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Transparent pricing, official API integration, and continuous benchmarking across top global generative weights.
          </p>
        </div>

        <div className="space-y-6">
          {models.map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-violet-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <h3 className="text-xl font-bold text-white">{m.name}</h3>
                  <span className="text-[11px] font-bold text-violet-300 bg-violet-950/80 px-2.5 py-0.5 rounded border border-violet-500/30">
                    {m.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">by {m.provider}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{m.desc}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <span>Resolutions: <strong className="text-slate-200">{m.resolutions.join(', ')}</strong></span>
                  <span>•</span>
                  <span>Durations: <strong className="text-slate-200">{m.durations}</strong></span>
                  <span>•</span>
                  <span>Ratios: <strong className="text-slate-200">{m.aspectRatios.join(', ')}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-lg">
                    <Zap className="w-4 h-4" />
                    <span>{m.costCredits} credits</span>
                  </div>
                  <span className="text-[11px] text-slate-400">per generation</span>
                </div>

                <Link
                  href={`/create?modelId=${m.id}`}
                  className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-violet-600/20 flex items-center gap-1.5"
                >
                  <span>Select Model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
