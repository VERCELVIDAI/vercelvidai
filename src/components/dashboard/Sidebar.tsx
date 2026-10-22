'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../theme/ThemeToggle';
import {
  Home,
  Video,
  Image as ImageIcon,
  Mic,
  UserCheck,
  Layers,
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

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: Home },
    { label: 'AI Video', href: '/create?mode=video', icon: Video },
    { label: 'AI Image', href: '/create?mode=image', icon: ImageIcon },
    { label: 'AI Voice', href: '/create?mode=audio', icon: Mic },
    { label: 'AI Avatars', href: '/ai-avatar-generator', icon: UserCheck },
    { label: 'Templates', href: '/templates', icon: Layers },
    { label: 'My Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive },
    { label: 'Brand Kit', href: '/dashboard/brand-kit', icon: Palette },
    { label: 'Credit Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Appearance', href: '/dashboard/settings/appearance', icon: Palette },
  ];

  return (
    <aside
      className="w-64 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none border-r transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-sidebar)',
        borderColor: 'var(--app-card-border)',
      }}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand header */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--app-card-border)' }}>
          <Logo size="sm" />
        </div>

        {/* Quick Create CTA */}
        <div className="p-4">
          <Link
            href="/create"
            className="w-full py-2.5 px-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            style={{
              backgroundImage: 'var(--app-gradient-primary)',
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create with AI</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isActive
                    ? 'font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.04]'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--app-badge-bg)' : undefined,
                  color: isActive ? 'var(--app-primary)' : undefined,
                  borderColor: isActive ? 'var(--app-badge-border)' : 'transparent',
                }}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin link if user is admin */}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all mt-3 ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Credit Wallet Widget & Footer Profile */}
      <div className="p-4 border-t border-white/[0.08] space-y-3">
        <Link
          href="/dashboard/wallet"
          className="p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/5 flex items-center justify-between transition-colors block"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Available Credits</div>
              <div className="text-sm font-black text-white">{credits.availableBalance}</div>
            </div>
          </div>
          <span className="text-[10px] text-violet-400 font-bold hover:underline">Top Up</span>
        </Link>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <ThemeToggle variant="icon" />
          <Link href="/help" className="hover:text-white flex items-center gap-1 text-[11px]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-rose-400 flex items-center gap-1 text-[11px]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
