import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BLOG_POSTS } from '@/lib/data/blog';
import { ArrowLeft, Calendar, Clock, Share2, Sparkles } from 'lucide-react';

export default function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <div>
          <span className="text-xs font-bold text-violet-400 uppercase tracking-wider bg-violet-950/80 px-2.5 py-1 rounded border border-violet-500/30">
            {post.category}
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center gap-4 text-xs font-mono text-slate-400 border-b border-white/10 pb-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span>•</span>
            <span>By Vercel Vidai Core Team</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl overflow-hidden aspect-video border border-white/10">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="mt-12 prose prose-invert max-w-none text-slate-300 space-y-6 text-base sm:text-lg leading-relaxed">
          <p className="text-xl font-medium text-white leading-relaxed">
            {post.summary}
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">The Challenge of Scalable AI Video Synthesis</h2>
          <p>
            Generative video models require tremendous compute compared to standard LLM token completion. A 5-second 1080p video generation job at 24fps implies rendering 120 individual diffusion frames with inter-frame temporal coherency.
          </p>

          <p>
            In Vercel Vidai, we solve this through a decoupled, multi-tier asynchronous job pipeline. When a user issues a creation request, credits are atomically reserved in our immutable ledger, an idempotency token is registered, and the generation payload is dispatched to our multi-model adapter.
          </p>

          <h2 className="text-2xl font-bold text-white pt-4">Zero-Loss Ledger Guarantees</h2>
          <p>
            Our credit accounting guarantees that creators are never unfairly billed for failed or interrupted provider jobs. If an upstream GPU cluster fails midway through rendering, our webhook listener or worker reconciler immediately posts a compensating refund transaction to the user balance.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link
            href="/create"
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Try the Studio Now</span>
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-slate-400 hover:text-white">
            Read More Articles →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
