import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { Mic, Volume2, Globe, Sparkles, ArrowRight, Play } from 'lucide-react';

export default function AIVoiceGeneratorPage() {
  const sampleVoices = [
    { name: 'Aria', accent: 'American Professional', gender: 'Female', tone: 'Warm & Authoritative' },
    { name: 'Liam', accent: 'British Cinematic', gender: 'Male', tone: 'Narrative & Deep' },
    { name: 'Kavya', accent: 'Indian English', gender: 'Female', tone: 'Friendly & Conversational' },
    { name: 'Marcus', accent: 'Urban Commercial', gender: 'Male', tone: 'High-Energy & Punchy' },
    { name: 'Sophie', accent: 'French Accent', gender: 'Female', tone: 'Sophisticated & Elegant' },
    { name: 'Dev', accent: 'Hindi / Hinglish', gender: 'Male', tone: 'Authentic & Casual' },
  ];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            <Mic className="w-3.5 h-3.5" />
            <span>ElevenLabs & Neural Speech Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            AI Voice & Audio Studio
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-300">
            Lifelike voiceovers in 29+ languages with human inflection, pacing control, and automated audio ducking.
          </p>
        </div>

        {/* Embedded Interactive Voice Composer */}
        <div className="mb-20">
          <HeroComposer />
        </div>

        {/* Available Neural Voices Library */}
        <div className="my-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
            Explore Neural Voice Presets
          </h2>
          <p className="text-slate-400 text-sm text-center max-w-xl mx-auto mb-10">
            Seamlessly pair any of these studio-grade voices with generated video clips or scripts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVoices.map((voice, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                        {voice.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{voice.name}</h4>
                        <span className="text-xs text-slate-400">{voice.gender} • {voice.accent}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-indigo-300 font-medium">
                      Neural HD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 bg-[#0E1017] p-2.5 rounded-lg border border-white/5">
                    Tone: {voice.tone}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Sample Loaded</span>
                  </div>
                  <Link
                    href={`/create?voice=${encodeURIComponent(voice.name)}`}
                    className="text-indigo-400 font-semibold hover:underline"
                  >
                    Select in Studio →
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
