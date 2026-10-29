'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { BRAND } from '@/lib/brand';
import {
  Film,
  Sparkles,
  Camera,
  Play,
  RotateCcw,
  Sliders,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Eye,
  CheckCircle2,
  Video,
  Ratio,
  Maximize2,
  Download,
  Zap,
} from 'lucide-react';

const CAMERA_MOVEMENTS = [
  { id: 'Static', label: 'Static Lock', desc: 'Locked tripod, zero camera drift' },
  { id: 'Dolly in', label: 'Dolly In', desc: 'Slow cinematic push toward subject' },
  { id: 'Dolly out', label: 'Dolly Out', desc: 'Dramatic reveal pulling back' },
  { id: 'Tracking shot', label: 'Tracking', desc: 'Parallel lateral motion tracking subject' },
  { id: 'Orbit', label: 'Orbit 360°', desc: '360 degree rotational revolution' },
  { id: 'Crane movement', label: 'Crane Boom', desc: 'Sweeping vertical crane ascent/descent' },
  { id: 'Handheld', label: 'Handheld Raw', desc: 'Subtle human organic shake' },
  { id: 'Aerial movement', label: 'Aerial Drone', desc: 'Expansive high-altitude drone flyover' },
];

const LENSES = [
  { id: 'anamorphic-35', label: '35mm Anamorphic', desc: 'Oval bokeh & horizontal streaks' },
  { id: 'prime-50', label: '50mm Cinema Prime', desc: 'Natural perspective, shallow depth' },
  { id: 'portrait-85', label: '85mm Telephoto', desc: 'Extreme subject isolation' },
  { id: 'wide-24', label: '24mm Ultra-Wide', desc: 'Expansive environmental grandeur' },
];

const COLOR_GRADES = [
  { id: 'kodak-2383', label: 'Kodak 2383 Film Print', desc: 'Rich warm skin tones & deep shadows' },
  { id: 'emerald-teal', label: 'Emerald Mint & Teal', desc: 'Crystalline green contrast & saturation' },
  { id: 'rose-sunset', label: 'Soft Rose Twilight', desc: 'Delicate pink volumetric backlighting' },
  { id: 'noir', label: 'Cinematic Noir', desc: 'High-contrast monochrome with silver grain' },
];

