'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Loader2,
  Film,
  CheckCircle2,
  AlertCircle,
  Tag,
  Ratio,
} from 'lucide-react';

interface PublishTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublished?: (template: any) => void;
}

export function PublishTemplateModal({
  isOpen,
  onClose,
  onPublished,
}: PublishTemplateModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Product Commercial');
  const [aspect, setAspect] = useState<'16:9' | '9:16' | '1:1' | '4:5' | '2.39:1'>('16:9');
  const [prompt, setPrompt] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) {
      setErrorMessage('Please provide both a template title and the AI generation prompt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/templates/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          aspect,
          prompt: prompt.trim(),
          description: description.trim(),
          thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
          videoPreview: '/media/templates/tmpl-01-cinematic-product.mp4',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish template.');
      }

      setSuccess(true);
      if (onPublished) {
        onPublished(data.template);
      }
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setTitle('');
        setPrompt('');
        setDescription('');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error publishing template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#111714] border border-white/15 shadow-2xl p-6 sm:p-8 text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Publish Video Template</h3>
            <p className="text-xs text-white/60">Share your creative AI prompt with the Fluvia Flow community</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Template successfully published to the Discovery Feed!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Template Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neo Tokyo Cyberpunk Drone Flight"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#161D1A] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Product Commercial">Product Commercial</option>
                <option value="Cinematic Automotive">Cinematic Automotive</option>
                <option value="AI Influencer & UGC">AI Influencer & UGC</option>
                <option value="Anime & Fantasy">Anime & Fantasy</option>
                <option value="3D Cartoon & Characters">3D Cartoon & Characters</option>
                <option value="Pet & Wildlife">Pet & Wildlife</option>
                <option value="Travel & Landscapes">Travel & Landscapes</option>
                <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                <option value="Enterprise Cloud & SaaS Infrastructure">Enterprise Cloud & SaaS Infrastructure</option>
                <option value="Storytelling & Viral Shorts">Storytelling & Viral Shorts</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Aspect Ratio</label>
              <select
                value={aspect}
                onChange={(e) => setAspect(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#161D1A] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="16:9">16:9 Landscape (TV & Film)</option>
                <option value="9:16">9:16 Vertical (Reels & Shorts)</option>
                <option value="1:1">1:1 Square (Social Feed)</option>
                <option value="4:5">4:5 Social Portrait</option>
                <option value="2.39:1">2.39:1 Anamorphic Widescreen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              AI Generation Prompt <span className="text-emerald-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Detailed scene description, camera lighting, movements, style tokens..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-500 font-mono resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Short Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. High energy drone flight through rain-slicked neon skyscrapers."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/60 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Publish to Community</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
