import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Cpu, ArrowRight, Zap } from 'lucide-react';

export default function ModelsPage() {
  const models = [
    {
      id: 'gemini-omni-1.1-flash',
      name: 'Google Gemini Omni 1.1 Flash',
      provider: 'Google DeepMind & Gemini Video Engine',
      type: 'video',
      resolutions: ['720p', '1080p HD'],
      durations: '5s, 10s',
      aspectRatios: ['16:9', '9:16', '1:1'],
      costCredits: 15,
      badge: 'Active Engine',
      isComingSoon: false,
      desc: 'Official active video generation engine. Real-time inference for commercial ads, automotive showcases, cinematic lighting, and product promotions.',
    },
    {
      id: 'gemini-creative-flash',
      name: 'Google Gemini 2.5 Flash Copilot',
      provider: 'Google DeepMind & Gemini Neural Engine',
      type: 'copilot',
      resolutions: ['Lossless Text', 'Structured JSON'],
      durations: 'Ultra-Low Latency',
      aspectRatios: ['Multimodal Analysis'],
      costCredits: 2,
      badge: 'Integrated Copilot',
      isComingSoon: false,
      desc: 'Real-time creative director that enhances video prompts, constructs narrative storyboards, and scores viral retention angles.',
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
      badge: 'Coming Soon',
      isComingSoon: true,
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
      badge: 'Coming Soon',
      isComingSoon: true,
      desc: 'Excels at rapid action sports, fluid dynamics, car commercials, and 3D environment fly-throughs.',
    },
    {
      id: 'fluvia-cinematic-v1',
      name: 'Fluvia Cinematic HD Core',
      provider: 'Fluvia Neural Architecture',
      type: 'video',
      resolutions: ['720p', '1080p'],
      durations: '5s, 10s',
      aspectRatios: ['16:9', '9:16', '1:1'],
      costCredits: 25,
      badge: 'Coming Soon',
      isComingSoon: true,
      desc: 'Proprietary cinematic engine currently in private tuning for physically accurate studio illumination.',
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
      isComingSoon: false,
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
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-xs font-mono font-semibold text-[#5145CD] mb-4">
            <Cpu className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Multi-Provider Model Registry</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17191D] tracking-tight">
            Foundation AI Models
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#667085]">
            Transparent pricing, official API integration, and continuous benchmarking across top global generative weights.
          </p>
        </div>

        <div className="space-y-6">
          {models.map((m) => (
            <div
              key={m.id}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs"
            >
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <h3 className="text-xl font-bold text-[#17191D]">{m.name}</h3>
                  <span className={`text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full border ${
                    m.badge === 'Active Engine'
                      ? 'text-[#5145CD] bg-[#EEF2FF] border-[#5145CD]/30'
                      : m.isComingSoon
                      ? 'text-[#667085] bg-slate-100 border-[#E5E7EB]'
                      : 'text-[#5145CD] bg-[#EEF2FF] border-[#5145CD]/20'
                  }`}>
                    {m.badge}
                  </span>
                  <span className="text-xs text-[#667085] font-mono">by {m.provider}</span>
                </div>
                <p className="text-sm text-[#667085] leading-relaxed">{m.desc}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-[#667085]">
                  <span>Resolutions: <strong className="text-[#17191D]">{m.resolutions.join(', ')}</strong></span>
                  <span>•</span>
                  <span>Durations: <strong className="text-[#17191D]">{m.durations}</strong></span>
                  <span>•</span>
                  <span>Ratios: <strong className="text-[#17191D]">{m.aspectRatios.join(', ')}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#E5E7EB]">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[#5145CD] font-bold text-lg font-mono">
                    <Zap className="w-4 h-4 text-[#5145CD]" />
                    <span>{m.costCredits} credits</span>
                  </div>
                  <span className="text-[11px] text-[#667085] font-mono">per generation</span>
                </div>

                {m.isComingSoon ? (
                  <span className="px-5 py-2.5 bg-[#F7F8FA] text-[#667085] border border-[#E5E7EB] rounded-xl text-xs font-semibold cursor-not-allowed font-mono">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/create?modelId=${m.id}`}
                    className="px-5 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Select Model</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
