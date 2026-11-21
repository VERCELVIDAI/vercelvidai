'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Plus, BookOpen, Sparkles, Video, ArrowRight } from 'lucide-react';

export default function MythologySeriesPage() {
  const [seriesList, setSeriesList] = useState([
    {
      id: 'series_ramayan',
      title: 'Complete Ramayana Katha Series',
      description: 'From Bal Kanda to Yuddha Kanda with consistent character appearances and devotional Hindi narration.',
      episodeCount: 6,
      culture: 'Hindu Epic',
      style: 'Classical Indian Oil Realism',
    },
    {
      id: 'series_mahabharat',
      title: 'Kurukshetra: The Great Mahabharata War',
      description: 'Exploring the 18 days of the epic Kurukshetra battle with cinematic god-rays and battle drums.',
      episodeCount: 4,
      culture: 'Hindu Epic',
      style: 'Cinematic Epic 8K',
    },
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            Multi-Episode Series Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Group multi-part stories under a master series with shared Character Bibles, voices, and art styles.
          </p>
        </div>

        <Link
          href="/mythology/studio"
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Series</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seriesList.map((series) => (
          <div
            key={series.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                {series.culture}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {series.episodeCount} Episodes
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {series.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {series.description}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Style: {series.style}</span>
              <Link
                href="/mythology/studio"
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Add Episode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
