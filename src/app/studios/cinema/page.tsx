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
  { id: 'anamorphic-35', label: '35mm Anamorphic', desc: 'Oval bokeh & horizontal cyan streaks' },
  { id: 'prime-50', label: '50mm Cinema Prime', desc: 'Natural perspective, shallow depth of field' },
  { id: 'portrait-85', label: '85mm Telephoto', desc: 'Extreme subject isolation & compressed background' },
  { id: 'wide-24', label: '24mm Ultra-Wide', desc: 'Expansive environmental grandeur' },
];

const COLOR_GRADES = [
  { id: 'kodak-2383', label: 'Kodak 2383 Film Print', desc: 'Rich warm skin tones & deep emerald shadows' },
  { id: 'teal-orange', label: 'Cyberpunk Teal & Orange', desc: 'Electric contrast & neon saturation' },
  { id: 'bleach-bypass', label: 'Bleach Bypass', desc: 'Desaturated gritty silver-retention look' },
  { id: 'noir', label: 'Cinematic Noir', desc: 'High-contrast monochrome with fine silver grain' },
  { id: 'golden-hour', label: 'Sunset Golden Hour', desc: 'Warm volumetric backlighting' },
];

export default function CinemaStudioPage() {
  const router = useRouter();
  const [authData, setAuthData] = useState<any>(null);
  const [prompt, setPrompt] = useState('An ethereal glass observatory suspended above an ocean of bioluminescent clouds at twilight.');
  const [camera, setCamera] = useState('Dolly in');
  const [lens, setLens] = useState('anamorphic-35');
  const [colorGrade, setColorGrade] = useState('kodak-2383');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '21:9' | '1:1'>('21:9');
  const [durationSec, setDurationSec] = useState<number>(5);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'storyboard'>('single');
  const [storyboard, setStoryboard] = useState<any>(null);
  const [previewVideo, setPreviewVideo] = useState('https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1175-large.mp4');

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
          stylePreference: colorGrade,
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

  // Gemini Storyboard Generator
  const handleGenerateStoryboard = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-storyboard',
          concept: prompt,
          aspectRatio,
          sceneCount: 3,
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
    // Send to unified create workspace with pre-populated cinematic prompt
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
    <div className="flex h-screen bg-[#07080C] text-zinc-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-white/[0.08] bg-[#0A0C13]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#090A10] rounded-[7px] flex items-center justify-center">
                <Film className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white uppercase">Cinema Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  Director Grade
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Multi-axis camera motion, optical lens emulation & color grading</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'single'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Shot Composer
            </button>
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'storyboard'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Storyboard Sequencer</span>
              {storyboard && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Studio Workspace Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Controls Column (Left) */}
          <div className="w-[480px] border-r border-white/[0.08] flex flex-col bg-[#0A0C13]/50 overflow-y-auto p-6 space-y-6">
            {/* Prompt Composer & Gemini Enhancer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Cinematic Scene Prompt
                </label>
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing}
                  className="text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-600/30 to-cyan-500/30 border border-cyan-500/30 text-cyan-300 hover:brightness-125 transition-all font-semibold disabled:opacity-50"
                >
                  <Sparkles className={`w-3 h-3 ${isEnhancing ? 'animate-spin' : ''}`} />
                  {isEnhancing ? 'Gemini Enhancing...' : 'Gemini Director Polish'}
                </button>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400/80 transition-all resize-none font-mono text-[13px] leading-relaxed"
                placeholder="Describe the cinematic scene in vivid sensory detail..."
              />
            </div>

            {/* Camera Movement Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-violet-400" />
                Camera Motion Path
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CAMERA_MOVEMENTS.map((cam) => {
                  const isSelected = camera === cam.id;
                  return (
                    <button
                      key={cam.id}
                      onClick={() => setCamera(cam.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                          : 'bg-[#11131C] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{cam.label}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{cam.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optics & Color Grade */}
            <div className="grid grid-cols-2 gap-3">
              {/* Lens Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Optical Lens</label>
                <select
                  value={lens}
                  onChange={(e) => setLens(e.target.value)}
                  className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
                >
                  {LENSES.map((l) => (
                    <option key={l.id} value={l.id} className="bg-[#11131C]">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Grade */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Color Science</label>
                <select
                  value={colorGrade}
                  onChange={(e) => setColorGrade(e.target.value)}
                  className="w-full bg-[#11131C] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400"
                >
                  {COLOR_GRADES.map((cg) => (
                    <option key={cg.id} value={cg.id} className="bg-[#11131C]">
                      {cg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Aspect Ratio & Duration */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Aspect Ratio</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '21:9', label: '21:9 Cinema' },
                  { id: '16:9', label: '16:9 Wide' },
                  { id: '9:16', label: '9:16 Reel' },
                  { id: '1:1', label: '1:1 Square' },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id as any)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                      aspectRatio === ar.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-[#11131C] border-white/[0.06] text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Storyboard Button */}
            <button
              onClick={handleGenerateStoryboard}
              disabled={isEnhancing}
              className="w-full py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span>Generate 3-Scene Storyboard with Gemini</span>
            </button>

            {/* Primary Render Action */}
            <div className="pt-2">
              <button
                onClick={handleLaunchGeneration}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isGenerating ? 'Initializing Cinema Pipeline...' : 'Generate Cinema Shot (25 Credits)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cinematic Canvas & Preview Player (Right) */}
          <div className="flex-1 flex flex-col bg-[#06070A] p-8 overflow-y-auto">
            {activeTab === 'single' ? (
              <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full space-y-6">
                {/* Cinema Screen Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/80 bg-black aspect-[21/9]">
                  <video
                    src={previewVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle cinema letterboxing overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>REC • {aspectRatio} • {camera.toUpperCase()}</span>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => router.push('/editor')}
                      className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open in Creative Canvas</span>
                    </button>
                  </div>
                </div>

                {/* Specs Readout Banner */}
                <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-[#0C0E17] border border-white/[0.08]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Camera Engine</span>
                    <p className="text-xs font-semibold text-zinc-200 mt-0.5">{camera}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Optics Profile</span>
                    <p className="text-xs font-semibold text-zinc-200 mt-0.5">35mm Anamorphic</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Color Chemistry</span>
                    <p className="text-xs font-semibold text-zinc-200 mt-0.5">{colorGrade}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">AI Director</span>
                    <p className="text-xs font-semibold text-cyan-400 mt-0.5">Gemini 1.5/2.0 Verified</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Storyboard Sequence View */
              <div className="max-w-5xl mx-auto w-full space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-violet-400" />
                      {storyboard?.projectTitle || 'Cinematic Storyboard Sequence'}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      {storyboard?.visualDirection || 'Structured multi-scene shotlist generated by Fluvia Flow Gemini Copilot.'}
                    </p>
                  </div>
                  <button
                    onClick={handleLaunchGeneration}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
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
                      className="rounded-xl border border-white/[0.08] bg-[#0C0E17] p-4 flex flex-col justify-between space-y-4 hover:border-violet-500/50 transition-all group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-violet-400">SCENE {sc.sceneNumber || idx + 1}</span>
                          <span className="text-zinc-500">{sc.sceneDuration || 5}s • {sc.cameraDirection}</span>
                        </div>
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 border border-white/[0.05]">
                          <video
                            src={previewVideo}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <p className="text-xs text-zinc-300 font-medium line-clamp-3">{sc.visualPrompt}</p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.06] text-[11px] text-zinc-400 italic">
                        "{sc.narration}"
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
