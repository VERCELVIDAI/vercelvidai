'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  Receipt,
  Search,
  Download,
  ArrowLeft,
  CheckCircle2,
  FileText,
  CreditCard,
} from 'lucide-react';

export default function ReceiptsListPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchReceipts = async () => {
    try {
      const [authRes, rcpRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/billing/receipts?search=${encodeURIComponent(search)}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (rcpRes.ok) {
        const rcpData = await rcpRes.json();
        setReceipts(rcpData.receipts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReceipts();
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Link href="/dashboard/billing" className="hover:text-white transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-white">Receipts</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Payment Receipts</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Verified payment settlement vouchers confirming funds received by Fluvia Flow via PayU India.
              </p>
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 shrink-0 transition-all"
            >
              Top Up Credits
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between bg-[#12141A] border border-white/10 p-4 rounded-2xl">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by receipt # or txn ID..."
                className="w-full bg-[#181B24] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </form>
          </div>

          {/* Receipts Table */}
          <div className="rounded-2xl bg-[#12141A] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              {receipts.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs space-y-3">
                  <Receipt className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="font-semibold text-white">No payment receipts found</p>
                  <p>Official receipts are generated upon verified payment settlement.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/[0.02] text-slate-400 border-b border-white/5 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-4">Receipt Number</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Product Purchased</th>
                      <th className="py-3 px-4">Payment Method</th>
                      <th className="py-3 px-4">Amount Received</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {receipts.map((rcp: any) => (
                      <tr key={rcp.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          <Link href={`/dashboard/billing/receipts/${rcp.id}`} className="hover:text-emerald-400 underline">
                            {rcp.receiptNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(rcp.paymentDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                          {rcp.productPurchased}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {rcp.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          INR {rcp.amountReceived.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                            Verified
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/billing/receipts/${rcp.id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            >
                              View
                            </Link>
                            <a
                              href={`/api/billing/receipts/${rcp.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
                              title="Download Official Receipt PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
