'use client';

import React, { useState, useEffect } from 'react';
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
  Mic,
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
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  userRole?: string;
  credits?: { availableBalance: number; reservedBalance: number };
}

export function Sidebar({ userRole = 'creator', credits = { availableBalance: 0, reservedBalance: 0 } }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore collapsed preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fluvia_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('fluvia_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('fluvia-toggle-mobile-sidebar', handleToggle);
  }, []);

  // Lock background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobileOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  interface SidebarNavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }

  const studioItems: SidebarNavItem[] = [
    { label: 'Cinema Studio', href: '/studios/cinema', icon: Film, badge: 'Director' },
    { label: 'Marketing Studio', href: '/studios/marketing', icon: Megaphone, badge: 'Ecom' },
    { label: 'Storyboard Studio', href: '/studios/storyboard', icon: Layers, badge: 'Gemini' },
    { label: 'Creative Canvas', href: '/editor', icon: Sliders },
  ];

  const creationItems: SidebarNavItem[] = [
    { label: 'AI Video Studio', href: '/create?mode=video', icon: Video, badge: '15 cr' },
    { label: 'AI Voiceover HD', href: '/create?mode=audio', icon: Mic, badge: '2 cr' },
    { label: 'AI Image Studio', href: '/create?mode=image', icon: ImageIcon, badge: '5 cr' },
    { label: 'Curated Templates', href: '/templates', icon: Layers, badge: '24' },
  ];

  const managementItems: SidebarNavItem[] = [
    { label: 'My Projects', href: '/dashboard/projects', icon: FolderKanban },
    { label: 'Asset Library', href: '/dashboard/assets', icon: HardDrive },
    { label: 'Brand Kit', href: '/dashboard/brand-kit', icon: Palette },
    { label: 'Credit Wallet', href: '/dashboard/wallet', icon: Wallet },
    { label: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: SidebarNavItem[], collapsed: boolean, isDrawer: boolean) => (
    <div className="space-y-1">
      {!collapsed && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block">
          {title}
        </span>
      )}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? `${item.label}${item.badge ? ` (${item.badge})` : ''}` : undefined}
            className={`group relative flex items-center ${
              collapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
            } min-h-[40px] rounded-xl text-xs font-semibold transition-all border ${
              isActive
                ? 'font-bold bg-white/[0.08] text-white border-white/16 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {/* Glowing vertical active indicator on rail */}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                  item.badge.includes('cr')
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-white/[0.06] text-slate-300 border border-white/10'
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  const renderContent = (isDrawer: boolean, collapsed: boolean) => (
    <>
      <div className="flex flex-col flex-1 overflow-y-auto overscroll-contain">
        {/* Brand Header */}
        <div className={`p-4 border-b border-white/8 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {collapsed ? (
            <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm hover:scale-105 transition-transform">
              F
            </Link>
          ) : (
            <Logo size="sm" showTagline={false} />
          )}

          {isDrawer && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          )}
        </div>

        {/* Quick Create CTA */}
        <div className={`p-3 ${collapsed ? 'px-2' : ''}`}>
          <Link
            href="/create"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? 'New Creation' : undefined}
            className={`w-full py-2.5 px-3 min-h-[44px] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all cursor-pointer border border-white/10 ${
              collapsed ? 'px-0' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-200 shrink-0" />
            {!collapsed && <span>New Creation</span>}
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className={`space-y-4 py-1 text-left ${collapsed ? 'px-2' : 'px-3'}`}>
          {/* Main Dashboard */}
          <Link
            href="/dashboard"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? 'Dashboard Overview' : undefined}
            className={`group relative flex items-center ${
              collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5'
            } min-h-[44px] rounded-xl text-xs font-semibold transition-all border ${
              pathname === '/dashboard'
                ? 'font-bold bg-white/[0.08] text-white border-white/16 shadow-xs'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {pathname === '/dashboard' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}
            <Home className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-white" />
            {!collapsed && <span>Dashboard Overview</span>}
          </Link>

          {/* Production Studios */}
          {renderNavGroup('Production Studios', studioItems, collapsed, isDrawer)}

          {/* Generative Tools */}
          {renderNavGroup('Generative Tools', creationItems, collapsed, isDrawer)}

          {/* Workspace & Billing */}
          {renderNavGroup('Workspace & Billing', managementItems, collapsed, isDrawer)}

          {/* Admin link if user is admin */}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              onClick={() => isDrawer && setIsMobileOpen(false)}
              title={collapsed ? 'Admin Console' : undefined}
              className={`flex items-center ${
                collapsed ? 'justify-center p-2' : 'gap-2.5 px-3 py-2.5'
              } min-h-[44px] rounded-xl text-xs font-semibold transition-all mt-2 ${
                pathname.startsWith('/admin')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                  : 'text-amber-400 hover:bg-white/[0.04]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Admin Console</span>}
            </Link>
          )}
        </div>
      </div>

      {/* Credit Wallet Widget & Footer Profile */}
      <div className={`p-3 border-t border-white/8 space-y-2 ${collapsed ? 'px-2' : ''}`}>
        <Link
          href="/dashboard/wallet"
          onClick={() => isDrawer && setIsMobileOpen(false)}
          title={collapsed ? `Credits: ${credits.availableBalance}` : undefined}
          className={`bg-[#11131A] hover:bg-[#151822] rounded-2xl border border-white/8 hover:border-white/16 transition-colors block text-left shadow-xs ${
            collapsed ? 'p-2 flex flex-col items-center justify-center gap-1' : 'p-3 flex items-center justify-between'
          }`}
        >
          <div className={`flex items-center ${collapsed ? 'flex-col gap-1' : 'gap-2'}`}>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            {!collapsed ? (
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Available Credits</div>
                <div className="text-sm font-black text-white font-mono">{credits.availableBalance}</div>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold text-white">{credits.availableBalance}</span>
            )}
          </div>
          {!collapsed && <span className="text-[10px] text-indigo-400 font-bold hover:underline">Top Up</span>}
        </Link>

        {/* Footer Links & Rail Toggle */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'} text-xs text-slate-400 px-1 pt-1`}>
          {!collapsed && (
            <Link
              href="/help"
              onClick={() => isDrawer && setIsMobileOpen(false)}
              className="hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support</span>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {!isDrawer && (
              <button
                type="button"
                onClick={toggleCollapsed}
                title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={handleLogout}
              title={collapsed ? 'Sign Out' : undefined}
              className="hover:text-rose-400 flex items-center gap-1 text-[11px] font-medium cursor-pointer transition-colors p-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar with smooth width transition */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 h-full select-none border-r border-white/8 bg-[#0B0C10] text-slate-200 transition-[width] duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent(false, isCollapsed)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col justify-between w-72 max-w-[85vw] h-full bg-[#0B0C10] shadow-2xl z-10 border-r border-white/10 animate-in slide-in-from-left duration-200 text-slate-200">
            {renderContent(true, false)}
          </aside>
        </div>
      )}
    </>
  );
}
