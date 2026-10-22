'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../brand/Logo';
import { BRAND } from '@/lib/brand';
import { Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer
      className="border-t transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-sidebar)',
        borderColor: 'var(--app-card-border)',
        color: 'var(--app-text-muted)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2">
            <Logo size="md" showTagline={true} />
            <p className="mt-4 text-xs text-zinc-400 max-w-sm leading-relaxed">
              {BRAND.description}
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Gemini AI & GPU Rendering Nodes Operational</span>
            </div>
            <p className="mt-3 text-[11px] text-zinc-500">
              {BRAND.legalName} — Independent AI Creative Production Platform.
            </p>
          </div>

          {/* Studios */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">Production Studios</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/studios/cinema" className="hover:text-cyan-400 transition-colors">Cinema Studio</Link></li>
              <li><Link href="/studios/marketing" className="hover:text-cyan-400 transition-colors">Marketing Studio</Link></li>
              <li><Link href="/studios/storyboard" className="hover:text-cyan-400 transition-colors">Storyboard Studio</Link></li>
              <li><Link href="/editor" className="hover:text-cyan-400 transition-colors">Creative Canvas</Link></li>
              <li><Link href="/templates" className="hover:text-cyan-400 transition-colors">Creative Templates</Link></li>
              <li><Link href="/models" className="hover:text-cyan-400 transition-colors">Foundation Models</Link></li>
            </ul>
          </div>

          {/* Generative Tools */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">Creative Tools</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/create?mode=video" className="hover:text-cyan-400 transition-colors">Text-to-Video</Link></li>
              <li><Link href="/create?mode=video&preset=i2v" className="hover:text-cyan-400 transition-colors">Image-to-Video</Link></li>
              <li><Link href="/create?mode=image" className="hover:text-cyan-400 transition-colors">Flux 1.1 Pro Vision</Link></li>
              <li><Link href="/create?mode=audio" className="hover:text-cyan-400 transition-colors">Neural Voiceover</Link></li>
              <li><Link href="/ai-avatar-generator" className="hover:text-cyan-400 transition-colors">AI Talking Avatars</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition-colors">Plans & Pricing</Link></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li><Link href="/blog" className="hover:text-cyan-400 transition-colors">Engineering & Design</Link></li>
              <li><Link href="/help" className="hover:text-cyan-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-cyan-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enterprise Grade Security</span>
            </span>
            <span>•</span>
            <span>Built for world-class creators and modern brands</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
