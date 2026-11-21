'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Upload,
  Video,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Sliders,
} from 'lucide-react';
import { MythScene } from '@/lib/mythology/types';

interface Step4VisualsProps {
  scenes: MythScene[];
  artStyleId: string;
  characterBible: any[];
  onUpdateScenes: (scenes: MythScene[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step4Visuals({
  scenes,
  artStyleId,
  characterBible,
  onUpdateScenes,
  onNext,
  onPrev,
}: Step4VisualsProps) {
  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'diya_sparks' | 'holy_mist' | 'celestial_dust'>('diya_sparks');
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);

  const handleGenerateSceneVisual = async (sceneId: string, visualPrompt: string, isHeroAnimation = false) => {
    setGeneratingSceneId(sceneId);
    try {
      const res = await fetch('/api/mythology/visuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: visualPrompt,
          artStyleId,
          aspectRatio: '9:16',
          characterBible,
          isHeroAnimation,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate visual');
      }

      const next = scenes.map((s) => {
        if (s.id === sceneId) {
          return {
            ...s,
            imageUrl: data.imageUrl,
            animatedVideoUrl: data.animatedVideoUrl,
            isHeroSceneAnimated: isHeroAnimation,
          };
        }
        return s;
      });
      onUpdateScenes(next);
    } catch (err: any) {
      alert(`Visual generation failed: ${err.message}`);
    } finally {
      setGeneratingSceneId(null);
    }
  };

  const handleGenerateAllVisuals = async () => {
    setIsGeneratingAll(true);
    for (const scene of scenes) {
      if (!scene.imageUrl) {
        await handleGenerateSceneVisual(scene.id, scene.visualPrompt, false);
      }
    }
    setIsGeneratingAll(false);
  };

  const handleImageUpload = (sceneId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const next = scenes.map((s) => (s.id === sceneId ? { ...s, imageUrl: dataUrl } : s));
      onUpdateScenes(next);
    };
    reader.readAsDataURL(file);
  };

  const generatedCount = scenes.filter((s) => Boolean(s.imageUrl)).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            Step 4: Visuals & Motion FX
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Generate scene imagery & camera parallax
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Render high-definition visuals for each scene or upload your own sacred artwork.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAllVisuals}
          disabled={isGeneratingAll || Boolean(generatingSceneId)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGeneratingAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Rendering All Scenes...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate All Visuals ({generatedCount}/{scenes.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Atmospheric Overlays Selector */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Sacred Atmospheric Overlay:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'none', label: 'None (Clean)' },
            { id: 'diya_sparks', label: '🪔 Diya Golden Sparks' },
            { id: 'holy_mist', label: '🌫️ Sacred Temple Mist' },
            { id: 'celestial_dust', label: '✨ Celestial Stardust' },
          ].map((ov) => (
            <button
              key={ov.id}
              type="button"
              onClick={() => setActiveOverlay(ov.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activeOverlay === ov.id
                  ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {ov.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scene Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenes.map((scene, idx) => {
          const isBusy = generatingSceneId === scene.id;
          return (
            <div
              key={scene.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Scene Meta Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    Scene {scene.sceneNumber || idx + 1}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {scene.cameraMove.replace('_', ' ')}
                  </span>
                </div>

                {/* Visual Viewport Box (9:16 Aspect Preview) */}
                <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 group">
                  {scene.imageUrl ? (
                    <>
                      <img
                        src={scene.imageUrl}
                        alt={`Scene ${scene.sceneNumber}`}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          scene.cameraMove === 'zoom_in' ? 'scale-105' : 'scale-100'
                        }`}
                      />
                      {activeOverlay === 'diya_sparks' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent pointer-events-none animate-pulse" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg(scene.imageUrl || null)}
                          className="p-2 rounded-full bg-white/90 text-slate-900 shadow-md hover:scale-110 transition-transform"
                          title="View Fullscreen"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-slate-400">
                      {isBusy ? (
                        <>
                          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                          <span className="text-xs font-bold text-amber-500">Painting Scene...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs font-medium">Visual not generated yet</span>
                        </>
                      )}
                    </div>
                  )}

                  {scene.isHeroSceneAnimated && (
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      Hero Motion
                    </span>
                  )}
                </div>

                {/* Narration Excerpt */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed italic">
                  &quot;{scene.narration}&quot;
                </p>
              </div>

              {/* Actions Row */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleGenerateSceneVisual(scene.id, scene.visualPrompt, false)}
                    disabled={isBusy}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isBusy ? 'animate-spin' : ''}`} />
                    <span>{scene.imageUrl ? 'Re-roll' : 'Generate'}</span>
                  </button>

                  <label className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors" title="Upload Image">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(scene.id, e)}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Animate Hero Scene Button */}
                <button
                  type="button"
                  onClick={() => handleGenerateSceneVisual(scene.id, scene.visualPrompt, true)}
                  disabled={isBusy || !scene.imageUrl}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Video className="w-3 h-3 text-indigo-500" />
                  <span>Animate Scene (+12 cr)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="max-w-md w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl relative">
            <img src={previewModalImg} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Stepper Actions */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={generatedCount === 0}
          className="px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Voice & Audio</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
