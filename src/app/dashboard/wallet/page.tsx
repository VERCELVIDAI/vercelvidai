'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function CreditWalletPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [ledger, setLedger] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const [authRes, credRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/credits'),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      const authData = await authRes.json();
      setData(authData);

      if (credRes.ok) {
        const c = await credRes.json();
        setLedger(c.ledger || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading credit ledger...</span>
        </div>
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isLowBalance = credits.availableBalance < 30;

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#070A0F] text-white relative selection:bg-[#d4ff00] selection:text-black">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#070A0F] pb-24 md:pb-6">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 text-left">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-2xl backdrop-blur-xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Credit Wallet & Ledger</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Real-time audit log of your available balances, reservations, purchases, and refunds.
            </p>
          </div>

          {/* Low Balance Warning */}
          {isLowBalance && (
            <div className="p-4 rounded-2xl bg-amber-950/60 border-2 border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Your credit balance is low ({credits.availableBalance} credits remaining). Video generations require 15 credits.</span>
              </div>
              <Link
                href="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white font-black rounded-xl shrink-0 sm:ml-4 transition-all shadow-md self-start sm:self-auto cursor-pointer"
              >
                Top Up Now
              </Link>
            </div>
          )}

          {/* Balances Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 relative overflow-hidden shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Available Balance</span>
                <div className="w-8 h-8 rounded-xl bg-violet-950/80 text-[#d4ff00] flex items-center justify-center border border-violet-500/40">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-black text-[#d4ff00] font-mono">{credits.availableBalance}</div>
              <p className="mt-2 text-xs text-slate-400">Ready to spend on immediate AI jobs</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">In-Flight Reserved</span>
                <div className="w-8 h-8 rounded-xl bg-[#141A26] text-slate-400 flex items-center justify-center border border-slate-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-black text-white font-mono">{credits.reservedBalance}</div>
              <p className="mt-2 text-xs text-slate-400">Locked while rendering active jobs</p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs text-violet-400 font-bold uppercase tracking-wider font-mono">Top-Up Wallet</span>
                <h3 className="font-black text-white text-base mt-1">Need additional compute?</h3>
                <p className="mt-1 text-xs text-slate-400">Purchase instant top-up packs via UPI or Card.</p>
              </div>
              <Link
                href="/pricing"
                className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black text-center block shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all cursor-pointer border border-violet-400/30"
              >
                View Credit Packs
              </Link>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-3xl bg-[#0E121B]/95 border-2 border-slate-800 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-[#141A26] flex items-center justify-between">
              <h3 className="font-black text-white text-sm">Immutable Transaction Ledger</h3>
              <span className="text-xs font-mono text-slate-400">{ledger.length} total entries</span>
            </div>

            {ledger.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No ledger transactions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#141A26] text-slate-400 font-mono text-[10px] uppercase">
                      <th className="p-3.5 font-bold">Transaction Type</th>
                      <th className="p-3.5 font-bold">Amount</th>
                      <th className="p-3.5 font-bold">Balance After</th>
                      <th className="p-3.5 font-bold">Reference / Notes</th>
                      <th className="p-3.5 font-bold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {ledger.map((entry) => {
                      const isPositive = entry.amount > 0;
                      return (
                        <tr key={entry.id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="p-3.5 flex items-center gap-2">
                            {isPositive ? (
                              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-rose-400" />
                            )}
                            <span className="font-bold text-white capitalize">
                              {entry.transactionType.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className={`p-3.5 font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? `+${entry.amount}` : entry.amount} cr
                          </td>
                          <td className="p-3.5 font-mono font-bold text-white">
                            {entry.balanceAfter} cr
                          </td>
                          <td className="p-3.5 font-mono text-[#667085] text-[11px]">
                            {entry.relatedJobId || entry.idempotencyKey || entry.metadata?.packName || 'System grant'}
                          </td>
                          <td className="p-3.5 font-mono text-[#667085] text-[11px]">
                            {new Date(entry.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
