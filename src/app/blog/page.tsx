import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Sparkles, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/data/blog';

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17191D] overflow-x-hidden max-w-full">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-xs font-semibold text-[#5145CD] mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Engineering & Design Insights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#17191D] tracking-tight">
            The Fluvia Flow Journal
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#667085]">
            Technical architecture, creative workflows, AI model benchmarks, and product updates from the Fluvia Flow team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl bg-white border border-[#E5E7EB] overflow-hidden group hover:border-[#5145CD] hover:shadow-lg transition-all flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="aspect-[16/10] relative overflow-hidden bg-[#F7F8FA]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 text-[#5145CD] backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold border border-[#E5E7EB] shadow-2xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#667085] font-mono mb-3 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span>{post.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#5145CD]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#17191D] group-hover:text-[#5145CD] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#667085] leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#E5E7EB] mt-4 flex items-center justify-between text-xs font-semibold text-[#5145CD]">
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
