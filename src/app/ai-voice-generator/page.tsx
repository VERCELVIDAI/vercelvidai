import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HeroComposer } from '@/components/home/HeroComposer';
import { Mic, Volume2 } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-white text-[#17191D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] text-xs font-bold text-[#5145CD] mb-4 shadow-2xs font-mono">
            <Mic className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>ElevenLabs & Neural Speech Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#17191D] tracking-tight">
            AI Voice & Audio Studio
          </h1>
          <p className="mt-4 text-base sm:text-xl text-[#667085]">
            Lifelike voiceovers in 29+ languages with human inflection, pacing control, and automated audio ducking.
          </p>
        </div>

        {/* Embedded Interactive Voice Composer */}
        <div className="mb-20">
          <HeroComposer />
        </div>

        {/* Available Neural Voices Library */}
        <div className="my-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17191D] mb-3 text-center">
            Explore Neural Voice Presets
          </h2>
          <p className="text-[#667085] text-sm text-center max-w-xl mx-auto mb-10">
            Seamlessly pair any of these studio-grade voices with generated video clips or scripts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVoices.map((voice, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-xs transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] flex items-center justify-center font-bold text-sm">
                        {voice.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#17191D] text-base">{voice.name}</h4>
                        <span className="text-xs text-[#667085] font-medium">{voice.gender} • {voice.accent}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-[#EEF2FF] px-2 py-0.5 rounded text-[#5145CD] font-bold border border-[#E0E7FF] font-mono">
                      Neural HD
                    </span>
                  </div>
                  <p className="text-xs text-[#17191D] mt-2 bg-white p-2.5 rounded-lg border border-[#E5E7EB] font-medium">
                    Tone: {voice.tone}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#E5E7EB] text-xs">
                  <div className="flex items-center gap-1.5 text-[#667085] font-medium">
                    <Volume2 className="w-4 h-4 text-[#5145CD]" />
                    <span>Sample Loaded</span>
                  </div>
                  <Link
                    href={`/create?voice=${encodeURIComponent(voice.name)}`}
                    className="text-[#5145CD] font-bold hover:underline"
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
