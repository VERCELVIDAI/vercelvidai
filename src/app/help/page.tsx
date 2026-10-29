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
    <div className="min-h-screen bg-white text-[#17191D] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#5145CD]/20 text-xs font-semibold text-[#5145CD] mb-4 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#17191D] tracking-tight">
            How can we help you create?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#667085]">
            Search our knowledge base or browse help guides below.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-[#667085] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. 4K export, refund policy, credit costs)..."
              className="w-full bg-[#F7F8FA] border border-[#E5E7EB] text-[#17191D] placeholder-[#667085]/50 pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-[#5145CD]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#5145CD]/40 hover:shadow-md transition-all flex gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#5145CD] flex items-center justify-center shrink-0 border border-[#5145CD]/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#17191D] text-lg">{cat.title}</h3>
                  <p className="mt-1 text-sm text-[#667085] leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center p-8 rounded-2xl bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs">
          <h3 className="text-xl font-bold text-[#17191D]">Need personal assistance?</h3>
          <p className="mt-2 text-sm text-[#667085]">Our engineering & creator support team is available 24/7.</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#5145CD] hover:bg-[#4338CA] text-white shadow-xs transition-all cursor-pointer"
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
