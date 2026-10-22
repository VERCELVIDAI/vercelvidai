import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/data/blog';

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col text-[#17211D]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-800 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Engineering & Design Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#17211D] tracking-tight">
            The Fluvia Flow Journal
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Technical architecture, creative workflows, AI model benchmarks, and product updates from the Fluvia Flow team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl glass-card border border-emerald-500/20 overflow-hidden group hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-900 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold border border-emerald-300">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#17211D] group-hover:text-emerald-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-emerald-500/15 mt-4 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Read Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
