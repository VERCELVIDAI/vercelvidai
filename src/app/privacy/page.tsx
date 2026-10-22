import React from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Privacy Policy</h1>
        <p className="text-xs text-slate-500 font-mono mb-8">Effective Date: October 2026 • Version 2.0</p>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6 text-sm leading-relaxed">
          <p>
            At <strong>Fluvia Flow</strong> (&ldquo;Fluvia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), we take your privacy, proprietary creative assets, and prompt confidentiality seriously. This Privacy Policy details how we collect, process, and protect your information when utilizing our AI video creation studios.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">1. Data We Collect</h2>
          <p>
            We collect account identification (email address, display name, encrypted passwords), workspace configurations (brand kits, uploaded assets, logos, and fonts), transactional credit history, and generation job parameters (prompts, negative prompts, aspect ratios, model selections).
          </p>

          <h2 className="text-xl font-bold text-white pt-4">2. Ownership and Model Training Protections</h2>
          <p>
            <strong>Your inputs and outputs are yours.</strong> We do not sell your personal data or user-submitted prompts. We do not utilize customer private footage, confidential brand kits, or enterprise video exports to train foundational public weights without explicit opt-in consent.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">3. Payment Information & Security</h2>
          <p>
            All payment transactions (UPI, credit cards, debit cards, net banking) are processed through certified PCI-DSS compliant gateways such as PayU and Razorpay. Fluvia Flow never stores full credit card numbers or banking secrets on our servers.
          </p>

          <h2 className="text-xl font-bold text-white pt-4">4. Account and Data Deletion</h2>
          <p>
            Users can request immediate and irreversible account deletion through their profile settings at any time, which purges all stored projects, uploaded assets, and credentials from our active database.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
