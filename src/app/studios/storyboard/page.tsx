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
    <div className="flex h-screen overflow-hidden font-sans bg-[#F7F8FA] text-[#17191D]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F8FA]">
        <DashboardHeader user={authData?.user} />

        {/* Studio Subheader */}
        <div className="h-14 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#5145CD]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-[#17191D] uppercase">Storyboard Studio</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#5145CD] border border-[#E0E7FF] font-bold font-mono">
                  Scene Orchestrator
                </span>
              </div>
              <p className="text-[11px] text-[#667085]">Multi-shot narrative sequencing, camera choreographies & pacing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenInEditor}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 text-xs font-bold text-[#17191D] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#5145CD]" />
              <span>Export to Timeline Editor</span>
            </button>
          </div>
        </div>

        {/* Workspace Canvas */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto w-full text-left">
          {/* Concept Header Composer */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-3 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-[#17191D] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5145CD]" />
              Overarching Narrative Concept
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="flex-1 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#17191D] placeholder-[#667085]/60 focus:outline-none focus:border-[#5145CD] focus:bg-white"
              />
              <button
                onClick={handleGenerateAIScenes}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Gemini Orchestrating...' : 'Regenerate Scenes with Gemini'}</span>
              </button>
            </div>
          </div>

          {/* Scenes Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#667085] font-mono">
                Timeline Sequences ({scenes.length} Shots • {scenes.reduce((acc, s) => acc + s.duration, 0)}s Total)
              </h2>
            </div>

            <div className="space-y-4">
              {scenes.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="rounded-2xl bg-white border border-[#E5E7EB] p-5 flex items-start gap-6 hover:border-[#5145CD]/40 hover:shadow-xs transition-all group"
                >
                  {/* Scene Number Index */}
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center font-mono font-bold text-sm text-[#5145CD] shrink-0">
                    0{scene.sceneNumber}
                  </div>

                  {/* Thumbnail / Video Preview */}
                  <div className="w-52 aspect-video rounded-xl overflow-hidden bg-[#17191D] border border-[#E5E7EB] shrink-0 relative">
                    <video
                      src={scene.previewUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-[#17191D] border border-[#E5E7EB]">
                      {scene.duration}s • {scene.camera}
                    </div>
                  </div>

                  {/* Scene Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17191D] flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#5145CD]" />
                        Camera: {scene.camera}
                      </span>
                      <span className="text-xs font-mono text-[#667085] font-semibold">{scene.duration} Seconds</span>
                    </div>

                    <p className="text-xs text-[#17191D] font-medium leading-relaxed bg-[#F7F8FA] p-3 rounded-lg border border-[#E5E7EB]">
                      {scene.prompt}
                    </p>

                    <div className="text-[11px] text-[#667085] italic">
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
