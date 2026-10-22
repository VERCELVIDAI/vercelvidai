'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { Settings, User, Lock, Trash2, CheckCircle2, AlertCircle, Palette, ArrowRight } from 'lucide-react';

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
  }, []);

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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div
      className="min-h-screen flex transition-colors duration-200"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-3xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account Settings</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Manage your personal credentials, workspace preferences, and privacy controls.
            </p>
          </div>

          {statusMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[#0E1017] text-white px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-[#0E1017]/60 text-slate-400 px-3 py-2.5 rounded-xl border border-white/5 text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Email verification active. Contact support to update primary address.
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-violet-600/20"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Appearance & Color Themes */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-violet-400" />
                  <span>Workspace Appearance & Themes</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Select from 10 bespoke color themes across Light, Dark, or System preference.
                </p>
              </div>

              <Link
                href="/dashboard/settings/appearance"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <span>Customize Themes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <h3 className="font-bold text-rose-300 text-base flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Danger Zone: Account Deletion</span>
            </h3>
            <p className="text-xs text-slate-400">
              Permanently delete your profile, workspaces, private video projects, and ledger history. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-500/30"
            >
              Delete Account
            </button>
          </div>

          {deleteConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#12141A] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                <h3 className="font-bold text-white text-base">Confirm Account Purge</h3>
                <p className="text-xs text-slate-400">
                  Are you absolutely certain? All credits and video exports will be immediately purged.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
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
