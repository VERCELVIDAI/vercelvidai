'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  Mic,
  Sliders,
  Ratio,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  Film,
  Download,
} from 'lucide-react';

const MODELS = [
  { id: 'vidai-cinematic-v1', name: 'Vidai Cinematic HD', cost: 25, badge: 'Fastest' },
  { id: 'runway-gen3', name: 'Runway Gen-3 Alpha', cost: 50, badge: 'Ultra' },
  { id: 'luma-ray', name: 'Luma Dream Machine Ray', cost: 40, badge: 'Realistic Motion' },
  { id: 'fal-flux-pro', name: 'Flux 1.1 Pro Vision (Image)', cost: 5, badge: 'Photoreal' },
  { id: 'eleven-multilingual', name: 'ElevenLabs Voice HD', cost: 10, badge: 'Voiceover' },
];

function CreateWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial params
  const initialMode = (searchParams.get('mode') as any) || 'video';
  const initialPrompt = searchParams.get('prompt') || '';
  const initialModel = searchParams.get('modelId') || 'vidai-cinematic-v1';
  const initialRatio = (searchParams.get('aspectRatio') as any) || '16:9';

  const [authData, setAuthData] = useState<any>(null);
  const [mode, setMode] = useState<'video' | 'image' | 'audio' | 'script'>(initialMode);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [modelId, setModelId] = useState(initialModel);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>(initialRatio);
  const [durationSec, setDurationSec] = useState<number>(5);
  const [referenceUrl, setReferenceUrl] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');

  // Active Job State
  const [activeJob, setActiveJob] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check saved draft from localStorage if empty
  useEffect(() => {
    if (!prompt) {
      try {
        const saved = localStorage.getItem('vidai_pending_prompt');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.prompt) setPrompt(parsed.prompt);
          if (parsed.mode) setMode(parsed.mode);
          if (parsed.aspectRatio) setAspectRatio(parsed.aspectRatio);
          if (parsed.modelId) setModelId(parsed.modelId);
          localStorage.removeItem('vidai_pending_prompt');
        }
      } catch (e) {}
    }

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login?returnUrl=/create');
        else setAuthData(d);
      });
  }, []);

  // Poll active job while status is queued or processing
  useEffect(() => {
    if (!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${activeJob.id}`);
        if (res.ok) {
          const d = await res.json();
          setActiveJob(d.job);

          // Update user credits balance if completed
          if (d.job.status === 'completed') {
            fetch('/api/auth/me')
              .then((r) => r.json())
              .then((ud) => setAuthData(ud));
          }
        }
      } catch (err) {
        console.error('Job polling error:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJob]);

  const selectedModelObj = MODELS.find((m) => m.id === modelId) || MODELS[0];
  const estimatedCost =
    mode === 'image'
      ? 5
      : mode === 'audio'
      ? 10
      : Math.round(selectedModelObj.cost * (durationSec / 5));

  const handleStartGeneration = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please enter a creative prompt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId,
          prompt,
          negativePrompt,
          aspectRatio,
          durationSec,
          referenceImageUrl: referenceUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation submission failed');
      }

      setActiveJob(data.job);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = authData?.user || {};
  const credits = authData?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={authData?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Generation Parameters & Prompt Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Unified Creation Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Generate with AI</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Condition foundation models, attach reference images, and reserve credits atomically.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
                {errorMsg.includes('Insufficient') && (
                  <Link
                    href="/pricing"
                    className="px-2.5 py-1 bg-rose-500 text-white font-bold rounded text-[11px] shrink-0"
                  >
                    Top Up
                  </Link>
                )}
              </div>
            )}

            {/* Mode Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('video');
                  setModelId('vidai-cinematic-v1');
                }}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'video' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Text-to-Video</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('image');
                  setModelId('fal-flux-pro');
                }}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'image' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>AI Image (Flux)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('audio');
                  setModelId('eleven-multilingual');
                }}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  mode === 'audio' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice & Speech</span>
              </button>
            </div>

            {/* Prompt Box */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                  Creative Prompt
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your scene lighting, cinematography, camera movements, subject, and atmosphere..."
                  className="w-full bg-[#0E1017] text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-sm leading-relaxed resize-none"
                />
              </div>

              {/* Advanced optional negative prompt */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Negative Prompt (Optional)
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, distorted face, low resolution, watermark..."
                  className="w-full bg-[#0E1017] text-slate-300 px-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>
            </div>

            {/* Model & Setting Pickers */}
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Model Selector */}
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1.5">Foundation Model</label>
                  <select
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    className="w-full bg-[#0E1017] text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs cursor-pointer"
                  >
                    {MODELS.map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#12141A]">
                        {m.name} ({m.cost} credits)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1.5">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-1 bg-[#0E1017] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('16:9')}
                      className={`py-1.5 rounded-lg font-medium transition-all ${
                        aspectRatio === '16:9' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      16:9
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('9:16')}
                      className={`py-1.5 rounded-lg font-medium transition-all ${
                        aspectRatio === '9:16' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      9:16
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('1:1')}
                      className={`py-1.5 rounded-lg font-medium transition-all ${
                        aspectRatio === '1:1' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1:1
                    </button>
                  </div>
                </div>
              </div>

              {/* Duration Slider if video */}
              {mode === 'video' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-slate-400 uppercase font-semibold">Duration: {durationSec} seconds</label>
                    <span className="text-[11px] text-slate-500 font-mono">Max 15s</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={15}
                    step={5}
                    value={durationSec}
                    onChange={(e) => setDurationSec(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>5s Standard</span>
                    <span>10s Extended</span>
                    <span>15s Narrative</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Estimated Cost:</span>
                <span className="font-bold text-white text-sm">{estimatedCost} Credits</span>
                <span className="text-[11px] text-slate-500">({credits.availableBalance} available)</span>
              </div>

              <button
                type="button"
                onClick={handleStartGeneration}
                disabled={isSubmitting || !prompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Dispatch Generation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT: Active Job Status & Cinema Viewport (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 min-h-[460px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Film className="w-4 h-4 text-violet-400" />
                    <span>Inference Monitor</span>
                  </h3>
                  {activeJob && (
                    <span className="text-[11px] font-mono text-slate-400 uppercase">
                      ID: {activeJob.id.slice(0, 8)}
                    </span>
                  )}
                </div>

                {!activeJob ? (
                  <div className="py-24 text-center">
                    <Video className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-float" />
                    <h4 className="font-semibold text-white text-sm">Ready to Generate</h4>
                    <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                      Configure your prompt on the left and click Dispatch to initiate the neural pipeline.
                    </p>
                  </div>
                ) : activeJob.status === 'queued' || activeJob.status === 'processing' ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-violet-600/20 border-2 border-violet-500 border-t-transparent mx-auto animate-spin" />
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {activeJob.status === 'queued' ? 'Dispatched to Queue' : 'Synthesizing Neural Scene'}
                      </h4>
                      <p className="mt-1 text-xs text-slate-300 max-w-xs mx-auto">
                        {activeJob.progressMessage || 'Processing frame latent variables...'}
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{activeJob.progressPercent || 30}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all duration-500"
                          style={{ width: `${activeJob.progressPercent || 30}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-amber-400 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20 inline-block">
                      Atomic Reservation: {activeJob.reservedCredits} credits locked
                    </div>
                  </div>
                ) : activeJob.status === 'completed' ? (
                  <div className="space-y-4">
                    {/* Cinema Result Player */}
                    <div className="aspect-video rounded-xl overflow-hidden bg-black relative border border-white/10 group shadow-xl">
                      {activeJob.output?.videoUrl ? (
                        <video
                          src={activeJob.output.videoUrl}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : activeJob.output?.imageUrl ? (
                        <img
                          src={activeJob.output.imageUrl}
                          alt="Generated Image"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 p-4">
                          Audio narration generated and registered to project.
                        </div>
                      )}

                      {/* Demo Mode Badge if simulated */}
                      {activeJob.output?.isDemoSimulated && (
                        <span className="absolute top-2.5 left-2.5 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded shadow">
                          Demo Mode — AI provider not connected
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-[#0E1017] rounded-xl border border-white/5 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-white">
                        <span>Generation Succeeded</span>
                        <span className="text-emerald-400 font-mono">✓ Settled {activeJob.actualCredits} cr</span>
                      </div>
                      <p className="text-slate-400 text-[11px] line-clamp-2">
                        {activeJob.progressMessage || 'Finished with temporal consistency.'}
                      </p>
                    </div>

                    {/* Editor CTA button */}
                    {activeJob.projectId && (
                      <Link
                        href={`/editor/${activeJob.projectId}`}
                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
                      >
                        <Film className="w-4 h-4" />
                        <span>Open & Edit in Studio Timeline</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                    <h4 className="font-bold text-white text-base">Generation Failed</h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      {activeJob.errorMessage || 'An error occurred during GPU inference.'}
                    </p>
                    <div className="text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/20 inline-block font-medium">
                      Compensating Refund Applied: +{activeJob.reservedCredits} credits returned to wallet
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.08] text-[11px] text-slate-500 flex justify-between">
                <span>Vercel Vidai Inference Cluster</span>
                <span>Latency: ~1.2s</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CreateWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CreateWorkspaceContent />
    </Suspense>
  );
}
