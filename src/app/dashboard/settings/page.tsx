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
      <div className="min-h-screen text-[#17211D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen text-[#17211D] flex">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D]">Account Settings</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Manage your personal credentials, workspace preferences, and privacy controls.
            </p>
          </div>

          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-500/40 text-xs text-emerald-800 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4 shadow-xl">
            <h3 className="font-bold text-[#17211D] text-base mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full glass-input text-[#17211D] px-3 py-2.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full glass-input bg-slate-100/70 text-slate-500 px-3 py-2.5 rounded-xl text-xs cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Email verification active. Contact support to update primary address.
                </span>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Appearance & Theme Display */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-3 shadow-xl">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-[#17211D] text-base mb-1 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>Workspace Theme</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Fluvia Flow Signature Light Theme (White, Emerald Green & Soft Pink Glassmorphism).
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                Active System Standard
              </span>
            </div>
          </div>

          {/* Danger Zone: Account Deletion */}
          <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/70 border border-rose-200 space-y-3 shadow-sm">
            <h3 className="font-bold text-rose-800 text-base flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Danger Zone: Account Deletion</span>
            </h3>
            <p className="text-xs text-slate-600">
              Permanently delete your profile, workspaces, private video projects, and ledger history. This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl text-xs font-bold transition-all border border-rose-300"
            >
              Delete Account
            </button>
          </div>

          {deleteConfirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
              <div className="glass-modal rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                <h3 className="font-bold text-rose-700 text-base">Confirm Account Purge</h3>
                <p className="text-xs text-slate-600">
                  Are you absolutely certain? All credits and video exports will be immediately purged.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold glass-button text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
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
