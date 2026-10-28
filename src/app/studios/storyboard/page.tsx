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
      previewUrl: '/media/templates/tmpl-02-luxury-perfume.mp4',
    },
    {
      id: 'sc_2',
      sceneNumber: 2,
      duration: 6,
      prompt: 'High-intensity sonar beams sweeping past towering hydrothermal crystalline vents.',
      camera: 'Tracking shot',
      narration: 'Thermal vents pulse with alien luminescence in the perpetual darkness.',
      previewUrl: '/media/templates/tmpl-09-tech-product.mp4',
    },
    {
      id: 'sc_3',
      sceneNumber: 3,
      duration: 5,
      prompt: 'A bioluminescent organism swirling around the submarine lens with iridescent emerald tentacles.',
      camera: 'Orbit',
      narration: 'And in that darkness, life was waiting.',
      previewUrl: '/media/templates/tmpl-06-travel-reel.mp4',
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
          previewUrl: '/media/templates/tmpl-01-cinematic-product.mp4',
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
    <div className="flex h-screen overflow-hidden font-sans bg-[#100A12] text-[#F5EAF4]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#100A12]">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-[#39233B] bg-[#100A12]/90 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F05BCE]/10 border border-[#F05BCE]/25 flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#F05BCE]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#F5EAF4] uppercase">Storyboard Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30 font-bold font-mono">
                  Scene Orchestrator
                </span>
              </div>
              <p className="text-[11px] text-[#A99AAA]">Multi-shot narrative sequencing, camera choreographies & pacing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenInEditor}
              className="px-3.5 py-1.5 rounded-lg bg-[#211522] border border-[#39233B] hover:border-[#F05BCE]/50 text-xs font-bold text-[#F5EAF4] hover:text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#F05BCE]" />
              <span>Export to Timeline Editor</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto w-full text-left">
          {/* Concept Header Composer */}
          <div className="p-6 rounded-2xl bg-[#211522] border border-[#39233B] space-y-3 shadow-md">
            <label className="text-xs font-bold uppercase tracking-wider text-[#F5EAF4] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F05BCE]" />
              Overarching Narrative Concept
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="flex-1 bg-[#100A12] border border-[#39233B] rounded-xl px-4 py-2.5 text-xs text-[#F5EAF4] placeholder-[#A99AAA]/50 focus:outline-none focus:border-[#F05BCE]"
              />
              <button
                onClick={handleGenerateAIScenes}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#F05BCE]/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Gemini Orchestrating...' : 'Regenerate Scenes with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Scenes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#A99AAA] font-mono">
                Timeline Sequences ({scenes.length} Shots • {scenes.reduce((acc, s) => acc + s.duration, 0)}s Total)
              </h2>
            </div>

            <div className="space-y-4">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="rounded-2xl bg-[#211522] border border-[#39233B] p-5 flex items-start gap-6 hover:border-[#F05BCE]/40 hover:shadow-lg transition-all group"
                >
                  {/* Scene Number Index */}
                  <div className="w-10 h-10 rounded-xl bg-[#F05BCE]/15 border border-[#F05BCE]/30 flex items-center justify-center font-mono font-bold text-sm text-[#F05BCE] shrink-0">
                    0{scene.sceneNumber}
                  </div>

                  {/* Thumbnail / Video Preview */}
                  <div className="w-52 aspect-video rounded-xl overflow-hidden bg-black border border-[#39233B] shrink-0 relative">
                    <video
                      src={scene.previewUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-[#100A12]/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-[#F5EAF4]">
                      {scene.duration}s • {scene.camera}
                    </div>
                  </div>

                  {/* Scene Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5EAF4] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#F05BCE]" />
                        Camera: {scene.camera}
                      </span>
                      <span className="text-xs font-mono text-[#A99AAA] font-semibold">{scene.duration} Seconds</span>
                    </div>

                    <p className="text-xs text-[#F5EAF4] font-medium leading-relaxed bg-[#100A12] p-3 rounded-lg border border-[#39233B]">
                      {scene.prompt}
                    </p>

                    <div className="text-[11px] text-[#A99AAA] italic">
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
