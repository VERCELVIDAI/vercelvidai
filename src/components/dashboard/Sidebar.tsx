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
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A99AAA]/70 px-3 block">
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
                ? 'font-bold bg-[#211522] text-[#F5EAF4] border-[#39233B] shadow-xs'
                : 'border-transparent text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]/50'
            }`}
          >
            {/* Glowing Hot Pink vertical active indicator on rail */}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#F05BCE] shadow-[0_0_10px_rgba(240,91,206,0.9)]" />
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#F05BCE]' : 'text-[#A99AAA] group-hover:text-[#F5EAF4]'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!collapsed && item.badge && (
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                  item.badge.includes('cr')
                    ? 'bg-[#F05BCE]/15 text-[#F05BCE] border border-[#F05BCE]/30'
                    : 'bg-[#211522] text-[#A99AAA] border border-[#39233B]'
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
        <div className={`p-4 border-b border-[#39233B] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {collapsed ? (
            <Link href="/dashboard" className="w-9 h-9 rounded-xl bg-[#F05BCE]/15 border border-[#F05BCE]/30 flex items-center justify-center text-[#F05BCE] font-black text-sm hover:scale-105 transition-transform">
              W
            </Link>
          ) : (
            <Logo size="sm" showTagline={false} />
          )}

          {isDrawer && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
              className="p-1.5 rounded-xl text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-[#F5EAF4]" />
            </button>
          )}
        </div>

        {/* Quick Create CTA in Hot Pink */}
        <div className={`p-3 ${collapsed ? 'px-2' : ''}`}>
          <Link
            href="/create"
            onClick={() => isDrawer && setIsMobileOpen(false)}
            title={collapsed ? 'New Creation' : undefined}
            className={`w-full py-2.5 px-3 min-h-[44px] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F05BCE]/25 bg-gradient-to-r from-[#F05BCE] via-[#E046BD] to-[#C026D3] hover:from-[#E046BD] hover:to-[#A21CAF] transition-all cursor-pointer border border-[#F05BCE]/40 ${
              collapsed ? 'px-0' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-white shrink-0" />
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
                ? 'font-bold bg-[#211522] text-[#F5EAF4] border-[#39233B] shadow-xs'
                : 'border-transparent text-[#A99AAA] hover:text-[#F5EAF4] hover:bg-[#211522]/50'
            }`}
          >
            {pathname === '/dashboard' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#F05BCE] shadow-[0_0_10px_rgba(240,91,206,0.9)]" />
            )}
            <Home className="w-4 h-4 text-[#A99AAA] shrink-0 group-hover:text-[#F5EAF4]" />
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
                  : 'text-amber-400 hover:bg-[#211522]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Admin Console</span>}
            </Link>
          )}
        </div>
      </div>

      {/* Credit Wallet Widget & Footer Profile */}
      <div className={`p-3 border-t border-[#39233B] space-y-2 ${collapsed ? 'px-2' : ''}`}>
        <Link
          href="/dashboard/wallet"
          onClick={() => isDrawer && setIsMobileOpen(false)}
          title={collapsed ? `Credits: ${credits.availableBalance}` : undefined}
          className={`bg-[#211522] hover:bg-[#2A1A2B] rounded-2xl border border-[#39233B] hover:border-[#F05BCE]/40 transition-colors block text-left shadow-xs ${
            collapsed ? 'p-2 flex flex-col items-center justify-center gap-1' : 'p-3 flex items-center justify-between'
          }`}
        >
          <div className={`flex items-center ${collapsed ? 'flex-col gap-1' : 'gap-2'}`}>
            <div className="w-7 h-7 rounded-lg bg-[#F05BCE]/20 text-[#F05BCE] flex items-center justify-center border border-[#F05BCE]/30 shrink-0">
              <Zap className="w-4 h-4 text-[#F05BCE]" />
            </div>
            {!collapsed ? (
              <div>
                <div className="text-[10px] text-[#A99AAA] font-medium">Available Credits</div>
                <div className="text-sm font-black text-[#F5EAF4] font-mono">{credits.availableBalance}</div>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold text-[#F5EAF4]">{credits.availableBalance}</span>
            )}
          </div>
          {!collapsed && <span className="text-[10px] text-[#F05BCE] font-bold hover:underline">Top Up</span>}
        </Link>

        {/* Footer Links & Rail Toggle */}
        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'} text-xs text-[#A99AAA] px-1 pt-1`}>
          {!collapsed && (
            <Link
              href="/help"
              onClick={() => isDrawer && setIsMobileOpen(false)}
              className="hover:text-[#F5EAF4] flex items-center gap-1 text-[11px] font-medium transition-colors"
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
                className="p-1 rounded-lg hover:bg-[#211522] text-[#A99AAA] hover:text-[#F5EAF4] transition-colors cursor-pointer"
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
      {/* Desktop Persistent Sidebar in Midnight Plum */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 h-full select-none border-r border-[#39233B] bg-[#170E1A] text-[#F5EAF4] transition-[width] duration-200 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderContent(false, isCollapsed)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative flex flex-col justify-between w-72 max-w-[85vw] h-full bg-[#170E1A] shadow-2xl z-10 border-r border-[#39233B] animate-in slide-in-from-left duration-200 text-[#F5EAF4]">
            {renderContent(true, false)}
          </aside>
        </div>
      )}
    </>
  );
}