export default function CinemaStudioPage() {
  const router = useRouter();
  const [authData, setAuthData] = useState<any>(null);
  const [prompt, setPrompt] = useState('An ethereal glass observatory suspended above an ocean of emerald clouds at sunrise.');
  const [camera, setCamera] = useState('Dolly in');
  const [lens, setLens] = useState('anamorphic-35');
  const [colorGrade, setColorGrade] = useState('kodak-2383');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '21:9' | '1:1'>('21:9');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'storyboard'>('single');
  const [storyboard, setStoryboard] = useState<any>(null);
  const [previewVideo, setPreviewVideo] = useState('/media/templates/tmpl-05-automotive-film.mp4');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login?returnUrl=/studios/cinema');
        else setAuthData(d);
      });
  }, [router]);

  // Gemini Prompt Enhancement
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enhance-prompt',
          prompt,
          aspectRatio,
          cameraMovement: camera,
        }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateStoryboard = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'storyboard',
          prompt,
          mode: 'video',
        }),
      });
      const data = await res.json();
      if (data.storyboard) {
        setStoryboard(data.storyboard);
        setActiveTab('storyboard');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleLaunchGeneration = () => {
    setIsGenerating(true);
    try {
      localStorage.setItem(
        'fluvia_pending_prompt',
        JSON.stringify({
          prompt: `${prompt} | Shot on ${lens}, ${camera}, graded with ${colorGrade}`,
          mode: 'video',
          aspectRatio,
          modelId: 'fluvia-cinematic-v1',
        })
      );
    } catch (e) {}

    setTimeout(() => {
      router.push(`/create?mode=video&camera=${encodeURIComponent(camera)}&aspectRatio=${aspectRatio}`);
    }, 600);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#F7F8FA] text-[#17191D]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F8FA]">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center">
              <Film className="w-4 h-4 text-[#5145CD]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#17191D] uppercase">Cinema Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] font-bold font-mono">
                  Director Grade
                </span>
              </div>
              <p className="text-[11px] text-[#667085]">Multi-axis camera motion, optical lens emulation & color grading</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-[#5145CD] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F1F3F5]'
              }`}
            >
              Shot Composer
            </button>
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'storyboard'
                  ? 'bg-[#5145CD] text-white shadow-xs'
                  : 'text-[#667085] hover:text-[#17191D] hover:bg-[#F1F3F5]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Storyboard Sequencer</span>
              {storyboard && <span className="w-1.5 h-1.5 rounded-full bg-[#5145CD]" />}
            </button>
          </div>
        </div>

        {/* Studio Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Controls Column (Left) */}
          <div className="w-[480px] border-r border-[#E5E7EB] flex flex-col bg-white overflow-y-auto p-6 space-y-6 text-left">
            {/* Prompt Composer & Gemini Enhancer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
                  Cinematic Scene Prompt
                </label>
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EEF2FF] border border-[#C7D2FE] text-[#5145CD] hover:bg-[#E0E7FF] transition-all font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className={`w-3 h-3 text-[#5145CD] ${isEnhancing ? 'animate-spin' : ''}`} />
                  {isEnhancing ? 'Gemini Enhancing...' : 'Gemini Director Polish'}
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-[#F7F8FA] text-[#17191D] p-3.5 rounded-xl border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD] focus:bg-white text-xs leading-relaxed resize-none placeholder:text-[#667085]/60"
                placeholder="Describe your scene lighting, environment, subject, and cinematic motion..."
              />
            </div>

            {/* Camera Motion Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#5145CD]" />
                Camera Motion Vector
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CAMERA_MOVEMENTS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCamera(c.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      camera === c.id
                        ? 'border-[#5145CD] bg-[#EEF2FF] text-[#5145CD] font-bold shadow-2xs'
                        : 'border-[#E5E7EB] bg-[#F7F8FA] text-[#667085] hover:bg-[#F1F3F5] hover:text-[#17191D]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{c.label}</div>
                    <div className="text-[10px] text-[#667085] line-clamp-1">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optical Lens Profile */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#5145CD]" />
                Optical Cinema Lens
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LENSES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLens(l.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      lens === l.id
                        ? 'border-[#5145CD] bg-[#EEF2FF] text-[#5145CD] font-bold shadow-2xs'
                        : 'border-[#E5E7EB] bg-[#F7F8FA] text-[#667085] hover:bg-[#F1F3F5] hover:text-[#17191D]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{l.label}</div>
                    <div className="text-[10px] text-[#667085] line-clamp-1">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Emulation Chemistry */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#5145CD]" />
                Color Grading Profile
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_GRADES.map((cg) => (
                  <button
                    key={cg.id}
                    onClick={() => setColorGrade(cg.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      colorGrade === cg.id
                        ? 'border-[#5145CD] bg-[#EEF2FF] text-[#5145CD] font-bold shadow-2xs'
                        : 'border-[#E5E7EB] bg-[#F7F8FA] text-[#667085] hover:bg-[#F1F3F5] hover:text-[#17191D]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{cg.label}</div>
                    <div className="text-[10px] text-[#667085] line-clamp-1">{cg.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5E7EB]">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] block mb-1.5">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['21:9', '16:9', '9:16', '1:1'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        aspectRatio === r
                          ? 'border-[#5145CD] bg-[#EEF2FF] text-[#5145CD]'
                          : 'border-[#E5E7EB] bg-[#F7F8FA] text-[#667085] hover:text-[#17191D]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] block mb-1.5">
                  Clip Duration
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[5, 10].map((s) => (
                    <button
                      key={s}
                      onClick={() => setDurationSec(s)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                        durationSec === s
                          ? 'border-[#5145CD] bg-[#EEF2FF] text-[#5145CD]'
                          : 'border-[#E5E7EB] bg-[#F7F8FA] text-[#667085] hover:text-[#17191D]'
                      }`}
                    >
                      {s}s ({s * 5} cr)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleLaunchGeneration}
                disabled={isGenerating}
                className="w-full py-3.5 bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-white" />
                <span>Dispatch to Generation Pipeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-[#667085] mt-2 font-mono">
                15 Credits Deducted on Generation • Gemini Omni 1.1 Flash Engine
              </p>
            </div>
          </div>

          {/* Viewport Column (Right) */}
          <div className="flex-1 bg-[#F7F8FA] p-8 flex flex-col justify-center items-center overflow-y-auto">
            {activeTab === 'single' ? (
              <div className="max-w-4xl w-full space-y-6">
                {/* 4K Stage Viewport */}
                <div
                  className={`relative w-full rounded-2xl overflow-hidden bg-[#17191D] border border-[#E5E7EB] shadow-md mx-auto ${
                    aspectRatio === '21:9'
                      ? 'aspect-[21/9]'
                      : aspectRatio === '16:9'
                      ? 'aspect-video'
                      : aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-w-sm'
                      : 'aspect-square max-w-md'
                  }`}
                >
                  <video
                    src={previewVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle cinema letterboxing overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[11px] font-mono text-[#17191D]">
                    <span className="w-2 h-2 rounded-full bg-[#5145CD] animate-pulse" />
                    <span>REC • {aspectRatio} • {camera.toUpperCase()}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => router.push('/editor')}
                      className="px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white backdrop-blur-md border border-[#E5E7EB] text-xs font-semibold text-[#17191D] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span>Open in Creative Canvas</span>
                    </button>
                  </div>
                </div>

                {/* Specs Readout Banner */}
                <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-[#E5E7EB] text-left shadow-2xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#667085] font-mono">Camera Engine</span>
                    <p className="text-xs font-bold text-[#17191D] mt-0.5">{camera}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#667085] font-mono">Optics Profile</span>
                    <p className="text-xs font-bold text-[#17191D] mt-0.5">35mm Anamorphic</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#667085] font-mono">Color Chemistry</span>
                    <p className="text-xs font-bold text-[#17191D] mt-0.5">{colorGrade}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#667085] font-mono">AI Director</span>
                    <p className="text-xs font-bold text-[#5145CD] mt-0.5">Gemini 2.0 Flash Verified</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Storyboard Sequence View */
              <div className="max-w-5xl mx-auto w-full space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-[#17191D] flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#5145CD]" />
                      {storyboard?.projectTitle || 'Cinematic Storyboard Sequence'}
                    </h2>
                    <p className="text-xs text-[#667085] mt-1">
                      {storyboard?.visualDirection || 'Structured multi-scene shotlist generated by Fluvia Flow Gemini Copilot.'}
                    </p>
                  </div>
                  <button
                    onClick={handleLaunchGeneration}
                    className="px-4 py-2 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Render Entire Storyboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {(storyboard?.scenes || [
                    {
                      sceneNumber: 1,
                      sceneDuration: 5,
                      narration: 'Establishing stillness before the dynamic motion begins.',
                      visualPrompt: prompt,
                      cameraDirection: 'Dolly in',
                      transition: 'Cut',
                    },
                    {
                      sceneNumber: 2,
                      sceneDuration: 5,
                      narration: 'Dynamic tracking acceleration through luminous atmosphere.',
                      visualPrompt: `${prompt}, dramatic angle, accelerated pace`,
                      cameraDirection: 'Tracking shot',
                      transition: 'Whip Pan',
                    },
                    {
                      sceneNumber: 3,
                      sceneDuration: 5,
                      narration: 'Culmination of light and cinematic resolution.',
                      visualPrompt: `${prompt}, triumphant wide frame`,
                      cameraDirection: 'Crane movement',
                      transition: 'Fade to black',
                    },
                  ]).map((sc: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-white border border-[#E5E7EB] p-4 flex flex-col justify-between space-y-4 hover:border-[#5145CD]/50 hover:shadow-xs transition-all group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-[#5145CD]">SCENE {sc.sceneNumber || idx + 1}</span>
                          <span className="text-[#667085] font-medium">{sc.sceneDuration || 5}s • {sc.cameraDirection}</span>
                        </div>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-[#17191D] border border-[#E5E7EB]">
                          <video
                            src={previewVideo}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-xs text-[#17191D] font-semibold line-clamp-3">{sc.visualPrompt}</p>
                      </div>

                      <div className="pt-2 border-t border-[#E5E7EB] text-[11px] text-[#667085] italic">
                        &quot;{sc.narration}&quot;
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}