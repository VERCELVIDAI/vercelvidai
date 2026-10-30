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
  Download,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
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
      <div className="min-h-screen bg-white text-[#17191D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#5145CD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || {};
  const credits = data?.credits || { availableBalance: 0, reservedBalance: 0 };

  return (
    <div className="min-h-screen md:h-screen md:h-[100dvh] w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden bg-[#FFFFFF] text-[#17191D] relative">
      <Sidebar userRole={user.role} credits={credits} />

      <div className="flex-1 min-w-0 flex flex-col md:h-full md:overflow-y-auto overflow-x-hidden relative bg-[#F7F8FA] pb-24 md:pb-8">
        <DashboardHeader
          displayName={user.displayName}
          avatarUrl={user.avatarUrl}
          role={user.role}
          credits={credits.availableBalance}
          workspaceName={data?.workspace?.name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 text-left relative">
          {/* Ambient Frosted Background Lights */}
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#5145CD]/10 blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none -z-0" />

          {/* Frosted Glass Header Card */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl shadow-[#5145CD]/5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#667085] mb-2 font-medium">
                <Link href="/dashboard/billing" className="hover:text-[#5145CD] transition-colors">
                  Billing
                </Link>
                <span>/</span>
                <span className="text-[#17191D] font-bold">Transactions</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#17191D] tracking-tight">Transaction History</h1>
              <p className="mt-1 text-xs sm:text-sm text-[#667085]">
                Complete audit trail of all PayU India orders, tax itemization, and verified settlements.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <Link
                href="/dashboard/billing/invoices"
                className="px-4 py-2.5 bg-white/80 hover:bg-white text-[#17191D] border border-white/80 rounded-xl text-xs font-semibold shadow-2xs backdrop-blur-md transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#5145CD]" />
                <span>Invoices</span>
              </Link>
              <Link
                href="/checkout?type=pack&id=pack_5000"
                className="px-4 py-2.5 bg-[#5145CD] hover:bg-[#4338CA] text-white rounded-xl text-xs font-bold shadow-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buy Credits</span>
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar (Frosted Glass) */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-between p-3.5 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-88">
              <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by txn ID, item, or PayU ID..."
                className="w-full bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#17191D] placeholder-[#667085] focus:outline-none focus:border-[#5145CD] transition-colors"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#667085] font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#5145CD]" /> Status:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#17191D] font-semibold focus:outline-none focus:border-[#5145CD] transition-colors cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success / Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Transactions Table (Frosted Glass) */}
          <div className="relative z-10 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 overflow-hidden shadow-xl shadow-[#5145CD]/5">
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-[#667085] text-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto text-[#5145CD]">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-[#17191D] text-sm">No transactions found</p>
                  <p>Settled PayU India orders will appear here with complete verification and tax records.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F8FA]/80 backdrop-blur-xs text-[#667085] border-b border-[#E5E7EB] uppercase text-[10px] font-mono font-bold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-5">Merchant Txn ID</th>
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">Product / Description</th>
                      <th className="py-3.5 px-4">Base (INR)</th>
                      <th className="py-3.5 px-4">GST 18%</th>
                      <th className="py-3.5 px-4">Total (INR)</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-5 text-right">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]/70 text-[#17191D]">
                    {transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-[#17191D]">
                          <Link href={`/dashboard/billing/transactions/${tx.id}`} className="hover:text-[#5145CD] underline">
                            {tx.txnid}
                          </Link>
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-[#5145CD]">
                          {tx.invoiceNumber || tx.invoiceId ? (
                            <Link href={`/dashboard/billing/invoices/${tx.invoiceId || tx.invoiceNumber}`} className="hover:underline">
                              #{tx.invoiceNumber || tx.invoiceId}
                            </Link>
                          ) : (
                            <span className="text-[#667085]">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-semibold text-[#17191D] max-w-xs truncate">
                          {tx.productInfo}
                        </td>
                        <td className="py-4 px-4 font-mono text-[#667085]">
                          INR {Number(tx.baseAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 font-mono text-[#667085]">
                          INR {Number(tx.taxAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-sm text-[#5145CD]">
                          INR {Number(tx.totalAmount || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                              tx.status === 'success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : tx.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {tx.status === 'success' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                            <span>{tx.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#667085]">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#667085]/60" />
                            <span>
                              {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end flex-wrap gap-1.5">
                            {tx.invoiceId && (
                              <a
                                href={`/api/billing/invoices/${tx.invoiceId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-[#5145CD]/10 hover:bg-[#5145CD] text-[#5145CD] hover:text-white border border-[#5145CD]/20 text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-2xs"
                                title="Download Official Tax Invoice PDF"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Invoice</span>
                              </a>
                            )}
                            {tx.receiptId && (
                              <a
                                href={`/api/billing/receipts/${tx.receiptId}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-2xs"
                                title="Download Official Settlement Receipt PDF"
                              >
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Receipt</span>
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
              <div className="p-4 border-t border-[#E5E7EB]/80 flex items-center justify-between text-xs text-[#667085] font-semibold bg-white/40">
                <span>
                  Showing {transactions.length} of {pagination.totalCount} orders
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchTransactions(pagination.page - 1)}
                    className="p-1.5 rounded-lg border border-white/80 bg-white/80 text-[#17191D] hover:bg-white disabled:opacity-30 cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[#17191D]">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchTransactions(pagination.page + 1)}
                    className="p-1.5 rounded-lg border border-white/80 bg-white/80 text-[#17191D] hover:bg-white disabled:opacity-30 cursor-pointer shadow-2xs"
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
