'use client';

import React, { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { Mail, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Product Question');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#100A12] text-[#F5EAF4]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-[#F5EAF4]">Contact Our Team</h1>
          <p className="mt-3 text-[#A99AAA] text-sm">
            Have questions about enterprise plans, billing, or custom model integrations? We’d love to help.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#211522] border border-[#39233B] shadow-2xl">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-14 h-14 text-[#F05BCE] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-[#F5EAF4]">Message Dispatched</h3>
              <p className="mt-2 text-sm text-[#A99AAA] max-w-md mx-auto">
                Thank you for reaching out, {name || 'Creator'}. Our support team will review your ticket and reply to {email} within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F5EAF4] mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aria Vance"
                    className="w-full bg-[#100A12] text-[#F5EAF4] px-4 py-3 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] text-sm shadow-xs placeholder-[#A99AAA]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#F5EAF4] mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@fluviaflow.ai"
                    className="w-full bg-[#100A12] text-[#F5EAF4] px-4 py-3 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] text-sm shadow-xs placeholder-[#A99AAA]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5EAF4] mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#100A12] text-[#F5EAF4] px-4 py-3 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] text-sm cursor-pointer"
                >
                  <option>Product Question</option>
                  <option>Billing & PayU Payments</option>
                  <option>Enterprise Volume Licensing</option>
                  <option>Bug Report or Incident</option>
                  <option>Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5EAF4] mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry with detail..."
                  className="w-full bg-[#100A12] text-[#F5EAF4] p-4 rounded-xl border border-[#39233B] focus:outline-none focus:border-[#F05BCE] text-sm resize-none shadow-xs placeholder-[#A99AAA]/50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-[#F05BCE]/25 flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Message</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
