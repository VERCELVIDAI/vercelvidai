'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FolderKanban,
  Plus,
  CreditCard,
  Menu,
  Zap,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu?: () => void;
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const pathname = usePathname();

  const handleOpenMenu = () => {
    if (onOpenMenu) {
      onOpenMenu();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fluvia-toggle-mobile-sidebar'));
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/dashboard',
      icon: Home,
      exact: true,
    },
    {
      label: 'OpenHiggs',
      href: '/openhiggs',
      icon: Zap,
      exact: false,
    },
    {
      label: 'Create',
      href: '/create',
      icon: Plus,
      isPrimary: true,
    },
    {
      label: 'Projects',
      href: '/dashboard/projects',
      icon: FolderKanban,
      exact: false,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-[#0B0E17]/95 backdrop-blur-xl border-t border-slate-800/90 z-40 px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-5px_30px_rgba(0,0,0,0.6)] select-none text-white"
    >
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'text-[#d4ff00] font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#d4ff00]' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Primary Action: Create Ad */}
        <div className="flex flex-col items-center justify-center">
          <Link
            href="/create"
            className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-2 border-violet-400/50 active:scale-95 transition-all"
            aria-label="Create New Ad"
          >
            <Plus className="w-6 h-6 stroke-[2.5] text-white" />
          </Link>
          <span className="text-[10px] mt-0.5 font-black text-violet-400">Create</span>
        </div>

        {/* Projects */}
        {(() => {
          const item = navItems[3];
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] rounded-lg transition-colors ${
                isActive ? 'text-indigo-400 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })()}

        {/* Menu / Drawer Trigger */}
        <button
          type="button"
          onClick={handleOpenMenu}
          className="flex flex-col items-center justify-center py-1 min-h-[44px] rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Open Full Studio Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
}
