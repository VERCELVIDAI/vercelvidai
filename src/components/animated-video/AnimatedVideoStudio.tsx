'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Code,
  LayoutGrid,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Upload,
  ArrowRight,
  Sliders,
  Ratio,
  Clock,
  Layers,
  Flame,
} from 'lucide-react';
import { ANIMATION_STYLES, STYLE_SAMPLE_JSONS } from '@/lib/animated-video/styles';
import { AnimationStyleId, AnimatedScene } from '@/lib/animated-video/types';

interface StudioProps {
  initialStyleId?: AnimationStyleId;
  onStyleChange?: (styleId: AnimationStyleId) => void;
}

export function AnimatedVideoStudio({ initialStyleId = 'mythology', onStyleChange }: StudioProps) {
  const [selectedStyleId, setSelectedStyleId] = useState<AnimationStyleId>(initialStyleId);

  // Sync if parent updates initialStyleId
  useEffect(() => {
    if (initialStyleId && initialStyleId !== selectedStyleId) {
      setSelectedStyleId(initialStyleId);
      const sample = STYLE_SAMPLE_JSONS[initialStyleId] || STYLE_SAMPLE_JSONS['mythology'];
      setScenes(sample);
      setRawJsonText(JSON.stringify(sample, null, 2));
    }
  }, [initialStyleId]);
  const [topic, setTopic] = useState('Lord Krishna revealing the cosmic Vishwaroop to Arjuna at Kurukshetra');
  const [language, setLanguage] = useState<'hi' | 'en' | 'hi-en'>('hi');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9'>('9:16');
  const [selectedVoice, setSelectedVoice] = useState('rishi_hindi_m');

  const [scenes, setScenes] = useState<AnimatedScene[]>(() => {
    return STYLE_SAMPLE_JSONS[initialStyleId] || STYLE_SAMPLE_JSONS['mythology'];
  });

  const [rawJsonText, setRawJsonText] = useState(() => {
    return JSON.stringify(STYLE_SAMPLE_JSONS[initialStyleId] || STYLE_SAMPLE_JSONS['mythology'], null, 2);
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [validationState, setValidationState] = useState<{ status: 'idle' | 'valid' | 'invalid'; message: string }>({
    status: 'idle',
    message: '',
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeStyle = ANIMATION_STYLES.find((s) => s.id === selectedStyleId) || ANIMATION_STYLES[0];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 5), 0);

  // When user switches style pill
  const handleSelectStyle = (styleId: AnimationStyleId) => {
    setSelectedStyleId(styleId);
    onStyleChange?.(styleId);
    const sample = STYLE_SAMPLE_JSONS[styleId] || STYLE_SAMPLE_JSONS['flat-vector'];
    setScenes(sample);
    setRawJsonText(JSON.stringify(sample, null, 2));
    setValidationState({ status: 'valid', message: `Loaded ${styleId} preset script.` });
    setCurrentSceneIdx(0);
    setCurrentTimeSec(0);
    setIsPlaying(false);
  };

  // Generate Script via AI
  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setValidationState({ status: 'idle', message: '' });
    try {
      const res = await fetch('/api/animated-video/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId: selectedStyleId,
          topic,
          language,
          targetDuration: 30,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate script');
      }
      if (data.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
        setRawJsonText(JSON.stringify(data.scenes, null, 2));
        setValidationState({
          status: 'valid',
          message: data.mode === 'live_ai' ? 'AI generated script in JSON format.' : 'Generated structured script from style engine.',
        });
        setCurrentSceneIdx(0);
      }
    } catch (err: any) {
      setValidationState({ status: 'invalid', message: err.message || 'Generation error' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Validate JSON
  const handleValidateJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Root JSON must be an array of scene objects: [ { "scene": 1, ... } ]');
      }
      if (parsed.length === 0) {
        throw new Error('Scenes array cannot be empty. Minimum 2 scenes required.');
      }
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.narration && !item.image_prompt) {
          throw new Error(`Scene #${i + 1} is missing "narration" or "image_prompt".`);
        }
      }
      setScenes(parsed);
      setValidationState({ status: 'valid', message: `Valid JSON: ${parsed.length} scenes parsed successfully!` });
      setTimeout(() => setValidationState({ status: 'idle', message: '' }), 4000);
    } catch (err: any) {
      setValidationState({ status: 'invalid', message: `Invalid JSON: ${err.message}` });
    }
  };

  // Format JSON
  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setRawJsonText(JSON.stringify(parsed, null, 2));
      setValidationState({ status: 'valid', message: 'JSON formatted cleanly.' });
    } catch (err: any) {
      setValidationState({ status: 'invalid', message: `Syntax error: ${err.message}` });
    }
  };

  // Load Sample
  const handleLoadSample = () => {
    const sample = STYLE_SAMPLE_JSONS[selectedStyleId] || STYLE_SAMPLE_JSONS['mythology'];
    setScenes(sample);
    setRawJsonText(JSON.stringify(sample, null, 2));
    setValidationState({ status: 'valid', message: `Loaded default sample for ${activeStyle.name}.` });
  };

  // Copy JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(rawJsonText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Play / Pause Preview Simulation
  const handleTogglePlay = () => {
    if (activeStyle.previewVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    setIsPlaying(!isPlaying);
  };

  // Simulate timeline ticking when playing without video
  useEffect(() => {
    let interval: any;
    if (isPlaying && (!activeStyle.previewVideo || !videoRef.current)) {
      interval = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          // compute active scene
          let elapsed = 0;
          for (let i = 0; i < scenes.length; i++) {
            elapsed += scenes[i].duration || 5;
            if (next <= elapsed) {
              setCurrentSceneIdx(i);
              break;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, scenes, activeStyle.previewVideo]);

  // Export Video Handler
  const handleExportVideo = async () => {
    setIsRendering(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsRendering(false);
      setExportComplete(true);
    }, 3000);
  };

  const activeScene = scenes[currentSceneIdx] || scenes[0];

  return (
    <div className="min-h-screen bg-[#090A11] text-white font-sans selection:bg-[#FFB800] selection:text-black pb-24">
      {/* Top Navbar */}
      <div className="border-b border-[#231F3D] bg-[#0E0D1B]/95 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/animated-video" className="flex items-center gap-2 font-black text-sm text-white">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5145CD] to-[#FFB800] flex items-center justify-center text-xs font-black text-black">
              ⚡
            </span>
            <span>AI Video Maker</span>
          </Link>
          <span className="text-[#3B3564]">|</span>
          <span className="text-xs text-[#9E9AB7] hidden sm:inline">JSON-Driven Animation Studio</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-[#1A1733] border border-[#2B2552] text-[#FFB800] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
            <span>Active: {activeStyle.name}</span>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-1.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-bold transition-colors"
          >
            Video Credits
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* STEP 1: CHOOSE A STYLE (7 PILLS) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">Choose a style</h2>
          </div>
          <p className="text-xs text-[#9E9AB7]">
            Pick one of the seven animation styles. This will tune the AI prompts, narration, character rules, and visuals for your video.
          </p>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ANIMATION_STYLES.map((st) => {
              const isSelected = selectedStyleId === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSelectStyle(st.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                    isSelected
                      ? 'bg-[#1F193D] border-[#FFB800] text-white shadow-[0_0_20px_rgba(255,184,0,0.25)] ring-1 ring-[#FFB800]'
                      : 'bg-[#121124] border-[#252047] text-[#9E9AB7] hover:border-[#3E366E] hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: st.accentColor }}
                  />
                  <span>{st.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: STUDIO WORKSPACE (JSON SCRIPT EDITOR + 9:16 PREVIEW PLAYER) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FFB800] text-black font-black text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">{activeStyle.name} Studio</h2>
            </div>
            <span className="text-xs text-[#9E9AB7]">
              Enter your story idea or pick from our library, then generate a script in JSON. You can edit the JSON directly before rendering.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: TOPIC INPUT + JSON SCRIPT EDITOR + VOICE (7 COLS) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Topic & Prompt Input Deck */}
              <div className="p-4 rounded-2xl bg-[#121124] border border-[#231F3D] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                    Story Topic / Prompt:
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg bg-[#1B1736] border border-[#2F2959] text-xs font-bold text-white outline-none focus:border-[#FFB800]"
                    >
                      <option value="hi">Hindi (हिंदी)</option>
                      <option value="en">English</option>
                      <option value="hi-en">Hinglish</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Untold story of warrior Karna in Mahabharata..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#090A11] border border-[#231F3D] text-xs sm:text-sm text-white placeholder-[#5D5783] focus:outline-none focus:border-[#FFB800]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateScript}
                    disabled={isGenerating}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#FF9000] text-black font-black text-xs shrink-0 flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Script</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* JSON EDITOR CONTAINER */}
              <div className="p-4 rounded-2xl bg-[#121124] border border-[#231F3D] space-y-3">
                {/* Editor Header Toolbar */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#231F3D]">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#FFB800]" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      {activeStyle.name} JSON Editor
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1A1733] text-[#9E9AB7] font-mono">
                      {scenes.length} Scenes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="px-2.5 py-1 rounded-lg bg-[#1B1736] hover:bg-[#28224D] border border-[#2F2959] text-[11px] font-bold text-white transition-colors"
                    >
                      Load sample
                    </button>
                    <button
                      type="button"
                      onClick={handleValidateJson}
                      className="px-3 py-1 rounded-lg bg-[#FFB800] hover:bg-[#E5A600] text-black text-[11px] font-black transition-colors"
                    >
                      Validate
                    </button>
                  </div>
                </div>

                {/* Validation Feedback Banner */}
                {validationState.status === 'valid' && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{validationState.message}</span>
                  </div>
                )}
                {validationState.status === 'invalid' && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationState.message}</span>
                  </div>
                )}

                {/* Code Textarea */}
                <div className="relative">
                  <textarea
                    rows={13}
                    value={rawJsonText}
                    onChange={(e) => setRawJsonText(e.target.value)}
                    className="w-full p-3.5 font-mono text-xs leading-relaxed rounded-xl bg-[#08080E] text-[#F3E8FF] border border-[#231F3D] focus:outline-none focus:border-[#FFB800] selection:bg-[#FFB800] selection:text-black resize-y"
                    placeholder="// Type or paste your scene JSON here..."
                  />
                </div>

                {/* Editor Bottom Actions */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFormatJson}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1733] hover:bg-[#26214A] border border-[#28224C] text-[11px] font-bold text-[#C5C0E6] transition-colors"
                    >
                      Format
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1733] hover:bg-[#26214A] border border-[#28224C] text-[11px] font-bold text-[#C5C0E6] flex items-center gap-1 transition-colors"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy for external use'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-[#9E9AB7]">
                    Total length: ~{totalDuration}s
                  </div>
                </div>

                {/* Voiceover Selection Bar */}
                <div className="pt-2 border-t border-[#231F3D] flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-[#FFB800]" />
                    <span className="text-xs font-bold text-white">Narrator voice:</span>
                    <select
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-[#090A11] border border-[#2B2552] text-xs font-semibold text-white outline-none focus:border-[#FFB800]"
                    >
                      <option value="rishi_hindi_m">Rishi (Male - Deep Hindi Narration)</option>
                      <option value="ananya_hindi_f">Ananya (Female - Expressive Hindi)</option>
                      <option value="alistair_en_m">Alistair (Male - Epic Cinema English)</option>
                      <option value="rohan_hinglish_m">Rohan (Male - Modern Hinglish Viral)</option>
                    </select>
                  </div>

                  <label className="text-[11px] font-bold text-[#9E9AB7] hover:text-white flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Upload voice audio</span>
                    <input type="file" accept="audio/*" className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 9:16 PREVIEW PLAYER & EXPORT CONTROLS (5 COLS) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              {/* Preview Box Container */}
              <div className="p-4 rounded-2xl bg-[#121124] border border-[#231F3D] flex flex-col items-center">
                {/* Aspect Ratio Switcher */}
                <div className="w-full flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#9E9AB7]">Video Preview</span>
                  <div className="flex items-center gap-1 bg-[#090A11] p-1 rounded-lg border border-[#231F3D]">
                    {(['9:16', '1:1', '16:9'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setAspectRatio(r)}
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                          aspectRatio === r
                            ? 'bg-[#FFB800] text-black'
                            : 'text-[#9E9AB7] hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas / Video Screen */}
                <div
                  className={`relative w-full rounded-2xl overflow-hidden bg-black border border-[#2B2552] flex items-center justify-center shadow-2xl ${
                    aspectRatio === '9:16'
                      ? 'aspect-[9/16] max-w-[280px]'
                      : aspectRatio === '1:1'
                      ? 'aspect-square max-w-[320px]'
                      : 'aspect-[16/9] w-full'
                  }`}
                >
                  {/* If style has video preview (e.g. Mythology), play real video! */}
                  {activeStyle.previewVideo ? (
                    <video
                      ref={videoRef}
                      src={activeStyle.previewVideo}
                      poster={activeStyle.previewImage}
                      playsInline
                      loop
                      muted={isMuted}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* Dynamic Animated Canvas Preview */
                    <div
                      className="w-full h-full p-4 flex flex-col justify-between relative bg-cover bg-center"
                      style={{ backgroundImage: `url(${activeStyle.previewImage})` }}
                    >
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#FFB800] border border-[#FFB800]/40">
                          Scene {currentSceneIdx + 1}/{scenes.length}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#FFB800] text-black text-[10px] font-black uppercase">
                          {activeStyle.name}
                        </span>
                      </div>

                      {/* On-Screen Caption Banner */}
                      <div className="relative z-10 text-center space-y-2">
                        {activeScene?.on_screen_text && (
                          <div className="inline-block px-3 py-1 rounded-lg bg-black/80 border border-[#FFB800]/50 text-xs font-black text-[#FFB800] shadow-lg">
                            {activeScene.on_screen_text}
                          </div>
                        )}
                        <p className="text-xs text-white leading-relaxed font-bold drop-shadow-md px-2">
                          "{activeScene?.narration || 'Your narrated story scenes will appear here...'}"
                        </p>
                      </div>

                      <div className="relative z-10 text-[10px] font-mono text-slate-400 text-right">
                        Camera: {activeScene?.camera || 'zoom_in'}
                      </div>
                    </div>
                  )}

                  {/* Play/Pause Center Overlay */}
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                        isPlaying
                          ? 'bg-black/50 text-white opacity-0 group-hover/play:opacity-100 scale-90'
                          : 'bg-[#FFB800] text-black scale-100 shadow-[0_0_30px_rgba(255,184,0,0.6)]'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                    </div>
                  </button>
                </div>

                {/* Timeline & Player Bar Below Screen */}
                <div className="w-full mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#9E9AB7]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="p-1 rounded text-white hover:text-[#FFB800]"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <span>{currentTimeSec}s / {totalDuration}s</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded text-white hover:text-[#FFB800]"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Scrubber Progress Bar */}
                  <div
                    className="w-full h-1.5 rounded-full bg-[#1A1733] cursor-pointer overflow-hidden relative"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = (e.clientX - rect.left) / rect.width;
                      setCurrentTimeSec(Math.round(ratio * totalDuration));
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#FFB800] to-[#FF9000] transition-all"
                      style={{ width: `${(currentTimeSec / (totalDuration || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Export & Download Action */}
                <div className="w-full mt-5 pt-3 border-t border-[#231F3D]">
                  <button
                    type="button"
                    onClick={handleExportVideo}
                    disabled={isRendering}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFB800] via-[#FFAE00] to-[#FF9000] hover:opacity-95 text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,184,0,0.35)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isRendering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Rendering 1080p Video...</span>
                      </>
                    ) : exportComplete ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Download 1080p MP4 Ready</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Export Animated Video MP4</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-[#7F79AA] mt-2">
                    Commercial license included • High-definition 1080p • Zero watermark
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
