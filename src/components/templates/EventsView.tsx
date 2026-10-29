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
import { TEMPLATE_EVENTS } from '@/lib/templates';

interface EventsViewProps {
  onJoinChallenge: (prompt: string, category: string) => void;
}

export function EventsView({ onJoinChallenge }: EventsViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner for Events */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-[#5145CD] text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Fluvia Creator Arena</span>
            <span className="text-[#667085]/40">•</span>
            <span>Monthly Prize Pools</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[#17191D] tracking-tight">
            Creative Challenges & Seasonal Sprints
          </h2>

          <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
            Push the boundaries of AI cinema, luxury product reveals, and commercial storytelling. Join community events, win up to 10,000 credits, and earn spotlight placements across the Fluvia Flow studio platform.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {TEMPLATE_EVENTS.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Event Header with Banner Image */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img
                src={event.bannerImage}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#5145CD] text-white shadow-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  <span>{event.badge}</span>
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#17191D] font-medium border border-[#E5E7EB]">
                  {event.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white drop-shadow-xs">
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{event.deadline}</span>
                </span>
                <span className="flex items-center gap-1.5 font-mono text-slate-200">
                  <Users className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{event.participantsCount.toLocaleString()} Joined</span>
                </span>
              </div>
            </div>

            {/* Event Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#17191D] group-hover:text-[#5145CD] transition-colors">
                  {event.title}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {event.subtitle}
                </p>

                {/* Prize Pool Callout */}
                <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#E5E7EB] text-xs flex items-center justify-between">
                  <span className="text-[#667085] flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-[#5145CD]" />
                    <span>Reward Pool:</span>
                  </span>
                  <strong className="text-[#5145CD] font-bold font-mono">{event.prizePool}</strong>
                </div>

                {/* Rules Checklist */}
                <div className="space-y-1 pt-1">
                  {event.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-[#667085]">
                      <CheckCircle2 className="w-3 h-3 text-[#5145CD] shrink-0" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => onJoinChallenge(event.featuredPrompt, event.category)}
                  className="w-full py-3 px-4 rounded-xl bg-[#5145CD] hover:bg-[#4338CA] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
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
