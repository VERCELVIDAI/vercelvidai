'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { BRAND } from '@/lib/brand';
import {
  Layers,
  Sparkles,
  Film,
  Plus,
  Trash2,
  ArrowRight,
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Camera,
  CheckCircle2,
} from 'lucide-react';

interface SceneItem {
  id: string;
  sceneNumber: number;
  duration: number;
  prompt: string;
  camera: string;
  narration: string;
  previewUrl: string;
}

export default function StoryboardStudioPage() {
  const router = useRouter();
  const [authData, setAuthData] = useState<any>(null);
  const [concept, setConcept] = useState('An expedition across an icy subterranean ocean on Jupiter moon Europa.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<SceneItem[]>([
    {
      id: 'sc_1',
      sceneNumber: 1,
      duration: 5,
      prompt: 'A sleek deep-sea research probe descending into dark cyan oceanic waters under thick ice sheets.',
      camera: 'Dolly in',
      narration: 'Beyond the edge of human warmth lies an ocean untouched for a billion years.',
      previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-forest-2213-large.mp4',
    },
    {
      id: 'sc_2',
      sceneNumber: 2,
      duration: 6,
      prompt: 'High-intensity sonar beams sweeping past towering hydrothermal crystalline vents.',
      camera: 'Tracking shot',
      narration: 'Thermal vents pulse with alien luminescence in the perpetual darkness.',
      previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-running-through-the-city-at-sunset-41662-large.mp4',
    },
    {
      id: 'sc_3',
      sceneNumber: 3,
      duration: 5,
      prompt: 'A bioluminescent organism swirling around the submarine lens with iridescent tentacles.',
      camera: 'Orbit',
      narration: 'And in that darkness, life was waiting.',
      previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1175-large.mp4',
    },
  ]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login?returnUrl=/studios/storyboard');
        else setAuthData(d);
      });
  }, [router]);

  const handleGenerateAIScenes = async () => {
    if (!concept.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-storyboard',
          concept,
          sceneCount: 3,
        }),
      });
      const data = await res.json();
      if (data.storyboard?.scenes) {
        const mapped = data.storyboard.scenes.map((s: any, idx: number) => ({
          id: `sc_gen_${idx}`,
          sceneNumber: s.sceneNumber || idx + 1,
          duration: s.sceneDuration || 5,
          prompt: s.visualPrompt,
          camera: s.cameraDirection || 'Dolly in',
          narration: s.narration || '',
          previewUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-setting-over-the-ocean-1175-large.mp4',
        }));
        setScenes(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenInEditor = () => {
    router.push('/editor');
  };

  return (
    <div className="flex h-screen bg-[#07080C] text-zinc-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-white/[0.08] bg-[#0A0C13]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 p-[1px]">
              <div className="w-full h-full bg-[#090A10] rounded-[7px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white uppercase">Storyboard Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                  Scene Orchestrator
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Multi-shot narrative sequencing, camera choreographies & pacing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenInEditor}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-200 border border-white/[0.08] flex items-center gap-1.5 transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export to Timeline Editor</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto w-full">
          {/* Concept Header Composer */}
          <div className="p-6 rounded-2xl bg-[#0C0E17] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Overarching Narrative Concept
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="flex-1 bg-[#11131C] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleGenerateAIScenes}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Gemini Orchestrating...' : 'Regenerate Scenes with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Scenes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                Timeline Sequences ({scenes.length} Shots • {scenes.reduce((acc, s) => acc + s.duration, 0)}s Total)
              </h2>
            </div>

            <div className="space-y-4">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="rounded-2xl border border-white/[0.08] bg-[#0C0E17] p-5 flex items-start gap-6 hover:border-violet-500/40 transition-all group"
                >
                  {/* Scene Number Index */}
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono font-bold text-sm text-violet-400 shrink-0">
                    0{scene.sceneNumber}
                  </div>

                  {/* Thumbnail / Video Preview */}
                  <div className="w-52 aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/[0.08] shrink-0 relative">
                    <video
                      src={scene.previewUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300">
                      {scene.duration}s • {scene.camera}
                    </div>
                  </div>

                  {/* Scene Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        Camera: {scene.camera}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">{scene.duration} Seconds</span>
                    </div>

                    <p className="text-xs text-zinc-200 font-medium leading-relaxed bg-[#11131C] p-3 rounded-lg border border-white/[0.04]">
                      {scene.prompt}
                    </p>

                    <div className="text-[11px] text-zinc-400 italic">
                      Voiceover Narration: "{scene.narration}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
