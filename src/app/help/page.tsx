import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { HelpCircle, Search, BookOpen, CreditCard, Film, Shield, ArrowRight } from 'lucide-react';

export default function HelpPage() {
  const categories = [
    {
      icon: Film,
      title: 'Generation & Video Editing',
      desc: 'Prompt formatting, camera motions, aspect ratios, timeline splitting, and trimming.',
    },
    {
      icon: CreditCard,
      title: 'Credits, Billing & PayU India',
      desc: 'Credit usage calculation, monthly allowances, refunds, and official invoices.',
    },
    {
      icon: BookOpen,
      title: 'Commercial Rights & Licensing',
      desc: 'Monetization permissions, YouTube copyright clearance, and brand asset ownership.',
    },
    {
      icon: Shield,
      title: 'Account & Security',
      desc: 'Multi-factor authentication, workspace management, and data deletion workflows.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A0D] text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/8 text-xs font-semibold text-indigo-400 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            How can we help you create?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Search our knowledge base or browse help guides below.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. 4K export, refund policy, credit costs)..."
              className="w-full glass-input text-white pl-12 pr-4 py-3.5 rounded-2xl text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-6 rounded-3xl glass-card hover:border-white/20 transition-all flex gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-emerald-600 flex items-center justify-center shrink-0 border border-white/8">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{cat.title}</h3>
                  <p className="mt-1 text-sm text-slate-400 leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center p-8 rounded-3xl glass-card shadow-sm">
          <h3 className="text-xl font-bold text-white">Need personal assistance?</h3>
          <p className="mt-2 text-sm text-slate-400">Our engineering & creator support team is available 24/7.</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-emerald-500/20 transition-all"
          >
            <span>Open Support Ticket</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
