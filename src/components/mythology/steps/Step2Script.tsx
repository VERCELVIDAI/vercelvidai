'use client';

import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  RefreshCw,
  Video,
  Volume2,
  TrendingUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { MythScene, CameraMove, SfxTag } from '@/lib/mythology/types';

interface Step2ScriptProps {
  scenes: MythScene[];
  hookStrengthScore?: number;
  hookFeedback?: string;
  storyConcept: string;
  sourceNote?: string;
  culture: string;
  language: string;
  targetDurationSec: number;
  tone: string;
  artStyleId: string;
  characterBible: any[];
  onUpdateScenes: (scenes: MythScene[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Script({
  scenes,
  hookStrengthScore = 88,
  hookFeedback = 'Strong opening curiosity hook in the first 3 seconds.',
  storyConcept,
  sourceNote,
  culture,
  language,
  targetDurationSec,
  tone,
  artStyleId,
  characterBible,
  onUpdateScenes,
  onNext,
  onPrev,
}: Step2ScriptProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/mythology/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyConcept,
          sourceNote,
          culture,
          language,
          targetDurationSec,
          tone,
          artStyleId,
          characterBible,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate script');
      }
      if (data.scenes && data.scenes.length > 0) {
        onUpdateScenes(data.scenes);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSceneChange = (idx: number, fields: Partial<MythScene>) => {
    const next = [...scenes];
    next[idx] = { ...next[idx], ...fields };
    onUpdateScenes(next);
  };

  const handleDeleteScene = (idx: number) => {
    if (scenes.length <= 2) {
      alert('A minimum of 2 scenes is required.');
      return;
    }
    const next = scenes.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdateScenes(next);
  };

  const handleAddScene = () => {
    const newSceneNumber = scenes.length + 1;
    const newScene: MythScene = {
      id: `scene_${newSceneNumber}_${Date.now()}`,
      sceneNumber: newSceneNumber,
      narration: language === 'hi' ? 'कहानी का अगला दिव्य प्रसंग...' : 'The next sacred sequence unfolds...',
      onScreenText: language === 'hi' ? 'अगला प्रसंग' : 'THE LEGEND CONTINUES',
      characters: [],
      visualPrompt: `Scene ${newSceneNumber} continuing ${storyConcept}, cinematic composition`,
      negativePrompt: 'low quality, blurry, modern',
      mood: 'devotional',
      cameraMove: 'zoom_in',
      estimatedDurationSec: 5,
      sfxTag: 'conch_shell',
    };
    onUpdateScenes([...scenes, newScene]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            Step 2: Script Engine & Viral Hook
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Fine-tune each scene narration & caption
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Scenes are paced for spoken narration and vertical screen transitions with sound effects.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateScript}
          disabled={isGenerating}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Drafting Script...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{scenes.length > 0 ? 'Regenerate Script' : 'Generate AI Script'}</span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Hook Strength Indicator Card */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-lg flex items-center justify-center shrink-0">
            {hookStrengthScore}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>3-Second Hook Retention Score: {hookStrengthScore}/100</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {hookFeedback}
            </p>
          </div>
        </div>
        <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full shrink-0">
          Reels / Shorts Optimized
        </div>
      </div>

      {/* Scene Cards List */}
      <div className="space-y-4">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id || idx}
            className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 relative group"
          >
            {/* Top Scene Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  {scene.sceneNumber || idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Scene {scene.sceneNumber || idx + 1}
                  {idx === 0 && (
                    <span className="ml-2 text-[10px] bg-red-500/10 text-red-600 font-bold px-2 py-0.5 rounded-full">
                      Hook Scene
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  ~{scene.estimatedDurationSec || 5}s
                </span>
                {scenes.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteScene(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Delete Scene"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Narration Text Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Spoken Narration ({language === 'hi' ? 'हिंदी वाणी' : 'Narration Text'})
              </label>
              <textarea
                rows={2}
                value={scene.narration}
                onChange={(e) => handleSceneChange(idx, { narration: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* On-Screen Caption Text */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  On-Screen Bold Caption
                </label>
                <input
                  type="text"
                  value={scene.onScreenText}
                  onChange={(e) => handleSceneChange(idx, { onScreenText: e.target.value })}
                  placeholder="2-4 words"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Camera Move */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Video className="w-3 h-3 text-indigo-500" />
                  Camera Move
                </label>
                <select
                  value={scene.cameraMove}
                  onChange={(e) => handleSceneChange(idx, { cameraMove: e.target.value as CameraMove })}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="zoom_in">Slow Zoom In (Intense)</option>
                  <option value="zoom_out">Slow Zoom Out (Reveal)</option>
                  <option value="pan_left">Pan Left (Cinematic)</option>
                  <option value="pan_right">Pan Right (Dynamic)</option>
                  <option value="orbital_slow">Orbital Drift (Divine)</option>
                  <option value="celestial_tilt">Celestial Tilt Up (Awe)</option>
                </select>
              </div>

              {/* Sound Effect (SFX) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-500" />
                  Sound Effect Tag
                </label>
                <select
                  value={scene.sfxTag}
                  onChange={(e) => handleSceneChange(idx, { sfxTag: e.target.value as SfxTag })}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="conch_shell">Divya Shankh (Conch)</option>
                  <option value="temple_bell">Mandir Ghanta (Bell)</option>
                  <option value="thunder_strike">Indra Vajra (Thunder)</option>
                  <option value="flute_melody">Mohan Bansuri (Flute)</option>
                  <option value="war_drums">Yuddha Bheri (Drums)</option>
                  <option value="fire_whoosh">Agni Jwala (Fire)</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Add Scene Button */}
        <button
          type="button"
          onClick={handleAddScene}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-slate-600 dark:text-slate-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-amber-500/5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-500" />
          <span>Add New Scene</span>
        </button>
      </div>

      {/* Stepper Navigation Actions */}
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
          disabled={scenes.length === 0}
          className="px-6 py-3 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>Continue to Character & Style</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
