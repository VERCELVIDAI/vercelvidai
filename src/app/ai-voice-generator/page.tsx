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
    <div className="min-h-screen flex flex-col bg-[#100A12] text-[#F5EAF4]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs font-bold text-[#F05BCE] mb-4 shadow-xs font-mono">
            <Mic className="w-3.5 h-3.5 text-[#F05BCE]" />
            <span>ElevenLabs & Neural Speech Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-[#F5EAF4] tracking-tight">
            AI Voice & Audio Studio
          </h1>
          <p className="mt-4 text-base sm:text-xl text-[#A99AAA]">
            Lifelike voiceovers in 29+ languages with human inflection, pacing control, and automated audio ducking.
          </p>
        </div>

        {/* Embedded Interactive Voice Composer */}
        <div className="mb-20">
          <HeroComposer />
        </div>

        {/* Available Neural Voices Library */}
        <div className="my-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F5EAF4] mb-3 text-center">
            Explore Neural Voice Presets
          </h2>
          <p className="text-[#A99AAA] text-sm text-center max-w-xl mx-auto mb-10">
            Seamlessly pair any of these studio-grade voices with generated video clips or scripts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVoices.map((voice, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#211522] border border-[#39233B] hover:border-[#F05BCE]/40 hover:shadow-lg transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 flex items-center justify-center font-bold text-sm">
                        {voice.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#F5EAF4] text-base">{voice.name}</h4>
                        <span className="text-xs text-[#A99AAA] font-medium">{voice.gender} • {voice.accent}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#F05BCE]/15 px-2 py-0.5 rounded text-[#F05BCE] font-bold border border-[#F05BCE]/30 font-mono">
                      Neural HD
                    </span>
                  </div>
                  <p className="text-xs text-[#A99AAA] mt-2 bg-[#100A12] p-2.5 rounded-lg border border-[#39233B] font-medium">
                    Tone: {voice.tone}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#39233B] text-xs">
                  <div className="flex items-center gap-1.5 text-[#A99AAA] font-medium">
                    <Volume2 className="w-4 h-4 text-[#F05BCE]" />
                    <span>Sample Loaded</span>
                  </div>
                  <Link
                    href={`/create?voice=${encodeURIComponent(voice.name)}`}
                    className="text-[#F05BCE] font-bold hover:underline"
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
