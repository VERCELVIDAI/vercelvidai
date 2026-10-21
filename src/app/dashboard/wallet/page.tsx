'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Wallet,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Clock,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Sparkles,
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
      <div className="min-h-screen bg-[#090A0F] text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };
  const isLowBalance = credits.availableBalance < 30;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Credit Wallet & Ledger</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Real-time audit log of your available balances, reservations, purchases, and refunds.
            </p>
          </div>

          {/* Low Balance Warning */}
          {isLowBalance && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Your credit balance is low ({credits.availableBalance} credits remaining). Standard video generations require 25 credits.</span>
              </div>
              <Link
                href="/pricing"
                className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg shrink-0 ml-4 hover:bg-amber-400 transition-colors"
              >
                Top Up Now
              </Link>
            </div>
          )}

          {/* Balances Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-slate-400 font-semibold uppercase">Available Balance</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-black text-white">{credits.availableBalance}</div>
              <p className="mt-2 text-xs text-slate-400">Ready to spend on immediate AI jobs</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs text-slate-400 font-semibold uppercase">In-Flight Reserved</span>
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-4xl font-black text-white">{credits.reservedBalance}</div>
              <p className="mt-2 text-xs text-slate-400">Locked while rendering active jobs</p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Top-Up Wallet</span>
                <h3 className="font-bold text-white text-base mt-1">Need additional compute?</h3>
                <p className="mt-1 text-xs text-slate-400">Purchase instant top-up packs via UPI or Card.</p>
              </div>
              <Link
                href="/pricing"
                className="mt-4 w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold text-center block shadow-lg shadow-violet-600/20"
              >
                View Credit Packs
              </Link>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Immutable Transaction Ledger</h3>
              <span className="text-xs font-mono text-slate-400">{ledger.length} total entries</span>
            </div>

            {ledger.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No ledger transactions recorded yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.01] text-slate-400">
                      <th className="p-3.5 font-semibold">Transaction Type</th>
                      <th className="p-3.5 font-semibold">Amount</th>
                      <th className="p-3.5 font-semibold">Balance After</th>
                      <th className="p-3.5 font-semibold">Reference / Notes</th>
                      <th className="p-3.5 font-semibold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {ledger.map((entry) => {
                      const isPositive = entry.amount > 0;
                      return (
                        <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3.5 flex items-center gap-2">
                            {isPositive ? (
                              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4 text-rose-400" />
                            )}
                            <span className="font-semibold text-white capitalize">
                              {entry.transactionType.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className={`p-3.5 font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? `+${entry.amount}` : entry.amount} cr
                          </td>
                          <td className="p-3.5 font-mono font-semibold text-white">
                            {entry.balanceAfter} cr
                          </td>
                          <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                            {entry.relatedJobId || entry.idempotencyKey || entry.metadata?.packName || 'System grant'}
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-[11px]">
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
