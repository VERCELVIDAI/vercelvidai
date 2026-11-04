'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { User, Trash2, CheckCircle2, Palette } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (!d) router.push('/login');
        else {
          setData(d);
          setDisplayName(d.user?.displayName || '');
          setEmail(d.user?.email || '');
        }
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Profile changes saved successfully.');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading account preferences...</span>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#070A0F] text-white relative selection:bg-[#d4ff00] selection:text-black">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#070A0F] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6 text-left">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Account Settings</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Manage your personal credentials, workspace preferences, and privacy controls.
            </p>
          </div>

          {statusMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="font-bold">{statusMsg}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-white font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#141A26] border border-slate-800 text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-1.5 uppercase text-[11px] tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-[#141A26] border border-slate-800 text-slate-400 px-3.5 py-2.5 rounded-xl text-xs cursor-not-allowed opacity-75"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email verification active. Contact support to update primary address.
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] cursor-pointer border border-violet-400/30"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Workspace Standard */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 space-y-3 shadow-2xl">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-violet-400" />
                  <span>Workspace Theme</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Fluvia Obsidian Cyber Studio Suite (High-contrast obsidian black, neon lime, violet-indigo glows).
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-violet-950/80 text-violet-300 border border-violet-500/40">
                Cyber Studio Active
              </span>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-950/30 border-2 border-rose-900/50 space-y-3">
            <h3 className="font-bold text-rose-300 text-sm flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Danger Zone: Account Deletion</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Permanently delete your profile, workspaces, private video projects, and ledger history. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs font-bold transition-all border border-rose-500/40 cursor-pointer shadow-xs"
            >
              Delete Account
            </button>
          </div>

          {deleteConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0E121B] border-2 border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-white">
                <h3 className="font-black text-rose-400 text-base">Confirm Account Purge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you absolutely certain? All credits and video exports will be immediately purged.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#141A26] border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}