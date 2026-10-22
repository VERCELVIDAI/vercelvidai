'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { BRAND } from '@/lib/brand';
import { Shield, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  darkVariant?: boolean;
}

export function Footer({ darkVariant }: FooterProps) {
  const pathname = usePathname();
  const isDark = darkVariant !== undefined ? darkVariant : (pathname === '/' || pathname === '/create');

  return (
    <footer className={`border-t transition-colors duration-200 ${
      isDark ? 'border-[#293831] bg-[#080D0B] text-slate-400' : 'border-emerald-500/15 bg-white/75 backdrop-blur-xl text-[#64748B]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 text-left">
          {/* Brand Info */}
          <div className="col-span-2">
            <Logo size="md" showTagline={true} darkVariant={isDark} />
            <p className={`mt-4 text-xs max-w-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              {BRAND.description}
            </p>
            <div className={`mt-5 flex items-center gap-2 text-xs font-mono ${isDark ? 'text-emerald-400' : 'text-[#047857]'}`}>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Gemini AI & Neural GPU Rendering Active</span>
            </div>
            <p className={`mt-3 text-[11px] ${isDark ? 'text-slate-500' : 'text-[#94A3B8]'}`}>
              {BRAND.legalName} — Cinematic AI Creative Platform.
            </p>
          </div>

          {/* Studios */}
          <div>
            <h4 className={`text-xs font-bold tracking-wider uppercase mb-4 ${isDark ? 'text-white' : 'text-[#17211D]'}`}>Production Studios</h4>
            <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              <li><Link href="/studios/cinema" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Cinema Studio</Link></li>
              <li><Link href="/studios/marketing" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Marketing Studio</Link></li>
              <li><Link href="/studios/storyboard" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Storyboard Studio</Link></li>
              <li><Link href="/editor" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Creative Canvas</Link></li>
              <li><Link href="/templates" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Creative Templates</Link></li>
              <li><Link href="/models" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Foundation Models</Link></li>
            </ul>
          </div>

          {/* Generative Tools */}
          <div>
            <h4 className={`text-xs font-bold tracking-wider uppercase mb-4 ${isDark ? 'text-white' : 'text-[#17211D]'}`}>Creative Tools</h4>
            <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              <li><Link href="/create?mode=video" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Text-to-Video</Link></li>
              <li><Link href="/create?mode=video&preset=i2v" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Image-to-Video</Link></li>
              <li><Link href="/create?mode=image" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Gemini & Flux Image</Link></li>
              <li><Link href="/create?mode=audio" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Neural Voiceover</Link></li>
              <li><Link href="/ai-avatar-generator" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>AI Talking Avatars</Link></li>
              <li><Link href="/pricing" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Plans & Pricing</Link></li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <h4 className={`text-xs font-bold tracking-wider uppercase mb-4 ${isDark ? 'text-white' : 'text-[#17211D]'}`}>Company & Legal</h4>
            <ul className={`space-y-2.5 text-xs ${isDark ? 'text-slate-400' : 'text-[#64748B]'}`}>
              <li><Link href="/blog" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Engineering & Design</Link></li>
              <li><Link href="/help" className={`${isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-700'} transition-colors`}>Help Center & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-700 transition-colors">Contact Support</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-700 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-700 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#047857]">
              <Shield className="w-3.5 h-3.5" />
              <span>PayU Verified • 256-bit Encrypted</span>
            </span>
            <span className="flex items-center gap-1 text-pink-600">
              <Heart className="w-3 h-3 fill-pink-500" />
              <span>Designed for Creators</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
