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
    <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F05BCE]/15 border border-[#F05BCE]/30 text-xs font-semibold text-[#F05BCE] mb-4 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[#F05BCE]" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#F5EAF4] tracking-tight">
            How can we help you create?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#A99AAA]">
            Search our knowledge base or browse help guides below.
          </p>

          <div className="mt-8 relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-[#A99AAA] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. 4K export, refund policy, credit costs)..."
              className="w-full bg-[#211522] border border-[#39233B] text-[#F5EAF4] placeholder-[#A99AAA]/50 pl-12 pr-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-[#F05BCE]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="p-6 rounded-3xl bg-[#211522] border border-[#39233B] hover:border-[#F05BCE]/40 transition-all flex gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-[#100A12] text-[#F05BCE] flex items-center justify-center shrink-0 border border-[#39233B]">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F5EAF4] text-lg">{cat.title}</h3>
                  <p className="mt-1 text-sm text-[#A99AAA] leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center p-8 rounded-3xl bg-[#211522] border border-[#39233B] shadow-sm">
          <h3 className="text-xl font-bold text-[#F5EAF4]">Need personal assistance?</h3>
          <p className="mt-2 text-sm text-[#A99AAA]">Our engineering & creator support team is available 24/7.</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white shadow-md shadow-[#F05BCE]/25 transition-all cursor-pointer"
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
