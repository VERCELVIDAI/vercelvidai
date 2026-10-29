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
  Download,
  Film,
  Type,
  Music,
  Layers,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  Sliders,
  X,
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

  // Asset Library Modal State
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [isAssetsLoading, setIsAssetsLoading] = useState(false);

  // Export State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportResolution, setExportResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [exportResult, setExportResult] = useState<any>(null);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<any[]>([]);
  const [future, setFuture] = useState<any[]>([]);

  // Mobile editor active panel toggle
  const [mobileTab, setMobileTab] = useState<'timeline' | 'inspector' | 'tools'>('timeline');

  const fetchAssets = async () => {
    setIsAssetsLoading(true);
    try {
      const res = await fetch('/api/assets');
      if (res.ok) {
        const data = await res.json();
        setAvailableAssets(data.assets || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAssetsLoading(false);
    }
  };

  const handleAddAssetToTimeline = (asset: any) => {
    recordHistory();
    const isAudio = asset.assetType === 'audio';
    const isImage = asset.assetType === 'image';

    const trackId = isAudio ? 'trk_a1' : 'trk_v1';
    const type = isAudio ? 'audio' : isImage ? 'image' : 'video';
    const clipDuration = isAudio ? 10 : 5;

    const newClip = {
      id: 'clp_' + Math.random().toString(36).substring(2, 9),
      trackId,
      type,
      title: asset.name,
      sourceUrl: asset.url,
      thumbnailUrl: asset.url,
      startTimeSec: currentTimeSec,
      durationSec: clipDuration,
      volume: 1,
    };

    setTimeline((prev: any) => ({
      ...prev,
      durationSec: Math.max(prev.durationSec || 15, currentTimeSec + clipDuration),
      clips: [...prev.clips, newClip],
    }));
    setActiveClipId(newClip.id);
    setAssetModalOpen(false);
  };

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
      sourceUrl: '/media/login/login-hero-preview.mp4',
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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active clip inspector
  const activeClip = timeline.clips.find((c: any) => c.id === activeClipId);

  // Primary video source
  const primaryClip = timeline.clips.find((c: any) => c.type === 'video' && c.sourceUrl);
  const videoSrc = primaryClip?.sourceUrl || '/media/templates/tmpl-01-cinematic-product.mp4';

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden select-none transition-colors duration-200 bg-white text-[#17191D]">
      {/* 1. TOP TOOLBAR */}
      <header className="h-14 border-b border-[#E5E7EB] bg-white px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-[#F7F8FA] hover:bg-slate-100 text-[#667085] hover:text-[#17191D] transition-colors border border-[#E5E7EB]"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-[#E5E7EB]" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#17191D] text-sm truncate max-w-xs">{project.title}</span>
            <span className="text-[11px] font-mono text-[#5145CD] bg-[#EEF2FF] px-2 py-0.5 rounded border border-[#5145CD]/20 font-semibold">
              {timeline.aspectRatio}
            </span>
          </div>
        </div>

        {/* Center: Undo / Redo / Aspect Switcher */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-lg border border-[#E5E7EB]">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1 rounded text-[#667085] hover:text-[#5145CD] disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-1 rounded text-[#667085] hover:text-[#5145CD] disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1 bg-[#F7F8FA] p-1 rounded-lg border border-[#E5E7EB] text-xs font-mono">
            {(['16:9', '9:16', '1:1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleAspectRatioChange(r)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  timeline.aspectRatio === r
                    ? 'bg-[#5145CD] text-white shadow-2xs font-semibold'
                    : 'text-[#667085] hover:text-[#17191D]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Right Actions: Save & Export */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveProject}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] text-[#17191D] hover:bg-[#F7F8FA] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            {saveToast ? <Check className="w-3.5 h-3.5 text-[#5145CD]" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? 'Saving...' : saveToast ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              setExportResult(null);
              setExportModalOpen(true);
            }}
            className="px-4 py-1.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Cinema Player + Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools / Media Palette (Desktop only) */}
        <aside className="hidden md:flex w-16 border-r border-[#E5E7EB] bg-white flex-col items-center py-4 gap-4 shrink-0 transition-colors duration-200">
          <button
            onClick={handleAddSampleScene}
            className="p-2.5 rounded-xl bg-[#F7F8FA] text-[#667085] hover:text-[#5145CD] hover:bg-[#EEF2FF] border border-[#E5E7EB] transition-all cursor-pointer"
            title="Add AI Scene"
          >
            <Film className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              fetchAssets();
              setAssetModalOpen(true);
            }}
            className="p-2.5 rounded-xl bg-[#F7F8FA] text-[#667085] hover:text-[#5145CD] hover:bg-[#EEF2FF] border border-[#E5E7EB] transition-all cursor-pointer"
            title="Import Asset from Library"
          >
            <Layers className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddTextOverlay}
            className="p-2.5 rounded-xl bg-[#F7F8FA] text-[#667085] hover:text-[#5145CD] hover:bg-[#EEF2FF] border border-[#E5E7EB] transition-all cursor-pointer"
            title="Add Text Caption"
          >
            <Type className="w-5 h-5" />
          </button>

          <Link
            href="/create?mode=video"
            className="p-2.5 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#5145CD] transition-all border border-[#5145CD]/20"
            title="Generate AI Scene"
          >
            <Sparkles className="w-5 h-5 text-[#5145CD]" />
          </Link>
        </aside>

        {/* Central Cinema Viewport */}
        <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden items-center justify-center p-2 sm:p-4">
          {/* Cinema Frame */}
          <div
            className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-slate-800 transition-all max-h-[35vh] sm:max-h-[50vh] ${
              timeline.aspectRatio === '9:16'
                ? 'aspect-[9/16] h-[260px] sm:h-[400px]'
                : timeline.aspectRatio === '1:1'
                ? 'aspect-square h-[260px] sm:h-[380px]'
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
                    onClick={() => {
                      setActiveClipId(c.id);
                      setMobileTab('inspector');
                    }}
                    className="absolute inset-x-4 flex justify-center cursor-pointer pointer-events-auto"
                    style={{ bottom: `${c.style?.positionY || 20}%` }}
                  >
                    <span
                      className="px-4 py-1.5 rounded-lg font-black tracking-wider text-center drop-shadow-xl border border-white/20 select-none text-xs sm:text-base"
                      style={{
                        fontSize: `${c.style?.fontSize || 24}px`,
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
          <div className="mt-2.5 flex items-center gap-3 sm:gap-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs shadow-lg">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-8 h-8 rounded-full bg-[#5145CD] hover:bg-[#4338CA] text-white flex items-center justify-center transition-all shadow-sm shrink-0 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <span className="font-mono text-[#17191D] text-[11px] sm:text-xs font-semibold">
              {Math.floor(currentTimeSec)}s / {timeline.durationSec || 15}s
            </span>
          </div>
        </div>

        {/* Right Inspector Panel (Desktop only) */}
        <aside className="hidden md:flex w-72 border-l border-[#E5E7EB] bg-white p-4 flex-col justify-between shrink-0 overflow-y-auto transition-colors duration-200 text-[#17191D]">
          {activeClip ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-xs font-bold text-[#17191D] uppercase tracking-wider">Clip Inspector</span>
                <button onClick={() => handleDeleteClip(activeClip.id)} className="text-rose-600 hover:text-rose-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {activeClip.type === 'text' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[#667085] mb-1 font-semibold">Overlay Text</label>
                    <input
                      type="text"
                      value={activeClip.text || ''}
                      onChange={(e) => {
                        recordHistory();
                        activeClip.text = e.target.value;
                        setTimeline({ ...timeline });
                      }}
                      className="w-full bg-[#F7F8FA] text-[#17191D] px-3 py-2 rounded-lg border border-[#E5E7EB] focus:outline-none focus:border-[#5145CD]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] mb-1 font-semibold">Text Color</label>
                    <input
                      type="color"
                      value={activeClip.style?.color || '#FFFFFF'}
                      onChange={(e) => {
                        recordHistory();
                        activeClip.style = { ...activeClip.style, color: e.target.value };
                        setTimeline({ ...timeline });
                      }}
                      className="w-full h-8 bg-white border border-[#E5E7EB] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#667085] mb-1 font-semibold">Duration ({activeClip.durationSec}s)</label>
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
                      className="w-full accent-[#5145CD] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {activeClip.type === 'video' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#667085]">Clip Title:</span>
                    <p className="font-semibold text-[#17191D] mt-1">{activeClip.title}</p>
                  </div>
                  <div>
                    <span className="text-[#667085]">Duration:</span>
                    <p className="font-semibold text-[#17191D] mt-1">{activeClip.durationSec} seconds</p>
                  </div>
                  <button
                    onClick={() => handleSplitClip(activeClip.id)}
                    className="w-full py-2 rounded-lg bg-[#F7F8FA] hover:bg-slate-100 text-[#17191D] border border-[#E5E7EB] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Split Clip in Half</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#667085] space-y-2">
              <Sliders className="w-8 h-8 mx-auto text-[#667085]/40" />
              <p>Select any clip or text layer on the timeline to inspect and edit properties.</p>
            </div>
          )}

          <div className="pt-4 border-t border-[#E5E7EB] text-[11px] text-[#667085]">
            <span>Video Engine: WebCodecs Remotion</span>
          </div>
        </aside>
      </div>

      {/* MOBILE TAB CONTROLS (Only visible on screens < 768px) */}
      <div className="md:hidden flex border-t border-[#E5E7EB] bg-white text-xs font-bold divide-x divide-[#E5E7EB] shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('timeline')}
          className={`flex-1 py-2.5 min-h-[44px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'timeline'
              ? 'bg-[#EEF2FF] text-[#5145CD] border-b-2 border-[#5145CD]'
              : 'text-[#667085]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-2.5 min-h-[44px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'inspector'
              ? 'bg-[#EEF2FF] text-[#5145CD] border-b-2 border-[#5145CD]'
              : 'text-[#667085]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Inspector {activeClip ? '•' : ''}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('tools')}
          className={`flex-1 py-2.5 min-h-[44px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'tools'
              ? 'bg-[#EEF2FF] text-[#5145CD] border-b-2 border-[#5145CD]'
              : 'text-[#667085]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Media Tools</span>
        </button>
      </div>

      {/* 3. MULTI-TRACK TIMELINE & MOBILE PANELS (Bottom Area) */}
      <div className="h-56 sm:h-60 border-t border-[#E5E7EB] bg-white flex flex-col shrink-0 transition-colors duration-200 overflow-hidden">
        {/* Mobile Tab Condition: Inspector */}
        {mobileTab === 'inspector' && (
          <div className="md:hidden flex-1 p-4 overflow-y-auto text-xs text-left">
            {activeClip ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                  <span className="font-bold text-[#17191D] uppercase tracking-wider">
                    Clip Properties: {activeClip.title || activeClip.text || 'Selected Clip'}
                  </span>
                  <button
                    onClick={() => handleDeleteClip(activeClip.id)}
                    className="p-1 rounded text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {activeClip.type === 'text' && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[#667085] mb-1 font-semibold">Overlay Text</label>
                      <input
                        type="text"
                        value={activeClip.text || ''}
                        onChange={(e) => {
                          recordHistory();
                          activeClip.text = e.target.value;
                          setTimeline({ ...timeline });
                        }}
                        className="w-full bg-[#F7F8FA] text-[#17191D] px-3 py-2 rounded-xl border border-[#E5E7EB] focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-[#667085] mb-1 font-semibold">Color</label>
                        <input
                          type="color"
                          value={activeClip.style?.color || '#FFFFFF'}
                          onChange={(e) => {
                            recordHistory();
                            activeClip.style = { ...activeClip.style, color: e.target.value };
                            setTimeline({ ...timeline });
                          }}
                          className="w-full h-8 rounded-lg cursor-pointer border border-[#E5E7EB]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[#667085] mb-1 font-semibold">Duration: {activeClip.durationSec}s</label>
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
                          className="w-full accent-[#5145CD] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeClip.type === 'video' && (
                  <div className="space-y-2">
                    <p className="text-[#667085]">Duration: <strong className="text-[#17191D]">{activeClip.durationSec}s</strong></p>
                    <button
                      onClick={() => handleSplitClip(activeClip.id)}
                      className="py-2 px-3 rounded-xl bg-[#F7F8FA] text-[#5145CD] font-bold border border-[#5145CD]/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Split Clip in Half</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-[#667085] space-y-1">
                <Sliders className="w-6 h-6 mx-auto text-[#5145CD]" />
                <p>Tap any clip or caption in the Timeline tab to edit its properties.</p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Tab Condition: Media Tools */}
        {mobileTab === 'tools' && (
          <div className="md:hidden flex-1 p-4 grid grid-cols-2 gap-2.5 overflow-y-auto">
            <button
              onClick={() => {
                handleAddSampleScene();
                setMobileTab('timeline');
              }}
              className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex flex-col items-center gap-1.5 text-xs font-bold text-[#17191D] shadow-2xs cursor-pointer"
            >
              <Film className="w-5 h-5 text-[#5145CD]" />
              <span>Add AI Scene</span>
            </button>
            <button
              onClick={() => {
                fetchAssets();
                setAssetModalOpen(true);
              }}
              className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex flex-col items-center gap-1.5 text-xs font-bold text-[#17191D] shadow-2xs cursor-pointer"
            >
              <Layers className="w-5 h-5 text-[#5145CD]" />
              <span>Import Asset</span>
            </button>
            <button
              onClick={() => {
                handleAddTextOverlay();
                setMobileTab('timeline');
              }}
              className="p-3 rounded-xl bg-white border border-[#E5E7EB] flex flex-col items-center gap-1.5 text-xs font-bold text-[#17191D] shadow-2xs cursor-pointer"
            >
              <Type className="w-5 h-5 text-indigo-500" />
              <span>Add Caption</span>
            </button>
            <Link
              href="/create?mode=video"
              className="p-3 rounded-xl bg-[#EEF2FF] border border-[#5145CD]/20 flex flex-col items-center gap-1.5 text-xs font-bold text-[#5145CD] shadow-2xs"
            >
              <Sparkles className="w-5 h-5 text-[#5145CD]" />
              <span>Generate AI Clip</span>
            </Link>
          </div>
        )}

        {/* Timeline Tracks (Visible on Desktop OR when mobileTab === 'timeline') */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileTab !== 'timeline' ? 'hidden md:flex' : 'flex'}`}>
          {/* Timeline ruler & playhead */}
          <div className="h-8 border-b border-[#E5E7EB] bg-[#F7F8FA] flex items-center px-4 justify-between text-[11px] font-mono shrink-0 text-[#667085]">
            <div className="flex items-center gap-3">
              <span className="text-[#5145CD] font-bold">TIMELINE</span>
              <button
                onClick={handleAddTextOverlay}
                className="hidden sm:flex text-[11px] text-[#667085] hover:text-[#5145CD] items-center gap-1 font-medium cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#5145CD]" />
                <span>Add Caption Track</span>
              </button>
            </div>

            <div className="flex-1 max-w-xl mx-3 sm:mx-4">
              <input
                type="range"
                min={0}
                max={timeline.durationSec || 15}
                step={0.1}
                value={currentTimeSec}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full accent-[#5145CD] cursor-pointer h-1.5"
              />
            </div>

            <span className="font-bold text-[#17191D]">{Math.floor(currentTimeSec)}s</span>
          </div>

          {/* Tracks Area (Scrolls horizontally ONLY within its own container) */}
          <div className="flex-1 overflow-y-auto overflow-x-auto p-3 space-y-2">
            <div className="min-w-[540px] space-y-2">
              {/* TRACK 1: Video Track */}
              <div className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-xs font-mono text-[#667085] flex items-center gap-1.5 font-medium">
                  <Film className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>VIDEO</span>
                </div>

                <div className="flex-1 h-12 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] relative flex items-center p-1 gap-2">
                  {timeline.clips
                    .filter((c: any) => c.type === 'video')
                    .map((clip: any) => (
                      <div
                        key={clip.id}
                        onClick={() => {
                          setActiveClipId(clip.id);
                          setMobileTab('inspector');
                        }}
                        className={`h-full rounded-lg px-3 flex items-center justify-between text-xs font-semibold cursor-pointer border transition-all ${
                          activeClipId === clip.id
                            ? 'bg-[#5145CD] text-white border-[#5145CD] shadow-xs'
                            : 'bg-white text-[#17191D] border-[#E5E7EB] hover:border-[#5145CD]/40'
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
                <div className="w-24 shrink-0 text-xs font-mono text-[#667085] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-500" />
                  <span>CAPTIONS</span>
                </div>

                <div className="flex-1 h-9 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] relative flex items-center p-1 gap-2">
                  {timeline.clips
                    .filter((c: any) => c.type === 'text')
                    .map((clip: any) => (
                      <div
                        key={clip.id}
                        onClick={() => {
                          setActiveClipId(clip.id);
                          setMobileTab('inspector');
                        }}
                        className={`h-full rounded-md px-2.5 flex items-center justify-between text-[11px] font-medium cursor-pointer border transition-all ${
                          activeClipId === clip.id
                            ? 'bg-[#5145CD] text-white border-[#5145CD]'
                            : 'bg-white text-[#5145CD] border-[#5145CD]/30 hover:border-[#5145CD]'
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
                <div className="w-24 shrink-0 text-xs font-mono text-[#667085] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#5145CD]" />
                  <span>AUDIO</span>
                </div>

                <div className="flex-1 h-8 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB] flex items-center px-3 text-[11px] font-mono text-[#667085] truncate">
                  Master Soundscape Track (Royalty-Free 128BPM)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT & RENDER MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left text-[#17191D]">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="font-bold text-[#17191D] text-base flex items-center gap-2">
                <Download className="w-4 h-4 text-[#5145CD]" />
                <span>Export Master Video</span>
              </h3>
              {!isRendering && (
                <button onClick={() => setExportModalOpen(false)} className="text-[#667085] hover:text-[#17191D] cursor-pointer">
                  ✕
                </button>
              )}
            </div>

            {isRendering ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#5145CD] border-t-transparent animate-spin mx-auto" />
                <h4 className="font-bold text-[#17191D] text-base">Rendering Master MP4</h4>
                <p className="text-xs text-[#667085]">Composing tracks, subtitles, and lossless audio...</p>

                <div className="w-full h-2 bg-[#F7F8FA] rounded-full overflow-hidden border border-[#E5E7EB]">
                  <div
                    className="h-full bg-[#5145CD] transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-[#5145CD] font-bold">{renderProgress}% Complete</span>
              </div>
            ) : exportResult ? (
              <div className="py-4 text-center space-y-4">
                <Check className="w-12 h-12 text-[#5145CD] mx-auto" />
                <h4 className="font-bold text-[#17191D] text-base">Export Ready</h4>
                <p className="text-xs text-[#667085]">{exportResult.message}</p>

                <a
                  href={exportResult.downloadUrl}
                  download="FluviaFlow_MasterRender.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master File (1080p MP4)</span>
                </a>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#667085] font-semibold mb-1.5">Master Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['720p', '1080p', '4k'] as const).map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setExportResolution(res)}
                        className={`p-2.5 rounded-xl border text-center font-bold uppercase transition-all cursor-pointer ${
                          exportResolution === res
                            ? 'bg-[#5145CD] text-white border-[#5145CD] shadow-xs'
                            : 'bg-[#F7F8FA] border-[#E5E7EB] text-[#667085] hover:text-[#17191D]'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#667085] space-y-1">
                  <div className="flex justify-between">
                    <span>Aspect Ratio:</span>
                    <strong className="text-[#17191D]">{timeline.aspectRatio}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <strong className="text-[#17191D]">{timeline.durationSec || 15}s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Codec:</span>
                    <strong className="text-[#17191D]">H.264 / AAC High Profile</strong>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setExportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-[#667085] hover:text-[#17191D] border border-[#E5E7EB] bg-white font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExportSubmit}
                    className="px-6 py-2.5 rounded-xl text-white bg-[#5145CD] hover:bg-[#4338CA] font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
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

      {/* 5. ASSET PICKER MODAL */}
      {assetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative space-y-4 flex flex-col max-h-[85vh] text-[#17191D]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#5145CD]" />
                <h3 className="font-bold text-[#17191D] text-base">Select from Workspace Assets</h3>
              </div>
              <button
                onClick={() => setAssetModalOpen(false)}
                className="text-[#667085] hover:text-[#17191D] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isAssetsLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : availableAssets.length === 0 ? (
                <div className="py-12 text-center text-[#667085] space-y-3">
                  <p className="text-sm">No assets found in workspace library.</p>
                  <Link
                    href="/dashboard/assets"
                    className="inline-block px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#17191D] hover:border-[#5145CD]/40"
                  >
                    Upload Assets in Dashboard
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl flex items-center gap-3 transition-all group hover:border-[#5145CD]/40"
                    >
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-[#E5E7EB]">
                        {asset.assetType === 'image' || asset.assetType === 'video' ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Music className="w-5 h-5 text-[#5145CD]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#17191D] truncate">{asset.name}</h4>
                        <span className="text-[10px] uppercase font-mono text-[#667085]">
                          {asset.assetType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddAssetToTimeline(asset)}
                        className="px-2.5 py-1.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-2xs transition-colors"
                      >
                        Insert
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5E7EB] shrink-0">
              <button
                type="button"
                onClick={() => setAssetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[#667085] hover:text-[#17191D] border border-[#E5E7EB] bg-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
