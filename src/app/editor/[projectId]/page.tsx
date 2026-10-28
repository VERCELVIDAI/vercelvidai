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
      <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active clip inspector
  const activeClip = timeline.clips.find((c: any) => c.id === activeClipId);

  // Primary video source
  const primaryClip = timeline.clips.find((c: any) => c.type === 'video' && c.sourceUrl);
  const videoSrc = primaryClip?.sourceUrl || '/media/templates/tmpl-01-cinematic-product.mp4';

  return (
    <div
      className="min-h-screen flex flex-col h-screen overflow-hidden select-none transition-colors duration-200 bg-[#100A12] text-[#F5EAF4]"
    >
      {/* 1. TOP TOOLBAR */}
      <header
        className="h-14 border-b border-[#39233B] bg-[#211522] px-4 flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#A99AAA] hover:text-[#F5EAF4] transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-[#39233B]" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F5EAF4] text-sm truncate max-w-xs">{project.title}</span>
            <span className="text-[11px] font-mono text-[#F05BCE] bg-[#F05BCE]/15 px-2 py-0.5 rounded border border-[#F05BCE]/30 font-bold">
              {timeline.aspectRatio}
            </span>
          </div>
        </div>

        {/* Center: Undo / Redo / Aspect Switcher */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#100A12] p-1 rounded-lg border border-[#39233B]">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="p-1 rounded text-[#A99AAA] hover:text-[#F05BCE] disabled:opacity-30 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={future.length === 0}
              className="p-1 rounded text-[#A99AAA] hover:text-[#F05BCE] disabled:opacity-30 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-[#100A12] p-1 rounded-lg border border-[#39233B] text-xs font-mono">
            {(['16:9', '9:16', '1:1'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleAspectRatioChange(r)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                  timeline.aspectRatio === r ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white shadow-xs' : 'text-[#A99AAA] hover:text-[#F5EAF4]'
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
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-[#39233B] text-[#F5EAF4] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {saveToast ? <Check className="w-3.5 h-3.5 text-[#F05BCE]" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saveToast ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              setExportModalOpen(true);
              setExportResult(null);
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#F05BCE]/25 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Video</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (Cinema Player + Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools / Media Palette (Desktop only) */}
        <aside
          className="hidden md:flex w-16 border-r border-[#39233B] bg-[#211522] flex-col items-center py-4 gap-4 shrink-0 transition-colors duration-200"
        >
          <button
            onClick={handleAddSampleScene}
            className="p-2.5 rounded-xl bg-white/[0.04] text-[#A99AAA] hover:text-[#F05BCE] hover:bg-white/[0.08] transition-all cursor-pointer"
            title="Add AI Scene"
          >
            <Film className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              fetchAssets();
              setAssetModalOpen(true);
            }}
            className="p-2.5 rounded-xl bg-white/[0.04] text-[#A99AAA] hover:text-[#F05BCE] hover:bg-white/[0.08] transition-all cursor-pointer"
            title="Import Asset from Library"
          >
            <Layers className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddTextOverlay}
            className="p-2.5 rounded-xl bg-white/[0.04] text-[#A99AAA] hover:text-[#F05BCE] hover:bg-white/[0.08] transition-all cursor-pointer"
            title="Add Text Caption"
          >
            <Type className="w-5 h-5" />
          </button>

          <Link
            href="/create?mode=video"
            className="p-2.5 rounded-xl bg-[#F05BCE]/15 hover:bg-[#F05BCE]/25 text-[#F05BCE] transition-all border border-[#F05BCE]/30"
            title="Generate AI Scene"
          >
            <Sparkles className="w-5 h-5 text-[#F05BCE]" />
          </Link>
        </aside>

        {/* Central Cinema Viewport */}
        <div className="flex-1 flex flex-col bg-[#100A12] relative overflow-hidden items-center justify-center p-2 sm:p-4">
          {/* Cinema Frame */}
          <div
            className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-[#39233B] transition-all max-h-[35vh] sm:max-h-[50vh] ${
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
          <div className="mt-2.5 flex items-center gap-3 sm:gap-4 bg-[#211522] px-4 py-1.5 rounded-full border border-[#39233B] text-xs shadow-lg">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white flex items-center justify-center hover:brightness-110 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <span className="font-mono text-[#A99AAA] text-[11px] sm:text-xs">
              {Math.floor(currentTimeSec)}s / {timeline.durationSec || 15}s
            </span>
          </div>
        </div>

        {/* Right Inspector Panel (Desktop only) */}
        <aside
          className="hidden md:flex w-72 border-l border-[#39233B] bg-[#211522] p-4 flex-col justify-between shrink-0 overflow-y-auto transition-colors duration-200 text-[#F5EAF4]"
        >
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
                      className="w-full bg-[#100A12] text-[#F5EAF4] px-3 py-2 rounded-lg border border-[#39233B] focus:outline-none focus:border-[#F05BCE]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A99AAA] mb-1 font-semibold">Text Color</label>
                    <input
                      type="color"
                      value={activeClip.style?.color || '#FFFFFF'}
                      onChange={(e) => {
                        recordHistory();
                        activeClip.style = { ...activeClip.style, color: e.target.value };
                        setTimeline({ ...timeline });
                      }}
                      className="w-full h-8 bg-[#100A12] border border-[#39233B] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A99AAA] mb-1 font-semibold">Duration ({activeClip.durationSec}s)</label>
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
                      className="w-full accent-[#F05BCE] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {activeClip.type === 'video' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#A99AAA]">Clip Title:</span>
                    <p className="font-semibold text-[#F5EAF4] mt-1">{activeClip.title}</p>
                  </div>
                  <div>
                    <span className="text-[#A99AAA]">Duration:</span>
                    <p className="font-semibold text-[#F5EAF4] mt-1">{activeClip.durationSec} seconds</p>
                  </div>
                  <button
                    onClick={() => handleSplitClip(activeClip.id)}
                    className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#F5EAF4] border border-[#39233B] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-[#F05BCE]" />
                    <span>Split Clip in Half</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#A99AAA] space-y-2">
              <Sliders className="w-8 h-8 mx-auto text-[#A99AAA]/50" />
              <p>Select any clip or text layer on the timeline to inspect and edit properties.</p>
            </div>
          )}

          <div className="pt-4 border-t border-[#39233B] text-[11px] text-[#A99AAA]">
            <span>Video Engine: WebCodecs Remotion</span>
          </div>
        </aside>
      </div>

      {/* MOBILE TAB CONTROLS (Only visible on screens < 768px) */}
      <div className="md:hidden flex border-t border-[#39233B] bg-[#211522] text-xs font-bold divide-x divide-[#39233B] shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('timeline')}
          className={`flex-1 py-2.5 min-h-[44px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'timeline'
              ? 'bg-[#F05BCE]/15 text-[#F05BCE] border-b-2 border-[#F05BCE]'
              : 'text-[#A99AAA]'
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
              ? 'bg-[#F05BCE]/15 text-[#F05BCE] border-b-2 border-[#F05BCE]'
              : 'text-[#A99AAA]'
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
              ? 'bg-[#F05BCE]/15 text-[#F05BCE] border-b-2 border-[#F05BCE]'
              : 'text-[#A99AAA]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Media Tools</span>
        </button>
      </div>

      {/* 3. MULTI-TRACK TIMELINE & MOBILE PANELS (Bottom Area) */}
      <div
        className="h-56 sm:h-60 border-t border-[#39233B] bg-[#211522] flex flex-col shrink-0 transition-colors duration-200 overflow-hidden"
      >
        {/* Mobile Tab Condition: Inspector */}
        {mobileTab === 'inspector' && (
          <div className="md:hidden flex-1 p-4 overflow-y-auto text-xs text-left">
            {activeClip ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/8 pb-2">
                  <span className="font-bold text-white uppercase tracking-wider">
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
                      <label className="block text-slate-400 mb-1 font-semibold">Overlay Text</label>
                      <input
                        type="text"
                        value={activeClip.text || ''}
                        onChange={(e) => {
                          recordHistory();
                          activeClip.text = e.target.value;
                          setTimeline({ ...timeline });
                        }}
                        className="w-full bg-[#11131A] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-slate-400 mb-1 font-semibold">Color</label>
                        <input
                          type="color"
                          value={activeClip.style?.color || '#FFFFFF'}
                          onChange={(e) => {
                            recordHistory();
                            activeClip.style = { ...activeClip.style, color: e.target.value };
                            setTimeline({ ...timeline });
                          }}
                          className="w-full h-8 rounded-lg cursor-pointer border border-white/10"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[#A99AAA] mb-1 font-semibold">Duration: {activeClip.durationSec}s</label>
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
                          className="w-full accent-[#F05BCE] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeClip.type === 'video' && (
                  <div className="space-y-2">
                    <p className="text-[#A99AAA]">Duration: <strong className="text-[#F5EAF4]">{activeClip.durationSec}s</strong></p>
                    <button
                      onClick={() => handleSplitClip(activeClip.id)}
                      className="py-2 px-3 rounded-xl bg-white/[0.04] text-[#F05BCE] font-bold border border-[#F05BCE]/30 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Split Clip in Half</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-[#A99AAA] space-y-1">
                <Sliders className="w-6 h-6 mx-auto text-[#F05BCE]" />
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
              className="p-3 rounded-xl bg-[#100A12] border border-[#39233B] flex flex-col items-center gap-1.5 text-xs font-bold text-[#F5EAF4] shadow-xs cursor-pointer"
            >
              <Film className="w-5 h-5 text-[#F05BCE]" />
              <span>Add AI Scene</span>
            </button>
            <button
              onClick={() => {
                fetchAssets();
                setAssetModalOpen(true);
              }}
              className="p-3 rounded-xl bg-[#100A12] border border-[#39233B] flex flex-col items-center gap-1.5 text-xs font-bold text-[#F5EAF4] shadow-xs cursor-pointer"
            >
              <Layers className="w-5 h-5 text-[#F05BCE]" />
              <span>Import Asset</span>
            </button>
            <button
              onClick={() => {
                handleAddTextOverlay();
                setMobileTab('timeline');
              }}
              className="p-3 rounded-xl bg-[#100A12] border border-[#39233B] flex flex-col items-center gap-1.5 text-xs font-bold text-[#F5EAF4] shadow-xs cursor-pointer"
            >
              <Type className="w-5 h-5 text-sky-400" />
              <span>Add Caption</span>
            </button>
            <Link
              href="/create?mode=video"
              className="p-3 rounded-xl bg-[#F05BCE]/15 border border-[#F05BCE]/30 flex flex-col items-center gap-1.5 text-xs font-bold text-[#F05BCE] shadow-xs"
            >
              <Sparkles className="w-5 h-5 text-[#F05BCE]" />
              <span>Generate AI Clip</span>
            </Link>
          </div>
        )}

        {/* Timeline Tracks (Visible on Desktop OR when mobileTab === 'timeline') */}
        <div className={`flex-1 flex flex-col overflow-hidden ${mobileTab !== 'timeline' ? 'hidden md:flex' : 'flex'}`}>
          {/* Timeline ruler & playhead */}
          <div
            className="h-8 border-b border-[#39233B] bg-[#211522] flex items-center px-4 justify-between text-[11px] font-mono shrink-0 text-[#A99AAA]"
          >
            <div className="flex items-center gap-3">
              <span className="text-[#F05BCE] font-bold">TIMELINE</span>
              <button
                onClick={handleAddTextOverlay}
                className="hidden sm:flex text-[11px] text-[#A99AAA] hover:text-[#F05BCE] items-center gap-1 font-medium cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#F05BCE]" />
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
                className="w-full accent-[#F05BCE] cursor-pointer h-1.5"
              />
            </div>

            <span className="font-bold text-[#F5EAF4]">{Math.floor(currentTimeSec)}s</span>
          </div>

          {/* Tracks Area (Scrolls horizontally ONLY within its own container) */}
          <div className="flex-1 overflow-y-auto overflow-x-auto p-3 space-y-2">
            <div className="min-w-[540px] space-y-2">
              {/* TRACK 1: Video Track */}
              <div className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-xs font-mono text-[#A99AAA] flex items-center gap-1.5 font-medium">
                  <Film className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>VIDEO</span>
                </div>

                <div className="flex-1 h-12 bg-[#100A12] rounded-xl border border-[#39233B] relative flex items-center p-1 gap-2">
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
                            ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white border-[#F05BCE] shadow-md'
                            : 'bg-[#211522] text-[#F5EAF4] border-[#39233B] hover:border-[#F05BCE]/40'
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
                <div className="w-24 shrink-0 text-xs font-mono text-[#A99AAA] flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-sky-400" />
                  <span>CAPTIONS</span>
                </div>

                <div className="flex-1 h-9 bg-[#100A12] rounded-xl border border-[#39233B] relative flex items-center p-1 gap-2">
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
                <div className="w-24 shrink-0 text-xs font-mono text-[#A99AAA] flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#F05BCE]" />
                  <span>AUDIO</span>
                </div>

                <div className="flex-1 h-8 bg-[#100A12] rounded-xl border border-[#39233B] flex items-center px-3 text-[11px] font-mono text-[#A99AAA] truncate">
                  Synthwave Master Audio Track (Royalty-Free 128BPM)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPORT & RENDER MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#211522] border border-[#39233B] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left text-[#F5EAF4]">
            <div className="flex justify-between items-center border-b border-[#39233B] pb-3">
              <h3 className="font-bold text-[#F5EAF4] text-base flex items-center gap-2">
                <Download className="w-4 h-4 text-[#F05BCE]" />
                <span>Export Master Video</span>
              </h3>
              {!isRendering && (
                <button onClick={() => setExportModalOpen(false)} className="text-[#A99AAA] hover:text-[#F5EAF4] cursor-pointer">
                  ✕
                </button>
              )}
            </div>

            {isRendering ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#F05BCE] border-t-transparent animate-spin mx-auto" />
                <h4 className="font-bold text-[#F5EAF4] text-base">Rendering Master MP4</h4>
                <p className="text-xs text-[#A99AAA]">Composing tracks, subtitles, and lossless audio...</p>

                <div className="w-full h-2 bg-[#100A12] rounded-full overflow-hidden border border-[#39233B]">
                  <div
                    className="h-full bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-[#F05BCE] font-bold">{renderProgress}% Complete</span>
              </div>
            ) : exportResult ? (
              <div className="py-4 text-center space-y-4">
                <Check className="w-12 h-12 text-[#F05BCE] mx-auto" />
                <h4 className="font-bold text-[#F5EAF4] text-base">Export Ready</h4>
                <p className="text-xs text-[#A99AAA]">{exportResult.message}</p>

                <a
                  href={exportResult.downloadUrl}
                  download="FluviaFlow_MasterRender.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F05BCE]/25 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master File (1080p MP4)</span>
                </a>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#A99AAA] font-semibold mb-1.5">Master Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['720p', '1080p', '4k'] as const).map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setExportResolution(res)}
                        className={`p-2.5 rounded-xl border text-center font-bold uppercase transition-all cursor-pointer ${
                          exportResolution === res
                            ? 'bg-gradient-to-r from-[#F05BCE] to-[#C026D3] text-white border-[#F05BCE] shadow-sm'
                            : 'bg-[#100A12] border-[#39233B] text-[#A99AAA] hover:text-[#F5EAF4]'
                        }`}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#100A12] border border-[#39233B] text-[#A99AAA] space-y-1">
                  <div className="flex justify-between">
                    <span>Aspect Ratio:</span>
                    <strong className="text-[#F5EAF4]">{timeline.aspectRatio}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <strong className="text-[#F5EAF4]">{timeline.durationSec || 15}s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Codec:</span>
                    <strong className="text-[#F5EAF4]">H.264 / AAC High Profile</strong>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setExportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-[#A99AAA] hover:text-[#F5EAF4] border border-[#39233B] bg-white/[0.04] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExportSubmit}
                    className="px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 font-bold shadow-lg shadow-[#F05BCE]/25 flex items-center gap-1.5 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#211522] border border-[#39233B] rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative space-y-4 flex flex-col max-h-[85vh] text-[#F5EAF4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#39233B] shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F05BCE]" />
                <h3 className="font-bold text-[#F5EAF4] text-base">Select from Workspace Assets</h3>
              </div>
              <button
                onClick={() => setAssetModalOpen(false)}
                className="text-[#A99AAA] hover:text-[#F5EAF4] p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isAssetsLoading ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#F05BCE] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : availableAssets.length === 0 ? (
                <div className="py-12 text-center text-[#A99AAA] space-y-3">
                  <p className="text-sm">No assets found in workspace library.</p>
                  <Link
                    href="/dashboard/assets"
                    className="inline-block px-4 py-2 bg-white/[0.04] border border-[#39233B] rounded-xl text-xs font-semibold text-[#F5EAF4] hover:border-[#F05BCE]/40"
                  >
                    Upload Assets in Dashboard
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-3 bg-[#100A12] border border-[#39233B] rounded-xl flex items-center gap-3 transition-all group hover:border-[#F05BCE]/40"
                    >
                      <div className="w-12 h-12 rounded-lg bg-black overflow-hidden shrink-0 flex items-center justify-center border border-[#39233B]">
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
                          <Music className="w-5 h-5 text-[#F05BCE]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#F5EAF4] truncate">{asset.name}</h4>
                        <span className="text-[10px] uppercase font-mono text-[#A99AAA]">
                          {asset.assetType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddAssetToTimeline(asset)}
                        className="px-2.5 py-1.5 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white rounded-lg text-xs font-bold shrink-0 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                      >
                        Insert
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#39233B] shrink-0">
              <button
                type="button"
                onClick={() => setAssetModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[#A99AAA] hover:text-[#F5EAF4] border border-[#39233B] bg-white/[0.04] text-xs font-semibold cursor-pointer"
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
