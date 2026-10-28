import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { BRAND } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Fluvia Flow protects creator privacy, manages data security, and handles personal information.',
  alternates: {
    canonical: `${BRAND.siteUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#100A12] text-[#F5EAF4] flex flex-col text-left">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5EAF4] mb-4">Privacy Policy</h1>
        <p className="text-xs text-[#A99AAA] font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="bg-[#211522] border border-[#39233B] rounded-3xl p-8 sm:p-12 space-y-6 text-sm text-[#A99AAA] leading-relaxed shadow-sm">
          <p>
            At <strong className="text-[#F5EAF4]">Fluvia Flow</strong> (&ldquo;Fluvia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), we take your privacy, proprietary creative assets, and prompt confidentiality seriously. This Privacy Policy details how we collect, process, and protect your information when utilizing our AI video creation studios.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">1. Data We Collect</h2>
          <p>
            We collect account identification (email address, display name, encrypted passwords), workspace configurations (brand kits, uploaded assets, logos, and fonts), transactional credit history, and generation job parameters (prompts, negative prompts, aspect ratios, model selections).
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">2. Ownership and Model Training Protections</h2>
          <p>
            <strong className="text-[#F5EAF4]">Your inputs and outputs are yours.</strong> We do not sell your personal data or user-submitted prompts. We do not utilize customer private footage, confidential brand kits, or enterprise video exports to train foundational public weights without explicit opt-in consent.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">3. Payment Information & Security</h2>
          <p>
            All payment transactions (UPI, credit cards, debit cards, net banking) are processed through certified PCI-DSS compliant gateways such as PayU India. Fluvia Flow never stores full credit card numbers or banking secrets on our servers.
          </p>

          <h2 className="text-lg font-bold text-[#F5EAF4] pt-4 border-t border-[#39233B]">4. Account and Data Deletion</h2>
          <p>
            Users can request immediate and irreversible account deletion through their profile settings at any time, which purges all stored projects, uploaded assets, and credentials from our active database.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
