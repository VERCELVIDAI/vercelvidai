'use client';

import React from 'react';
import {
  Trophy,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { TEMPLATE_EVENTS, TemplateEvent } from '@/lib/templates';

interface EventsViewProps {
  onJoinChallenge: (prompt: string, category: string) => void;
}

export function EventsView({ onJoinChallenge }: EventsViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner for Events */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 via-[#101815] to-[#120F1D] border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Fluvia Creator Arena</span>
            <span className="text-white/30">•</span>
            <span>Monthly Prize Pools</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Creative Challenges & Seasonal Sprints
          </h2>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            Push the boundaries of AI cinema, organic farm food visuals, and virtual couture. Join community events, win up to 10,000 credits, and earn spotlight placements on the Fluvia Flow front page.
          </p>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TEMPLATE_EVENTS.map((event) => (
          <div
            key={event.id}
            className="rounded-3xl overflow-hidden bg-[#121815] border border-white/10 hover:border-emerald-500/40 shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Event Header with Banner Image */}
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121815] via-[#121815]/30 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-black shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-black" />
                  <span>{event.badge}</span>
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/15">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{event.deadline}</span>
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>{event.participantsCount.toLocaleString()} Joined</span>
                </span>
              </div>
            </div>

            {/* Event Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {event.subtitle}
                </p>

                {/* Prize Pool Callout */}
                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs flex items-center justify-between">
                  <span className="text-white/70 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reward Pool:</span>
                  </span>
                  <strong className="text-emerald-400 font-bold font-mono">{event.prizePool}</strong>
                </div>

                {/* Rules Checklist */}
                <div className="space-y-1 pt-1">
                  {event.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-white/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onJoinChallenge(event.featuredPrompt, event.category)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Join Challenge & Remix Prompt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
