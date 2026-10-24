'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import {
  CreditCard,
  Search,
  Filter,
  Receipt,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function TransactionsListPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalCount: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async (page = 1) => {
    try {
      const [authRes, txRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/billing/transactions?page=${page}&limit=10&search=${encodeURIComponent(search)}&status=${statusFilter}`),
      ]);

      if (!authRes.ok) {
        router.push('/login');
        return;
      }

      setData(await authRes.json());
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
        if (txData.pagination) setPagination(txData.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(1);
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
    <div className="h-screen h-[100dvh] w-full flex overflow-hidden text-[#17211D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain relative">
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
                <Link href="/dashboard/billing" className="hover:text-emerald-700 transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-[#17211D]">Transactions</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211D]">Transaction History</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Complete audit trail of all PayU India payment orders, settlements, and tax calculations.
              </p>
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 shrink-0 transition-all"
            >
              Buy Creative Credits
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
                placeholder="Search by txnid, item, or PayU ID..."
                className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-[#17211D]"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-600" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input rounded-xl px-3 py-2 text-xs text-[#17211D] font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl glass-card overflow-hidden">
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs space-y-3">
                  <CreditCard className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="font-semibold text-[#17211D]">No transactions found</p>
                  <p>Orders created via PayU Hosted Checkout will appear here with complete verification data.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50/50 text-slate-600 border-b border-emerald-500/10 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-3 px-4">Merchant Txn ID</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Base (INR)</th>
                      <th className="py-3 px-4">Taxes (INR)</th>
                      <th className="py-3 px-4">Total (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/10 text-slate-700">
                    {transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#17211D]">
                          <Link href={`/dashboard/billing/transactions/${tx.id}`} className="hover:text-emerald-700 underline">
                            {tx.txnid}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#17211D] max-w-xs truncate">
                          {tx.productInfo}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          INR {tx.baseAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          INR {tx.taxAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          INR {tx.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              tx.status === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                                : tx.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-500/30'
                                : 'bg-rose-50 text-rose-700 border border-rose-500/30'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {tx.receiptId && (
                              <a
                                href={`/api/billing/receipts/${tx.receiptId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-colors"
                                title="Download Receipt PDF"
                              >
                                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                              </a>
                            )}
                            {tx.invoiceId && (
                              <a
                                href={`/api/billing/invoices/${tx.invoiceId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-300 transition-colors"
                                title="Download Tax Invoice PDF"
                              >
                                <FileText className="w-3.5 h-3.5 text-teal-600" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-emerald-500/10 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>
                  Showing {transactions.length} of {pagination.totalCount} orders
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchTransactions(pagination.page - 1)}
                    className="p-1.5 rounded-lg glass-button text-slate-700 hover:text-emerald-700 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[#17211D]">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchTransactions(pagination.page + 1)}
                    className="p-1.5 rounded-lg glass-button text-slate-700 hover:text-emerald-700 disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
