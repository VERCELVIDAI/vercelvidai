'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../brand/Logo';
import {
  Home,
  Film,
  Megaphone,
  Layers,
  Sliders,
  Video,
  Image as ImageIcon,
  FolderKanban,
  HardDrive,
  Palette,
  Wallet,
  CreditCard,
  Settings,
  HelpCircle,
  ShieldAlert,
  LogOut,
  Sparkles,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  credits?: { availableBalance: number; reservedBalance: number };
}

export function Sidebar({ userRole = 'creator', credits = { availableBalance: 0, reservedBalance: 0 } }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const studioItems = [
    { label: 'Cinema Studio', href: '/studios/cinema', icon: Film, badge: 'Director' },
    { label: 'Marketing Studio', href: '/studios/marketing', icon: Megaphone, badge: 'Ecom' },
    { label: 'Storyboard Studio', href: '/studios/storyboard', icon: Layers, badge: 'Gemini' },
    { label: 'Creative Canvas', href: '/editor', icon: Sliders },
  ];

  const creationItems = [
    { label: 'AI Video Engine', href: '/create?mode=video', icon: Video },
    { label: 'AI Image Studio', href: '/create?mode=image', icon: ImageIcon },
    { label: 'Templates Library', href: '/templates', icon: Layers },
  ];

  const managementItems = [
    { label: 'My Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive },
    { label: 'Brand Kit', href: '/dashboard/brand-kit', icon: Palette },
    { label: 'Credit Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none border-r border-emerald-500/15 glass-sidebar transition-colors duration-200 text-[#17211D]">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand header */}
        <div className="p-4 border-b border-emerald-500/15">
          <Logo size="sm" showTagline={false} />
        </div>

        {/* Quick Create CTA */}
        <div className="p-3">
          <Link
            href="/create"
            className="w-full py-2.5 px-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 bg-gradient-to-r from-emerald-500 to-teal-700 hover:from-emerald-600 hover:to-teal-800 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>New Creation</span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 space-y-4 py-1 text-left">
          {/* Main */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              pathname === '/dashboard'
                ? 'font-bold bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs'
                : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
            }`}
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Dashboard Overview</span>
          </Link>

          {/* Studios Section */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Production Studios
            </span>
            {studioItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'font-bold bg-emerald-100 text-emerald-950 border-emerald-300 shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-900 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Creative Tools */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Generative Tools
            </span>
            {creationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'font-bold bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Management */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
              Workspace & Billing
            </span>
            {managementItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isActive
                      ? 'font-bold bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'border-transparent text-slate-600 hover:text-[#17211D] hover:bg-emerald-50/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin link if user is admin */}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all mt-2 ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </div>
      </div>

      {/* Credit Wallet Widget & Footer Profile */}
      <div className="p-3 border-t border-emerald-500/15 space-y-2">
        <Link
          href="/dashboard/wallet"
          className="p-3 bg-emerald-50/90 hover:bg-emerald-100/80 rounded-xl border border-emerald-300/80 flex items-center justify-between transition-colors block text-left shadow-xs"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">Available Credits</div>
              <div className="text-sm font-black text-[#17211D]">{credits.availableBalance}</div>
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold hover:underline">Top Up</span>
        </Link>

        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
          <Link href="/help" className="hover:text-emerald-800 flex items-center gap-1 text-[11px] font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-rose-600 flex items-center gap-1 text-[11px] font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
