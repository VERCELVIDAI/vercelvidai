'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  FileText,
  Search,
  Download,
  Filter,
} from 'lucide-react';

export default function InvoicesListPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const [authRes, invRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/billing/invoices?search=${encodeURIComponent(search)}&status=${statusFilter}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090A0D] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden bg-[#090A0D] text-white relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative bg-[#090A0D]">
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
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                <Link href="/dashboard/billing" className="hover:text-indigo-400 transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-white">Invoices</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Invoices</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Official billing invoices for all creative subscriptions and credit purchases.
              </p>
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 shrink-0 transition-all"
            >
              Buy Additional Credits
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-card p-4 rounded-2xl">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by invoice # or txn ID..."
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-white"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input rounded-xl px-3 py-2 text-xs text-white font-medium"
              >
                <option value="all">All Invoices</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="rounded-2xl glass-card overflow-hidden">
            <div className="overflow-x-auto">
              {invoices.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs space-y-3">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="font-semibold text-white">No invoices found</p>
                  <p>Invoices are automatically issued whenever a credit pack or subscription is completed.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-indigo-500/10 text-slate-400 border-b border-white/8 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-4">Invoice Number</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Subtotal</th>
                      <th className="py-3 px-4">Taxes</th>
                      <th className="py-3 px-4">Total Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10 text-slate-300">
                    {invoices.map((inv: any) => (
                      <tr key={inv.id} className="hover:bg-white/[0.04]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          <Link href={`/dashboard/billing/invoices/${inv.id}`} className="hover:text-indigo-400 underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(inv.issueDate).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                          {inv.items?.[0]?.description || 'Creative Credits'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          INR {inv.baseAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          INR {inv.taxAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                          INR {inv.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-white/[0.04] text-indigo-400 border border-white/10">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/billing/invoices/${inv.id}`}
                              className="px-2.5 py-1.5 rounded-lg glass-button text-slate-300 hover:text-indigo-400 transition-colors font-medium"
                            >
                              View
                            </Link>
                            <a
                              href={`/api/billing/invoices/${inv.id}/pdf`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-indigo-400 border border-emerald-300 flex items-center gap-1 transition-colors font-medium"
                              title="Download Official Tax Invoice PDF"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-600" />
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
