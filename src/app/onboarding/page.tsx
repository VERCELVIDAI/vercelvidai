'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [primaryUseCase, setPrimaryUseCase] = useState('marketing');
  const [platforms, setPlatforms] = useState<string[]>(['Instagram Reels', 'TikTok', 'YouTube Shorts']);
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [isFinishing, setIsFinishing] = useState(false);

  const togglePlatform = (p: string) => {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter((x) => x !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await fetch('/api/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboarded: true,
          primaryUseCase,
          platforms,
          experienceLevel,
        }),
      });
      router.push('/dashboard');
    } catch (e) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <Logo size="md" />
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 font-semibold">
            <span>Step {step} of 3</span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden ml-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-[#0E1015] border border-white/8 shadow-2xl relative">
          {/* STEP 1: PRIMARY USE CASE */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Personalize Your Studio
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  What is your primary focus?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  We will optimize your dashboard templates and generative prompt defaults.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'marketing', title: 'Performance Ads & Commercials', desc: 'Paid social ads, promotional videos, & product trailers' },
                  { id: 'youtube', title: 'YouTube & Faceless Channels', desc: 'Long-form explainers, documentaries, & daily shorts' },
                  { id: 'ecommerce', title: 'E-commerce & Amazon', desc: '3D product spins, lifestyle unboxings, & catalog reveals' },
                  { id: 'agency', title: 'Agency & Freelancer', desc: 'Multiple client brand kits, reels, & rapid client variations' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrimaryUseCase(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      primaryUseCase === item.id
                        ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-[#11131A] text-slate-300 border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-white">{item.title}</span>
                      {primaryUseCase === item.id && <Check className="w-4 h-4 text-indigo-400 font-bold" />}
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SOCIAL PLATFORMS */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Audience & Formats
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Which platforms do you publish on?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Select all that apply to calibrate default aspect ratios.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Instagram Reels', 'YouTube Shorts', 'TikTok', 'YouTube Long-form', 'LinkedIn Video', 'Meta Ads'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      platforms.includes(p)
                        ? 'bg-indigo-600/25 border-indigo-500 text-white font-bold shadow-sm'
                        : 'bg-[#11131A] text-slate-300 border-white/8 hover:border-white/20'
                    }`}
                  >
                    <span>{p}</span>
                    {platforms.includes(p) && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE LEVEL & SETUP */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Final Setup
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  What is your video editing experience?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Helps us tune whether you prefer one-click AI generation or timeline inspector controls.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'beginner', title: 'I want AI to do 90% of the work', desc: 'Automatic prompt generation, scene building, and one-click render.' },
                  { id: 'intermediate', title: 'I like AI generation with quick timeline touch-ups', desc: 'AI scenes with custom text tweaks and quick audio balancing.' },
                  { id: 'pro', title: 'Experienced Video Editor / Director', desc: 'Full multi-track control, custom B-roll timing, color grading, and lossless export.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExperienceLevel(item.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      experienceLevel === item.id
                        ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-[#11131A] text-slate-300 border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-sm text-white">{item.title}</span>
                      {experienceLevel === item.id && <Check className="w-4 h-4 text-indigo-400 font-bold" />}
                    </div>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={isFinishing}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {isFinishing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>Launch Creative Studio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
