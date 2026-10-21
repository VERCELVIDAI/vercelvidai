'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Scissors,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Film,
  Type,
  Music,
  Layers,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  Maximize2,
  Ratio,
  Sliders,
  HelpCircle,
} from 'lucide-react';

export default function VideoEditorPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [project, setProject] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Export State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportResolution, setExportResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [exportResult, setExportResult] = useState<any>(null);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then((res) => {
        if (!res.ok) router.push('/dashboard');
        return res.json();
      })
      .then((data) => {
        if (data.project) {
          setProject(data.project);
          setTimeline(data.project.timeline || {
            durationSec: 15,
            aspectRatio: '16:9',
            resolution: '1080p',
            tracks: [
              { id: 'trk_v1', type: 'video', name: 'Primary Video Track' },
              { id: 'trk_t1', type: 'text', name: 'Text & Titles' },
              { id: 'trk_a1', type: 'audio', name: 'Music Track' },
            ],
            clips: [],
          });
        }
      })
      .catch(() => router.push('/dashboard'));
  }, [params.projectId]);

  // Sync video element time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeSec(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTimeSec(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Push to undo stack before mutating timeline
  const recordHistory = () => {
    if (timeline) {
      setHistory((prev) => [...prev, JSON.parse(JSON.stringify(timeline))]);
      setFuture([]);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((prev) => [JSON.parse(JSON.stringify(timeline)), ...prev]);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setTimeline(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(timeline))]);
    setFuture((prev) => prev.slice(1));
    setTimeline(next);
  };

  // Timeline Operations
  const handleAddTextOverlay = () => {
    recordHistory();
    const newClip = {
      id: 'clp_' + Math.random().toString(36).substring(2, 9),
      trackId: 'trk_t1',
      type: 'text',
      title: 'Headline Text',
      text: 'YOUR CAPTION HERE',
      startTimeSec: currentTimeSec,
      durationSec: 4,
      style: { fontSize: 32, color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.6)', positionY: 80 },
    };
    setTimeline((prev: any) => ({
      ...prev,
      clips: [...prev.clips, newClip],
    }));
    setActiveClipId(newClip.id);
  };

  const handleAddSampleScene = () => {
    recordHistory();
    const newClip = {
      id: 'clp_' + Math.random().toString(36).substring(2, 9),
      trackId: 'trk_v1',
      type: 'video',
      title: 'B-Roll City Sunset',
      sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-running-through-the-city-at-sunset-41662-large.mp4',
      startTimeSec: timeline.durationSec || 0,
      durationSec: 5,
      volume: 1,
    };
    setTimeline((prev: any) => ({
      ...prev,
      durationSec: (prev.durationSec || 0) + 5,
      clips: [...prev.clips, newClip],
    }));
  };

  const handleSplitClip = (clipId: string) => {
    recordHistory();
    const clip = timeline.clips.find((c: any) => c.id === clipId);
    if (!clip || clip.durationSec <= 2) return;

    const splitDuration = Math.round(clip.durationSec / 2);
    clip.durationSec = splitDuration;

    const secondHalf = {
      ...JSON.parse(JSON.stringify(clip)),
      id: 'clp_' + Math.random().toString(36).substring(2, 9),
      title: `${clip.title} (Part 2)`,
      startTimeSec: clip.startTimeSec + splitDuration,
      durationSec: clip.durationSec,
    };

    setTimeline((prev: any) => ({
      ...prev,
      clips: [...prev.clips, secondHalf],
    }));
  };

  const handleDeleteClip = (clipId: string) => {
    recordHistory();
    setTimeline((prev: any) => ({
      ...prev,
      clips: prev.clips.filter((c: any) => c.id !== clipId),
    }));
    if (activeClipId === clipId) setActiveClipId(null);
  };

  const handleAspectRatioChange = (ratio: '16:9' | '9:16' | '1:1') => {
    recordHistory();
    setTimeline((prev: any) => ({
      ...prev,
      aspectRatio: ratio,
    }));
  };

  // Save changes to database
  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/projects/${params.projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeline,
        }),
      });
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Export render sequence
  const handleExportSubmit = async () => {
    setIsRendering(true);
    setRenderProgress(10);

    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 600);

    try {
      const res = await fetch('/api/editor/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: params.projectId,
          settings: { resolution: exportResolution, fps: 30, format: 'mp4' },
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      setRenderProgress(100);

      setTimeout(() => {
        setIsRendering(false);
        setExportResult(data);
      }, 800);
    } catch (err) {
      clearInterval(interval);
      setIsRendering(false);
    }
  };

  if (!project || !timeline) {
    return (
      <div className="min-h-screen bg-[#07080B] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active clip inspector
  const activeClip = timeline.clips.find((c: any) => c.id === activeClipId);

  // Primary video source
  const primaryClip = timeline.clips.find((c: any) => c.type === 'video' && c.sourceUrl);
  const videoSrc = primaryClip?.sourceUrl || 'https://assets.mixkit.co/videos/preview/mixkit-athlete-tying-his-running-shoes-42352-large.mp4';

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 flex flex-col h-screen overflow-hidden select-none">
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 border-b border-white/[0.08] bg-[#0B0C11] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm truncate max-w-xs">{project.title}</span>
            <span className="text-[11px] font-mono text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-500/30">
              {timeline.aspectRatio}
            </span>
          </div>
        </div>

        {/* Center: Undo / Redo / Aspect Switcher */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5 text-xs font-mono">
            {(['16:9', '9:16', '1:1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleAspectRatioChange(r)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  timeline.aspectRatio === r ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {saveToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveToast ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              setExportModalOpen(true);
              setExportResult(null);
            }}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Video</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Cinema Player + Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools / Media Palette (Hidden on small screens) */}
        <aside className="w-16 bg-[#090A0F] border-r border-white/[0.08] flex flex-col items-center py-4 gap-4 shrink-0">
          <button
            onClick={handleAddSampleScene}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-violet-600 text-slate-300 hover:text-white transition-all"
            title="Add AI Scene"
          >
            <Film className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddTextOverlay}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-violet-600 text-slate-300 hover:text-white transition-all"
            title="Add Text Caption"
          >
            <Type className="w-5 h-5" />
          </button>

          <Link
            href="/create?mode=video"
            className="p-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-400 hover:text-white transition-all"
            title="Generate AI Scene"
          >
            <Sparkles className="w-5 h-5" />
          </Link>
        </aside>

        {/* Central Cinema Viewport */}
        <div className="flex-1 flex flex-col bg-[#050608] relative overflow-hidden items-center justify-center p-4">
          {/* Cinema Frame */}
          <div
            className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10 transition-all ${
              timeline.aspectRatio === '9:16'
                ? 'aspect-[9/16] h-[340px] sm:h-[400px]'
                : timeline.aspectRatio === '1:1'
                ? 'aspect-square h-[340px] sm:h-[380px]'
                : 'aspect-video w-full max-w-3xl'
            }`}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              onTimeUpdate={handleTimeUpdate}
              playsInline
              loop
              className="w-full h-full object-cover"
            />

            {/* Dynamic In-Video Text Overlays based on current time */}
            {timeline.clips
              .filter((c: any) => c.type === 'text')
              .map((c: any) => {
                const isVisible =
                  currentTimeSec >= c.startTimeSec &&
                  currentTimeSec <= c.startTimeSec + c.durationSec;
                if (!isVisible) return null;

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveClipId(c.id)}
                    className="absolute inset-x-4 flex justify-center cursor-pointer pointer-events-auto"
                    style={{ bottom: `${c.style?.positionY || 20}%` }}
                  >
                    <span
                      className="px-4 py-1.5 rounded-lg font-black tracking-wider text-center drop-shadow-xl border border-white/20 select-none"
                      style={{
                        fontSize: `${c.style?.fontSize || 28}px`,
                        color: c.style?.color || '#FFFFFF',
                        backgroundColor: c.style?.backgroundColor || 'rgba(0,0,0,0.6)',
                      }}
                    >
                      {c.text}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Quick Playback Transport Controls */}
          <div className="mt-3 flex items-center gap-4 bg-[#0E1017]/90 px-4 py-1.5 rounded-full border border-white/10 text-xs shadow-lg">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <span className="font-mono text-slate-300">
              {Math.floor(currentTimeSec)}s / {timeline.durationSec || 15}s
            </span>
          </div>
        </div>

        {/* Right Inspector Panel */}
        <aside className="w-72 bg-[#0A0B10] border-l border-white/[0.08] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          {activeClip ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Clip Inspector</span>
                <button onClick={() => handleDeleteClip(activeClip.id)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {activeClip.type === 'text' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Overlay Text</label>
                    <input
                      type="text"
                      value={activeClip.text || ''}
                      onChange={(e) => {
                        recordHistory();
                        activeClip.text = e.target.value;
                        setTimeline({ ...timeline });
                      }}
                      className="w-full bg-[#12141A] text-white px-3 py-2 rounded-lg border border-white/10 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Text Color</label>
                    <input
                      type="color"
                      value={activeClip.style?.color || '#FFFFFF'}
                      onChange={(e) => {
                        recordHistory();
                        activeClip.style = { ...activeClip.style, color: e.target.value };
                        setTimeline({ ...timeline });
                      }}
                      className="w-full h-8 bg-[#12141A] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Duration ({activeClip.durationSec}s)</label>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={activeClip.durationSec}
                      onChange={(e) => {
                        recordHistory();
                        activeClip.durationSec = Number(e.target.value);
                        setTimeline({ ...timeline });
                      }}
                      className="w-full accent-violet-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {activeClip.type === 'video' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400">Clip Title:</span>
                    <p className="font-semibold text-white mt-1">{activeClip.title}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Duration:</span>
                    <p className="font-semibold text-white mt-1">{activeClip.durationSec} seconds</p>
                  </div>
                  <button
                    onClick={() => handleSplitClip(activeClip.id)}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Split Clip in Half</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <Sliders className="w-8 h-8 mx-auto text-slate-600" />
              <p>Select any clip or text layer on the timeline to inspect and edit properties.</p>
            </div>
          )}

          <div className="pt-4 border-t border-white/[0.08] text-[11px] text-slate-500">
            <span>Video Engine: WebCodecs Remotion</span>
          </div>
        </aside>
      </div>

      {/* 3. MULTI-TRACK TIMELINE (Bottom Panel) */}
      <div className="h-60 border-t border-white/[0.08] bg-[#090A0F] flex flex-col shrink-0">
        {/* Timeline ruler & playhead */}
        <div className="h-7 border-b border-white/[0.06] bg-[#07080B] flex items-center px-4 justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-violet-400 font-bold">TIMELINE</span>
            <button
              onClick={handleAddTextOverlay}
              className="text-[11px] text-slate-300 hover:text-violet-400 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Caption Track</span>
            </button>
          </div>

          <div className="flex-1 max-w-xl mx-4">
            <input
              type="range"
              min={0}
              max={timeline.durationSec || 15}
              step={0.1}
              value={currentTimeSec}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-violet-500 cursor-pointer h-1"
            />
          </div>

          <span>{Math.floor(currentTimeSec)}s</span>
        </div>

        {/* Tracks Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* TRACK 1: Video Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-violet-400" />
              <span>VIDEO</span>
            </div>

            <div className="flex-1 h-12 bg-white/[0.02] rounded-xl border border-white/5 relative flex items-center p-1 gap-2">
              {timeline.clips
                .filter((c: any) => c.type === 'video')
                .map((clip: any) => (
                  <div
                    key={clip.id}
                    onClick={() => setActiveClipId(clip.id)}
                    className={`h-full rounded-lg px-3 flex items-center justify-between text-xs font-semibold cursor-pointer border transition-all ${
                      activeClipId === clip.id
                        ? 'bg-violet-600 text-white border-white shadow-lg'
                        : 'bg-gradient-to-r from-violet-900/60 to-indigo-900/60 text-violet-200 border-violet-500/30 hover:border-violet-400'
                    }`}
                    style={{ flex: clip.durationSec }}
                  >
                    <span className="truncate">{clip.title}</span>
                    <span className="text-[10px] opacity-75 font-mono shrink-0 ml-2">{clip.durationSec}s</span>
                  </div>
                ))}
            </div>
          </div>

          {/* TRACK 2: Text / Subtitle Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-sky-400" />
              <span>CAPTIONS</span>
            </div>

            <div className="flex-1 h-9 bg-white/[0.02] rounded-xl border border-white/5 relative flex items-center p-1 gap-2">
              {timeline.clips
                .filter((c: any) => c.type === 'text')
                .map((clip: any) => (
                  <div
                    key={clip.id}
                    onClick={() => setActiveClipId(clip.id)}
                    className={`h-full rounded-md px-2.5 flex items-center justify-between text-[11px] font-medium cursor-pointer border transition-all ${
                      activeClipId === clip.id
                        ? 'bg-sky-600 text-white border-white'
                        : 'bg-sky-950/60 text-sky-200 border-sky-500/30 hover:border-sky-400'
                    }`}
                    style={{ flex: clip.durationSec }}
                  >
                    <span className="truncate">{clip.text}</span>
                    <span className="text-[10px] opacity-75 font-mono ml-2 shrink-0">{clip.durationSec}s</span>
                  </div>
                ))}
            </div>
          </div>

          {/* TRACK 3: Audio Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-emerald-400" />
              <span>AUDIO</span>
            </div>

            <div className="flex-1 h-8 bg-emerald-950/20 rounded-xl border border-emerald-500/20 flex items-center px-3 text-[11px] font-mono text-emerald-300">
              Synthwave Master Audio Track (Royalty-Free 128BPM)
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT & RENDER MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141A] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Download className="w-4 h-4 text-violet-400" />
                <span>Export Master Video</span>
              </h3>
              {!isRendering && (
                <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              )}
            </div>

            {isRendering ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin mx-auto" />
                <h4 className="font-bold text-white text-base">Rendering Master MP4</h4>
                <p className="text-xs text-slate-400">Composing tracks, subtitles, and lossless audio...</p>

                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-violet-400">{renderProgress}% Complete</span>
              </div>
            ) : exportResult ? (
              <div className="py-4 text-center space-y-4">
                <Check className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Export Ready</h4>
                <p className="text-xs text-slate-300">{exportResult.message}</p>

                <a
                  href={exportResult.downloadUrl}
                  download="VercelVidai_MasterRender.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master File (1080p MP4)</span>
                </a>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1.5">Master Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['720p', '1080p', '4k'] as const).map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setExportResolution(res)}
                        className={`p-2.5 rounded-xl border text-center font-bold uppercase transition-all ${
                          exportResolution === res
                            ? 'bg-violet-600 text-white border-violet-400'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Aspect Ratio:</span>
                    <strong className="text-white">{timeline.aspectRatio}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <strong className="text-white">{timeline.durationSec || 15}s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Codec:</span>
                    <strong className="text-white">H.264 / AAC High Profile</strong>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setExportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExportSubmit}
                    className="px-6 py-2.5 rounded-xl text-white bg-violet-600 hover:bg-violet-500 font-bold shadow-lg shadow-violet-600/30 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Start Render</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
