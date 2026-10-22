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
      prompt: 'A bioluminescent organism swirling around the submarine lens with iridescent emerald tentacles.',
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
    <div className="flex h-screen overflow-hidden font-sans text-[#17211D]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-emerald-500/15 glass-navbar px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-300 flex items-center justify-center">
              <Layers className="w-4 h-4 text-teal-700" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#17211D] uppercase">Storyboard Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-bold">
                  Scene Orchestrator
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Multi-shot narrative sequencing, camera choreographies & pacing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenInEditor}
              className="px-3.5 py-1.5 rounded-lg glass-card border border-emerald-500/20 hover:border-emerald-500/40 text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export to Timeline Editor</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto w-full text-left">
          {/* Concept Header Composer */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 space-y-3 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Overarching Narrative Concept
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="flex-1 glass-input border border-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-[#17211D] placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleGenerateAIScenes}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Gemini Orchestrating...' : 'Regenerate Scenes with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Scenes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Timeline Sequences ({scenes.length} Shots • {scenes.reduce((acc, s) => acc + s.duration, 0)}s Total)
              </h2>
            </div>

            <div className="space-y-4">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="rounded-2xl glass-card border border-emerald-500/20 p-5 flex items-start gap-6 hover:border-emerald-500/40 hover:shadow-lg transition-all group"
                >
                  {/* Scene Number Index */}
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center font-mono font-bold text-sm text-emerald-900 shrink-0">
                    0{scene.sceneNumber}
                  </div>

                  {/* Thumbnail / Video Preview */}
                  <div className="w-52 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/20 shrink-0 relative">
                    <video
                      src={scene.previewUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                      {scene.duration}s • {scene.camera}
                    </div>
                  </div>

                  {/* Scene Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17211D] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        Camera: {scene.camera}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{scene.duration} Seconds</span>
                    </div>

                    <p className="text-xs text-[#17211D] font-bold leading-relaxed bg-white/80 p-3 rounded-lg border border-emerald-500/15">
                      {scene.prompt}
                    </p>

                    <div className="text-[11px] text-slate-600 italic">
                      Voiceover Narration: &quot;{scene.narration}&quot;
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
