'use client';

import React, { useState, useEffect } from 'react';
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
  Code,
  LayoutGrid,
  Copy,
  Check,
  Zap,
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
  const [editorMode, setEditorMode] = useState<'visual' | 'json'>('visual');
  const [rawJsonText, setRawJsonText] = useState('');
  const [jsonErrorMsg, setJsonErrorMsg] = useState<string | null>(null);
  const [jsonSuccessMsg, setJsonSuccessMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Sync scenes to raw JSON when entering JSON mode
  useEffect(() => {
    if (scenes && scenes.length > 0) {
      setRawJsonText(JSON.stringify(scenes, null, 2));
    }
  }, [scenes]);

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
        setRawJsonText(JSON.stringify(data.scenes, null, 2));
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyJson = () => {
    setJsonErrorMsg(null);
    setJsonSuccessMsg(null);
    try {
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Script JSON must be an array of scenes: [ { "sceneNumber": 1, "narration": "..." }, ... ]');
      }
      if (parsed.length === 0) {
        throw new Error('Scene array cannot be empty. Please include at least 2 scenes.');
      }
      onUpdateScenes(parsed);
      setJsonSuccessMsg('Script JSON successfully parsed & synchronized!');
      setTimeout(() => setJsonSuccessMsg(null), 3000);
    } catch (err: any) {
      setJsonErrorMsg(err.message || 'Invalid JSON syntax. Please check brackets and quotes.');
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setRawJsonText(JSON.stringify(parsed, null, 2));
      setJsonErrorMsg(null);
    } catch (err: any) {
      setJsonErrorMsg('Cannot format invalid JSON: ' + err.message);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(rawJsonText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
            Step 2: JSON Script Engine & Viral Hook
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Fine-tune each scene narration & caption
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Edit scene-by-scene with visual cards or use raw JSON mode like Zedking.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Visual vs Raw JSON Mode Switcher */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                editorMode === 'visual'
                  ? 'bg-[#5145CD] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Visual Cards</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRawJsonText(JSON.stringify(scenes, null, 2));
                setEditorMode('json');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                editorMode === 'json'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw JSON Mode</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating JSON...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{scenes.length > 0 ? 'Regenerate' : 'Generate Script'}</span>
              </>
            )}
          </button>
        </div>
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

      {/* MODE 1: RAW JSON EDITOR (ZEDKING JSON-TO-VIDEO WORKFLOW) */}
      {editorMode === 'json' && (
        <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 border-amber-400/80 shadow-md">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                JSON Script Payload
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-mono">
                {scenes.length} Scenes Loaded
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFormatJson}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Format JSON
              </button>
              <button
                type="button"
                onClick={handleCopyJson}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleApplyJson}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-colors"
              >
                Apply JSON to Scenes
              </button>
            </div>
          </div>

          {jsonErrorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2 border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{jsonErrorMsg}</span>
            </div>
          )}

          {jsonSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{jsonSuccessMsg}</span>
            </div>
          )}

          <textarea
            value={rawJsonText}
            onChange={(e) => setRawJsonText(e.target.value)}
            rows={16}
            className="w-full p-4 font-mono text-xs leading-relaxed rounded-xl bg-slate-950 text-amber-200 border border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400 selection:bg-amber-500 selection:text-black resize-y"
            placeholder="Paste your scene JSON here..."
          />
        </div>
      )}

      {/* MODE 2: VISUAL SCENE CARDS */}
      {editorMode === 'visual' && (
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
                    Scene {scene.sceneNumber || idx + 1} of {scenes.length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    (~{scene.estimatedDurationSec || 5}s)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteScene(idx)}
                    title="Delete scene"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Narration (Spoken Voiceover Text) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Narration Voiceover (Hindi / English):
                </label>
                <textarea
                  value={scene.narration}
                  onChange={(e) => handleSceneChange(idx, { narration: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed font-sans"
                  placeholder="Voiceover words that ElevenLabs will speak for this scene..."
                />
              </div>

              {/* On-Screen Text / Captions */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  On-Screen Heading / Caption Banner:
                </label>
                <input
                  type="text"
                  value={scene.onScreenText}
                  onChange={(e) => handleSceneChange(idx, { onScreenText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                  placeholder="e.g. जब सूर्यपुत्र कर्ण का रथ पहिया धंसा..."
                />
              </div>

              {/* Visual Prompt for Image Model */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Visual Image Generation Prompt:
                </label>
                <textarea
                  value={scene.visualPrompt}
                  onChange={(e) => handleSceneChange(idx, { visualPrompt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono leading-relaxed"
                  placeholder="Detailed scene prompt passed to Flux / Imagen..."
                />
              </div>

              {/* Technical Controls (Camera Move + Sound Effect) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Camera Move (Ken Burns):
                  </label>
                  <select
                    value={scene.cameraMove}
                    onChange={(e) => handleSceneChange(idx, { cameraMove: e.target.value as CameraMove })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="zoom_in">Slow Zoom In (Intense)</option>
                    <option value="zoom_out">Slow Zoom Out (Epic Reveal)</option>
                    <option value="pan_left">Cinematic Pan Left</option>
                    <option value="pan_right">Cinematic Pan Right</option>
                    <option value="orbital_slow">Orbital Celestial Drift</option>
                    <option value="celestial_tilt">Celestial Upward Tilt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Sacred SFX Tag:
                  </label>
                  <select
                    value={scene.sfxTag}
                    onChange={(e) => handleSceneChange(idx, { sfxTag: e.target.value as SfxTag })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="conch_shell">Divine Shankh (Conch Shell)</option>
                    <option value="temple_bell">Sacred Temple Bell (Ghanti)</option>
                    <option value="thunder_strike">Celestial Thunder Strike</option>
                    <option value="flute_melody">Vedic Krishna Flute Melody</option>
                    <option value="war_drums">Kurukshetra War Drums</option>
                    <option value="fire_whoosh">Sacred Havan Fire Whoosh</option>
                    <option value="divine_chime">Cosmic Divine Chimes</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          {/* Add Scene Button */}
          <button
            type="button"
            onClick={handleAddScene}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Next Scene</span>
          </button>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Story</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Convert JSON to Video (Next: Style & Visuals)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
