'use client';

import React from 'react';

export function BillingDocumentSkeleton({ type = 'invoice' }: { type?: 'invoice' | 'receipt' }) {
  return (
    <div className="relative z-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-2xl shadow-[#5145CD]/5 overflow-hidden p-6 sm:p-10 space-y-8 animate-pulse">
      {/* Top Bar Skeleton */}
      <div className="flex justify-between items-start gap-6 pb-6 border-b border-[#E5E7EB]/80">
        <div className="space-y-3 w-1/2">
          <div className="h-9 w-44 bg-slate-200/80 rounded-xl" />
          <div className="h-3.5 w-64 bg-slate-100 rounded-md" />
          <div className="flex gap-2 pt-2">
            <div className="h-5 w-28 bg-slate-100 rounded-md" />
            <div className="h-5 w-24 bg-slate-100 rounded-md" />
          </div>
        </div>
        <div className="space-y-2.5 flex flex-col items-end w-1/3">
          <div className="h-6 w-28 bg-[#5145CD]/10 rounded-full" />
          <div className="h-8 w-40 bg-slate-200/80 rounded-xl" />
          <div className="h-5 w-32 bg-emerald-100/60 rounded-full" />
        </div>
      </div>

      {/* Two Columns Panels Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/60 border border-white/80 space-y-3">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="space-y-1.5 pt-2">
            <div className="h-3 w-56 bg-slate-100 rounded" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white/60 border border-white/80 space-y-3">
          <div className="h-4 w-28 bg-slate-200 rounded-md" />
          <div className="h-6 w-48 bg-slate-200 rounded-lg" />
          <div className="space-y-1.5 pt-2">
            <div className="h-3 w-56 bg-slate-100 rounded" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* Table / Details Skeleton */}
      <div className="rounded-2xl bg-white/60 border border-white/80 p-6 space-y-4">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="space-y-3 pt-2">
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Total Card Skeleton */}
      <div className="p-6 rounded-2xl bg-[#EEF2FF]/60 border border-[#C7D2FE]/60 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-28 bg-[#5145CD]/20 rounded" />
          <div className="h-8 w-44 bg-[#5145CD]/20 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-[#5145CD]/20 rounded-xl" />
      </div>
    </div>
  );
}
