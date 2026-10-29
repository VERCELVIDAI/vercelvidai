'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl p-6 sm:p-8 text-[#17191D]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#667085] hover:text-[#17191D] p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] border border-[#5145CD]/20 flex items-center justify-center text-[#5145CD]">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#17191D]">Publish Video Template</h3>
            <p className="text-xs text-[#667085]">Share your creative AI prompt with the Fluvia Flow community</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Template successfully published to the community library!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#17191D] mb-1">
              Template Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minimalist Titanium Luxury Watch"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-xs sm:text-sm placeholder:text-[#667085]/60 focus:outline-none focus:border-[#5145CD]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17191D] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-xs focus:outline-none focus:border-[#5145CD] cursor-pointer"
              >
                <option value="Product Commercial">Product Commercial</option>
                <option value="Luxury Commercial">Luxury Commercial</option>
                <option value="Cinematic Automotive">Cinematic Automotive</option>
                <option value="Social Media Reel">Social Media Reel</option>
                <option value="Fashion & Beauty">Fashion & Beauty</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Technology & SaaS">Technology & SaaS</option>
                <option value="Travel & Architecture">Travel & Architecture</option>
                <option value="Motion Graphics">Motion Graphics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17191D] mb-1">Aspect Ratio</label>
              <select
                value={aspect}
                onChange={(e) => setAspect(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-xs focus:outline-none focus:border-[#5145CD] cursor-pointer"
              >
                <option value="16:9">16:9 (Landscape / TV / YouTube)</option>
                <option value="9:16">9:16 (Vertical / Reels / TikTok)</option>
                <option value="1:1">1:1 (Square / Feed)</option>
                <option value="4:5">4:5 (Social Portrait)</option>
                <option value="2.39:1">2.39:1 (Cinemascope Widescreen)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191D] mb-1">
              AI Generation Prompt <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Macro tracking camera shot of a minimalist titanium watch on dark slate..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-xs sm:text-sm placeholder:text-[#667085]/60 focus:outline-none focus:border-[#5145CD] font-mono resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191D] mb-1">Short Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clean cinematic product reveal suitable for e-commerce and luxury brands."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] text-xs placeholder:text-[#667085]/60 focus:outline-none focus:border-[#5145CD]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#667085] hover:text-[#17191D] text-xs font-semibold border border-[#E5E7EB] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish to Community</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
