import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BLOG_POSTS } from '@/lib/data/blog';
import { ArrowLeft, Calendar, Clock, Share2, Sparkles } from 'lucide-react';

export default function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen flex flex-col text-[#17211D]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
            {post.category}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-[#17211D] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-500 border-b border-emerald-500/15 pb-6 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{post.readTime}</span>
            </span>
            <span>•</span>
            <span>By Fluvia Flow Core Team</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden aspect-video border border-emerald-500/20 shadow-xl">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="mt-12 max-w-none text-slate-700 space-y-6 text-base sm:text-lg leading-relaxed">
          <p className="text-xl font-bold text-[#17211D] leading-relaxed">
            {post.summary}
          </p>

          <h2 className="text-2xl font-bold text-[#17211D] pt-4">The Challenge of Scalable AI Video Synthesis</h2>
          <p>
            Generative video models require tremendous compute compared to standard LLM token completion. A 5-second 1080p video generation job at 24fps implies rendering 120 individual diffusion frames with inter-frame temporal coherency.
          </p>

          <p>
            In Fluvia Flow, we solve this through a decoupled, multi-tier asynchronous job pipeline. When a user issues a creation request, credits are atomically reserved in our immutable ledger, an idempotency token is registered, and the generation payload is dispatched to our multi-model adapter.
          </p>

          <h2 className="text-2xl font-bold text-[#17211D] pt-4">Zero-Loss Ledger Guarantees</h2>
          <p>
            Our credit accounting guarantees that creators are never unfairly billed for failed or interrupted provider jobs. If an upstream GPU cluster fails midway through rendering, our webhook listener or worker reconciler immediately posts a compensating refund transaction to the user balance.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-emerald-500/15 flex items-center justify-between">
          <Link
            href="/create"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try the Studio Now</span>
          </Link>
          <Link href="/blog" className="text-sm font-bold text-slate-600 hover:text-emerald-700">
            Read More Articles →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
